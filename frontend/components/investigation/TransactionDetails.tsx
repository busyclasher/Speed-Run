import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDetails } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

interface TransactionDetailsProps {
  alert: AlertDetails;
}

export function TransactionDetails({ alert }: TransactionDetailsProps) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Transaction Details</CardTitle>
          <Badge variant={getPriorityVariant(alert.priority) as any}>
            {alert.priority}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Alert ID: {alert.alert_id}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Amount</p>
            <p className="text-lg font-bold">
              {formatCurrency(alert.amount, alert.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date</p>
            <p className="text-lg font-semibold">{alert.date || formatDate(alert.timestamp)}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Client</p>
          <p className="font-semibold">{alert.client}</p>
          <p className="text-sm text-muted-foreground">{alert.client_id}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Country</p>
          <p className="font-semibold">{alert.country || "Switzerland"}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Transaction Type</p>
          <p className="font-semibold">{alert.transaction_type || alert.type}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Counterparty</p>
          <p className="font-semibold">{alert.counterparty || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Purpose</p>
          <p className="font-semibold">{alert.purpose || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-red-600"
                style={{ width: `${alert.risk_score}%` }}
              />
            </div>
            <span className="text-lg font-bold">{alert.risk_score}/100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

