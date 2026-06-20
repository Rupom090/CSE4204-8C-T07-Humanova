<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\UserApiKey;
use App\Models\AiProvider;
use App\Services\Providers\ProviderOrchestrator;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ApiKeyController extends Controller
{
    use ApiResponse;

    protected ProviderOrchestrator $orchestrator;

    public function __construct(ProviderOrchestrator $orchestrator)
    {
        $this->orchestrator = $orchestrator;
    }

    /**
     * List user's API keys (masked).
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', UserApiKey::class);

        $keys = UserApiKey::with('provider')
            ->where('organization_id', $request->user()->current_organization_id)
            ->paginate(20)
            ->through(function ($key) {
                $key->makeHidden('encrypted_key');
                return $key;
            });
            
        return $this->success($keys, 'API keys retrieved successfully');
    }

    /**
     * Store a new API key.
     */
    public function store(Request $request)
    {
        $this->authorize('create', UserApiKey::class);

        $validated = $request->validate([
            'provider_id' => 'required|exists:ai_providers,id',
            'api_key' => 'required|string',
            'label' => 'nullable|string|max:255',
        ]);

        $provider = AiProvider::find($validated['provider_id']);

        try {
            $adapter = $this->orchestrator->getAdapter($provider->slug, $validated['api_key']);
            if (!$adapter->validateKey($validated['api_key'])) {
                return $this->error('Invalid API Key provided for this provider', 400);
            }
        } catch (\Exception $e) {
            return $this->error('Failed to validate API key: ' . $e->getMessage(), 400);
        }

        $keyLength = strlen($validated['api_key']);
        $maskedKey = substr($validated['api_key'], 0, 4) . str_repeat('*', max(0, $keyLength - 8)) . substr($validated['api_key'], -4);

        $apiKey = UserApiKey::create([
            'organization_id' => $request->user()->current_organization_id,
            'user_id' => $request->user()->id,
            'provider_id' => $provider->id,
            'encrypted_key' => $validated['api_key'],
            'masked_key' => $maskedKey,
            'label' => $validated['label'] ?? "{$provider->name} Key",
            'status' => 'active',
        ]);

        $apiKey->makeHidden('encrypted_key');

        return $this->created($apiKey, 'API key securely stored');
    }

    /**
     * Update the specified API key label.
     */
    public function update(Request $request, UserApiKey $apiKey)
    {
        $this->authorize('update', $apiKey);

        $validated = $request->validate([
            'label' => 'required|string|max:255',
        ]);

        $apiKey->update($validated);

        return $this->success($apiKey, 'API key updated successfully');
    }

    /**
     * Remove the specified API key.
     */
    public function destroy(Request $request, UserApiKey $apiKey)
    {
        $this->authorize('delete', $apiKey);

        $apiKey->delete();
        
        return $this->noContent('API key deleted successfully');
    }

    /**
     * Validate an existing API key.
     */
    public function validateKey(Request $request, UserApiKey $apiKey)
    {
        $this->authorize('view', $apiKey);

        try {
            $adapter = $this->orchestrator->getAdapter($apiKey->provider->slug, $apiKey->encrypted_key);
            $isValid = $adapter->validateKey($apiKey->encrypted_key);
            
            if ($isValid) {
                $apiKey->update(['status' => 'active', 'last_used_at' => now()]);
                return $this->success(['is_valid' => true], 'API key is valid');
            } else {
                $apiKey->update(['status' => 'expired']);
                return $this->success(['is_valid' => false], 'API key is invalid');
            }
        } catch (\Exception $e) {
            return $this->error('Validation check failed', 500);
        }
    }
}
