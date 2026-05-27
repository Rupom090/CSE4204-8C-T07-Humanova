<?php

namespace App\Models;

use App\Enums\ClaimType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ExtractedClaim extends Model
{
    use HasFactory;

    protected $fillable = [
        'scan_id',
        'claim_text',
        'claim_type',
        'confidence',
        'entity_count',
        'position_start',
        'position_end',
    ];

    protected $casts = [
        'claim_type' => ClaimType::class,
        'confidence' => 'decimal:2',
        'entity_count' => 'integer',
        'position_start' => 'integer',
        'position_end' => 'integer',
    ];

    public function scan(): BelongsTo
    {
        return $this->belongsTo(Scan::class, 'scan_id');
    }

    public function verificationResult(): HasOne
    {
        return $this->hasOne(VerificationResult::class, 'claim_id');
    }

    public function contradictions(): HasMany
    {
        return $this->hasMany(ContradictionResult::class, 'claim_id');
    }
}
