"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Download,
  MessageSquare,
} from "lucide-react";

interface CallToActionsProps {
  onAction: (actionType: string, reason?: string) => void;
}

export function CallToActions({ onAction }: CallToActionsProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [reason, setReason] = useState("");

  const handleActionClick = (actionType: string) => {
    setSelectedAction(actionType);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (reason.trim()) {
      onAction(selectedAction, reason);
      setShowModal(false);
      setReason("");
      setSelectedAction("");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎯 Call-to-Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Priority Actions */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-3">Priority Actions</div>
              <div className="space-y-2">
                <Button
                  className="w-full justify-start gap-2 bg-red-600 hover:bg-red-700"
                  onClick={() => handleActionClick("Escalate to Senior Officer")}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Escalate to Senior
                </Button>
                <Button
                  className="w-full justify-start gap-2 bg-orange-600 hover:bg-orange-700"
                  onClick={() => handleActionClick("Request Additional Documents")}
                >
                  <FileText className="h-4 w-4" />
                  Request Documents
                </Button>
                <Button
                  className="w-full justify-start gap-2 bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => handleActionClick("Schedule Client Interview")}
                >
                  <MessageSquare className="h-4 w-4" />
                  Schedule Interview
                </Button>
              </div>
            </div>

            {/* Standard Actions */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-3">Standard Actions</div>
              <div className="space-y-2">
                <Button
                  className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => handleActionClick("Approve KYC")}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve KYC
                </Button>
                <Button
                  className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleActionClick("Approve with Conditions")}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve w/ Conditions
                </Button>
                <Button
                  className="w-full justify-start gap-2 bg-gray-600 hover:bg-gray-700"
                  onClick={() => handleActionClick("Put on Hold")}
                >
                  <Clock className="h-4 w-4" />
                  Put on Hold
                </Button>
                <Button
                  className="w-full justify-start gap-2 bg-red-600 hover:bg-red-700"
                  onClick={() => handleActionClick("Reject Application")}
                >
                  <XCircle className="h-4 w-4" />
                  Reject Application
                </Button>
              </div>
            </div>

            {/* Documentation Actions */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-3">
                Documentation Actions
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => handleActionClick("Add Internal Note")}
                >
                  <MessageSquare className="h-4 w-4" />
                  Add Internal Note
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => handleActionClick("Export Risk Report")}
                >
                  <Download className="h-4 w-4" />
                  Export Risk Report
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => handleActionClick("Send Email to RM")}
                >
                  <Mail className="h-4 w-4" />
                  Email to RM
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Action: {selectedAction}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason or note for this action:
            </p>
            <textarea
              className="w-full border rounded-lg p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter reason or notes..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <Button className="flex-1" onClick={handleConfirm} disabled={!reason.trim()}>
                Confirm
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
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

