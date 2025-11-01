"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface RiskBreakdown {
  document_risk: number;
  geographic_risk: number;
  client_profile_risk: number;
  transaction_risk: number;
}

interface RiskScoreCardProps {
  score: number;
  breakdown: RiskBreakdown;
}

export function RiskScoreCard({ score, breakdown }: RiskScoreCardProps) {
  const getRiskLevel = () => {
    if (score >= 86) return { level: "Critical", color: "text-red-600", bg: "bg-red-50", border: "border-red-300" };
    if (score >= 71) return { level: "High", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-300" };
    if (score >= 41) return { level: "Medium", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-300" };
    return { level: "Low", color: "text-green-600", bg: "bg-green-50", border: "border-green-300" };
  };

  const risk = getRiskLevel();

  const getProgressColor = (value: number) => {
    if (value >= 30) return "bg-red-600";
    if (value >= 20) return "bg-orange-600";
    if (value >= 10) return "bg-yellow-600";
    return "bg-green-600";
  };

  return (
    <Card className={`border-2 ${risk.border} ${risk.bg}`}>
      <CardHeader>
        <CardTitle className="text-lg">📊 Risk Score Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Overall Score */}
        <div className="text-center mb-6 pb-6 border-b">
          <div className="text-sm text-muted-foreground mb-2">Overall Risk Score</div>
          <div className={`text-6xl font-bold ${risk.color}`}>{score}</div>
          <div className="text-sm text-muted-foreground mt-1">out of 100</div>
          <Badge
            className={`mt-3 ${
              risk.level === "Critical"
                ? "bg-red-600"
                : risk.level === "High"
                ? "bg-orange-600"
                : risk.level === "Medium"
                ? "bg-yellow-600"
                : "bg-green-600"
            }`}
          >
            {risk.level} Risk
          </Badge>
        </div>

        {/* How is this assigned? */}
        <div className="mb-4">
          <div className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            How is this score assigned?
          </div>
          <div className="text-sm text-gray-600 mb-4">
            The risk score is calculated based on four key categories. Each category contributes points based on detected risk factors:
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          {/* Document Risk */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Document Risk</div>
              <div className="text-sm font-bold">{breakdown.document_risk}/40</div>
            </div>
            <Progress value={(breakdown.document_risk / 40) * 100} className="h-2" />
            <div className="text-xs text-gray-600 mt-1">
              Tampering, missing fields, expired docs, inconsistencies
            </div>
          </div>

          {/* Geographic Risk */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Geographic Risk</div>
              <div className="text-sm font-bold">{breakdown.geographic_risk}/30</div>
            </div>
            <Progress value={(breakdown.geographic_risk / 30) * 100} className="h-2" />
            <div className="text-xs text-gray-600 mt-1">
              High-risk jurisdictions, offshore entities, sanctioned countries
            </div>
          </div>

          {/* Client Profile Risk */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Client Profile Risk</div>
              <div className="text-sm font-bold">{breakdown.client_profile_risk}/20</div>
            </div>
            <Progress value={(breakdown.client_profile_risk / 20) * 100} className="h-2" />
            <div className="text-xs text-gray-600 mt-1">
              PEP status, unclear wealth source, negative media, violations
            </div>
          </div>

          {/* Transaction Risk */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Transaction Risk</div>
              <div className="text-sm font-bold">{breakdown.transaction_risk}/10</div>
            </div>
            <Progress value={(breakdown.transaction_risk / 10) * 100} className="h-2" />
            <div className="text-xs text-gray-600 mt-1">
              Large amounts, unusual patterns, cash-intensive business
            </div>
          </div>
        </div>

        {/* Risk Level Guide */}
        <div className="mt-6 pt-4 border-t">
          <div className="text-xs font-medium text-gray-700 mb-2">Risk Level Guide:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span>0-40: Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-600 rounded"></div>
              <span>41-70: Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded"></div>
              <span>71-85: High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span>86-100: Critical Risk</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

