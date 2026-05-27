<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\Analytics\AnalyticsAggregatorService;
use Illuminate\Support\Facades\Log;

class AggregateAnalytics implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(AnalyticsAggregatorService $aggregator): void
    {
        try {
            $aggregator->aggregateDaily();
        } catch (\Exception $e) {
            Log::error("AggregateAnalytics Job failed: " . $e->getMessage());
        }
    }
}
