<?php

namespace App\Repositories;

use App\Models\AnalyticsSnapshot;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class AnalyticsRepository
{
    /**
     * Get analytics snapshots for a date range.
     */
    public function getSnapshots(int $organizationId, string $metricType, Carbon $startDate, Carbon $endDate): Collection
    {
        return AnalyticsSnapshot::where('organization_id', $organizationId)
            ->where('metric_type', $metricType)
            ->whereBetween('period_start', [$startDate, $endDate])
            ->orderBy('period_start', 'asc')
            ->get();
    }

    /**
     * Get latest snapshot for a metric.
     */
    public function getLatestSnapshot(int $organizationId, string $metricType): ?AnalyticsSnapshot
    {
        return AnalyticsSnapshot::where('organization_id', $organizationId)
            ->where('metric_type', $metricType)
            ->latest('period_end')
            ->first();
    }
}
