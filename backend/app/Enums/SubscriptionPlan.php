<?php

namespace App\Enums;

enum SubscriptionPlan: string
{
    case Free = 'free';
    case Growth = 'growth';
    case Enterprise = 'enterprise';
    case Custom = 'custom';

    public function label(): string
    {
        return match ($this) {
            self::Free => 'Free',
            self::Growth => 'Growth',
            self::Enterprise => 'Enterprise',
            self::Custom => 'Custom',
        };
    }

    public function maxMembers(): int
    {
        return match ($this) {
            self::Free => 5,
            self::Growth => 25,
            self::Enterprise => 999,
            self::Custom => 9999,
        };
    }

    public function maxScansPerDay(): int
    {
        return match ($this) {
            self::Free => 10,
            self::Growth => 100,
            self::Enterprise => 1000,
            self::Custom => 99999,
        };
    }
}
