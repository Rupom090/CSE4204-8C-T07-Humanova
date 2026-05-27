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
    public function index(Request $request)
    {
        $keys = UserApiKey::where('organization_id', $request->user()->organization_id)
            ->with('provider')
            ->get()
            ->makeHidden('encrypted_key'); // Ensure raw key never exposed
            
        return $this->success($keys, 'API keys retrieved successfully');
    }

    /**
     * Store a new API key.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'provider_id' => 'required|exists:ai_providers,id',
            'api_key' => 'required|string',
            'label' => 'nullable|string|max:255',
        ]);

        $provider = AiProvider::find($validated['provider_id']);

        // Test key validity before saving
        try {
            $adapter = $this->orchestrator->getAdapter($provider->slug, $validated['api_key']);
            if (!$adapter->validateKey($validated['api_key'])) {
                return $this->error('Invalid API Key provided for this provider', 400);
            }
        } catch (\Exception $e) {
            return $this->error('Failed to validate API key: ' . $e->getMessage(), 400);
        }

        // Mask the key (e.g. sk-...1234)
        $keyLength = strlen($validated['api_key']);
        $maskedKey = substr($validated['api_key'], 0, 4) . str_repeat('*', max(0, $keyLength - 8)) . substr($validated['api_key'], -4);

        $apiKey = UserApiKey::create([
            'organization_id' => $request->user()->organization_id,
            'user_id' => $request->user()->id,
            'provider_id' => $provider->id,
            'encrypted_key' => $validated['api_key'], // Laravel encrypts this via model cast
            'masked_key' => $maskedKey,
            'label' => $validated['label'] ?? "{$provider->name} Key",
            'status' => 'active',
        ]);

        $apiKey->makeHidden('encrypted_key');

        return $this->created($apiKey, 'API key securely stored');
    }

    /**
     * Remove the specified API key.
     */
    public function destroy(Request $request, UserApiKey $apiKey)
    {
        if ($apiKey->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        $apiKey->delete();
        
        return $this->noContent('API key deleted successfully');
    }

    /**
     * Validate an existing API key.
     */
    public function validateKey(Request $request, UserApiKey $apiKey)
    {
        if ($apiKey->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

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
            return $this->serverError('Validation check failed');
        }
    }
}
