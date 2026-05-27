<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromptVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'prompt_id',
        'version_number',
        'content',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'json',
        'version_number' => 'integer',
    ];

    public function prompt(): BelongsTo
    {
        return $this->belongsTo(Prompt::class, 'prompt_id');
    }
}
