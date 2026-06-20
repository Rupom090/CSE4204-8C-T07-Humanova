<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScanProcessingQueue extends Model
{
    protected $table = 'scan_processing_queue';

    protected $fillable = [
        'scan_id',
        'job_type',
        'status',
        'attempts',
        'max_attempts',
        'error_message',
        'payload',
        'started_at',
        'completed_at',
        'next_retry_at',
    ];

    protected $casts = [
        'payload'       => 'array',
        'started_at'    => 'datetime',
        'completed_at'  => 'datetime',
        'next_retry_at' => 'datetime',
    ];

    public function scan(): BelongsTo
    {
        return $this->belongsTo(Scan::class);
    }

    public function markProcessing(): void
    {
        $this->update(['status' => 'processing', 'started_at' => now(), 'attempts' => $this->attempts + 1]);
    }

    public function markCompleted(): void
    {
        $this->update(['status' => 'completed', 'completed_at' => now()]);
    }

    public function markFailed(string $error): void
    {
        $this->update([
            'status'        => 'failed',
            'error_message' => $error,
            'completed_at'  => now(),
        ]);
    }

    public function markRetrying(int $delaySeconds = 60): void
    {
        $this->update([
            'status'        => 'retrying',
            'next_retry_at' => now()->addSeconds($delaySeconds),
        ]);
    }
}
