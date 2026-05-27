<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReputationScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_reports',
        'approved_reports',
        'accuracy_rate',
        'reputation_level',
    ];

    protected $casts = [
        'total_reports' => 'integer',
        'approved_reports' => 'integer',
        'accuracy_rate' => 'decimal:2',
        'reputation_level' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
