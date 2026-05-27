<?php

namespace App\Models;

use App\Enums\ModerationStatus;
use App\Enums\Severity;
use App\Traits\Auditable;
use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class HallucinationReport extends Model
{
    use HasFactory, SoftDeletes, Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'user_id',
        'scan_id',
        'claim_id',
        'report_reason',
        'description',
        'severity',
        'moderation_status',
    ];

    protected $casts = [
        'severity' => Severity::class,
        'moderation_status' => ModerationStatus::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scan(): BelongsTo
    {
        return $this->belongsTo(Scan::class, 'scan_id');
    }

    public function claim(): BelongsTo
    {
        return $this->belongsTo(ExtractedClaim::class, 'claim_id');
    }

    public function votes(): HasMany
    {
        return $this->hasMany(ReportVote::class, 'report_id');
    }

    public function evidence(): HasMany
    {
        return $this->hasMany(ReportEvidence::class, 'report_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(VerifierReview::class, 'report_id');
    }
}
