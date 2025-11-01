"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { RedFlagsAlert } from "@/components/compliance/RedFlagsAlert";
import { RiskScoreCard } from "@/components/compliance/RiskScoreCard";
import { ClientProfile } from "@/components/compliance/ClientProfile";
import { DocumentAnalysis } from "@/components/compliance/DocumentAnalysis";
import { SourceOfWealth } from "@/components/compliance/SourceOfWealth";
import { ComplianceChecklist } from "@/components/compliance/ComplianceChecklist";
import { CallToActions } from "@/components/compliance/CallToActions";
import { QuickApproval } from "@/components/investigation/QuickApproval";

// Mock data for the review
const mockReviewData = {
  review_id: "KYC-2024-001",
  client_id: "CLI-456",
  client_name: "Hans Müller",
  status: "investigating",
  risk_score: 85,
  risk_breakdown: {
    document_risk: 25,
    geographic_risk: 20,
    client_profile_risk: 15,
    transaction_risk: 25,
  },
  red_flags: [
    {
      id: "RF-001",
      type: "Expired Passport",
      severity: "critical" as const,
      description: "Primary identification document expired 6 months ago",
      detected_at: "2024-11-01T09:30:00Z",
      resolved: false,
    },
    {
      id: "RF-002",
      type: "High-Risk Jurisdiction",
      severity: "high" as const,
      description: "Client has business operations in a sanctioned country",
      detected_at: "2024-11-01T09:31:00Z",
      resolved: false,
    },
    {
      id: "RF-003",
      type: "Inconsistent Address",
      severity: "medium" as const,
      description: "Address on passport doesn't match proof of address document",
      detected_at: "2024-11-01T09:32:00Z",
      resolved: false,
    },
  ],
  client: {
    client_id: "CLI-456",
    full_name: "Hans Müller",
    date_of_birth: "1975-03-15",
    nationality: "Swiss",
    address: {
      street: "Bahnhofstrasse 45",
      city: "Zurich",
      country: "Switzerland",
      postal_code: "8001",
    },
    occupation: "Business Owner",
    employer: "Müller Trading GmbH",
    account_type: "Private Banking",
    pep_status: false,
    relationship_manager: "Thomas Weber",
    documents: [
      { type: "Passport", status: "expired", uploaded_date: "2024-10-15T10:00:00Z" },
      { type: "Proof of Address", status: "approved", uploaded_date: "2024-10-20T14:30:00Z" },
      { type: "Bank Statement", status: "pending", uploaded_date: "2024-10-25T09:15:00Z" },
    ],
  },
  ocr_results: [
    {
      document_type: "Passport",
      extracted_data: {
        full_name: "Hans Müller",
        document_number: "P123456789",
        nationality: "Swiss",
        date_of_birth: "1975-03-15",
        expiry_date: "2024-04-30",
        issue_date: "2014-05-01",
      },
      confidence_scores: {
        full_name: 0.98,
        document_number: 0.95,
        nationality: 0.99,
        date_of_birth: 0.97,
        expiry_date: 0.92,
        issue_date: 0.94,
      },
      inconsistencies: [
        "Document has expired",
        "Issue date suggests document is 10 years old (typical validity: 10 years)",
      ],
      missing_fields: [],
    },
    {
      document_type: "Proof of Address",
      extracted_data: {
        full_name: "Hans Müller",
        address: "Seestrasse 120, Zurich, 8002",
        document_date: "2024-09-15",
      },
      confidence_scores: {
        full_name: 0.96,
        address: 0.88,
        document_date: 0.94,
      },
      inconsistencies: [
        "Address doesn't match passport address (Bahnhofstrasse 45 vs Seestrasse 120)",
      ],
      missing_fields: ["Postal code not clearly visible"],
    },
  ],
  source_of_wealth: {
    declaredSource: "Business ownership - International trading company",
    supportingDocuments: [
      { name: "Company Registration Certificate", status: "approved" },
      { name: "Tax Returns (Last 3 years)", status: "approved" },
      { name: "Business Bank Statements", status: "pending" },
    ],
    industryValidation: {
      typical_for_industry: true,
      notes:
        "Trading business with international operations is consistent with declared wealth source. Revenue figures align with industry standards.",
    },
    verificationStatus: "pending" as const,
  },
  compliance_checklist: [
    { id: "1", label: "Identity Verification", required: true, completed: false, notes: "Passport expired - requires renewal" },
    { id: "2", label: "Address Confirmation", required: true, completed: false, notes: "Address mismatch needs clarification" },
    { id: "3", label: "PEP Screening", required: true, completed: true },
    { id: "4", label: "Sanctions Check", required: true, completed: true },
    { id: "5", label: "Source of Wealth Verification", required: true, completed: false },
    { id: "6", label: "Tax Residency Confirmation", required: false, completed: true },
    { id: "7", label: "Beneficial Ownership Check", required: false, completed: false },
  ],
  created_at: "2024-11-01T09:30:00Z",
  assigned_officer: "Ana Rodriguez",
};

