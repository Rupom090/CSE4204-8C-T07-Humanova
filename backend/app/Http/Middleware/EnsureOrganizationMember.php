<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganizationMember
{
    /**
     * Validates that the authenticated user is an active member
     * of the organization being accessed via route parameter {organization}.
     *
     * Usage: ->middleware('org.member')
     *
     * Prevents IDOR on organization-specific routes.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $organization = $request->route('organization');

        if (!$organization) {
            return $next($request);
        }

        // Resolve org ID whether it's a model or integer
        $orgId = is_object($organization) ? $organization->id : $organization;

        // Super admins can access any org
        if (!$user->relationLoaded('role')) {
            $user->load('role');
        }

        if ($user->role?->slug === 'super_admin') {
            return $next($request);
        }

        $isMember = $user->organizationMemberships()
            ->where('organization_id', $orgId)
            ->where('status', 'active')
            ->exists();

        if (!$isMember) {
            return response()->json([
                'success' => false,
                'message' => 'You are not a member of this organization.',
            ], 403);
        }

        return $next($request);
    }
}
