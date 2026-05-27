<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LinkCheck extends Model
{
    use HasFactory;

    protected $fillable = [
        'scan_id',
        'url',
        'http_status',
        'ssl_valid',
        'redirect_chain',
        'response_time_ms',
        'trust_score',
    ];

    protected $casts = [
        'ssl_valid' => 'boolean',
        'redirect_chain' => 'json',
        'response_time_ms' => 'integer',
        'trust_score' => 'decimal:2',
    ];

    public function scan(): BelongsTo
    {
        return $this->belongsTo(Scan::class, 'scan_id');
    }
}
