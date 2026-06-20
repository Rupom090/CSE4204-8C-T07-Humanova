<?php

namespace App\Policies;

use App\Models\User;

class AnalyticsPolicy
{
    /**
     * Determine whether the user can view analytics.
     */
    public function view(User $user): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        $membership = $user->organizationMemberships()
            ->with('role.permissions')
            ->where('organization_id', $user->current_organization_id)
            ->where('status', 'active')
            ->first();

        if (!$membership || !$membership->role) {
            return false;
        }

        return $membership->role->slug === 'org_admin' ||
               $membership->role->slug === 'researcher' ||
               $membership->role->permissions->contains('slug', 'view-analytics');
    }
}
