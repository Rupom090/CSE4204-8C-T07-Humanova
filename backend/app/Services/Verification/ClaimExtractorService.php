<?php

namespace App\Services\Verification;

use App\Models\ExtractedClaim;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ClaimExtractorService
{
    protected string $aiMicroserviceUrl;

    public function __construct()
    {
        $this->aiMicroserviceUrl = config('services.python_ai.url', 'http://python-ai:8000');
    }

    /**
     * Extract factual claims from text using Python AI microservice.
     */
    public function extractClaims(int $scanId, string $text): void
    {
        try {
            $response = Http::timeout(30)->post("{$this->aiMicroserviceUrl}/extract-claims", [
                'text' => $text
            ]);

            if ($response->successful()) {
                $claims = $response->json('claims', []);
                
                foreach ($claims as $claimData) {
                    ExtractedClaim::create([
                        'scan_id' => $scanId,
                        'claim_text' => $claimData['text'],
                        'claim_type' => $claimData['type'] ?? 'factual',
                        'confidence' => $claimData['confidence'] ?? 0.8,
                        'entity_count' => count($claimData['entities'] ?? []),
                        'position_start' => $claimData['start'] ?? 0,
                        'position_end' => $claimData['end'] ?? 0,
                    ]);
                }
            } else {
                Log::error("Claim extraction failed: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Claim extraction exception: " . $e->getMessage());
        }
    }
}
