<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\OrganizationMember;
use App\Models\Role;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    use ApiResponse;

    /**
     * List all system roles.
     * GET /api/v1/roles
     */
    public function index(): JsonResponse
    {
        $roles = Role::orderBy('level')->get();
        return $this->success($roles, 'Roles retrieved.');
    }

    /**
     * Get role with permissions.
     * GET /api/v1/roles/{role}
     */
    public function show(Role $role): JsonResponse
    {
        $role->load('permissions');
        return $this->success($role, 'Role details retrieved.');
    }

    /**
     * Assign a role to a user in the current organization.
     * POST /api/v1/users/{user}/assign-role
     * Requires: org_admin or assign-roles permission
     */
    public function assignToUser(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $orgId = $request->user()->current_organization_id;

        $membership = OrganizationMember::where('organization_id', $orgId)
            ->where('user_id', $user->id)
            ->first();

        if (!$membership) {
            return $this->error('User is not a member of your current organization.', 422);
        }

        $newRole = Role::findOrFail($request->role_id);

        // Prevent assigning super_admin via API
        if ($newRole->slug === 'super_admin' && $request->user()->role?->slug !== 'super_admin') {
            return $this->error('Cannot assign super admin role.', 403);
        }

        $membership->update(['role_id' => $newRole->id]);

        // If the user's current org is this one, update their active role_id too
        if ($user->current_organization_id === $orgId) {
            $user->update(['role_id' => $newRole->id]);
        }

        return $this->success(null, 'Role assigned successfully.');
    }

    /**
     * Remove role from user in current organization.
     * DELETE /api/v1/users/{user}/remove-role
     * Requires: org_admin or assign-roles permission
     */
    public function removeFromUser(Request $request, User $user): JsonResponse
    {
        $orgId = $request->user()->current_organization_id;

        $membership = OrganizationMember::where('organization_id', $orgId)
            ->where('user_id', $user->id)
            ->first();

        if (!$membership) {
            return $this->error('User is not a member of your current organization.', 422);
        }

        $defaultRole = Role::where('slug', 'user')->first();
        
        $membership->update(['role_id' => $defaultRole?->id]);

        if ($user->current_organization_id === $orgId) {
            $user->update(['role_id' => $defaultRole?->id]);
        }

        return $this->success(null, 'Role removed successfully (reverted to default user).');
    }
}
