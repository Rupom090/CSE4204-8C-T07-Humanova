<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SecurityEvent;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    use ApiResponse;

    public function logs(Request $request): JsonResponse
    {
        $this->authorize('viewAny', AuditLog::class);

        $query = AuditLog::where('organization_id', $request->user()->current_organization_id)
            ->with('user')
            ->latest();

        if ($request->has('event_type')) {
            $query->where('event_type', $request->event_type);
        }

        return $this->paginated($query->paginate(25), 'Audit logs retrieved');
    }

    public function securityEvents(Request $request): JsonResponse
    {
        $this->authorize('viewAny', AuditLog::class);

        $events = SecurityEvent::whereIn('user_id', function($q) use ($request) {
                $q->select('id')->from('users')->where('organization_id', $request->user()->current_organization_id);
            })
            ->latest()
            ->paginate(25);
            
        return $this->paginated($events, 'Security events retrieved');
    }
}
