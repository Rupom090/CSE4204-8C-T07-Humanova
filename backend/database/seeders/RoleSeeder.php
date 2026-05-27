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
                'name' => 'System Administrator',
                'slug' => 'system_admin',
                'description' => 'Full access to the entire Humanova platform',
                'is_system' => true,
                'level' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Organization Owner',
                'slug' => 'org_owner',
                'description' => 'Full access to their specific organization',
                'is_system' => true,
                'level' => 80,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Verifier',
                'slug' => 'verifier',
                'description' => 'Can review and verify scans and hallucination reports',
                'is_system' => true,
                'level' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Member',
                'slug' => 'member',
                'description' => 'Standard organization member',
                'is_system' => true,
                'level' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('roles')->insertOrIgnore($roles);
    }
}
