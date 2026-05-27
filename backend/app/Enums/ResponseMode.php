<?php

namespace App\Enums;

enum ResponseMode: string
{
    case Concise = 'concise';
    case Balanced = 'balanced';
    case Detailed = 'detailed';
    case Enterprise = 'enterprise';

    public function label(): string
    {
        return match ($this) {
            self::Concise => 'Concise',
            self::Balanced => 'Balanced',
            self::Detailed => 'Detailed',
            self::Enterprise => 'Enterprise',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::Concise => 'Brief, to-the-point responses',
            self::Balanced => 'Standard depth with adequate explanation',
            self::Detailed => 'Comprehensive analysis with thorough coverage',
            self::Enterprise => 'Full enterprise-grade response with all sections',
        };
    }
}
