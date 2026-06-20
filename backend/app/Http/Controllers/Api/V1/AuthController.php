<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Models\Role;
use App\Models\User;
use App\Notifications\EmailVerificationNotification;
use App\Notifications\PasswordResetNotification;
use App\Notifications\WelcomeNotification;
use App\Services\Security\SecurityEventService;
use App\Traits\ApiResponse;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly SecurityEventService $securityEvents
    ) {}

    /**
     * Register a new user.
     * POST /api/v1/auth/register
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|max:255|unique:users,email',
            'password'              => ['required', 'confirmed', PasswordRule::min(8)->mixedCase()],
            'organization_name'     => 'nullable|string|max:255',
        ]);

        $user = DB::transaction(function () use ($validated) {
            /** @var User $user */
            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Assign default 'user' role
            $userRole = Role::where('slug', 'user')->first();

            // Create a personal organization for the new user
            $orgName = $validated['organization_name'] ?? $validated['name'] . "'s Organization";
            $org = Organization::create([
                'name'       => $orgName,
                'owner_id'   => $user->id,
                'is_active'  => true,
            ]);

            // Add user as org admin of their own org
            $adminRole = Role::where('slug', 'org_admin')->first();
            OrganizationMember::create([
                'organization_id' => $org->id,
                'user_id'         => $user->id,
                'role_id'         => $adminRole?->id ?? $userRole?->id,
                'status'          => 'active',
            ]);

            // Set the user's current organization
            $user->update([
                'current_organization_id' => $org->id,
                'role_id'                 => $userRole?->id,
            ]);

            return $user;
        });

        // Send verification email
        $user->notify(new EmailVerificationNotification($user));

        // Welcome notification
        $user->notify(new WelcomeNotification());

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->created([
            'user'  => $user->only(['id', 'name', 'email', 'created_at']),
            'token' => $token,
        ], 'Registration successful. Please verify your email.');
    }

    /**
     * Login a user.
     * POST /api/v1/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Rate limiting check — 5 attempts per minute per IP
        $key = 'login:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            $this->securityEvents->log(
                null,
                null,
                'rate_limit_hit',
                'auth',
                $request->ip(),
                $request->userAgent(),
                'high',
                ['email' => $validated['email']]
            );

            return $this->error('Too many login attempts. Try again in ' . $seconds . ' seconds.', 429);
        }

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            RateLimiter::hit($key, 60);

            // Log failed login as security event
            $this->securityEvents->log(
                $user?->id,
                $user?->current_organization_id,
                'login_failure',
                'auth',
                $request->ip(),
                $request->userAgent(),
                'medium',
                ['email' => $validated['email']]
            );

            return $this->error('Invalid credentials.', 401);
        }

        // Clear rate limit on success
        RateLimiter::clear($key);

        // Update last login
        $user->update(['last_login_at' => now()]);

        // Log successful login
        $this->securityEvents->log(
            $user->id,
            $user->current_organization_id,
            'login_success',
            'auth',
            $request->ip(),
            $request->userAgent(),
            'low'
        );

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user'  => $user->load('role', 'currentOrganization'),
            'token' => $token,
        ], 'Login successful.');
    }

    /**
     * Logout the authenticated user.
     * POST /api/v1/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $this->securityEvents->log(
            $request->user()->id,
            $request->user()->current_organization_id,
            'logout',
            'auth',
            $request->ip(),
            $request->userAgent(),
            'low'
        );

        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logged out successfully.');
    }

    /**
     * Get authenticated user profile.
     * GET /api/v1/auth/me
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load([
            'role',
            'currentOrganization',
            'organizationMemberships.organization',
            'organizationMemberships.role',
        ]);

        return $this->success($user, 'Profile retrieved.');
    }

    /**
     * Send a password reset link.
     * POST /api/v1/auth/forgot-password
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            $this->securityEvents->log(
                null,
                null,
                'password_reset_requested',
                'auth',
                $request->ip(),
                $request->userAgent(),
                'low',
                ['email' => $request->email]
            );

            return $this->success(null, 'Password reset link sent to your email.');
        }

        return $this->error('Unable to send reset link. Please check the email address.', 422);
    }

    /**
     * Reset user password.
     * POST /api/v1/auth/reset-password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'                 => 'required',
            'email'                 => 'required|email',
            'password'              => ['required', 'confirmed', PasswordRule::min(8)->mixedCase()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill(['password' => Hash::make($password)])->save();
                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->success(null, 'Password reset successfully. Please log in.');
        }

        return $this->error('Invalid or expired reset token.', 422);
    }

    /**
     * Verify email address.
     * GET /api/v1/auth/email/verify/{id}/{hash}
     */
    public function verifyEmail(Request $request, int $id, string $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (!hash_equals(sha1($user->email), $hash)) {
            return $this->error('Invalid verification link.', 403);
        }

        if ($user->hasVerifiedEmail()) {
            return $this->success(null, 'Email already verified.');
        }

        $user->markEmailAsVerified();

        return $this->success(null, 'Email verified successfully.');
    }

    /**
     * Resend email verification notification.
     * POST /api/v1/auth/email/resend
     */
    public function resendVerification(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->success(null, 'Email already verified.');
        }

        $request->user()->notify(new EmailVerificationNotification($request->user()));

        return $this->success(null, 'Verification email resent.');
    }
}
