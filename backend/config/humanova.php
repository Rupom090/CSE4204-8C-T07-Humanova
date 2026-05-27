<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Platform Identity
    |--------------------------------------------------------------------------
    */

    'name' => env('APP_NAME', 'Humanova'),
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),

    /*
    |--------------------------------------------------------------------------
    | AI Providers
    |--------------------------------------------------------------------------
    | Base URLs and default models for each supported AI provider.
    */

    'providers' => [
        'openai' => [
            'base_url' => env('OPENAI_API_BASE', 'https://api.openai.com/v1'),
            'default_model' => 'gpt-4o',
            'timeout' => 60,
            'retry_attempts' => 3,
            'retry_delay' => 1000, // ms
        ],
        'gemini' => [
            'base_url' => env('GEMINI_API_BASE', 'https://generativelanguage.googleapis.com/v1beta'),
            'default_model' => 'gemini-2.0-flash',
            'timeout' => 60,
            'retry_attempts' => 3,
            'retry_delay' => 1000,
        ],
        'deepseek' => [
            'base_url' => env('DEEPSEEK_API_BASE', 'https://api.deepseek.com/v1'),
            'default_model' => 'deepseek-chat',
            'timeout' => 60,
            'retry_attempts' => 3,
            'retry_delay' => 1000,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Confidence Scoring Weights
    |--------------------------------------------------------------------------
    | Weights for the hallucination confidence scoring formula.
    | Positive weights (boosters) and negative weights (penalties).
    */

    'scoring' => [
        'weights' => [
            'semantic_similarity' => 0.30,
            'source_authority'    => 0.20,
            'citation_validity'   => 0.15,
            'community'           => 0.10,
        ],
        'penalties' => [
            'contradiction' => 0.15,
            'uncertainty'   => 0.05,
            'fabrication'   => 0.25,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Queue Names
    |--------------------------------------------------------------------------
    | Named queues for different job types. Allows priority-based processing.
    */

    'queues' => [
        'generation'    => 'generation',
        'scans'         => 'scans',
        'verification'  => 'verification',
        'exports'       => 'exports',
        'analytics'     => 'analytics',
        'notifications' => 'notifications',
        'moderation'    => 'moderation',
    ],

    /*
    |--------------------------------------------------------------------------
    | SSRF Protection
    |--------------------------------------------------------------------------
    | Blocked IP ranges and domains for link-checking safety.
    */

    'ssrf' => [
        'block_private_ips' => env('BLOCK_PRIVATE_IPS', true),
        'max_redirects' => env('MAX_REDIRECTS', 3),
        'blocked_ip_ranges' => [
            '10.0.0.0/8',
            '172.16.0.0/12',
            '192.168.0.0/16',
            '127.0.0.0/8',
            '169.254.0.0/16',  // Link-local
            '0.0.0.0/8',
            '::1/128',        // IPv6 loopback
            'fc00::/7',       // IPv6 private
            'fe80::/10',      // IPv6 link-local
        ],
        'request_timeout' => 10, // seconds
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    */

    'rate_limits' => [
        'enabled' => env('RATE_LIMIT_ENABLED', true),
        'api' => env('API_RATE_LIMIT', 60),         // per minute
        'auth' => env('AUTH_RATE_LIMIT', 5),         // per minute
        'generation' => 20,                           // per minute
        'scan' => 10,                                 // per minute
        'export' => 5,                                // per minute
    ],

    /*
    |--------------------------------------------------------------------------
    | AI Microservice (Python FastAPI)
    |--------------------------------------------------------------------------
    */

    'ai_service' => [
        'url' => env('AI_SERVICE_URL', 'http://localhost:8001'),
        'timeout' => env('AI_SERVICE_TIMEOUT', 30),
        'endpoints' => [
            'extract_claims' => '/api/extract-claims',
            'semantic_similarity' => '/api/semantic-similarity',
            'contradiction_detection' => '/api/detect-contradictions',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | PDF Export
    |--------------------------------------------------------------------------
    */

    'exports' => [
        'timeout' => env('PDF_EXPORT_TIMEOUT', 120),
        'max_file_size_mb' => env('PDF_MAX_FILE_SIZE', 20),
        'storage_disk' => 'local',
        'storage_path' => 'exports/pdf',
        'expiry_hours' => 72,
    ],

    /*
    |--------------------------------------------------------------------------
    | Analytics
    |--------------------------------------------------------------------------
    */

    'analytics' => [
        'cache_ttl' => env('ANALYTICS_CACHE_TTL', 3600),
        'refresh_interval' => env('ANALYTICS_REFRESH_INTERVAL', 900),
    ],

    /*
    |--------------------------------------------------------------------------
    | Feature Flags
    |--------------------------------------------------------------------------
    */

    'features' => [
        'community_reports' => env('ENABLE_COMMUNITY_REPORTS', true),
        'provider_comparison' => env('ENABLE_PROVIDER_COMPARISON', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Security
    |--------------------------------------------------------------------------
    */

    'security' => [
        'force_https' => env('FORCE_HTTPS', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring
    |--------------------------------------------------------------------------
    */

    'monitoring' => [
        'enabled' => env('MONITORING_ENABLED', false),
        'sentry_dsn' => env('SENTRY_DSN'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Tenant / Organization Defaults
    |--------------------------------------------------------------------------
    */

    'tenant' => [
        'default_plan' => 'free',
        'max_members_free' => 5,
        'max_members_growth' => 25,
        'max_members_enterprise' => 999,
    ],

];
