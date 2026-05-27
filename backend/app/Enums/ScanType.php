<?php

namespace App\Enums;

enum ScanType: string
{
    case Internal = 'internal';
    case External = 'external';

    public function label(): string
    {
        return match ($this) {
            self::Internal => 'Internal (AI-generated)',
            self::External => 'External (Pasted response)',
        };
    }
}
