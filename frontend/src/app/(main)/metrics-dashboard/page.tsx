/**
 * System Metrics Dashboard Page
 *
 * Comprehensive system monitoring dashboard
 */

'use client';

import SystemMetricsDashboard from "@/components/ui/system-metrics-dashboard";

// Force dynamic rendering - requires QueryClient at runtime
export const dynamic = 'force-dynamic';

export default function MetricsDashboardPage() {
  return <SystemMetricsDashboard />;
}
