<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\Analytics\AnalyticsService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
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

    public function dashboard(Request $request): JsonResponse
    {
        $this->authorize('viewDashboard', AnalyticsSnapshot::class);

        $metrics = $this->analyticsService->computeDashboardMetrics($request->user()->current_organization_id);
        return $this->success($metrics, 'Dashboard metrics retrieved');
    }

    public function providers(Request $request): JsonResponse
    {
        $this->authorize('viewDashboard', AnalyticsSnapshot::class);

        return $this->success([], 'Provider metrics retrieved');
    }

    public function tokens(Request $request): JsonResponse
    {
        $this->authorize('viewDashboard', AnalyticsSnapshot::class);

        $usage = ProviderUsageLog::where('organization_id', $request->user()->current_organization_id)
            ->sum('request_tokens');
            
        return $this->success(['total_request_tokens' => $usage], 'Token metrics retrieved');
    }

    public function hallucinations(Request $request): JsonResponse
    {
        $this->authorize('viewDashboard', AnalyticsSnapshot::class);

        return $this->success([], 'Hallucination metrics retrieved');
    }

    public function moderation(Request $request): JsonResponse
    {
        $this->authorize('viewDashboard', AnalyticsSnapshot::class);

        return $this->success([], 'Moderation metrics retrieved');
    }
}
