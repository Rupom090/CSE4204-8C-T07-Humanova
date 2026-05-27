<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

/**
 * Auto-scopes all queries to the current organization.
 * Models using this trait MUST have an `organization_id` column.
 */
trait BelongsToOrganization
{
    public static function bootBelongsToOrganization(): void
    {
        static::creating(function ($model) {
            if (auth()->check() && empty($model->organization_id)) {
                $model->organization_id = auth()->user()->current_organization_id
                    ?? auth()->user()->organization_id;
            }
        });

        static::addGlobalScope('organization', function (Builder $builder) {
            if (auth()->check() && auth()->user()->current_organization_id) {
                $builder->where(
                    $builder->getModel()->getTable() . '.organization_id',
                    auth()->user()->current_organization_id
                );
            }
        });
    }

    public function organization(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(\App\Models\Organization::class);
    }

    public function scopeForOrganization(Builder $query, int $organizationId): Builder
    {
        return $query->withoutGlobalScope('organization')
            ->where('organization_id', $organizationId);
    }
}
