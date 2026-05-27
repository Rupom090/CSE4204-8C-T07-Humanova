<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Models\OrganizationInvitation;
use App\Models\Role;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Notifications\OrganizationInvitationNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;

class OrganizationController extends Controller
{
    use ApiResponse;

    /**
     * Store a newly created organization.
     */
    public function store(Request $request)
    {
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
                'subscription_plan' => 'free', // App\Enums\SubscriptionPlan::FREE -> use string for now if enum matches
                'status' => 'active',
            ]);

            // Assign the creator as org_admin
            $adminRole = Role::where('slug', 'org_admin')->first();

            OrganizationMember::create([
                'organization_id' => $organization->id,
                'user_id' => $user->id,
                'role_id' => $adminRole ? $adminRole->id : null,
                'status' => 'active',
                'joined_at' => now(),
            ]);

            // If user has no organization_id set as active yet
            if (!$user->organization_id) {
                $user->organization_id = $organization->id;
                $user->save();
            }

            DB::commit();

            return $this->created($organization, 'Organization created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverError('Failed to create organization: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified organization.
     */
    public function show(Organization $organization)
    {
        // Authorization should ideally be handled via policies
        $organization->load('owner');
        return $this->success($organization, 'Organization retrieved successfully');
    }

    /**
     * Update the specified organization.
     */
    public function update(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'logo' => 'nullable|string|max:255',
        ]);

        $organization->update($validated);

        return $this->success($organization, 'Organization updated successfully');
    }

    /**
     * List members of the organization.
     */
    public function members(Organization $organization)
    {
        $members = $organization->members()->with(['user', 'role'])->paginate(15);
        return $this->paginated($members, 'Members retrieved successfully');
    }

    /**
     * Invite a user to the organization.
     */
    public function invite(Request $request, Organization $organization)
    {
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

        // Send email (Assuming Notification is created)
        Notification::route('mail', $validated['email'])
            ->notify(new OrganizationInvitationNotification($invitation, $token, $organization));

        return $this->created(null, 'Invitation sent successfully');
    }

    /**
     * Remove a member from the organization.
     */
    public function removeMember(Organization $organization, $userId)
    {
        $member = OrganizationMember::where('organization_id', $organization->id)
            ->where('user_id', $userId)
            ->firstOrFail();

        if ($organization->owner_user_id == $userId) {
            return $this->error('Cannot remove the owner of the organization', 400);
        }

        $member->delete();

        return $this->noContent('Member removed successfully');
    }

    /**
     * Switch the user's active organization.
     */
    public function switchOrganization(Request $request, Organization $organization)
    {
        $user = $request->user();

        $isMember = OrganizationMember::where('organization_id', $organization->id)
            ->where('user_id', $user->id)
            ->exists();

        if (!$isMember) {
            return $this->forbidden('You are not a member of this organization');
        }

        $user->organization_id = $organization->id;
        $user->save();

        return $this->success(['organization' => $organization], 'Switched organization successfully');
    }
}
