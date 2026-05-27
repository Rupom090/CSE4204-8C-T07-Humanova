<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProviderModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_id',
        'name',
        'slug',
        'input_rate',
        'output_rate',
        'max_tokens',
        'status',
    ];

    protected $casts = [
        'input_rate' => 'decimal:6',
        'output_rate' => 'decimal:6',
        'max_tokens' => 'integer',
    ];

    public function provider(): BelongsTo
    {
        return $this->belongsTo(AiProvider::class, 'provider_id');
    }

    public function usageLogs(): HasMany
    {
        return $this->hasMany(ProviderUsageLog::class, 'model_id');
    }
}
