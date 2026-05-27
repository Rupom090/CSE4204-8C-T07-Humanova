<?php

namespace App\Listeners;

use App\Events\ScanCompleted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\AnalyticsSnapshot;
use Carbon\Carbon;

class UpdateAnalyticsOnScanComplete implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(ScanCompleted $event): void
    {
        $scan = $event->scan;
        
        // Example: Increment daily scan count for the organization
        $today = Carbon::today();
        
        $snapshot = AnalyticsSnapshot::firstOrCreate(
            [
                'organization_id' => $scan->organization_id,
                'metric_type' => 'daily_scans',
                'period_start' => $today,
                'period_end' => $today->copy()->endOfDay(),
            ],
            ['metric_data' => ['count' => 0]]
        );

        $data = $snapshot->metric_data;
        $data['count'] = ($data['count'] ?? 0) + 1;
        
        $snapshot->update(['metric_data' => $data]);
    }
}
