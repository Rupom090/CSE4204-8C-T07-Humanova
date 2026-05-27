<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\HallucinationReport;
use App\Models\ReportVote;
use App\Models\Scan;
use App\Models\ExtractedClaim;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    use ApiResponse;

    public function submitReport(Request $request)
    {
        $validated = $request->validate([
            'scan_id' => 'required|exists:scans,id',
            'claim_id' => 'nullable|exists:extracted_claims,id',
            'report_reason' => 'required|string',
            'description' => 'required|string',
            'severity' => 'required|string|in:low,medium,high,critical',
        ]);

        $scan = Scan::findOrFail($validated['scan_id']);
        
        if ($scan->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        $report = HallucinationReport::create([
            'organization_id' => $request->user()->organization_id,
            'user_id' => $request->user()->id,
            'scan_id' => $scan->id,
            'claim_id' => $validated['claim_id'] ?? null,
            'report_reason' => $validated['report_reason'],
            'description' => $validated['description'],
            'severity' => $validated['severity'],
            'moderation_status' => 'pending',
        ]);

        return $this->created($report, 'Report submitted successfully');
    }

    public function vote(Request $request, HallucinationReport $report)
    {
        $validated = $request->validate([
            'vote_type' => 'required|string|in:up,down',
        ]);

        if ($report->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        ReportVote::updateOrCreate(
            ['report_id' => $report->id, 'user_id' => $request->user()->id],
            ['vote_type' => $validated['vote_type']]
        );

        return $this->success(null, 'Vote recorded');
    }

    public function listReports(Request $request)
    {
        $query = HallucinationReport::where('organization_id', $request->user()->organization_id)
            ->with(['user', 'scan']);

        if ($request->has('status')) {
            $query->where('moderation_status', $request->status);
        }

        return $this->paginated($query->paginate(15), 'Reports retrieved');
    }
}
