<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnhancedPrompt extends Model
{
    use HasFactory;

    protected $fillable = [
        'prompt_id',
        'enhanced_prompt',
        'enhancement_strategy',
        'token_reduction_percent',
    ];

    protected $casts = [
        'token_reduction_percent' => 'decimal:2',
    ];

    public function prompt(): BelongsTo
    {
        return $this->belongsTo(Prompt::class, 'prompt_id');
    }
}
