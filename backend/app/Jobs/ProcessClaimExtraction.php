<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Scan;
use App\Services\Verification\ClaimExtractorService;

class ProcessClaimExtraction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    protected $scanId;

    public function __construct(int $scanId)
    {
        $this->scanId = $scanId;
    }

    public function handle(ClaimExtractorService $claimExtractor): void
    {
        $scan = Scan::with('generation')->findOrFail($this->scanId);
        
        $scan->update(['scan_status' => 'processing']); // Update status

        $textToAnalyze = $scan->scan_type === 'internal' 
            ? $scan->generation->response_text 
            : $scan->generation->response_text; // Or external text

        $claimExtractor->extractClaims($scan->id, $textToAnalyze);
    }
}
