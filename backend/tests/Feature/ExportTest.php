<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Organization;

class ExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_request_export()
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['owner_user_id' => $user->id]);
        $user->update(['current_organization_id' => $org->id]);

        $response = $this->actingAs($user)->postJson('/api/v1/exports/pdf', [
            'export_type' => 'org_report',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('pdf_exports', ['export_type' => 'org_report']);
    }
}
