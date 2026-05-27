<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Scan;
use App\Services\Scoring\ConfidenceScorerService;
use App\Events\ScanCompleted;

class ProcessConfidenceScoring implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    protected $scanId;

    public function __construct(int $scanId)
    {
        $this->scanId = $scanId;
    }

    public function handle(ConfidenceScorerService $scorer): void
    {
        $scan = Scan::findOrFail($this->scanId);
        
        $scan->update(['scan_status' => 'scoring']);

        $scorer->calculateScore($scan);

        $scan->update([
            'scan_status' => 'completed',
            'completed_at' => now(),
        ]);

        event(new ScanCompleted($scan));
    }
}
