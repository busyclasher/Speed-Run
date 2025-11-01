"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface RedFlag {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  detected_at: string;
  resolved: boolean;
}

interface RedFlagsAlertProps {
  flags: RedFlag[];
}

export function RedFlagsAlert({ flags }: RedFlagsAlertProps) {
  const criticalFlags = flags.filter((f) => f.severity === "critical" && !f.resolved);
  const highFlags = flags.filter((f) => f.severity === "high" && !f.resolved);
  const mediumFlags = flags.filter((f) => f.severity === "medium" && !f.resolved);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "high":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case "medium":
        return <Info className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-900";
      case "high":
        return "bg-orange-50 border-orange-200 text-orange-900";
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  const unresolvedFlags = flags.filter((f) => !f.resolved);

  if (unresolvedFlags.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <div>
              <div className="font-semibold text-green-900">No Red Flags Detected</div>
              <div className="text-sm text-green-700">
                All compliance checks passed successfully
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-300 bg-red-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-red-900 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            🚨 Red Flags Detected ({unresolvedFlags.length} Issues)
          </CardTitle>
          <div className="flex gap-2">
            {criticalFlags.length > 0 && (
              <Badge variant="destructive">{criticalFlags.length} Critical</Badge>
            )}
            {highFlags.length > 0 && (
              <Badge className="bg-orange-600">{highFlags.length} High</Badge>
            )}
            {mediumFlags.length > 0 && (
              <Badge className="bg-yellow-600">{mediumFlags.length} Medium</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {unresolvedFlags.map((flag) => (
            <div
              key={flag.id}
              className={`p-4 rounded-lg border-2 ${getSeverityColor(flag.severity)}`}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(flag.severity)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold">{flag.type}</div>
                    <Badge
                      variant="outline"
                      className={
                        flag.severity === "critical"
                          ? "border-red-600 text-red-600"
                          : flag.severity === "high"
                          ? "border-orange-600 text-orange-600"
                          : "border-yellow-600 text-yellow-600"
                      }
                    >
                      {flag.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm mb-2">{flag.description}</div>
                  <div className="text-xs text-gray-600">
                    Detected: {new Date(flag.detected_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {criticalFlags.length > 0 && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <div className="text-sm font-medium text-red-900">
              ⚠️ Critical flags require immediate attention and senior officer review
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

