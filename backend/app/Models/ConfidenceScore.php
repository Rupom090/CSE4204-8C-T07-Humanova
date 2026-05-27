<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConfidenceScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'scan_id',
        'semantic_similarity_score',
        'source_authority_score',
        'citation_validity_score',
        'contradiction_penalty',
        'uncertainty_penalty',
        'fabrication_penalty',
        'community_weight',
        'final_score',
    ];

    protected $casts = [
        'semantic_similarity_score' => 'decimal:2',
        'source_authority_score' => 'decimal:2',
        'citation_validity_score' => 'decimal:2',
        'contradiction_penalty' => 'decimal:2',
        'uncertainty_penalty' => 'decimal:2',
        'fabrication_penalty' => 'decimal:2',
        'community_weight' => 'decimal:2',
        'final_score' => 'decimal:2',
    ];

    public function scan(): BelongsTo
    {
        return $this->belongsTo(Scan::class, 'scan_id');
    }

    public function explanations(): HasMany
    {
        return $this->hasMany(ScoringExplanation::class, 'confidence_score_id');
    }
}
