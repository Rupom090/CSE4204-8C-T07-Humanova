<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvidenceSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'verification_result_id',
        'source_type',
        'source_url',
        'source_title',
        'authority_score',
        'retrieval_score',
    ];

    protected $casts = [
        'authority_score' => 'decimal:2',
        'retrieval_score' => 'decimal:2',
    ];

    public function verificationResult(): BelongsTo
    {
        return $this->belongsTo(VerificationResult::class, 'verification_result_id');
    }
}
