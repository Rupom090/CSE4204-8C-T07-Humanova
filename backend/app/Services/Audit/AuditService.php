<?php

namespace App\Services\Audit;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Request;

class AuditService
{
    /**
     * Create an audit log entry.
     */
    public function log(string $eventType, string $action, string $targetType, ?int $targetId = null, array $metadata = [], ?int $organizationId = null, ?int $userId = null): void
    {
        AuditLog::create([
            'organization_id' => $organizationId ?? request()->user()?->organization_id,
            'user_id' => $userId ?? request()->user()?->id,
            'event_type' => $eventType,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'metadata' => $metadata,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }
}
