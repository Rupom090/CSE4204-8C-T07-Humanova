<?php

namespace App\Enums;

enum ModerationStatus: string
{
    case Pending = 'pending';
    case UnderReview = 'under_review';
    case Verified = 'verified';
    case Rejected = 'rejected';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::UnderReview => 'Under Review',
            self::Verified => 'Verified',
            self::Rejected => 'Rejected',
            self::Archived => 'Archived',
        };
    }

    public function isOpen(): bool
    {
        return in_array($this, [self::Pending, self::UnderReview]);
    }

    public function isResolved(): bool
    {
        return in_array($this, [self::Verified, self::Rejected, self::Archived]);
    }
}
