<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'View Organizations', 'slug' => 'view_organizations'],
            ['name' => 'Create Organizations', 'slug' => 'create_organizations'],
            ['name' => 'Edit Organizations', 'slug' => 'edit_organizations'],
            ['name' => 'Delete Organizations', 'slug' => 'delete_organizations'],
            
            ['name' => 'View Prompts', 'slug' => 'view_prompts'],
            ['name' => 'Create Prompts', 'slug' => 'create_prompts'],
            ['name' => 'Edit Prompts', 'slug' => 'edit_prompts'],
            ['name' => 'Delete Prompts', 'slug' => 'delete_prompts'],
            
            ['name' => 'Run Scans', 'slug' => 'run_scans'],
            ['name' => 'View Reports', 'slug' => 'view_reports'],
            ['name' => 'Verify Reports', 'slug' => 'verify_reports'],
        ];

        DB::table('permissions')->insertOrIgnore($permissions);
    }
}
