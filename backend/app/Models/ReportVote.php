<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportVote extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'user_id',
        'vote_type',
    ];

    public function report(): BelongsTo
    {
        return $this->belongsTo(HallucinationReport::class, 'report_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
