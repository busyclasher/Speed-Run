const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Alert {
  alert_id: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  client: string;
  client_id: string;
  type: string;
  amount: number;
  currency: string;
  risk_score: number;
  status: "pending" | "investigating" | "resolved";
  timestamp: string;
  country?: string;
  transaction_type?: string;
  counterparty?: string;
  purpose?: string;
  date?: string;
}

export interface DashboardSummary {
  total_active_alerts: number;
  critical_alerts: number;
  pending_cases: number;
  avg_resolution_time: number;
  resolution_time_change: number;
  alerts_by_risk: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface TransactionVolume {
  month: string;
  volume: number;
}

export interface AgentFinding {
  agent_name: string;
  agent_type: "Regulatory Watcher" | "Transaction Analyst" | "Document Forensics";
  priority: "critical" | "high" | "medium";
  finding: string;
  regulation?: string;
}

export interface DocumentIssue {
  type: "tampering" | "inconsistency" | "suspicious";
  description: string;
  page: number;
}

export interface TransactionHistory {
  month: string;
  amount: number;
}

export interface AlertDetails extends Alert {
  agent_findings: AgentFinding[];
  document_issues: DocumentIssue[];
  transaction_history: TransactionHistory[];
  document_url?: string;
}

export interface AuditLogEntry {
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    return this.request<DashboardSummary>("/api/alerts/summary");
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return this.request<Alert[]>("/api/alerts/active");
  }

  async getTransactionVolume(): Promise<TransactionVolume[]> {
    return this.request<TransactionVolume[]>("/api/transactions/volume");
  }

  async getAlertDetails(alertId: string): Promise<AlertDetails> {
    return this.request<AlertDetails>(`/api/alerts/${alertId}`);
  }

  async remediateAlert(alertId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/alerts/${alertId}/remediate`, {
      method: "POST",
    });
  }

  async getAuditTrail(alertId: string): Promise<AuditLogEntry[]> {
    return this.request<AuditLogEntry[]>(`/api/audit-trail/${alertId}`);
  }
}

export const apiClient = new ApiClient(API_URL);

