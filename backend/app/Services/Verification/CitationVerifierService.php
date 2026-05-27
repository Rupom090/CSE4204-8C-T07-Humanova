<?php

namespace App\Services\Verification;

use App\Models\CitationCheck;
use Illuminate\Support\Facades\Http;

class CitationVerifierService
{
    /**
     * Verify a citation using DOI / CrossRef API.
     */
    public function verifyCitation(int $scanId, string $citationText, ?string $doi = null): CitationCheck
    {
        $status = 'unverifiable';
        $metadataScore = 0;

        if ($doi) {
            try {
                $response = Http::timeout(10)->get("https://api.crossref.org/works/" . urlencode($doi));
                
                if ($response->successful()) {
                    $status = 'valid';
                    $metadataScore = 100;
                } elseif ($response->status() === 404) {
                    $status = 'invalid';
                    $metadataScore = 0;
                }
            } catch (\Exception $e) {
                // Network error, leave as unverifiable
            }
        } else {
            // For raw text without DOI, one might use CrossRef open URL search, but keeping simple for now
            $status = 'uncertain';
            $metadataScore = 30;
        }

        return CitationCheck::create([
            'scan_id' => $scanId,
            'citation_text' => $citationText,
            'doi' => $doi,
            'validity_status' => $status,
            'metadata_score' => $metadataScore,
        ]);
    }
}
