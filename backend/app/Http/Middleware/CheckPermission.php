<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * Usage: ->middleware('permission:approve-reports')
     * Multiple: ->middleware('permission:approve-reports,reject-reports')
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Load role with permissions if not already loaded
        if (!$user->relationLoaded('role')) {
            $user->load('role.permissions');
        } elseif (!$user->role?->relationLoaded('permissions')) {
            $user->role?->load('permissions');
        }

        // Super admin has all permissions
        if ($user->role?->slug === 'super_admin') {
            return $next($request);
        }

        $userPermissions = $user->role?->permissions->pluck('slug')->toArray() ?? [];

        // Check if user has ANY of the required permissions
        $hasPermission = !empty(array_intersect($permissions, $userPermissions));

        if (!$hasPermission) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have the required permission to perform this action.',
            ], 403);
        }

        return $next($request);
    }
}
