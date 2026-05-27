<?php

namespace App\Enums;

enum ExportType: string
{
    case ScanReport = 'scan_report';
    case AnalyticsSummary = 'analytics_summary';
    case ModerationReport = 'moderation_report';
    case OrgReport = 'org_report';

    public function label(): string
    {
        return match ($this) {
            self::ScanReport => 'Scan Report',
            self::AnalyticsSummary => 'Analytics Summary',
            self::ModerationReport => 'Moderation Report',
            self::OrgReport => 'Organization Report',
        };
    }
}
