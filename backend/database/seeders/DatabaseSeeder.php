<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
            AiProviderSeeder::class,
        ]);

        // Create a default admin user
        $adminRoleId = DB::table('roles')->where('slug', 'system_admin')->value('id');
        
        if ($adminRoleId) {
            DB::table('users')->insertOrIgnore([
                'name' => 'Admin User',
                'email' => 'admin@humanova.app',
                'password' => Hash::make('password'),
                'role_id' => $adminRoleId,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
                'remember_token' => Str::random(10),
            ]);
        }

        $this->call([
            OrganizationSeeder::class,
        ]);
    }
}
