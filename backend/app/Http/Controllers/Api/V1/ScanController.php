<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Scan;
use App\Models\AiGeneration;
use App\Services\Verification\ScanPipelineService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ScanController extends Controller
{
    use ApiResponse;

    protected ScanPipelineService $pipelineService;

    public function __construct(ScanPipelineService $pipelineService)
    {
        $this->pipelineService = $pipelineService;
    }

    public function index(Request $request)
    {
        $query = Scan::where('organization_id', $request->user()->organization_id)
            ->with(['generation.provider']);

        if ($request->has('status')) {
            $query->where('scan_status', $request->status);
        }

        return $this->paginated($query->latest()->paginate(15), 'Scans retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'generation_id' => 'required|exists:ai_generations,id',
            'scan_type' => 'nullable|string|in:internal,external',
        ]);

        $generation = AiGeneration::findOrFail($validated['generation_id']);

        if ($generation->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        $scan = Scan::create([
            'organization_id' => $request->user()->organization_id,
            'user_id' => $request->user()->id,
            'generation_id' => $generation->id,
            'scan_type' => $validated['scan_type'] ?? 'internal',
            'scan_status' => 'queued',
        ]);

        $this->pipelineService->dispatchPipeline($scan);

        return $this->created($scan, 'Verification scan queued successfully');
    }

    public function show(Request $request, Scan $scan)
    {
        if ($scan->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        $scan->load(['generation', 'confidenceScore', 'claims.verificationResults']);
        return $this->success($scan, 'Scan retrieved successfully');
    }

    public function claims(Request $request, Scan $scan)
    {
        if ($scan->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }
        
        return $this->success($scan->claims, 'Claims retrieved successfully');
    }

    public function evidence(Request $request, Scan $scan)
    {
        if ($scan->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        $evidence = $scan->claims()->with('verificationResults.evidence')->get()->pluck('verificationResults.*.evidence')->flatten();
        return $this->success($evidence, 'Evidence retrieved successfully');
    }

    public function confidence(Request $request, Scan $scan)
    {
        if ($scan->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        return $this->success($scan->confidenceScore()->with('explanations')->first(), 'Confidence score retrieved successfully');
    }
}
