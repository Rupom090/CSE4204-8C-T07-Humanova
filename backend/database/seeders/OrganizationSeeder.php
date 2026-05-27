<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        $ownerId = DB::table('users')->where('email', 'admin@humanova.app')->value('id');
        
        if ($ownerId) {
            DB::table('organizations')->insertOrIgnore([
                'name' => 'Default Organization',
                'slug' => 'default-organization',
                'owner_user_id' => $ownerId,
                'subscription_plan' => 'free',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            $orgId = DB::table('organizations')->where('slug', 'default-organization')->value('id');
            
            // Assign admin to the organization
            DB::table('users')->where('id', $ownerId)->update([
                'organization_id' => $orgId
            ]);
        }
    }
}
