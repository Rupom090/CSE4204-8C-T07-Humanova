<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'provider_type',
        'status',
        'api_base_url',
        'default_model',
    ];

    public function models(): HasMany
    {
        return $this->hasMany(ProviderModel::class, 'provider_id');
    }

    public function apiKeys(): HasMany
    {
        return $this->hasMany(UserApiKey::class, 'provider_id');
    }
}
