<?php

namespace App\Models;

use App\Enums\ResponseMode;
use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class AiGeneration extends Model
{
    use HasFactory, BelongsToOrganization, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'user_id',
        'provider_id',
        'model_id',
        'prompt_id',
        'response_text',
        'response_mode',
        'response_tokens',
        'prompt_tokens',
        'latency_ms',
        'status',
    ];

    protected $casts = [
        'response_mode' => ResponseMode::class,
        'response_tokens' => 'integer',
        'prompt_tokens' => 'integer',
        'latency_ms' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(AiProvider::class, 'provider_id');
    }

    public function aiModel(): BelongsTo
    {
        return $this->belongsTo(ProviderModel::class, 'model_id');
    }

    public function prompt(): BelongsTo
    {
        return $this->belongsTo(Prompt::class, 'prompt_id');
    }

    public function scan(): HasOne
    {
        return $this->hasOne(Scan::class, 'generation_id');
    }
}
