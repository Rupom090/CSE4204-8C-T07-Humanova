<?php

namespace App\Services\Scoring;

use App\Models\Scan;
use App\Models\ConfidenceScore;
use App\Models\ScoringExplanation;

class ConfidenceScorerService
{
    /**
     * Calculate final confidence score for a scan.
     * Formula: (semantic_similarity×0.30 + source_authority×0.20 + citation_validity×0.15 + community×0.10) 
     *          - (contradiction×0.15 + uncertainty×0.05 + fabrication×0.25)
     */
    public function calculateScore(Scan $scan): void
    {
        // Mocking metric retrieval for the pipeline integration
        $metrics = $this->gatherMetrics($scan);

        $baseScore = ($metrics['semantic_similarity'] * 0.30) + 
                     ($metrics['source_authority'] * 0.20) + 
                     ($metrics['citation_validity'] * 0.15) + 
                     ($metrics['community'] * 0.10);

        $penalty = ($metrics['contradiction'] * 0.15) + 
                   ($metrics['uncertainty'] * 0.05) + 
                   ($metrics['fabrication'] * 0.25);

        $finalScore = max(0, min(100, ($baseScore * 100) - ($penalty * 100)));

        $confidenceScore = ConfidenceScore::create([
            'scan_id' => $scan->id,
            'semantic_similarity_score' => $metrics['semantic_similarity'] * 100,
            'source_authority_score' => $metrics['source_authority'] * 100,
            'citation_validity_score' => $metrics['citation_validity'] * 100,
            'contradiction_penalty' => $metrics['contradiction'] * 100,
            'uncertainty_penalty' => $metrics['uncertainty'] * 100,
            'community_weight' => $metrics['community'] * 100,
            'fabrication_penalty' => $metrics['fabrication'] * 100,
            'final_score' => $finalScore,
        ]);

        $this->generateExplanations($confidenceScore, $metrics);

        $scan->update([
            'overall_confidence' => $finalScore,
            'hallucination_score' => 100 - $finalScore,
        ]);
    }

    protected function gatherMetrics(Scan $scan): array
    {
        // In reality, this would aggregate scores from ExtractedClaim, VerificationResult, etc.
        return [
            'semantic_similarity' => 0.85,
            'source_authority' => 0.70,
            'citation_validity' => 0.60,
            'community' => 0.50,
            'contradiction' => 0.10,
            'uncertainty' => 0.05,
            'fabrication' => 0.00,
        ];
    }

    protected function generateExplanations(ConfidenceScore $score, array $metrics): void
    {
        if ($metrics['contradiction'] > 0.3) {
            ScoringExplanation::create([
                'confidence_score_id' => $score->id,
                'explanation_type' => 'penalty',
                'explanation_text' => 'High contradiction detected in retrieved evidence.',
                'impact_score' => -($metrics['contradiction'] * 15),
            ]);
        }

        if ($metrics['semantic_similarity'] > 0.8) {
            ScoringExplanation::create([
                'confidence_score_id' => $score->id,
                'explanation_type' => 'bonus',
                'explanation_text' => 'Strong semantic alignment with authoritative sources.',
                'impact_score' => ($metrics['semantic_similarity'] * 30),
            ]);
        }
    }
}
