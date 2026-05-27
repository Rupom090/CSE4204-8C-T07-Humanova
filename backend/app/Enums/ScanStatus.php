<?php

namespace App\Enums;

enum ScanStatus: string
{
    case Queued = 'queued';
    case Processing = 'processing';
    case Verifying = 'verifying';
    case Scoring = 'scoring';
    case Completed = 'completed';
    case Failed = 'failed';
    case Retrying = 'retrying';

    public function label(): string
    {
        return match ($this) {
            self::Queued => 'Queued',
            self::Processing => 'Processing',
            self::Verifying => 'Verifying',
            self::Scoring => 'Scoring',
            self::Completed => 'Completed',
            self::Failed => 'Failed',
            self::Retrying => 'Retrying',
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Completed, self::Failed]);
    }

    public function isActive(): bool
    {
        return in_array($this, [self::Processing, self::Verifying, self::Scoring, self::Retrying]);
    }
}
