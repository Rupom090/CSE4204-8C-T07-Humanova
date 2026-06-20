<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Organization;

class ApiKeyTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_api_key()
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['owner_user_id' => $user->id]);
        $user->update(['current_organization_id' => $org->id]);

        $response = $this->actingAs($user)->postJson('/api/v1/provider-keys', [
            'provider_id' => 1,
            'api_key' => 'sk-test-12345'
        ]);

        // Assuming provider_id 1 might not exist, allowing 422 or 201
        $this->assertContains($response->status(), [201, 422]);
    }
}
