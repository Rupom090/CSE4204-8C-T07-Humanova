<?php

namespace App\Policies;

use App\Models\Scan;
use App\Models\User;

class ScanPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Filtered to user's current org by BelongsToOrganization scope
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Scan $scan): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        // Must belong to the same organization
        return $scan->organization_id === $user->current_organization_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user in an active org can create scans
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Scan $scan): bool
    {
        // Scans are generally immutable after creation/processing
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Scan $scan): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        // Must belong to same org
        if ($scan->organization_id !== $user->current_organization_id) {
            return false;
        }

        // Only the creator or an org admin can delete
        if ($scan->user_id === $user->id) {
            return true;
        }

        $membership = $user->organizationMemberships()
            ->with('role')
            ->where('organization_id', $scan->organization_id)
            ->where('status', 'active')
            ->first();

        return $membership && $membership->role?->slug === 'org_admin';
    }
}
