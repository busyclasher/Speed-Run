"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Clock, CheckCircle, X } from "lucide-react";
import { Recommendation, getUrgencyColor, getUrgencyIcon } from "@/lib/recommendation-engine";

interface SmartRecommendationsProps {
  recommendations: Recommendation[];
}

export default function SmartRecommendations({ recommendations }: SmartRecommendationsProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const activeRecommendations = recommendations.filter(
    rec => !dismissedIds.has(rec.id) && !completedIds.has(rec.id)
  );

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const handleAction = (recommendation: Recommendation) => {
    // In a real app, this would open a modal or navigate to an action page
    window.alert(`Action initiated: ${recommendation.action}`);
    setCompletedIds(prev => new Set([...prev, recommendation.id]));
  };

  if (activeRecommendations.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">All Clear!</p>
              <p className="text-sm text-green-700">No immediate actions required for this client.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          Smart Recommendations
          <Badge variant="secondary" className="ml-2">
            {activeRecommendations.length} Action{activeRecommendations.length !== 1 ? 's' : ''} Needed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {activeRecommendations.map((rec) => (
            <div
              key={rec.id}
              className={`border-l-4 rounded-lg p-4 ${getUrgencyColor(rec.urgency)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getUrgencyIcon(rec.urgency)}</span>
                    <Badge className={getUrgencyColor(rec.urgency)} variant="outline">
                      {rec.urgency}
                    </Badge>
                    <h4 className="font-semibold">{rec.title}</h4>
                  </div>
                  
                  <p className="text-sm mb-2">{rec.description}</p>
                  
                  <div className="bg-white/50 rounded p-3 mb-3">
                    <p className="text-sm font-medium mb-1">Recommended Action:</p>
                    <p className="text-sm">{rec.action}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Est. Time: {rec.estimatedTime}
                    </span>
                    <span>Reason: {rec.reason}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    className={
                      rec.urgency === "URGENT"
                        ? "bg-red-600 hover:bg-red-700"
                        : rec.urgency === "MEDIUM"
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    }
                    onClick={() => handleAction(rec)}
                  >
                    {rec.actionType === "contact" && "Contact Client"}
                    {rec.actionType === "escalate" && "Escalate Now"}
                    {rec.actionType === "schedule" && "Schedule Review"}
                    {rec.actionType === "review" && "Start Review"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDismiss(rec.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

