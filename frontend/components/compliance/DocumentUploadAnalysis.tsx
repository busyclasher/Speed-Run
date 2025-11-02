"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Image as ImageIcon, AlertTriangle, CheckCircle, X, RefreshCw, Info } from "lucide-react";
import { analyzeDocument, type CorroborationResponse, type CompressionProfile } from "@/lib/api";
import { logger } from "@/lib/logger";

interface UploadedFile {
  id: string;
  file: File;
  status: "uploading" | "analyzing" | "complete" | "error";
  progress: number;
  analysis?: AnalysisResult;
}

interface AnalysisResult {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  issuesDetected: string[];
  passedChecks: string[];
  recommendation: string;
  fileType: "pdf" | "image";
  tampering: boolean;
  compressionProfiles?: CompressionProfile[];
}

export function DocumentUploadAnalysis() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    logger.info('DocumentUpload', `📤 Files selected: ${files.length} file(s)`)

    const validFiles = files.filter((file) => {
      const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      const isValid = validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValid) {
        logger.warn('DocumentUpload', `⚠️  Invalid file rejected: ${file.name}`, {
          type: file.type,
          size: file.size,
        })
      }

      return isValid
    });

    logger.info('DocumentUpload', `✅ Valid files: ${validFiles.length}/${files.length}`)

    const newUploads: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "uploading",
      progress: 0,
    }));

    setUploadedFiles((prev) => [...prev, ...newUploads]);
    setShowResults(true);

    // Start real backend analysis for each file
    newUploads.forEach((upload) => {
      logger.info('DocumentUpload', `🚀 Starting analysis for: ${upload.file.name}`)
      performRealAnalysis(upload.id);
    });
  };

  // Real backend analysis function
  const performRealAnalysis = async (fileId: string) => {
    const upload = uploadedFiles.find((f) => f.id === fileId);
    if (!upload) {
      logger.error('DocumentUpload', `File not found for analysis: ${fileId}`)
      return;
    }

    try {
      logger.info('DocumentUpload', `🔍 Starting analysis: ${upload.file.name}`)

      // Set analyzing status
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "analyzing" as const, progress: 100 } : f
        )
      );

      // Call backend API
      const response: CorroborationResponse = await analyzeDocument(upload.file);

      logger.info('DocumentUpload', `✅ Analysis complete: ${upload.file.name}`, {
        riskScore: response.risk_score.overall_score,
        riskLevel: response.risk_score.risk_level,
        processingTime: response.processing_time,
        totalIssues: response.total_issues_found,
      })

      // Transform backend response to UI format
      const analysis = transformBackendResponse(response, upload.file);

      // Update state with complete analysis
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "complete" as const, analysis } : f
        )
      );
    } catch (error) {
      logger.error('DocumentUpload', `❌ Analysis failed: ${upload.file.name}`, { error })

      // Set error status
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "error" as const } : f
        )
      );
    }
  };

  // Transform backend response to UI format
  const transformBackendResponse = (
    response: CorroborationResponse,
    file: File
  ): AnalysisResult => {
    return {
      riskScore: response.risk_score.overall_score,
      riskLevel: response.risk_score.risk_level,
      issuesDetected: extractIssues(response),
      passedChecks: extractPassedChecks(response),
      recommendation: response.risk_score.recommendations[0] || generateRecommendation(response.risk_score.risk_level),
      fileType: file.type.includes("pdf") ? "pdf" : "image",
      tampering: response.image_analysis?.is_tampered || response.risk_score.overall_score > 70,
      compressionProfiles: response.image_analysis?.compression_profiles,
    };
  };

  // Extract issues from backend response
  const extractIssues = (response: CorroborationResponse): string[] => {
    const issues: string[] = [];

    // Format validation issues
    if (response.format_validation?.issues) {
      issues.push(...response.format_validation.issues.map(i => i.description));
    }

    // Structure validation issues
    if (response.structure_validation?.issues) {
      issues.push(...response.structure_validation.issues.map(i => i.description));
    }

    // Content validation issues
    if (response.content_validation?.issues) {
      issues.push(...response.content_validation.issues.map(i => i.description));
    }

    // Image analysis - metadata issues
    if (response.image_analysis?.metadata_issues) {
      issues.push(...response.image_analysis.metadata_issues.map(i => i.description));
    }

    // Image analysis - forensic findings
    if (response.image_analysis?.forensic_findings) {
      issues.push(...response.image_analysis.forensic_findings.map(i => i.description));
    }

    return issues.length > 0 ? issues : ["No issues detected"];
  };

  // Extract passed checks from backend response
  const extractPassedChecks = (response: CorroborationResponse): string[] => {
    const checks: string[] = [];

    // Format validation passed checks
    if (response.format_validation) {
      if (!response.format_validation.has_double_spacing) {
        checks.push("No double spacing issues");
      }
      if (!response.format_validation.has_font_inconsistencies) {
        checks.push("Font consistency verified");
      }
      if (!response.format_validation.has_spelling_errors) {
        checks.push("No spelling errors detected");
      }
      if (!response.format_validation.has_indentation_issues) {
        checks.push("Indentation is correct");
      }
    }

    // Structure validation passed checks
    if (response.structure_validation) {
      if (response.structure_validation.is_complete) {
        checks.push("Document structure is complete");
      }
      if (response.structure_validation.has_correct_headers) {
        checks.push("Headers are correctly formatted");
      }
      if (response.structure_validation.template_match_score >= 0.8) {
        checks.push("Document matches expected template");
      }
    }

    // Content validation passed checks
    if (response.content_validation) {
      if (response.content_validation.quality_score >= 0.7) {
        checks.push("Content quality is acceptable");
      }
      if (!response.content_validation.has_sensitive_data) {
        checks.push("No unauthorized sensitive data detected");
      }
    }

    // Image analysis passed checks
    if (response.image_analysis) {
      if (response.image_analysis.is_authentic) {
        checks.push("Image authenticity verified");
      }
      if (!response.image_analysis.is_ai_generated) {
        checks.push("No AI-generated content detected");
      }
      if (!response.image_analysis.is_tampered) {
        checks.push("No tampering detected");
      }
      if (response.image_analysis.reverse_image_matches === 0) {
        checks.push("No duplicate images found online");
      }
    }

    return checks.length > 0 ? checks : ["All checks passed"];
  };

  // Generate recommendation based on risk level
  const generateRecommendation = (riskLevel: string): string => {
    switch (riskLevel.toLowerCase()) {
      case "critical":
        return "ESCALATE - Critical fraud indicators detected. Requires immediate senior review and potential account freeze.";
      case "high":
        return "ESCALATE - High risk of fraud detected. Requires senior compliance officer review before approval.";
      case "medium":
        return "REVIEW - Moderate risk indicators present. Additional verification recommended before proceeding.";
      case "low":
        return "APPROVE - Document appears authentic with no significant risk indicators. Proceed with standard review process.";
      default:
        return "REVIEW - Unable to determine risk level. Manual review recommended.";
    }
  };

  // Retry analysis for failed files
  const retryAnalysis = (fileId: string) => {
    performRealAnalysis(fileId);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-orange-600 text-white";
      case "medium":
        return "bg-yellow-600 text-white";
      default:
        return "bg-green-600 text-white";
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (uploadedFiles.length === 1) {
      setShowResults(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            📤 Upload Documents for Fraud Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-sm text-gray-600 mb-4">
              <p className="font-medium mb-1">Drop PDF or Images here or click to browse</p>
              <p className="text-xs">Supported: PDF, JPG, PNG, JPEG • Max size: 10MB per file</p>
            </div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={handleFileSelect}
            />
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {showResults && uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analysis Results ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedFiles.map((upload) => (
              <div key={upload.id} className="border rounded-lg p-4">
                {/* File Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {upload.file.type.includes("pdf") ? (
                      <FileText className="h-8 w-8 text-red-600" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-blue-600" />
                    )}
                    <div>
                      <div className="font-medium">{upload.file.name}</div>
                      <div className="text-xs text-gray-500">
                        {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(upload.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status */}
                {upload.status === "uploading" && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">
                      Uploading... {upload.progress}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${upload.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {upload.status === "analyzing" && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span>Analyzing document with AI detection engines...</span>
                  </div>
                )}

                {upload.status === "error" && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-red-600 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">❌ Analysis failed</span>
                    </div>
                    <p className="text-sm text-red-600 mb-3">
                      Unable to analyze document. Please check that the backend is running and try again.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => retryAnalysis(upload.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Analysis
                    </Button>
                  </div>
                )}

                {upload.status === "complete" && upload.analysis && (
                  <div className="space-y-3">
                    {/* Risk Score */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Risk Score:</span>
                      <Badge className={getRiskColor(upload.analysis.riskLevel)}>
                        {upload.analysis.riskScore}/100 ({upload.analysis.riskLevel.toUpperCase()})
                      </Badge>
                    </div>

                    {/* Compression Profile Detection */}
                    {upload.analysis.compressionProfiles && upload.analysis.compressionProfiles.length > 0 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          📱 Compression Profile Detected
                        </div>
                        {upload.analysis.compressionProfiles.map((profile, i) => (
                          <div key={i} className="text-sm text-blue-600 space-y-1">
                            <div>
                              <strong>{profile.message}</strong> ({profile.confidence} confidence)
                            </div>
                            {profile.size_match && (
                              <div className="text-xs">
                                ✅ Image dimensions match typical {profile.profile} compression
                              </div>
                            )}
                            <div className="text-xs text-blue-500">
                              ELA range: {profile.ela_range[0]}-{profile.ela_range[1]} |
                              Typical size: {profile.typical_size[0]}x{profile.typical_size[1]}px
                            </div>
                          </div>
                        ))}
                        <div className="text-xs text-blue-500 mt-2 pt-2 border-t border-blue-200">
                          ℹ️  Risk score may be adjusted for social media compression artifacts
                        </div>
                      </div>
                    )}

                    {/* Issues Detected */}
                    {upload.analysis.issuesDetected.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          🚨 Issues Detected ({upload.analysis.issuesDetected.length}):
                        </div>
                        <div className="space-y-1">
                          {upload.analysis.issuesDetected.map((issue, i) => (
                            <div key={i} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                              • {issue}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Passed Checks */}
                    {upload.analysis.passedChecks.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          ✅ Passed Checks ({upload.analysis.passedChecks.length}):
                        </div>
                        <div className="space-y-1">
                          {upload.analysis.passedChecks.map((check, i) => (
                            <div key={i} className="text-sm text-green-600 bg-green-50 p-2 rounded">
                              • {check}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendation */}
                    <div
                      className={`p-3 rounded-lg ${
                        upload.analysis.riskLevel === "critical" || upload.analysis.riskLevel === "high"
                          ? "bg-red-50 border border-red-200"
                          : upload.analysis.riskLevel === "medium"
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-green-50 border border-green-200"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">💡 Recommendation:</div>
                      <div className="text-sm">{upload.analysis.recommendation}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

