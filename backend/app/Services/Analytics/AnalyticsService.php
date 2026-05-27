<?php

namespace App\Services\Analytics;

use App\Models\ProviderUsageLog;
use App\Models\Scan;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Compute dashboard metrics.
     */
    public function computeDashboardMetrics(int $organizationId): array
    {
        $today = Carbon::today();
        
        $totalScans = Scan::where('organization_id', $organizationId)->count();
        $todayScans = Scan::where('organization_id', $organizationId)->whereDate('created_at', $today)->count();
        
        $averageConfidence = Scan::where('organization_id', $organizationId)
            ->whereNotNull('overall_confidence')
            ->avg('overall_confidence') ?? 0;
            
        $totalTokens = ProviderUsageLog::where('organization_id', $organizationId)
            ->sum(DB::raw('request_tokens + response_tokens'));

        return [
            'total_scans' => $totalScans,
            'today_scans' => $todayScans,
            'average_confidence' => round($averageConfidence, 2),
            'total_tokens' => $totalTokens,
        ];
    }
}
