"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Zap, FileCheck } from "lucide-react";

interface QuickApprovalProps {
  riskScore: number;
  clientName: string;
  onApprove: (approvalType: string, reason: string) => void;
}

export function QuickApproval({ riskScore, clientName, onApprove }: QuickApprovalProps) {
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [reason, setReason] = useState("");

  const handleActionClick = (actionType: string) => {
    setSelectedAction(actionType);
    setShowReasonModal(true);
  };

  const handleConfirm = () => {
    if (reason.trim()) {
      onApprove(selectedAction, reason);
      setShowReasonModal(false);
      setReason("");
      setSelectedAction("");
    }
  };

  const getRiskLevel = () => {
    if (riskScore <= 40) return { level: "Low", color: "text-green-600", bg: "bg-green-50" };
    if (riskScore <= 70) return { level: "Medium", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (riskScore <= 85) return { level: "High", color: "text-orange-600", bg: "bg-orange-50" };
    return { level: "Critical", color: "text-red-600", bg: "bg-red-50" };
  };

  const risk = getRiskLevel();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">⚡ Quick Approval Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Risk Score Display */}
          <div className={`p-4 rounded-lg ${risk.bg}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Risk Score</div>
                <div className={`text-3xl font-bold ${risk.color}`}>{riskScore}</div>
              </div>
              <Badge variant={risk.level === "Critical" ? "destructive" : "secondary"}>
                {risk.level}
              </Badge>
            </div>
          </div>

          {/* Approval Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full justify-start gap-3 h-auto py-4"
              variant="outline"
              onClick={() => handleActionClick("Accept & Approve")}
            >
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <div className="font-semibold">Accept & Approve</div>
                <div className="text-xs text-muted-foreground">
                  Standard approval - no conditions
                </div>
              </div>
            </Button>

            <Button
              className="w-full justify-start gap-3 h-auto py-4"
              variant="outline"
              onClick={() => handleActionClick("Accept with Monitoring")}
            >
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="text-left">
                <div className="font-semibold">Accept with Monitoring</div>
                <div className="text-xs text-muted-foreground">
                  Approve but flag for periodic review
                </div>
              </div>
            </Button>

            <Button
              className="w-full justify-start gap-3 h-auto py-4"
              variant="outline"
              onClick={() => handleActionClick("Fast-Track Approval")}
              disabled={riskScore >= 50}
            >
              <Zap className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold">Fast-Track Approval</div>
                <div className="text-xs text-muted-foreground">
                  Low-risk client (score &lt; 50), expedite processing
                </div>
              </div>
            </Button>

            <Button
              className="w-full justify-start gap-3 h-auto py-4"
              variant="outline"
              onClick={() => handleActionClick("Approve with Conditions")}
            >
              <FileCheck className="h-5 w-5 text-orange-600" />
              <div className="text-left">
                <div className="font-semibold">Approve with Conditions</div>
                <div className="text-xs text-muted-foreground">
                  Specify conditions before final approval
                </div>
              </div>
            </Button>
          </div>

          {/* Escalation Warning for Risk >= 50 */}
          {riskScore >= 50 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm text-red-900">
                  <div className="font-semibold">⚠️ Auto-Escalation Required</div>
                  <div className="text-xs mt-1">
                    Risk score ≥ 50% requires senior officer review before final approval.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Accountability Info */}
          <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
            <div className="font-medium">Approval will be recorded as:</div>
            <div>Officer: Ana Rodriguez</div>
            <div>Timestamp: {new Date().toLocaleString()}</div>
            <div>Client: {clientName}</div>
            <div className="text-xs text-gray-500 mt-2">
              ℹ️ All cases require human review - no auto-approval
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Confirm: {selectedAction}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for this approval decision:
            </p>
            <textarea
              className="w-full border rounded-lg p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter reason for approval..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <Button
                className="flex-1"
                onClick={handleConfirm}
                disabled={!reason.trim()}
              >
                Confirm Approval
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  setShowReasonModal(false);
                  setReason("");
                  setSelectedAction("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

