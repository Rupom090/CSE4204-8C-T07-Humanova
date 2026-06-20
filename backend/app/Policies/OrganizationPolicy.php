<?php

namespace App\Policies;

use App\Models\Organization;
use App\Models\User;

class OrganizationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Users can view the list of their own organizations (filtered in controller)
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Organization $organization): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        return $user->organizationMemberships()
            ->where('organization_id', $organization->id)
            ->where('status', 'active')
            ->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can create an organization
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Organization $organization): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        // Owner can always update
        if ($organization->owner_id === $user->id) {
            return true;
        }

        // Organization admins can update
        return $this->isOrgAdmin($user, $organization);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Organization $organization): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        // Only the owner can delete the organization
        return $organization->owner_id === $user->id;
    }

    /**
     * Determine whether the user can invite members.
     */
    public function invite(User $user, Organization $organization): bool
    {
        if ($user->role?->slug === 'super_admin' || $organization->owner_id === $user->id) {
            return true;
        }

        // Org admins can invite, or users with 'invite-members' permission
        if ($this->isOrgAdmin($user, $organization)) {
            return true;
        }

        return $this->hasPermissionInOrg($user, $organization, 'invite-members');
    }

    /**
     * Determine whether the user can manage members.
     */
    public function manageMembers(User $user, Organization $organization): bool
    {
        if ($user->role?->slug === 'super_admin' || $organization->owner_id === $user->id) {
            return true;
        }

        return $this->isOrgAdmin($user, $organization);
    }

    /**
     * Helper to check if user is org admin
     */
    private function isOrgAdmin(User $user, Organization $organization): bool
    {
        $membership = $user->organizationMemberships()
            ->with('role')
            ->where('organization_id', $organization->id)
            ->where('status', 'active')
            ->first();

        return $membership && $membership->role?->slug === 'org_admin';
    }

    /**
     * Helper to check if user has a specific permission via their role in the org
     */
    private function hasPermissionInOrg(User $user, Organization $organization, string $permissionSlug): bool
    {
        $membership = $user->organizationMemberships()
            ->with('role.permissions')
            ->where('organization_id', $organization->id)
            ->where('status', 'active')
            ->first();

        if (!$membership || !$membership->role) {
            return false;
        }

        return $membership->role->permissions->contains('slug', $permissionSlug);
    }
}
