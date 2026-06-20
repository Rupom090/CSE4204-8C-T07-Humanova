<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\HallucinationReport;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModerationController extends Controller
{
    use ApiResponse;

    public function queue(Request $request): JsonResponse
    {
        $this->authorize('moderate', HallucinationReport::class);

        $reports = HallucinationReport::where('organization_id', $request->user()->current_organization_id)
            ->where('moderation_status', 'pending')
            ->orderBy('created_at', 'asc')
            ->paginate(15);
            
        return $this->paginated($reports, 'Moderation queue retrieved');
    }

    public function approve(Request $request, HallucinationReport $report): JsonResponse
    {
        $this->authorize('moderate', $report);

        $report->update(['moderation_status' => 'verified']);
        return $this->success($report, 'Report approved');
    }

    public function reject(Request $request, HallucinationReport $report): JsonResponse
    {
        $this->authorize('moderate', $report);

        $report->update(['moderation_status' => 'rejected']);
        return $this->success($report, 'Report rejected');
    }

    public function assign(Request $request, HallucinationReport $report): JsonResponse
    {
        $this->authorize('moderate', $report);

        $request->validate([
            'verifier_id' => 'required|exists:users,id',
        ]);

        $report->update(['assigned_to' => $request->verifier_id]);
        return $this->success($report, 'Report assigned successfully');
    }

    public function listVerifiers(Request $request): JsonResponse
    {
        $this->authorize('moderate', HallucinationReport::class);

        // Mock getting verifiers
        $verifiers = [];
        return $this->success($verifiers, 'Verifiers retrieved');
    }
}
