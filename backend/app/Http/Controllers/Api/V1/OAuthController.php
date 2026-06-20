<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    use ApiResponse;

    /**
     * Redirect the user to the provider authentication page.
     */
    public function redirect(string $provider): JsonResponse
    {
        if (!in_array($provider, ['google', 'github', 'microsoft'])) {
            return $this->error('Provider not supported', 400);
        }

        $url = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();

        return $this->success(['url' => $url], 'Redirect URL generated');
    }

    /**
     * Obtain the user information from the provider.
     */
    public function callback(Request $request, string $provider): JsonResponse
    {
        if (!in_array($provider, ['google', 'github', 'microsoft'])) {
            return $this->error('Provider not supported', 400);
        }

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return $this->error('Authentication failed', 401);
        }

        $user = User::where('email', $socialUser->getEmail())->first();

        if ($user) {
            // Link provider if not linked
            if (!$user->oauth_provider) {
                $user->update([
                    'oauth_provider' => $provider,
                    'oauth_provider_id' => $socialUser->getId(),
                    'avatar' => $user->avatar ?? $socialUser->getAvatar(),
                ]);
            }
        } else {
            // Create new user. In this system users usually need an organization.
            // We'll create the user and they might need to be added to an org later.
            // But per standard, they should have an org. Let's create a personal org for them.
            
            $user = User::create([
                'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
                'username' => $socialUser->getNickname() ?? Str::random(10),
                'email' => $socialUser->getEmail(),
                'password' => Hash::make(Str::random(32)),
                'oauth_provider' => $provider,
                'oauth_provider_id' => $socialUser->getId(),
                'avatar' => $socialUser->getAvatar(),
                'email_verified_at' => now(), // Assume oauth emails are verified
            ]);

            $org = \App\Models\Organization::create([
                'name' => $user->name . "'s Organization",
                'slug' => Str::slug($user->name . '-' . Str::random(6)),
                'owner_user_id' => $user->id,
            ]);

            $user->update([
                'organization_id' => $org->id,
                'current_organization_id' => $org->id,
                'role_id' => \App\Models\Role::where('slug', 'org_admin')->value('id') ?? 1
            ]);

            \App\Models\OrganizationMember::create([
                'organization_id' => $org->id,
                'user_id' => $user->id,
                'role_id' => $user->role_id,
                'status' => 'active',
            ]);
        }

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user' => $user->load('role', 'organization'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 'Authenticated successfully');
    }
}
