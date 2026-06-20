<?php

namespace App\Services\Security;

use App\Models\SecurityEvent;

class SecurityEventService
{
    /**
     * Log a security event
     */
    public function log(string $type, string $description, string $severity = 'info', ?int $userId = null, ?int $orgId = null): SecurityEvent
    {
        return SecurityEvent::create([
            'event_type' => $type,
            'description' => $description,
            'severity' => $severity,
            'user_id' => $userId ?? auth()->id(),
            'organization_id' => $orgId ?? auth()->user()?->current_organization_id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
