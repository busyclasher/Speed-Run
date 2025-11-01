"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface OCRResult {
  document_type: string;
  extracted_data: Record<string, string>;
  confidence_scores: Record<string, number>;
  inconsistencies: string[];
  missing_fields: string[];
}

interface DocumentAnalysisProps {
  ocrResults: OCRResult[];
}

export function DocumentAnalysis({ ocrResults }: DocumentAnalysisProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.95) return "text-green-600";
    if (score >= 0.85) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 0.95) return <Badge className="bg-green-600">High</Badge>;
    if (score >= 0.85) return <Badge className="bg-yellow-600">Medium</Badge>;
    return <Badge variant="destructive">Low</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          📄 Document Analysis (OCR Results)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {ocrResults.map((result, index) => (
          <div key={index} className="pb-6 border-b last:border-b-0 last:pb-0">
            {/* Document Type Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-gray-900">{result.document_type}</div>
              <Badge variant="outline">OCR Completed</Badge>
            </div>

            {/* Extracted Data */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Extracted Data:</div>
              <div className="space-y-2">
                {Object.entries(result.extracted_data).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm text-gray-600 capitalize">
                      {key.replace(/_/g, " ")}:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{value}</span>
                      {result.confidence_scores[key] && (
                        <span
                          className={`text-xs ${getConfidenceColor(
                            result.confidence_scores[key]
                          )}`}
                        >
                          ({(result.confidence_scores[key] * 100).toFixed(0)}%)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Scores Summary */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Overall Confidence:
              </div>
              <div className="flex items-center gap-2">
                {Object.values(result.confidence_scores).reduce((a, b) => a + b, 0) /
                  Object.values(result.confidence_scores).length >=
                0.95 ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      High confidence extraction
                    </span>
                  </>
                ) : Object.values(result.confidence_scores).reduce((a, b) => a + b, 0) /
                    Object.values(result.confidence_scores).length >=
                  0.85 ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600 font-medium">
                      Medium confidence - review recommended
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">
                      Low confidence - manual verification required
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Inconsistencies */}
            {result.inconsistencies.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Inconsistencies Found:
                </div>
                <div className="space-y-1">
                  {result.inconsistencies.map((issue, i) => (
                    <div key={i} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      • {issue}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Fields */}
            {result.missing_fields.length > 0 && (
              <div>
                <div className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Missing Information:
                </div>
                <div className="space-y-1">
                  {result.missing_fields.map((field, i) => (
                    <div key={i} className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                      • {field}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {ocrResults.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <div className="text-sm">No OCR results available</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

