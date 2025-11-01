"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TransactionDetails } from "@/components/investigation/TransactionDetails";
import { DocumentViewer } from "@/components/investigation/DocumentViewer";
import { AgentFindings } from "@/components/investigation/AgentFindings";
import { HistoricalContext } from "@/components/investigation/HistoricalContext";
import { QuickApproval } from "@/components/investigation/QuickApproval";
import { ArrowLeft, FileText } from "lucide-react";
import { mockAlertDetails } from "@/lib/mock-data";

export default function InvestigationPage() {
  const params = useParams();
  const router = useRouter();
  const alertId = params.alertId as string;

  // In production, fetch alert details from API
  const alertDetails = mockAlertDetails;

  const averageAmount = 60000;

  const handleRemediate = () => {
    window.alert("Alert marked for remediation. Audit trail updated.");
    router.push("/");
  };

  const handleViewAuditTrail = () => {
    window.alert("Audit trail viewer would open here.");
  };

  const handleApprove = (approvalType: string, reason: string) => {
    console.log("Approval:", { approvalType, reason, alertId, officer: "Ana Rodriguez", timestamp: new Date() });
    window.alert(`✅ ${approvalType} recorded!\n\nReason: ${reason}\n\nThis approval has been logged in the audit trail with full accountability.`);
    // In production, this would call an API to record the approval
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">AR</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Ana Rodriguez</p>
                <p className="text-xs text-gray-600">Compliance Officer</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Investigation Cockpit - Alert {alertId}
          </h1>
          <p className="text-sm text-muted-foreground">
            Comprehensive analysis combining transaction data and document forensics
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Transaction Details */}
          <TransactionDetails alert={alertDetails} />

          {/* Right Column - Document Forensics */}
          <DocumentViewer
            documentUrl={alertDetails.document_url}
            issues={alertDetails.document_issues}
          />
        </div>

        {/* AI Agent Findings */}
        <div className="mb-6">
          <AgentFindings findings={alertDetails.agent_findings} />
        </div>

        {/* Historical Context */}
        <div className="mb-6">
          <HistoricalContext
            data={alertDetails.transaction_history}
            currentAmount={alertDetails.amount}
            averageAmount={averageAmount}
          />
        </div>

        {/* Quick Approval + Action Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Quick Approval - Takes 2 columns */}
          <div className="lg:col-span-2">
            <QuickApproval
              riskScore={alertDetails.risk_score}
              clientName={alertDetails.client}
              onApprove={handleApprove}
            />
          </div>

          {/* Standard Actions - Takes 1 column */}
          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={handleRemediate}
            >
              🚨 Escalate to Senior Officer
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2"
              onClick={handleViewAuditTrail}
            >
              <FileText className="h-4 w-4" />
              View Audit Trail
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => window.alert("Reject functionality would be here")}
            >
              ❌ Reject Application
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

