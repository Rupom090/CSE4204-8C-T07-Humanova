<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = Permission::all()->keyBy('slug');
        $roles = Role::all()->keyBy('slug');

        if ($roles->isEmpty() || $permissions->isEmpty()) {
            return;
        }

        $rolePermissions = [];

        // Super Admin gets all permissions
        foreach ($permissions as $permission) {
            $rolePermissions[] = [
                'role_id' => $roles['super_admin']->id,
                'permission_id' => $permission->id,
            ];
        }

        // Org Admin gets specific permissions
        $orgAdminSlugs = [
            'manage-organization', 'invite-members', 'approve-reports', 'reject-reports',
            'view-audit-logs', 'manage-api-keys', 'view-analytics', 'assign-roles'
        ];
        foreach ($orgAdminSlugs as $slug) {
            if (isset($permissions[$slug])) {
                $rolePermissions[] = [
                    'role_id' => $roles['org_admin']->id,
                    'permission_id' => $permissions[$slug]->id,
                ];
            }
        }

        // Moderator
        $moderatorSlugs = ['approve-reports', 'reject-reports'];
        foreach ($moderatorSlugs as $slug) {
            if (isset($permissions[$slug])) {
                $rolePermissions[] = [
                    'role_id' => $roles['moderator']->id,
                    'permission_id' => $permissions[$slug]->id,
                ];
            }
        }

        // Researcher
        $researcherSlugs = ['view-analytics'];
        foreach ($researcherSlugs as $slug) {
            if (isset($permissions[$slug])) {
                $rolePermissions[] = [
                    'role_id' => $roles['researcher']->id,
                    'permission_id' => $permissions[$slug]->id,
                ];
            }
        }

        DB::table('role_permissions')->insertOrIgnore($rolePermissions);
    }
}
