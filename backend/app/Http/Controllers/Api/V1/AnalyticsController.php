<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\Analytics\AnalyticsService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\AnalyticsSnapshot;
use App\Models\ProviderUsageLog;

class AnalyticsController extends Controller
{
    use ApiResponse;

    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function dashboard(Request $request)
    {
        $metrics = $this->analyticsService->computeDashboardMetrics($request->user()->organization_id);
        return $this->success($metrics, 'Dashboard metrics retrieved');
    }

    public function providers(Request $request)
    {
        // Simple mock group by provider for now
        return $this->success([], 'Provider metrics retrieved');
    }

    public function tokens(Request $request)
    {
        $usage = ProviderUsageLog::where('organization_id', $request->user()->organization_id)
            ->sum('request_tokens'); // Example metric
            
        return $this->success(['total_request_tokens' => $usage], 'Token metrics retrieved');
    }
}
