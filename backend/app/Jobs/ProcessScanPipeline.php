<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Scan;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;

class ProcessScanPipeline implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    protected $scanId;

    public function __construct(int $scanId)
    {
        $this->scanId = $scanId;
    }

    public function handle(): void
    {
        $scan = Scan::findOrFail($this->scanId);
        $scan->update(['scan_status' => 'processing']);

        Bus::chain([
            new ProcessClaimExtraction($this->scanId),
            new ProcessEvidenceRetrieval($this->scanId),
            new ProcessLinkVerification($this->scanId),
            new ProcessConfidenceScoring($this->scanId),
        ])->catch(function (\Throwable $e) use ($scan) {
            Log::error("Scan Pipeline Failed for Scan ID {$scan->id}: " . $e->getMessage());
            $scan->update(['scan_status' => 'failed']);
        })->dispatch();
    }
}
