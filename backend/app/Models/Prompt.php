<?php

namespace App\Models;

use App\Enums\PromptMode;
use App\Traits\Auditable;
use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prompt extends Model
{
    use HasFactory, SoftDeletes, Auditable, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'user_id',
        'original_prompt',
        'optimization_mode',
        'token_estimate',
    ];

    protected $casts = [
        'optimization_mode' => PromptMode::class,
        'token_estimate' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function enhanced(): HasOne
    {
        return $this->hasOne(EnhancedPrompt::class, 'prompt_id');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(PromptVersion::class, 'prompt_id');
    }

    public function generations(): HasMany
    {
        return $this->hasMany(AiGeneration::class, 'prompt_id');
    }
}
