<?php

namespace App\Services\Verification;

use App\Services\Security\SsrfProtectionService;
use App\Models\LinkCheck;
use Illuminate\Support\Facades\Http;

class LinkCheckerService
{
    protected SsrfProtectionService $ssrfProtection;

    public function __construct(SsrfProtectionService $ssrfProtection)
    {
        $this->ssrfProtection = $ssrfProtection;
    }

    /**
     * Check a URL for validity and security.
     */
    public function checkLink(int $scanId, string $url): LinkCheck
    {
        // 1. SSRF Check
        if (!$this->ssrfProtection->isSafeUrl($url)) {
            return LinkCheck::create([
                'scan_id' => $scanId,
                'url' => $url,
                'http_status' => null,
                'ssl_valid' => false,
                'trust_score' => 0,
            ]);
        }

        // 2. HTTP Request Check
        try {
            $start = microtime(true);
            $response = Http::timeout(5)->get($url);
            $latency = (int) ((microtime(true) - $start) * 1000);

            $status = $response->status();
            $sslValid = str_starts_with($url, 'https://');
            
            // Calculate basic trust score
            $trustScore = 100;
            if ($status >= 400) {
                $trustScore = 0;
            } elseif (!$sslValid) {
                $trustScore -= 30;
            }

            return LinkCheck::create([
                'scan_id' => $scanId,
                'url' => $url,
                'http_status' => $status,
                'ssl_valid' => $sslValid,
                'response_time_ms' => $latency,
                'redirect_chain' => null, // Assuming no complex redirect tracking here
                'trust_score' => max(0, $trustScore),
            ]);

        } catch (\Exception $e) {
            return LinkCheck::create([
                'scan_id' => $scanId,
                'url' => $url,
                'http_status' => null,
                'ssl_valid' => false,
                'trust_score' => 0,
            ]);
        }
    }
}