export default function InvestigationCockpit() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params.reviewId as string;

  const handleAction = (actionType: string, reason?: string) => {
    console.log("Action:", { actionType, reason, reviewId, timestamp: new Date() });
    window.alert(`✅ ${actionType} recorded!\n\nReason: ${reason}\n\nThis action has been logged in the audit trail.`);
    if (actionType.includes("Approve") || actionType.includes("Reject")) {
      router.push("/compliance");
    }
  };

  const handleApprove = (approvalType: string, reason: string) => {
    console.log("Approval:", { approvalType, reason, reviewId, officer: "Ana Rodriguez", timestamp: new Date() });
    window.alert(`✅ ${approvalType} recorded!\n\nReason: ${reason}\n\nThis approval has been logged in the audit trail with full accountability.`);
    router.push("/compliance");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "investigating":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/compliance")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Investigation Cockpit - KYC Review: {reviewId}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">
                    Client: {mockReviewData.client_name} ({mockReviewData.client_id})
                  </span>
                  <Badge className={getStatusColor(mockReviewData.status)}>
                    {mockReviewData.status}
                  </Badge>
                </div>
              </div>
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
        {/* Red Flags Alert - Prominent */}
        <div className="mb-6">
          <RedFlagsAlert flags={mockReviewData.red_flags} />
        </div>

        {/* Two-Column Layout: Client Profile + Risk Score */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ClientProfile client={mockReviewData.client} />
          <RiskScoreCard
            score={mockReviewData.risk_score}
            breakdown={mockReviewData.risk_breakdown}
          />
        </div>

        {/* Document Analysis */}
        <div className="mb-6">
          <DocumentAnalysis ocrResults={mockReviewData.ocr_results} />
        </div>

        {/* Source of Wealth */}
        <div className="mb-6">
          <SourceOfWealth
            declaredSource={mockReviewData.source_of_wealth.declaredSource}
            supportingDocuments={mockReviewData.source_of_wealth.supportingDocuments}
            industryValidation={mockReviewData.source_of_wealth.industryValidation}
            verificationStatus={mockReviewData.source_of_wealth.verificationStatus}
          />
        </div>

        {/* Compliance Checklist */}
        <div className="mb-6">
          <ComplianceChecklist items={mockReviewData.compliance_checklist} />
        </div>

        {/* Quick Approval + Call-to-Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <QuickApproval
              riskScore={mockReviewData.risk_score}
              clientName={mockReviewData.client_name}
              onApprove={handleApprove}
            />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Quick Actions</div>
            <div className="space-y-2">
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => handleAction("Escalate to Senior Officer", "Risk score > 20%")}
              >
                🚨 Escalate (Risk > 20%)
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/compliance")}
              >
                View Audit Trail
              </Button>
            </div>
          </div>
        </div>

        {/* Call-to-Actions */}
        <div className="mb-6">
          <CallToActions onAction={handleAction} />
        </div>
      </main>
    </div>
  );
}

