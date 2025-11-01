"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CheckCircle, AlertCircle, FileText } from "lucide-react";

interface SourceOfWealthProps {
  declaredSource: string;
  supportingDocuments: Array<{
    name: string;
    status: string;
  }>;
  industryValidation: {
    typical_for_industry: boolean;
    notes: string;
  };
  verificationStatus: "verified" | "pending" | "requires_clarification";
}

export function SourceOfWealth({
  declaredSource,
  supportingDocuments,
  industryValidation,
  verificationStatus,
}: SourceOfWealthProps) {
  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return <Badge className="bg-green-600">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>;
      default:
        return <Badge variant="destructive">Requires Clarification</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            💼 Source of Wealth Verification
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Declared Source */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Declared Source:</div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-900">{declaredSource}</div>
          </div>
        </div>

        {/* Supporting Documents */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">
            Supporting Documents ({supportingDocuments.length}):
          </div>
          <div className="space-y-2">
            {supportingDocuments.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{doc.name}</span>
                </div>
                <Badge
                  variant={doc.status === "approved" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {doc.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Practice Validation */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">
            Industry Practice Validation:
          </div>
          <div
            className={`p-3 rounded-lg border ${
              industryValidation.typical_for_industry
                ? "bg-green-50 border-green-200"
                : "bg-orange-50 border-orange-200"
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              {industryValidation.typical_for_industry ? (
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
              )}
              <div>
                <div
                  className={`text-sm font-medium ${
                    industryValidation.typical_for_industry
                      ? "text-green-900"
                      : "text-orange-900"
                  }`}
                >
                  {industryValidation.typical_for_industry
                    ? "Typical for Industry"
                    : "Requires Additional Review"}
                </div>
                <div
                  className={`text-sm mt-1 ${
                    industryValidation.typical_for_industry
                      ? "text-green-700"
                      : "text-orange-700"
                  }`}
                >
                  {industryValidation.notes}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <div>
              <div className="text-sm font-medium">Verification Status</div>
              <div className="text-xs text-gray-600">
                {verificationStatus === "verified"
                  ? "Source of wealth has been verified and approved"
                  : verificationStatus === "pending"
                  ? "Verification in progress"
                  : "Additional clarification required from client"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

