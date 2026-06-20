<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Organization;

class OrganizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_organization()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/organizations', [
            'name' => 'New Org',
            'slug' => 'new-org',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('organizations', ['name' => 'New Org']);
    }

    public function test_user_can_view_their_organizations()
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['owner_user_id' => $user->id]);
        
        $user->organizations()->attach($org->id, ['role_id' => 1, 'status' => 'active']);

        $response = $this->actingAs($user)->getJson('/api/v1/organizations');

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => $org->name]);
    }
}
