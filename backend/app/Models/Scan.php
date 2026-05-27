<?php

namespace App\Models;

use App\Enums\ScanStatus;
use App\Traits\Auditable;
use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Scan extends Model
{
    use HasFactory, SoftDeletes, Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'user_id',
        'generation_id',
        'scan_type',
        'overall_confidence',
        'hallucination_score',
        'scan_status',
        'completed_at',
    ];

    protected $casts = [
        'scan_status' => ScanStatus::class,
        'overall_confidence' => 'decimal:2',
        'hallucination_score' => 'decimal:2',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function generation(): BelongsTo
    {
        return $this->belongsTo(AiGeneration::class, 'generation_id');
    }

    public function claims(): HasMany
    {
        return $this->hasMany(ExtractedClaim::class, 'scan_id');
    }

    public function uncertaintyAnalyses(): HasMany
    {
        return $this->hasMany(UncertaintyAnalysis::class, 'scan_id');
    }

    public function confidenceScore(): HasOne
    {
        return $this->hasOne(ConfidenceScore::class, 'scan_id');
    }

    public function citationChecks(): HasMany
    {
        return $this->hasMany(CitationCheck::class, 'scan_id');
    }

    public function linkChecks(): HasMany
    {
        return $this->hasMany(LinkCheck::class, 'scan_id');
    }
}
