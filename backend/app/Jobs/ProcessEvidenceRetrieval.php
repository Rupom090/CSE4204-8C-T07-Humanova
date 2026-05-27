<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Scan;
use App\Services\Verification\EvidenceRetrieverService;

class ProcessEvidenceRetrieval implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    protected $scanId;

    public function __construct(int $scanId)
    {
        $this->scanId = $scanId;
    }

    public function handle(EvidenceRetrieverService $evidenceRetriever): void
    {
        $scan = Scan::with('claims')->findOrFail($this->scanId);
        
        $scan->update(['scan_status' => 'verifying']);

        foreach ($scan->claims as $claim) {
            $evidenceRetriever->retrieveEvidenceForClaim($claim);
        }
    }
}
