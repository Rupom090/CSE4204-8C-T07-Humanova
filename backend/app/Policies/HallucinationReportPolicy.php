<?php

namespace App\Policies;

use App\Models\HallucinationReport;
use App\Models\User;

class HallucinationReportPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, HallucinationReport $report): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        // Must belong to the same organization
        return $report->organization_id === $user->current_organization_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can submit a report
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, HallucinationReport $report): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        // Only the reporter can update their report before it is reviewed
        return $report->reporter_id === $user->id && $report->moderation_status === 'pending';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, HallucinationReport $report): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        // Only the reporter can delete their report, and only if pending
        return $report->reporter_id === $user->id && $report->moderation_status === 'pending';
    }

    /**
     * Determine whether the user can approve/reject reports (Moderator action).
     */
    public function approve(User $user, HallucinationReport $report): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        if ($report->organization_id !== $user->current_organization_id) {
            return false;
        }

        $membership = $user->organizationMemberships()
            ->with('role.permissions')
            ->where('organization_id', $report->organization_id)
            ->where('status', 'active')
            ->first();

        if (!$membership || !$membership->role) {
            return false;
        }

        return $membership->role->slug === 'org_admin' ||
               $membership->role->slug === 'moderator' ||
               $membership->role->permissions->contains('slug', 'approve-reports');
    }

    /**
     * Reject has same rules as approve.
     */
    public function reject(User $user, HallucinationReport $report): bool
    {
        return $this->approve($user, $report);
    }
}
