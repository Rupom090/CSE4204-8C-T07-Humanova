<?php

namespace App\Enums;

enum PromptMode: string
{
    case Professional = 'professional';
    case Concise = 'concise';
    case Research = 'research';
    case Structured = 'structured';
    case LowHallucination = 'low_hallucination';

    public function label(): string
    {
        return match ($this) {
            self::Professional => 'Professional',
            self::Concise => 'Concise',
            self::Research => 'Research',
            self::Structured => 'Structured',
            self::LowHallucination => 'Low Hallucination',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::Professional => 'Polished, business-ready output with formal tone',
            self::Concise => 'Shortened prompts with reduced token usage',
            self::Research => 'Academic-style with citations and evidence-based framing',
            self::Structured => 'Output formatted with headings, lists, and logical sections',
            self::LowHallucination => 'Conservative prompting that minimizes fabrication risk',
        };
    }
}
