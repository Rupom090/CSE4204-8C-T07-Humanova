<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name'        => 'Super Administrator',
                'slug'        => 'super_admin',
                'description' => 'System-wide administrator. Has access to all organizations and settings.',
                'level'       => 100,
                'is_system'   => true,
            ],
            [
                'name'        => 'Organization Administrator',
                'slug'        => 'org_admin',
                'description' => 'Full administrative access within an organization.',
                'level'       => 80,
                'is_system'   => true,
            ],
            [
                'name'        => 'Moderator',
                'slug'        => 'moderator',
                'description' => 'Can review, approve, and reject hallucination reports.',
                'level'       => 50,
                'is_system'   => true,
            ],
            [
                'name'        => 'Trusted Verifier',
                'slug'        => 'trusted_verifier',
                'description' => 'High-reputation user whose reviews carry additional weight.',
                'level'       => 40,
                'is_system'   => true,
            ],
            [
                'name'        => 'Researcher',
                'slug'        => 'researcher',
                'description' => 'Has access to analytics and exports but limited mutation rights.',
                'level'       => 30,
                'is_system'   => true,
            ],
            [
                'name'        => 'Standard User',
                'slug'        => 'user',
                'description' => 'Standard user who can run scans and generate content.',
                'level'       => 10,
                'is_system'   => true,
            ],
        ];

        foreach ($roles as $role) {
            \App\Models\Role::firstOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
