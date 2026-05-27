<?php

namespace App\Enums;

enum HallucinationType: string
{
    case UnsupportedClaim = 'unsupported_claim';
    case FabricatedEntity = 'fabricated_entity';
    case FakeCitation = 'fake_citation';
    case BrokenReference = 'broken_reference';
    case Contradiction = 'contradiction';
    case FabricatedStatistic = 'fabricated_statistic';
    case OutdatedInfo = 'outdated_info';
    case UncertaintyOverconfidence = 'uncertainty_overconfidence';

    public function label(): string
    {
        return match ($this) {
            self::UnsupportedClaim => 'Unsupported Claim',
            self::FabricatedEntity => 'Fabricated Entity',
            self::FakeCitation => 'Fake Citation',
            self::BrokenReference => 'Broken Reference',
            self::Contradiction => 'Contradiction',
            self::FabricatedStatistic => 'Fabricated Statistic',
            self::OutdatedInfo => 'Outdated Information',
            self::UncertaintyOverconfidence => 'Uncertainty Overconfidence',
        };
    }

    public function defaultSeverity(): Severity
    {
        return match ($this) {
            self::FakeCitation, self::FabricatedEntity, self::FabricatedStatistic => Severity::High,
            self::Contradiction, self::BrokenReference => Severity::Medium,
            self::UnsupportedClaim, self::OutdatedInfo => Severity::Low,
            self::UncertaintyOverconfidence => Severity::Low,
        };
    }
}
