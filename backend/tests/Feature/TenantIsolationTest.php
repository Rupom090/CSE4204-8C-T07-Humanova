<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Organization;
use App\Models\Scan;

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_access_other_tenant_data()
    {
        $userA = User::factory()->create();
        $orgA = Organization::factory()->create(['owner_user_id' => $userA->id]);
        $userA->update(['current_organization_id' => $orgA->id]);

        $userB = User::factory()->create();
        $orgB = Organization::factory()->create(['owner_user_id' => $userB->id]);
        $userB->update(['current_organization_id' => $orgB->id]);

        $scanA = Scan::factory()->create(['organization_id' => $orgA->id, 'user_id' => $userA->id]);

        // User B attempts to access User A's scan
        $response = $this->actingAs($userB)->getJson('/api/v1/scans/' . $scanA->id);

        // Due to global scopes or policies, this should be 403 or 404
        $response->assertStatus(403);
    }
}
