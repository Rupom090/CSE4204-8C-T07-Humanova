<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Scan;
use App\Services\Verification\LinkCheckerService;

class ProcessLinkVerification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    protected $scanId;

    public function __construct(int $scanId)
    {
        $this->scanId = $scanId;
    }

    public function handle(LinkCheckerService $linkChecker): void
    {
        $scan = Scan::with('generation')->findOrFail($this->scanId);
        
        // Basic regex to find URLs in the original text
        $text = $scan->scan_type === 'internal' 
            ? $scan->generation->response_text 
            : $scan->generation->response_text;
            
        preg_match_all('/https?:\/\/[^\s]+/i', $text, $matches);
        $urls = array_unique($matches[0]);

        foreach ($urls as $url) {
            $linkChecker->checkLink($scan->id, $url);
        }
    }
}
