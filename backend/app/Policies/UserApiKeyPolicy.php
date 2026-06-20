<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserApiKey;

class UserApiKeyPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, UserApiKey $apiKey): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        return $apiKey->user_id === $user->id && $apiKey->organization_id === $user->current_organization_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can create an API key for their current org
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UserApiKey $apiKey): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        return $apiKey->user_id === $user->id && $apiKey->organization_id === $user->current_organization_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UserApiKey $apiKey): bool
    {
        if ($user->role?->slug === 'super_admin') {
            return true;
        }

        return $apiKey->user_id === $user->id && $apiKey->organization_id === $user->current_organization_id;
    }
}
