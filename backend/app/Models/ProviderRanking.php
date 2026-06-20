<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToOrganization;

class ProviderRanking extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'provider_id',
        'rank_score',
        'verification_accuracy',
        'citation_accuracy',
        'response_consistency',
        'token_efficiency',
        'total_requests',
        'successful_requests',
        'avg_latency_ms',
        'total_tokens_used',
        'period_type',
        'period_start',
        'period_end',
    ];

    protected $casts = [
        'rank_score'              => 'float',
        'verification_accuracy'   => 'float',
        'citation_accuracy'       => 'float',
        'response_consistency'    => 'float',
        'token_efficiency'        => 'float',
        'avg_latency_ms'          => 'float',
        'period_start'            => 'datetime',
        'period_end'              => 'datetime',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(AiProvider::class, 'provider_id');
    }
}
