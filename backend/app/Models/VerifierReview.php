<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VerifierReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'verifier_user_id',
        'decision',
        'review_notes',
    ];

    public function report(): BelongsTo
    {
        return $this->belongsTo(HallucinationReport::class, 'report_id');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verifier_user_id');
    }
}
