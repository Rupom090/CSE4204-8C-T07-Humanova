<?php

namespace App\Services\Verification;

use App\Models\ExtractedClaim;
use App\Models\VerificationResult;
use App\Models\EvidenceSource;
use App\Models\ContradictionResult;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EvidenceRetrieverService
{
    protected string $aiMicroserviceUrl;

    public function __construct()
    {
        $this->aiMicroserviceUrl = config('services.python_ai.url', 'http://python-ai:8000');
    }

    /**
     * Retrieve evidence for a specific claim.
     */
    public function retrieveEvidenceForClaim(ExtractedClaim $claim): void
    {
        try {
            $response = Http::timeout(45)->post("{$this->aiMicroserviceUrl}/retrieve-evidence", [
                'claim' => $claim->claim_text
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                $verificationResult = VerificationResult::create([
                    'claim_id' => $claim->id,
                    'verification_status' => $data['status'] ?? 'unverifiable',
                    'evidence_score' => $data['evidence_score'] ?? 0.0,
                    'contradiction_score' => $data['contradiction_score'] ?? 0.0,
                    'explanation' => $data['explanation'] ?? 'No explanation provided.',
                ]);

                if (!empty($data['sources'])) {
                    foreach ($data['sources'] as $source) {
                        EvidenceSource::create([
                            'verification_result_id' => $verificationResult->id,
                            'source_type' => $source['type'] ?? 'web',
                            'source_url' => $source['url'] ?? null,
                            'source_title' => $source['title'] ?? 'Unknown Source',
                            'authority_score' => $source['authority'] ?? 0.5,
                            'retrieval_score' => $source['retrieval_score'] ?? 0.5,
                        ]);
                    }
                }

                if (!empty($data['contradictions'])) {
                    foreach ($data['contradictions'] as $contradiction) {
                        ContradictionResult::create([
                            'claim_id' => $claim->id,
                            'contradicting_source' => $contradiction['source'] ?? 'Unknown',
                            'contradiction_probability' => $contradiction['probability'] ?? 0.8,
                            'severity' => $contradiction['severity'] ?? 'medium',
                            'explanation' => $contradiction['explanation'] ?? '',
                        ]);
                    }
                }
            } else {
                Log::error("Evidence retrieval failed: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Evidence retrieval exception: " . $e->getMessage());
        }
    }
}
