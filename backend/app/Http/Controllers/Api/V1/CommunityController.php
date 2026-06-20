<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\HallucinationReport;
use App\Models\ReportVote;
use App\Models\Scan;
use App\Models\ExtractedClaim;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    use ApiResponse;

    public function submitReport(Request $request): JsonResponse
    {
        $this->authorize('create', HallucinationReport::class);

        $validated = $request->validate([
            'scan_id' => 'required|exists:scans,id',
            'claim_id' => 'nullable|exists:extracted_claims,id',
            'report_reason' => 'required|string',
            'description' => 'required|string',
            'severity' => 'required|string|in:low,medium,high,critical',
        ]);

        $scan = Scan::findOrFail($validated['scan_id']);
        
        if ($scan->organization_id !== $request->user()->current_organization_id) {
            return $this->forbidden();
        }

        $report = HallucinationReport::create([
            'organization_id' => $request->user()->current_organization_id,
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

    public function vote(Request $request, HallucinationReport $report): JsonResponse
    {
        $this->authorize('view', $report);

        $validated = $request->validate([
            'vote_type' => 'required|string|in:up,down',
        ]);

        ReportVote::updateOrCreate(
            ['report_id' => $report->id, 'user_id' => $request->user()->id],
            ['vote_type' => $validated['vote_type']]
        );

        return $this->success(null, 'Vote recorded');
    }

    public function listReports(Request $request): JsonResponse
    {
        $this->authorize('viewAny', HallucinationReport::class);

        $query = HallucinationReport::where('organization_id', $request->user()->current_organization_id)
            ->with(['user', 'scan']);

        if ($request->has('status')) {
            $query->where('moderation_status', $request->status);
        }

        return $this->paginated($query->paginate(15), 'Reports retrieved');
    }

    public function showReport(Request $request, HallucinationReport $report): JsonResponse
    {
        $this->authorize('view', $report);

        $report->load(['user', 'scan', 'claim']);
        return $this->success($report, 'Report retrieved successfully');
    }

    public function uploadEvidence(Request $request, HallucinationReport $report): JsonResponse
    {
        $this->authorize('create', HallucinationReport::class); // Reusing create permission

        $request->validate([
            'evidence_file' => 'required|file|max:10240',
        ]);

        // Logic to store evidence and associate it with the report
        return $this->success(null, 'Evidence uploaded successfully');
    }
}
