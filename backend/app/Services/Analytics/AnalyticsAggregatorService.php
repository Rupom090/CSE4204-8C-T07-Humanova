<?php

namespace App\Services\Analytics;

use App\Models\AnalyticsSnapshot;
use App\Models\Organization;
use Carbon\Carbon;

class AnalyticsAggregatorService
{
    /**
     * Called by scheduled command to compute snapshots.
     */
    public function aggregateDaily(): void
    {
        $today = Carbon::today();
        $organizations = Organization::all();

        $analyticsService = new AnalyticsService();

        foreach ($organizations as $org) {
            $metrics = $analyticsService->computeDashboardMetrics($org->id);
            
            AnalyticsSnapshot::updateOrCreate(
                [
                    'organization_id' => $org->id,
                    'metric_type' => 'daily_summary',
                    'period_start' => $today,
                    'period_end' => $today->copy()->endOfDay(),
                ],
                [
                    'metric_data' => $metrics
                ]
            );
        }
    }
}
