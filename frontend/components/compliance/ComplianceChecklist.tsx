"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  completed: boolean;
  notes?: string;
}

interface ComplianceChecklistProps {
  items: ChecklistItem[];
  onToggle?: (id: string) => void;
}

export function ComplianceChecklist({ items, onToggle }: ComplianceChecklistProps) {
  const [localItems, setLocalItems] = useState(items);

  const handleToggle = (id: string) => {
    setLocalItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    if (onToggle) onToggle(id);
  };

  const completedCount = localItems.filter((item) => item.completed).length;
  const requiredCount = localItems.filter((item) => item.required).length;
  const completedRequired = localItems.filter(
    (item) => item.required && item.completed
  ).length;
  const completionPercentage = Math.round((completedCount / localItems.length) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">✅ Compliance Checklist</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {completedCount}/{localItems.length} Completed
            </Badge>
            <Badge
              variant={completedRequired === requiredCount ? "default" : "destructive"}
            >
              {completedRequired}/{requiredCount} Required
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-gray-900">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${
                completionPercentage === 100 ? "bg-green-600" : "bg-blue-600"
              }`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-2">
          {localItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                item.completed
                  ? "bg-green-50 border-green-200"
                  : item.required
                  ? "bg-orange-50 border-orange-200"
                  : "bg-gray-50 border-gray-200"
              }`}
              onClick={() => handleToggle(item.id)}
            >
              <div className="flex items-start gap-3">
                {item.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        item.completed ? "text-green-900" : "text-gray-900"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.required && !item.completed && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  {item.notes && (
                    <div className="text-xs text-gray-600 mt-1">{item.notes}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning if required items not completed */}
        {completedRequired < requiredCount && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
            <div className="text-sm text-red-900">
              <span className="font-medium">Action Required:</span> Complete all required
              items before approving this KYC review.
            </div>
          </div>
        )}

        {/* Success message if all completed */}
        {completionPercentage === 100 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="text-sm text-green-900">
              <span className="font-medium">All checks completed!</span> This review is ready
              for final approval.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

