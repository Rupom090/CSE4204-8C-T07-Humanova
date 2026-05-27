<?php

namespace App\Enums;

enum ClaimType: string
{
    case Factual = 'factual';
    case Statistic = 'statistic';
    case Citation = 'citation';
    case Entity = 'entity';
    case Url = 'url';

    public function label(): string
    {
        return match ($this) {
            self::Factual => 'Factual Claim',
            self::Statistic => 'Statistical Claim',
            self::Citation => 'Citation',
            self::Entity => 'Named Entity',
            self::Url => 'URL Reference',
        };
    }
}
