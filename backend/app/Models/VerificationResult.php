<?php

namespace App\Models;

use App\Enums\VerificationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VerificationResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'claim_id',
        'verification_status',
        'evidence_score',
        'contradiction_score',
        'explanation',
    ];

    protected $casts = [
        'verification_status' => VerificationStatus::class,
        'evidence_score' => 'decimal:2',
        'contradiction_score' => 'decimal:2',
    ];

    public function claim(): BelongsTo
    {
        return $this->belongsTo(ExtractedClaim::class, 'claim_id');
    }

    public function evidenceSources(): HasMany
    {
        return $this->hasMany(EvidenceSource::class, 'verification_result_id');
    }
}
