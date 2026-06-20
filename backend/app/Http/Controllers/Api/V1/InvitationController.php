<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\OrganizationInvitation;
use App\Models\OrganizationMember;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvitationController extends Controller
{
    use ApiResponse;

    /**
     * Accept an organization invitation using a token.
     * POST /api/v1/invitations/accept
     */
    public function accept(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $tokenHash = hash('sha256', $request->token);
        
        $invitation = OrganizationInvitation::where('token', $tokenHash)
            ->where('email', $request->user()->email)
            ->first();

        if (!$invitation) {
            return $this->error('Invalid invitation token or email mismatch.', 404);
        }

        if ($invitation->expires_at->isPast()) {
            return $this->error('Invitation has expired.', 400);
        }

        DB::beginTransaction();
        try {
            // Check if already member
            $isMember = OrganizationMember::where('organization_id', $invitation->organization_id)
                ->where('user_id', $request->user()->id)
                ->exists();

            if (!$isMember) {
                OrganizationMember::create([
                    'organization_id' => $invitation->organization_id,
                    'user_id'         => $request->user()->id,
                    'role_id'         => $invitation->role_id,
                    'status'          => 'active',
                    'joined_at'       => now(),
                ]);
            }

            // Switch to this org context if it's the first org or if they have no active org
            $user = $request->user();
            if (!$user->current_organization_id) {
                $user->update(['current_organization_id' => $invitation->organization_id]);
            }

            // Delete invitation
            $invitation->delete();

            DB::commit();
            return $this->success(null, 'Invitation accepted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to accept invitation: ' . $e->getMessage(), 500);
        }
    }
}
