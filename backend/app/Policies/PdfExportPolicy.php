<?php

namespace App\Policies;

use App\Models\PdfExport;
use App\Models\User;

class PdfExportPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Users can view the list of exports for their current organization
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PdfExport $export): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        return $export->organization_id === $user->current_organization_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can generate a PDF export
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PdfExport $export): bool
    {
        return false; // Exports are immutable
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PdfExport $export): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        // Only the creator or an org admin can delete
        if ($export->organization_id !== $user->current_organization_id) {
            return false;
        }

        if ($export->requested_by === $user->id) {
            return true;
        }

        $membership = $user->organizationMemberships()
            ->with('role')
            ->where('organization_id', $export->organization_id)
            ->where('status', 'active')
            ->first();

        return $membership && $membership->role?->slug === 'org_admin';
    }

    /**
     * Determine whether the user can download the export.
     */
    public function download(User $user, PdfExport $export): bool
    {
        return $this->view($user, $export);
    }
}
