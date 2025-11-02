export interface Recommendation {
  id: string;
  urgency: "URGENT" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  action: string;
  estimatedTime: string;
  actionType: "contact" | "escalate" | "schedule" | "review";
  reason: string;
}

interface ClientData {
  client_id: string;
  full_name: string;
  risk_rating: string;
  transactionHistory: Array<{
    date: string;
    description: string;
    amount: number;
    risk: string;
  }>;
  adverseMedia: Array<{
    source: string;
    headline: string;
    date: string;
  }>;
  complianceStatus: {
    sanctions: string;
    pep: string;
    aml: string;
  };
}

export function generateRecommendations(client: ClientData): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Check for high-risk transactions
  const highRiskTransactions = client.transactionHistory?.filter(tx => tx.risk === "high") || [];
  if (highRiskTransactions.length > 0) {
    const largestTx = highRiskTransactions.reduce((max, tx) => 
      Math.abs(tx.amount) > Math.abs(max.amount) ? tx : max
    );
    
    recommendations.push({
      id: `${client.client_id}-high-risk-tx`,
      urgency: "URGENT",
      title: "High-Risk Transaction Detected",
      description: `A ${Math.abs(largestTx.amount).toLocaleString()} ${largestTx.amount < 0 ? 'outgoing' : 'incoming'} transaction was flagged as high risk.`,
      action: "Contact client for transaction justification and supporting documentation",
      estimatedTime: "2 hours",
      actionType: "contact",
      reason: "High-value transaction to/from high-risk jurisdiction requires immediate verification"
    });
  }

  // Check for adverse media
  if (client.adverseMedia && client.adverseMedia.length > 0) {
    recommendations.push({
      id: `${client.client_id}-adverse-media`,
      urgency: "MEDIUM",
      title: "Adverse Media Alert",
      description: `${client.adverseMedia.length} negative news ${client.adverseMedia.length === 1 ? 'story' : 'stories'} linked to this client.`,
      action: "Escalate to Compliance department for review and risk assessment",
      estimatedTime: "1 day",
      actionType: "escalate",
      reason: "Adverse media may indicate reputational or regulatory risk requiring compliance review"
    });
  }

  // Check compliance status
  if (client.complianceStatus) {
    if (client.complianceStatus.sanctions === "Potential Match") {
      recommendations.push({
        id: `${client.client_id}-sanctions-match`,
        urgency: "URGENT",
        title: "Potential Sanctions Match",
        description: "Client name shows potential match on sanctions screening.",
        action: "Immediately freeze account and escalate to Head of Compliance",
        estimatedTime: "Immediate",
        actionType: "escalate",
        reason: "Potential sanctions violations require immediate action to avoid regulatory penalties"
      });
    }

    if (client.complianceStatus.pep && client.complianceStatus.pep.includes("PEP")) {
      recommendations.push({
        id: `${client.client_id}-pep-status`,
        urgency: "LOW",
        title: "PEP Status Identified",
        description: `Client classified as ${client.complianceStatus.pep}.`,
        action: "Schedule Enhanced Due Diligence (EDD) review",
        estimatedTime: "3-5 days",
        actionType: "schedule",
        reason: "PEP status requires enhanced due diligence procedures per regulatory requirements"
      });
    }

    if (client.complianceStatus.aml === "High Risk") {
      recommendations.push({
        id: `${client.client_id}-high-aml-risk`,
        urgency: "MEDIUM",
        title: "High AML Risk Rating",
        description: "Client's AML risk assessment is rated as High.",
        action: "Initiate comprehensive AML review and update risk profile",
        estimatedTime: "2-3 days",
        actionType: "review",
        reason: "High AML risk requires regular monitoring and updated risk assessment"
      });
    }
  }

  // Check for multiple medium-risk transactions
  const mediumRiskTransactions = client.transactionHistory?.filter(tx => tx.risk === "medium") || [];
  if (mediumRiskTransactions.length >= 2) {
    recommendations.push({
      id: `${client.client_id}-pattern-risk`,
      urgency: "LOW",
      title: "Transaction Pattern Review Needed",
      description: `${mediumRiskTransactions.length} medium-risk transactions detected.`,
      action: "Review transaction patterns for potential structuring or unusual activity",
      estimatedTime: "4 hours",
      actionType: "review",
      reason: "Multiple medium-risk transactions may indicate emerging risk patterns"
    });
  }

  // Sort by urgency
  const urgencyOrder = { URGENT: 0, MEDIUM: 1, LOW: 2 };
  return recommendations.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case "URGENT":
      return "bg-red-100 text-red-800 border-red-300";
    case "MEDIUM":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "LOW":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}

export function getUrgencyIcon(urgency: string): string {
  switch (urgency) {
    case "URGENT":
      return "🔴";
    case "MEDIUM":
      return "🟠";
    case "LOW":
      return "🟡";
    default:
      return "⚪";
  }
}

