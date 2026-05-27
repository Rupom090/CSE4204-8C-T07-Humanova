<?php

namespace App\Enums;

enum ApiKeyStatus: string
{
    case Active = 'active';
    case Disabled = 'disabled';
    case Expired = 'expired';
    case Revoked = 'revoked';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Disabled => 'Disabled',
            self::Expired => 'Expired',
            self::Revoked => 'Revoked',
        };
    }

    public function isUsable(): bool
    {
        return $this === self::Active;
    }
}
