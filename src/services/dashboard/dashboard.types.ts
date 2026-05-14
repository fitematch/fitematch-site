export interface DashboardSummaryMetric {
  total: number;
  lastWeek: number;
}

export interface DashboardSummaryResponse {
  users: DashboardSummaryMetric;
  companies: DashboardSummaryMetric;
  jobs: DashboardSummaryMetric;
  applications: DashboardSummaryMetric;
}
