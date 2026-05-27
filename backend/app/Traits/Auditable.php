<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

/**
 * Automatic audit log creation on model events.
 *
 * Models using this trait will automatically log create, update, and delete
 * events to the audit_logs table. Requires the AuditLog model to exist.
 *
 * Usage: `use Auditable;` in any Eloquent model.
 */
trait Auditable
{
    /**
     * Boot the auditable trait — registers model event listeners.
     */
    public static function bootAuditable(): void
    {
        static::created(function (Model $model) {
            static::logAuditEvent($model, 'created');
        });

        static::updated(function (Model $model) {
            static::logAuditEvent($model, 'updated', $model->getChanges(), $model->getOriginal());
        });

        static::deleted(function (Model $model) {
            static::logAuditEvent($model, 'deleted');
        });
    }

    /**
     * Create an audit log entry for a model event.
     */
    protected static function logAuditEvent(
        Model $model,
        string $action,
        array $changes = [],
        array $original = []
    ): void {
        try {
            // Skip if the AuditLog model doesn't exist yet (during migrations)
            if (! class_exists(\App\Models\AuditLog::class)) {
                return;
            }

            // Skip if the audit_logs table doesn't exist yet
            if (! \Illuminate\Support\Facades\Schema::hasTable('audit_logs')) {
                return;
            }

            $user = auth()->user();

            $metadata = [];
            if (! empty($changes)) {
                // Filter out sensitive fields from audit data
                $sensitiveFields = ['password', 'remember_token', 'encrypted_key', 'api_key'];
                $metadata['changes'] = array_diff_key($changes, array_flip($sensitiveFields));

                $relevantOriginal = array_intersect_key($original, $changes);
                $metadata['original'] = array_diff_key($relevantOriginal, array_flip($sensitiveFields));
            }

            \App\Models\AuditLog::create([
                'organization_id' => $model->organization_id ?? $user?->current_organization_id ?? $user?->organization_id,
                'user_id'         => $user?->id,
                'event_type'      => 'model.' . $action,
                'action'          => $action,
                'target_type'     => $model->getMorphClass(),
                'target_id'       => $model->getKey(),
                'metadata'        => ! empty($metadata) ? $metadata : null,
                'ip_address'      => request()?->ip(),
                'user_agent'      => request()?->userAgent(),
            ]);
        } catch (\Throwable $e) {
            // Never let audit logging break the application
            Log::warning('Audit log creation failed', [
                'model'   => get_class($model),
                'action'  => $action,
                'error'   => $e->getMessage(),
            ]);
        }
    }

    /**
     * Get the audit logs for this model.
     */
    public function auditLogs(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(\App\Models\AuditLog::class, 'target');
    }
}
