<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Scan;
use App\Models\AiGeneration;
use App\Services\Verification\ScanPipelineService;
use App\Services\Verification\CitationVerifierService;
use App\Services\Verification\LinkCheckerService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    use ApiResponse;

    protected ScanPipelineService $pipelineService;
    protected CitationVerifierService $citationVerifier;
    protected LinkCheckerService $linkChecker;

    public function __construct(
        ScanPipelineService $pipelineService,
        CitationVerifierService $citationVerifier,
        LinkCheckerService $linkChecker
    ) {
        $this->pipelineService = $pipelineService;
        $this->citationVerifier = $citationVerifier;
        $this->linkChecker = $linkChecker;
    }

    /**
     * Verify pasted AI response without internal generation log
     */
    public function verifyExternal(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string',
            'provider_name' => 'nullable|string',
        ]);

        // Create a dummy generation record for external text to attach the scan
        $generation = AiGeneration::create([
            'organization_id' => $request->user()->organization_id,
            'user_id' => $request->user()->id,
            'response_text' => $validated['text'],
            'status' => 'completed',
        ]);

        $scan = Scan::create([
            'organization_id' => $request->user()->organization_id,
            'user_id' => $request->user()->id,
            'generation_id' => $generation->id,
            'scan_type' => 'external',
            'scan_status' => 'queued',
        ]);

        $this->pipelineService->dispatchPipeline($scan);

        return $this->created($scan, 'External verification scan queued successfully');
    }

    /**
     * One-off citation verification
     */
    public function verifyCitations(Request $request)
    {
        $validated = $request->validate([
            'scan_id' => 'required|exists:scans,id',
            'citation_text' => 'required|string',
            'doi' => 'nullable|string',
        ]);

        $scan = Scan::findOrFail($validated['scan_id']);
        if ($scan->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        $result = $this->citationVerifier->verifyCitation($scan->id, $validated['citation_text'], $validated['doi'] ?? null);

        return $this->success($result, 'Citation verified');
    }

    /**
     * One-off link checking
     */
    public function checkLinks(Request $request)
    {
        $validated = $request->validate([
            'scan_id' => 'required|exists:scans,id',
            'url' => 'required|url',
        ]);

        $scan = Scan::findOrFail($validated['scan_id']);
        if ($scan->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        $result = $this->linkChecker->checkLink($scan->id, $validated['url']);

        return $this->success($result, 'Link checked');
    }
}
