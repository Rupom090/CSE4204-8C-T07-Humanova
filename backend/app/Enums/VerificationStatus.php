<?php

namespace App\Enums;

enum VerificationStatus: string
{
    case Verified = 'verified';
    case Uncertain = 'uncertain';
    case Hallucinated = 'hallucinated';
    case Unverifiable = 'unverifiable';

    public function label(): string
    {
        return match ($this) {
            self::Verified => 'Verified',
            self::Uncertain => 'Uncertain',
            self::Hallucinated => 'Hallucinated',
            self::Unverifiable => 'Unverifiable',
        };
    }

    /**
     * Whether this status indicates a problem.
     */
    public function isThreat(): bool
    {
        return in_array($this, [self::Hallucinated]);
    }

    /**
     * Whether this status indicates an inconclusive result.
     */
    public function isInconclusive(): bool
    {
        return in_array($this, [self::Uncertain, self::Unverifiable]);
    }
}
