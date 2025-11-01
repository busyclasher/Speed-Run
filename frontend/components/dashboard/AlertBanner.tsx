import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AlertBanner() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-900">
            1 Critical Alert Require Immediate Attention
          </p>
        </div>
        <Badge variant="critical" className="uppercase text-xs">
          ALT-789: ABC Trading Ltd - CHF 150,000
        </Badge>
      </div>
    </div>
  );
}

