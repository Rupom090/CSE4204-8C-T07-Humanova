<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProviderRetryQueue extends Model
{
    protected $table = 'provider_retry_queue';

    protected $fillable = [
        'provider_id',
        'organization_id',
        'failure_type',
        'failure_count',
        'max_failures',
        'last_failure_at',
        'next_retry_at',
        'is_blocked',
        'blocked_at',
        'cooldown_until',
    ];

    protected $casts = [
        'is_blocked'      => 'boolean',
        'last_failure_at' => 'datetime',
        'next_retry_at'   => 'datetime',
        'blocked_at'      => 'datetime',
        'cooldown_until'  => 'datetime',
    ];

    public function provider(): BelongsTo
    {
        return $this->belongsTo(AiProvider::class, 'provider_id');
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Record a new failure. Opens circuit if threshold exceeded.
     */
    public function recordFailure(string $type): void
    {
        $this->increment('failure_count');
        $this->update(['failure_type' => $type, 'last_failure_at' => now()]);

        if ($this->failure_count >= $this->max_failures) {
            $this->update([
                'is_blocked'     => true,
                'blocked_at'     => now(),
                'cooldown_until' => now()->addMinutes(10),
            ]);
        }
    }

    /**
     * Reset state after successful provider response.
     */
    public function recordSuccess(): void
    {
        $this->update([
            'failure_count'  => 0,
            'is_blocked'     => false,
            'blocked_at'     => null,
            'cooldown_until' => null,
            'next_retry_at'  => null,
        ]);
    }

    public function isCircuitOpen(): bool
    {
        if (!$this->is_blocked) {
            return false;
        }

        // Auto-reset after cooldown passes
        if ($this->cooldown_until && $this->cooldown_until->isPast()) {
            $this->update(['is_blocked' => false, 'failure_count' => 0]);
            return false;
        }

        return true;
    }
}
