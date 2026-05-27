<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\HallucinationReport;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ModerationController extends Controller
{
    use ApiResponse;

    public function queue(Request $request)
    {
        // Simple queue retrieval for moderators
        $reports = HallucinationReport::where('organization_id', $request->user()->organization_id)
            ->where('moderation_status', 'pending')
            ->orderBy('created_at', 'asc')
            ->paginate(15);
            
        return $this->paginated($reports, 'Moderation queue retrieved');
    }

    public function approve(Request $request, HallucinationReport $report)
    {
        if ($report->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        $report->update(['moderation_status' => 'verified']);
        return $this->success($report, 'Report approved');
    }

    public function reject(Request $request, HallucinationReport $report)
    {
        if ($report->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        $report->update(['moderation_status' => 'rejected']);
        return $this->success($report, 'Report rejected');
    }
}
