<?php

namespace App\Repositories;

use App\Models\AuditLog;
use Illuminate\Pagination\LengthAwarePaginator;

class AuditLogRepository
{
    /**
     * Get paginated audit logs for an organization.
     */
    public function getForOrganization(int $organizationId, array $filters = [], int $perPage = 25): LengthAwarePaginator
    {
        $query = AuditLog::where('organization_id', $organizationId)
            ->with(['user']);

        // Apply filters
        if (!empty($filters['event_type'])) {
            $query->where('event_type', $filters['event_type']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        return $query->latest()->paginate($perPage);
    }
}
