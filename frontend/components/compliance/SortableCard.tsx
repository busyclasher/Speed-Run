"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, User, ArrowRight, MoreVertical, Play, Flag, CheckCircle } from "lucide-react";

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

interface SortableCardProps {
  card: KanbanCard;
  getRiskColor: (score: number) => string;
  getPriorityColor: (priority: string) => string;
  onCardClick: () => void;
  onQuickAction: (action: string) => void;
  showActionMenu: boolean;
  setShowActionMenu: (show: boolean) => void;
}

export function SortableCard({
  card,
  getRiskColor,
  getPriorityColor,
  onCardClick,
  onQuickAction,
  showActionMenu,
  setShowActionMenu,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.review_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing border-l-4 ${getPriorityColor(
        card.priority
      )} ${card.risk_score >= 50 ? "ring-2 ring-red-400" : ""} relative`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4">
        {/* Quick Action Menu Button */}
        <div className="absolute top-2 right-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setShowActionMenu(!showActionMenu);
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {/* Action Menu Dropdown */}
          {showActionMenu && (
            <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 w-48">
              <div className="py-1">
                {card.status !== "review" && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAction("start_review");
                    }}
                  >
                    <Play className="h-4 w-4 text-blue-600" />
                    Start Review
                  </button>
                )}
                {card.status !== "flagged" && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAction("flag");
                    }}
                  >
                    <Flag className="h-4 w-4 text-orange-600" />
                    Flag for Review
                  </button>
                )}
                {card.status !== "resolved" && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAction("resolve");
                    }}
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Mark as Resolved
                  </button>
                )}
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 border-t"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardClick();
                  }}
                >
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                  Open Full Review
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Client Info */}
        <div className="mb-3 pr-8" onClick={onCardClick}>
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
          <div className="text-xs text-gray-400">Drag to move</div>
        </div>
      </CardContent>
    </Card>
  );
}

