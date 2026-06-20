<?php

namespace App\Policies;

use App\Models\AiGeneration;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AiGenerationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->current_organization_id !== null;
    }

    public function view(User $user, AiGeneration $aiGeneration): bool
    {
        return $user->current_organization_id === $aiGeneration->organization_id;
    }

    public function create(User $user): bool
    {
        return $user->current_organization_id !== null;
    }

    public function delete(User $user, AiGeneration $aiGeneration): bool
    {
        return $user->current_organization_id === $aiGeneration->organization_id &&
            ($user->id === $aiGeneration->user_id || $user->hasRole('org_admin', $user->current_organization_id));
    }
}
