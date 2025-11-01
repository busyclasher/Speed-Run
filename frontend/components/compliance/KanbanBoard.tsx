"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, User, ArrowRight } from "lucide-react";

interface KanbanCard {
  review_id: string;
  client_name: string;
  client_id: string;
  risk_score: number;
  red_flags_count: number;
  status: "new" | "review" | "flagged" | "resolved";
  assigned_officer: string;
  time_in_queue: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

interface KanbanBoardProps {
  cards: KanbanCard[];
}

export function KanbanBoard({ cards }: KanbanBoardProps) {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const getRiskColor = (score: number) => {
    if (score >= 86) return "bg-red-600 text-white";
    if (score >= 71) return "bg-orange-600 text-white";
    if (score >= 41) return "bg-yellow-600 text-white";
    return "bg-green-600 text-white";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "border-red-500 bg-red-50";
      case "HIGH":
        return "border-orange-500 bg-orange-50";
      case "MEDIUM":
        return "border-yellow-500 bg-yellow-50";
      default:
        return "border-gray-300 bg-white";
    }
  };

  const columns = [
    { id: "new", title: "📥 New Cases", status: "new", color: "bg-blue-50" },
    { id: "review", title: "🔍 Under Review", status: "review", color: "bg-purple-50" },
    { id: "flagged", title: "⚠️ Flagged", status: "flagged", color: "bg-orange-50" },
    { id: "resolved", title: "✅ Resolved", status: "resolved", color: "bg-green-50" },
  ];

  const getColumnCards = (status: string) => {
    let filtered = cards.filter((card) => card.status === status);
    
    if (selectedFilter !== "all") {
      filtered = filtered.filter((card) => card.priority === selectedFilter);
    }
    
    return filtered;
  };

  const totalCards = cards.length;
  const newCount = cards.filter((c) => c.status === "new").length;
  const reviewCount = cards.filter((c) => c.status === "review").length;
  const flaggedCount = cards.filter((c) => c.status === "flagged").length;
  const resolvedCount = cards.filter((c) => c.status === "resolved").length;

  return (
    <div>
      {/* Filter Bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by Priority:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedFilter === "all" ? "default" : "outline"}
              onClick={() => setSelectedFilter("all")}
            >
              All ({totalCards})
            </Button>
            <Button
              size="sm"
              variant={selectedFilter === "CRITICAL" ? "default" : "outline"}
              onClick={() => setSelectedFilter("CRITICAL")}
              className={selectedFilter === "CRITICAL" ? "bg-red-600" : ""}
            >
              Critical
            </Button>
            <Button
              size="sm"
              variant={selectedFilter === "HIGH" ? "default" : "outline"}
              onClick={() => setSelectedFilter("HIGH")}
              className={selectedFilter === "HIGH" ? "bg-orange-600" : ""}
            >
              High
            </Button>
            <Button
              size="sm"
              variant={selectedFilter === "MEDIUM" ? "default" : "outline"}
              onClick={() => setSelectedFilter("MEDIUM")}
            >
              Medium
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {newCount} New • {reviewCount} Review • {flaggedCount} Flagged • {resolvedCount} Resolved
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnCards = getColumnCards(column.status);
          
          return (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className={`${column.color} rounded-t-lg p-4 border-b-2 border-gray-300`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <Badge variant="secondary" className="bg-white">
                    {columnCards.length}
                  </Badge>
                </div>
              </div>

              {/* Column Cards */}
              <div className="bg-gray-100 rounded-b-lg p-3 min-h-[500px] space-y-3">
                {columnCards.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No cases
                  </div>
                ) : (
                  columnCards.map((card) => (
                    <Card
                      key={card.review_id}
                      className={`cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${getPriorityColor(
                        card.priority
                      )} ${card.risk_score >= 50 ? "ring-2 ring-red-400" : ""}`}
                      onClick={() => router.push(`/compliance/review/${card.review_id}`)}
                    >
                      <CardContent className="p-4">
                        {/* Client Info */}
                        <div className="mb-3">
                          <div className="font-semibold text-gray-900 mb-1">
                            {card.client_name}
                          </div>
                          <div className="text-xs text-gray-500">{card.client_id}</div>
                        </div>

                        {/* Risk Score */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-600">Risk Score:</span>
                          <Badge className={getRiskColor(card.risk_score)}>
                            {card.risk_score}
                          </Badge>
                        </div>

                        {/* Red Flags */}
                        {card.red_flags_count > 0 && (
                          <div className="flex items-center gap-2 mb-3 text-xs">
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                            <span className="text-red-600 font-medium">
                              {card.red_flags_count} Red Flag{card.red_flags_count > 1 ? "s" : ""}
                            </span>
                          </div>
                        )}

                        {/* Escalation Required Badge */}
                        {card.risk_score >= 50 && (
                          <div className="mb-3">
                            <Badge variant="destructive" className="text-xs">
                              ⚠️ Escalation Required (≥50%)
                            </Badge>
                          </div>
                        )}

                        {/* Time & Officer */}
                        <div className="space-y-1 mb-3 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>{card.time_in_queue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>{card.assigned_officer}</span>
                          </div>
                        </div>

                        {/* Priority Badge */}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className={
                              card.priority === "CRITICAL"
                                ? "border-red-600 text-red-600"
                                : card.priority === "HIGH"
                                ? "border-orange-600 text-orange-600"
                                : card.priority === "MEDIUM"
                                ? "border-yellow-600 text-yellow-600"
                                : "border-gray-400 text-gray-600"
                            }
                          >
                            {card.priority}
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

