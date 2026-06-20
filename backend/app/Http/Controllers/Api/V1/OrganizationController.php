<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Models\OrganizationInvitation;
use App\Models\Role;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Notifications\OrganizationInvitationNotification;
use Illuminate\Support\Facades\Notification;

class OrganizationController extends Controller
{
    use ApiResponse;

    /**
     * List organizations the user is a member of.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Organization::class);

        $organizations = $request->user()->organizations()
            ->withPivot('role_id', 'status')
            ->paginate(20);

        return $this->success($organizations, 'Organizations retrieved successfully');
    }

    /**
     * Store a newly created organization.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Organization::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        DB::beginTransaction();
        try {
            $slug = Str::slug($validated['name']) . '-' . Str::random(6);

            $organization = Organization::create([
                'name' => $validated['name'],
                'slug' => $slug,
                'logo' => $validated['logo'] ?? null,
                'owner_user_id' => $user->id,
                'subscription_plan' => 'free',
                'status' => 'active',
            ]);

            $adminRole = Role::where('slug', 'org_admin')->first();
            $defaultRole = Role::where('slug', 'user')->first();

            OrganizationMember::create([
                'organization_id' => $organization->id,
                'user_id' => $user->id,
                'role_id' => $adminRole ? $adminRole->id : $defaultRole?->id,
                'status' => 'active',
                'joined_at' => now(),
            ]);

            if (!$user->current_organization_id) {
                $user->current_organization_id = $organization->id;
                $user->save();
            }

            DB::commit();

            return $this->created($organization, 'Organization created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to create organization: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified organization.
     */
    public function show(Organization $organization): JsonResponse
    {
        $this->authorize('view', $organization);
        
        $organization->load('owner');
        return $this->success($organization, 'Organization retrieved successfully');
    }

    /**
     * Update the specified organization.
     */
    public function update(Request $request, Organization $organization): JsonResponse
    {
        $this->authorize('update', $organization);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'logo' => 'nullable|string|max:255',
        ]);

        $organization->update($validated);

        return $this->success($organization, 'Organization updated successfully');
    }

    /**
     * Remove the specified organization.
     */
    public function destroy(Organization $organization): JsonResponse
    {
        $this->authorize('delete', $organization);

        $organization->delete(); // Soft delete

        return $this->success(null, 'Organization deleted successfully');
    }

    /**
     * List members of the organization.
     */
    public function members(Organization $organization): JsonResponse
    {
        $this->authorize('view', $organization);

        $members = $organization->members()->with(['user', 'role'])->paginate(15);
        return $this->paginated($members, 'Members retrieved successfully');
    }

    /**
     * Invite a user to the organization.
     */
    public function invite(Request $request, Organization $organization): JsonResponse
    {
        $this->authorize('invite', $organization);

        $validated = $request->validate([
            'email' => 'required|email',
            'role_slug' => 'required|string|exists:roles,slug',
        ]);

        $role = Role::where('slug', $validated['role_slug'])->first();

        // Check if already a member
        $existingUser = \App\Models\User::where('email', $validated['email'])->first();
        if ($existingUser) {
            $isMember = OrganizationMember::where('organization_id', $organization->id)
                ->where('user_id', $existingUser->id)
                ->exists();
            if ($isMember) {
                return $this->error('User is already a member of this organization', 400);
            }
        }

        $token = Str::random(32);

        $invitation = OrganizationInvitation::create([
            'organization_id' => $organization->id,
            'email' => $validated['email'],
            'role_id' => $role->id,
            'token' => hash('sha256', $token),
            'invited_by' => $request->user()->id,
            'expires_at' => now()->addDays(7),
        ]);

        Notification::route('mail', $validated['email'])
            ->notify(new OrganizationInvitationNotification($invitation, $token, $organization));

        return $this->created(null, 'Invitation sent successfully');
    }

    /**
     * Remove a member from the organization.
     */
    public function removeMember(Organization $organization, $userId): JsonResponse
    {
        $this->authorize('manageMembers', $organization);

        $member = OrganizationMember::where('organization_id', $organization->id)
            ->where('user_id', $userId)
            ->firstOrFail();

        if ($organization->owner_id == $userId) { // note: check DB Architecture for owner_id or owner_user_id
            return $this->error('Cannot remove the owner of the organization', 400);
        }

        $member->delete();

        return $this->success(null, 'Member removed successfully');
    }
}
