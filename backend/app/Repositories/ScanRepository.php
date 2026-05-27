<?php

namespace App\Repositories;

use App\Models\Scan;
use Illuminate\Pagination\LengthAwarePaginator;

class ScanRepository
{
    /**
     * Get paginated scans for an organization.
     */
    public function getForOrganization(int $organizationId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Scan::where('organization_id', $organizationId)
            ->with(['generation.provider', 'generation.model']);

        // Apply filters
        if (!empty($filters['status'])) {
            $query->where('scan_status', $filters['status']);
        }

        if (!empty($filters['type'])) {
            $query->where('scan_type', $filters['type']);
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * Get a single scan with full details.
     */
    public function getDetailedScan(int $scanId, int $organizationId): ?Scan
    {
        return Scan::where('id', $scanId)
            ->where('organization_id', $organizationId)
            ->with([
                'generation',
                'claims.verificationResults.evidence',
                'confidenceScore.explanations'
            ])
            ->first();
    }
}
