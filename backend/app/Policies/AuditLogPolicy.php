<?php

namespace App\Policies;

use App\Models\AuditLog;
use App\Models\User;

class AuditLogPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        // Must be an organization admin or have specific permission
        $membership = $user->organizationMemberships()
            ->with('role.permissions')
            ->where('organization_id', $user->current_organization_id)
            ->where('status', 'active')
            ->first();

        if (!$membership || !$membership->role) {
            return false;
        }

        return $membership->role->slug === 'org_admin' ||
               $membership->role->permissions->contains('slug', 'view-audit-logs');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, AuditLog $auditLog): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        if ($auditLog->organization_id !== $user->current_organization_id) {
            return false;
        }

        return $this->viewAny($user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false; // Created internally by the system
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, AuditLog $auditLog): bool
    {
        return false; // Audit logs are immutable
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AuditLog $auditLog): bool
    {
        return false; // Audit logs are append-only
    }
}
