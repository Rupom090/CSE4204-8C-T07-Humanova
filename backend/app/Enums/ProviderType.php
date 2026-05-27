<?php

namespace App\Enums;

enum ProviderType: string
{
    case OpenAI = 'openai';
    case Gemini = 'gemini';
    case DeepSeek = 'deepseek';
    case Anthropic = 'anthropic';
    case Groq = 'groq';
    case OpenRouter = 'openrouter';

    public function label(): string
    {
        return match ($this) {
            self::OpenAI => 'OpenAI',
            self::Gemini => 'Google Gemini',
            self::DeepSeek => 'DeepSeek',
            self::Anthropic => 'Anthropic',
            self::Groq => 'Groq',
            self::OpenRouter => 'OpenRouter',
        };
    }

    public function baseUrl(): string
    {
        return match ($this) {
            self::OpenAI => 'https://api.openai.com/v1',
            self::Gemini => 'https://generativelanguage.googleapis.com/v1beta',
            self::DeepSeek => 'https://api.deepseek.com/v1',
            self::Anthropic => 'https://api.anthropic.com/v1',
            self::Groq => 'https://api.groq.com/openai/v1',
            self::OpenRouter => 'https://openrouter.ai/api/v1',
        };
    }
}
