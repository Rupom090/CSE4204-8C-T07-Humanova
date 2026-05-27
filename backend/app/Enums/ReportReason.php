<?php

namespace App\Enums;

enum ReportReason: string
{
    case FakeCitation = 'fake_citation';
    case FabricatedStat = 'fabricated_stat';
    case Contradiction = 'contradiction';
    case Hallucination = 'hallucination';

    public function label(): string
    {
        return match ($this) {
            self::FakeCitation => 'Fake Citation',
            self::FabricatedStat => 'Fabricated Statistic',
            self::Contradiction => 'Contradiction',
            self::Hallucination => 'General Hallucination',
        };
    }
}
