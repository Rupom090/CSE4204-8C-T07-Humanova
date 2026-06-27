<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'Manage Organization', 'slug' => 'manage-organization', 'module' => 'organization', 'description' => 'Can edit organization details'],
            ['name' => 'Invite Members', 'slug' => 'invite-members', 'module' => 'organization', 'description' => 'Can invite new users to org'],
            ['name' => 'Approve Reports', 'slug' => 'approve-reports', 'module' => 'moderation', 'description' => 'Can approve hallucination reports'],
            ['name' => 'Reject Reports', 'slug' => 'reject-reports', 'module' => 'moderation', 'description' => 'Can reject hallucination reports'],
            ['name' => 'View Audit Logs', 'slug' => 'view-audit-logs', 'module' => 'audit', 'description' => 'Can view immutable audit logs'],
            ['name' => 'Manage API Keys', 'slug' => 'manage-api-keys', 'module' => 'settings', 'description' => 'Can create and delete API keys'],
            ['name' => 'View Analytics', 'slug' => 'view-analytics', 'module' => 'analytics', 'description' => 'Can view dashboard and analytics'],
            ['name' => 'Assign Roles', 'slug' => 'assign-roles', 'module' => 'organization', 'description' => 'Can change member roles'],
        ];

        foreach ($permissions as $permission) {
            \App\Models\Permission::firstOrCreate(['slug' => $permission['slug']], $permission);
        }
    }
}
