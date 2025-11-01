"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { KPICard } from "@/components/dashboard/KPICard";
import { AlertTriageTable } from "@/components/dashboard/AlertTriageTable";
import { PieChart } from "@/components/charts/PieChart";
import { LineChart } from "@/components/charts/LineChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileWarning, Clock, TrendingUp } from "lucide-react";
import { mockDashboardSummary, mockActiveAlerts, mockTransactionVolume } from "@/lib/mock-data";

export default function DashboardPage() {
  // In production, these would fetch from the API
  // For now, we'll use mock data
  const summary = mockDashboardSummary;
  const alerts = mockActiveAlerts;
  const volumeData = mockTransactionVolume;

  const pieChartData = [
    { name: "Critical", value: summary.alerts_by_risk.critical, color: "#dc2626" },
    { name: "High", value: summary.alerts_by_risk.high, color: "#f97316" },
    { name: "Medium", value: summary.alerts_by_risk.medium, color: "#eab308" },
    { name: "Low", value: summary.alerts_by_risk.low, color: "#22c55e" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">JB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Julius Baer: Agentic AI AML Platform
                </h1>
                <p className="text-sm text-gray-600">
                  Real-time Monitoring & Document Corroboration
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">AR</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Ana Rodriguez</p>
                  <p className="text-xs text-gray-600">Compliance Officer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Critical Alert Banner */}
        <AlertBanner />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <KPICard
            title="Total Active Alerts"
            value={summary.total_active_alerts}
            subtitle="Across all priority levels"
            icon={AlertTriangle}
            iconColor="text-blue-600"
          />
          <KPICard
            title="Critical Alerts"
            value={summary.critical_alerts}
            subtitle="Require immediate action"
            icon={FileWarning}
            iconColor="text-red-600"
          />
          <KPICard
            title="Pending Cases"
            value={summary.pending_cases}
            subtitle="Awaiting investigation"
            icon={Clock}
            iconColor="text-yellow-600"
          />
          <KPICard
            title="Avg. Resolution Time"
            value={`${summary.avg_resolution_time} hours`}
            subtitle="↓ 12% from last month"
            icon={TrendingUp}
            iconColor="text-green-600"
            trend={{
              value: summary.resolution_time_change,
              isPositive: true,
            }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Alerts by Risk Level */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alerts by Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={pieChartData} />
            </CardContent>
          </Card>

          {/* Transaction Volume Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction Volume Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={volumeData} />
            </CardContent>
          </Card>
        </div>

        {/* Active Alert Triage Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Alert Triage Queue</CardTitle>
            <p className="text-sm text-muted-foreground">
              All alerts requiring compliance officer review
            </p>
          </CardHeader>
          <CardContent>
            <AlertTriageTable alerts={alerts} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
