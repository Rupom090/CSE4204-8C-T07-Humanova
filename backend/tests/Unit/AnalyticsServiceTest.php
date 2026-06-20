<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Services\Analytics\AnalyticsAggregatorService;
use App\Models\Organization;

class AnalyticsServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_aggregate_daily_metrics()
    {
        $org = Organization::factory()->create();
        
        $service = new AnalyticsAggregatorService();
        $result = $service->aggregateDailyMetrics($org->id, now());

        $this->assertIsArray($result);
        $this->assertArrayHasKey('total_scans', $result);
    }
}
