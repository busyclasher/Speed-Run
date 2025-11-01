"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Image as ImageIcon, AlertTriangle, CheckCircle, X } from "lucide-react";

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
    const validFiles = files.filter((file) => {
      const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB
    });

    const newUploads: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "uploading",
      progress: 0,
    }));

    setUploadedFiles((prev) => [...prev, ...newUploads]);
    setShowResults(true);

    // Simulate upload and analysis
    newUploads.forEach((upload) => {
      simulateAnalysis(upload.id);
    });
  };

  const simulateAnalysis = (fileId: string) => {
    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 20;
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, progress, status: progress >= 100 ? "analyzing" : "uploading" } : f
        )
      );
      if (progress >= 100) {
        clearInterval(uploadInterval);
        // Start analysis after upload
        setTimeout(() => performMockAnalysis(fileId), 1000);
      }
    }, 300);
  };

  const performMockAnalysis = (fileId: string) => {
    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (!file) return prev;

      const fileType = file.file.type.includes("pdf") ? "pdf" : "image";
      const analysis = generateMockAnalysis(file.file, fileType);

      return prev.map((f) =>
        f.id === fileId
          ? { ...f, status: "complete" as const, progress: 100, analysis }
          : f
      );
    });
  };

  const generateMockAnalysis = (file: File, fileType: "pdf" | "image"): AnalysisResult => {
    // Generate semi-random but realistic analysis
    const fileName = file.name.toLowerCase();
    const hasRiskKeywords = fileName.includes("copy") || fileName.includes("scan") || fileName.includes("temp");
    
    const baseRisk = Math.floor(Math.random() * 40) + 20; // 20-60
    const riskScore = hasRiskKeywords ? baseRisk + 30 : baseRisk;

    const riskLevel: "low" | "medium" | "high" | "critical" =
      riskScore >= 86 ? "critical" : riskScore >= 71 ? "high" : riskScore >= 41 ? "medium" : "low";

    const tampering = riskScore > 70;

    let issuesDetected: string[] = [];
    let passedChecks: string[] = [];

    if (fileType === "pdf") {
      // PDF-specific checks
      if (tampering) {
        issuesDetected = [
          "Document metadata shows multiple edits",
          "Suspicious timestamp modifications detected",
          "Multiple authors found in document history",
          "Embedded objects with inconsistent properties",
        ].slice(0, Math.floor(Math.random() * 3) + 1);
      } else {
        issuesDetected = riskScore > 40 ? ["Minor metadata inconsistencies"] : [];
      }

      passedChecks = [
        "File signature valid",
        "No hidden content detected",
        "Compression normal",
        "Text consistency verified",
        "Format compliant",
      ].slice(0, 5 - issuesDetected.length);
    } else {
      // Image-specific checks
      if (tampering) {
        issuesDetected = [
          "Image has been edited in photo editing software",
          "EXIF data shows multiple modifications",
          "Clone stamp tool usage detected",
          "Inconsistent compression levels across regions",
          "Suspicious color adjustments found",
          "Noise pattern inconsistencies",
        ].slice(0, Math.floor(Math.random() * 4) + 2);
      } else {
        issuesDetected = riskScore > 40 ? ["Minor EXIF inconsistencies", "Low resolution in some areas"] : [];
      }

      passedChecks = [
        "Original EXIF data intact",
        "No clone stamp detected",
        "Consistent compression",
        "Natural color histogram",
        "Watermark present",
        "Edge detection normal",
      ].slice(0, 6 - issuesDetected.length);
    }

    const recommendation =
      riskLevel === "critical" || riskLevel === "high"
        ? "ESCALATE - Requires senior officer review"
        : riskLevel === "medium"
        ? "REVIEW - Additional verification recommended"
        : "APPROVE - Document appears authentic";

    return {
      riskScore,
      riskLevel,
      issuesDetected,
      passedChecks,
      recommendation,
      fileType,
      tampering,
    };
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
                  <div className="text-sm text-blue-600 animate-pulse">
                    🔄 Analyzing document for fraud indicators...
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

