<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * Usage: ->middleware('role:moderator') or ->middleware('role:org_admin,moderator')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Load role relationship if not already loaded
        if (!$user->relationLoaded('role')) {
            $user->load('role');
        }

        $userRoleSlug = $user->role?->slug;

        // Super admin always passes
        if ($userRoleSlug === 'super_admin') {
            return $next($request);
        }

        if (!in_array($userRoleSlug, $roles, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient role. Required: ' . implode(' or ', $roles) . '.',
            ], 403);
        }

        return $next($request);
    }
}
