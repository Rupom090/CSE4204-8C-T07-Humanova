<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScoringExplanation extends Model
{
    use HasFactory;

    protected $fillable = [
        'confidence_score_id',
        'explanation_type',
        'explanation_text',
        'impact_score',
    ];

    protected $casts = [
        'impact_score' => 'decimal:2',
    ];

    public function confidenceScore(): BelongsTo
    {
        return $this->belongsTo(ConfidenceScore::class, 'confidence_score_id');
    }
}
