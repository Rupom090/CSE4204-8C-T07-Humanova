<?php

namespace App\Services\Verification;

use App\Models\Scan;
use App\Jobs\ProcessClaimExtraction;
use App\Jobs\ProcessEvidenceRetrieval;
use App\Jobs\ProcessLinkVerification;
use App\Jobs\ProcessConfidenceScoring;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;

class ScanPipelineService
{
    /**
     * Dispatch the verification scan pipeline jobs in a chain.
     */
    public function dispatchPipeline(Scan $scan): void
    {
        try {
            $scan->update(['scan_status' => 'queued']);

            Bus::chain([
                new ProcessClaimExtraction($scan->id),
                new ProcessEvidenceRetrieval($scan->id),
                new ProcessLinkVerification($scan->id),
                new ProcessConfidenceScoring($scan->id),
            ])->catch(function (\Throwable $e) use ($scan) {
                Log::error("Scan Pipeline Failed for Scan ID {$scan->id}: " . $e->getMessage());
                $scan->update(['scan_status' => 'failed']);
            })->dispatch();

        } catch (\Exception $e) {
            Log::error("Failed to dispatch Scan Pipeline: " . $e->getMessage());
            $scan->update(['scan_status' => 'failed']);
            throw $e;
        }
    }
}
