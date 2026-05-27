<?php

namespace App\Repositories;

use App\Models\HallucinationReport;
use Illuminate\Pagination\LengthAwarePaginator;

class ReportRepository
{
    /**
     * Get paginated reports for an organization.
     */
    public function getForOrganization(int $organizationId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = HallucinationReport::where('organization_id', $organizationId)
            ->with(['user', 'scan', 'claim']);

        // Apply filters
        if (!empty($filters['status'])) {
            $query->where('moderation_status', $filters['status']);
        }

        if (!empty($filters['severity'])) {
            $query->where('severity', $filters['severity']);
        }

        return $query->latest()->paginate($perPage);
    }
}
