<?php

namespace App\Models;

use App\Enums\ApiKeyStatus;
use App\Traits\Auditable;
use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserApiKey extends Model
{
    use HasFactory, SoftDeletes, Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'user_id',
        'provider_id',
        'encrypted_key',
        'masked_key',
        'label',
        'usage_limit',
        'token_usage',
        'last_used_at',
        'status',
    ];

    protected $casts = [
        'last_used_at' => 'datetime',
        'status' => ApiKeyStatus::class,
        'usage_limit' => 'integer',
        'token_usage' => 'integer',
        'encrypted_key' => 'encrypted',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(AiProvider::class, 'provider_id');
    }
}
