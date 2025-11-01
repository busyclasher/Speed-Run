import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentIssue } from "@/lib/api";
import { AlertTriangle } from "lucide-react";

interface DocumentViewerProps {
  documentUrl?: string;
  issues: DocumentIssue[];
}

export function DocumentViewer({ documentUrl, issues }: DocumentViewerProps) {
  const getIssueColor = (type: string) => {
    switch (type) {
      case "tampering":
        return "bg-red-50 border-red-200 text-red-900";
      case "inconsistency":
        return "bg-orange-50 border-orange-200 text-orange-900";
      case "suspicious":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  const getIssueBadgeVariant = (type: string) => {
    switch (type) {
      case "tampering":
        return "critical";
      case "inconsistency":
        return "high";
      case "suspicious":
        return "medium";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Document Forensics</CardTitle>
        <p className="text-sm text-muted-foreground">
          Swiss_Home_Purchase_Agreement.pdf
        </p>
      </CardHeader>
      <CardContent>
        {/* Document Preview */}
        <div className="bg-gray-100 rounded-lg p-8 mb-4 min-h-[400px] flex items-center justify-center border-2 border-gray-200">
          <div className="text-center space-y-4 w-full max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-300">
              <div className="space-y-3 text-left">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg">SWISS HOME PURCHASE AGREEMENT</h3>
                </div>
                <p className="text-sm">
                  <span className="font-semibold">Between:</span> ABC Trading Ltd
                </p>
                <p className="text-sm">
                  <span className="font-semibold">And:</span> Luxury Properties Zurich AG
                </p>
                <div className="border-t border-b border-gray-300 py-3 my-3">
                  <p className="text-sm">
                    <span className="font-semibold">Agreement Date:</span>{" "}
                    <span className="border-2 border-red-500 bg-red-50 px-1">
                      October 28, 2025
                    </span>
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-semibold">Purchase Price:</span> CHF 150,000
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Beneficiary (Beneficiary Name):</span>
                </p>
                <p className="text-xs">
                  <span className="font-semibold">Property Location:</span> Zurich, Switzerland
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Page 8 of 12 - Issues detected
            </p>
          </div>
        </div>

        {/* Issues Detected */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h4 className="font-semibold text-red-900">{issues.length} Issues Detected</h4>
          </div>

          {issues.map((issue, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getIssueColor(issue.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <Badge variant={getIssueBadgeVariant(issue.type) as any} className="uppercase">
                  {issue.type}
                </Badge>
                <span className="text-xs font-medium">Page {issue.page}</span>
              </div>
              <p className="text-sm font-medium">{issue.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

