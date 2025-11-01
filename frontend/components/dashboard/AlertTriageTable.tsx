"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/lib/api";
import { formatCurrency, formatTime, cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface AlertTriageTableProps {
  alerts: Alert[];
}

export function AlertTriageTable({ alerts }: AlertTriageTableProps) {
  const router = useRouter();

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "critical";
      case "HIGH":
        return "high";
      case "MEDIUM":
        return "medium";
      case "LOW":
        return "low";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "investigating":
        return "text-blue-600 bg-blue-50";
      case "resolved":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Alert ID</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.alert_id}>
              <TableCell className="font-medium">{alert.alert_id}</TableCell>
              <TableCell>
                <Badge variant={getPriorityVariant(alert.priority) as any}>
                  {alert.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{alert.client}</div>
                  <div className="text-xs text-muted-foreground">
                    {alert.client_id}
                  </div>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate">{alert.type}</div>
              </TableCell>
              <TableCell>
                {formatCurrency(alert.amount, alert.currency)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full",
                        alert.risk_score >= 90
                          ? "bg-red-600"
                          : alert.risk_score >= 70
                          ? "bg-orange-500"
                          : alert.risk_score >= 50
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      )}
                      style={{ width: `${alert.risk_score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{alert.risk_score}</span>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getStatusColor(alert.status)
                  )}
                >
                  {alert.status}
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatTime(alert.timestamp)}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(`/investigation/${alert.alert_id}`)
                  }
                >
                  Investigate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

