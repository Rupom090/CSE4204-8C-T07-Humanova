<?php

namespace App\Models;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProviderUsageLog extends Model
{
    use HasFactory, BelongsToOrganization;

    protected $fillable = [
        'provider_id',
        'model_id',
        'user_id',
        'organization_id',
        'request_tokens',
        'response_tokens',
        'estimated_cost',
        'latency_ms',
    ];

    protected $casts = [
        'request_tokens' => 'integer',
        'response_tokens' => 'integer',
        'estimated_cost' => 'decimal:6',
        'latency_ms' => 'integer',
    ];

    public function provider(): BelongsTo
    {
        return $this->belongsTo(AiProvider::class, 'provider_id');
    }

    public function model(): BelongsTo
    {
        return $this->belongsTo(ProviderModel::class, 'model_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
