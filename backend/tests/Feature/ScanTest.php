<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Organization;
use App\Models\Scan;

class ScanTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_scan()
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['owner_user_id' => $user->id]);
        $user->update(['current_organization_id' => $org->id]);

        $response = $this->actingAs($user)->postJson('/api/v1/scans', [
            'content_to_scan' => 'This is a test document to scan for hallucinations.',
            'title' => 'Test Scan'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('scans', ['title' => 'Test Scan']);
    }

    public function test_user_can_view_scan()
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['owner_user_id' => $user->id]);
        $user->update(['current_organization_id' => $org->id]);

        $scan = Scan::factory()->create(['organization_id' => $org->id, 'user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/v1/scans/' . $scan->id);

        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $scan->id]);
    }
}
