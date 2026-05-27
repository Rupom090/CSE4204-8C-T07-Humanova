<?php

namespace App\Models;

use App\Enums\Severity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContradictionResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'claim_id',
        'contradicting_source',
        'contradiction_probability',
        'severity',
        'explanation',
    ];

    protected $casts = [
        'contradiction_probability' => 'decimal:2',
        'severity' => Severity::class,
    ];

    public function claim(): BelongsTo
    {
        return $this->belongsTo(ExtractedClaim::class, 'claim_id');
    }
}
