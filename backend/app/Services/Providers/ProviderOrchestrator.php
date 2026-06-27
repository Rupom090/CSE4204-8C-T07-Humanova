<?php

namespace App\Services\Providers;

use App\Contracts\AiProviderInterface;
use App\Models\AiProvider;
use App\Models\ProviderUsageLog;
use Illuminate\Support\Facades\Log;

class ProviderOrchestrator
{
    /**
     * Factory to get the correct adapter based on provider slug.
     */
    public function getAdapter(string $providerSlug, ?string $apiKey = null): AiProviderInterface
    {
        return match ($providerSlug) {
            'openai' => new OpenAiAdapter($apiKey),
            'gemini' => new GeminiAdapter($apiKey),
            'deepseek' => new DeepSeekAdapter($apiKey),
            'groq' => new GroqAdapter($apiKey),
            default => throw new \InvalidArgumentException("Provider [{$providerSlug}] not supported."),
        };
    }

    /**
     * Generate response with fallback handling.
     */
    public function generate(string $prompt, string $primaryProviderSlug, array $options = [], ?string $apiKey = null): array
    {
        $adapter = $this->getAdapter($primaryProviderSlug, $apiKey);

        try {
            $start = microtime(true);
            $response = $adapter->generateResponse($prompt, $options);
            $latency = (int) ((microtime(true) - $start) * 1000);
            
            $response['latency_ms'] = $latency;
            $response['provider'] = $primaryProviderSlug;
            
            return $response;
            
        } catch (\Exception $e) {
            Log::error("Provider Orchestrator Error [{$primaryProviderSlug}]: " . $e->getMessage());
            
            // Basic fallback logic could go here
            if (isset($options['fallback_provider'])) {
                Log::info("Attempting fallback to {$options['fallback_provider']}");
                return $this->generate($prompt, $options['fallback_provider'], $options, $options['fallback_api_key'] ?? null);
            }
            
            throw $e;
        }
    }

    /**
     * Log usage for analytics.
     */
    public function logUsage(array $response, int $providerId, int $modelId, int $userId, int $organizationId): void
    {
        ProviderUsageLog::create([
            'provider_id' => $providerId,
            'model_id' => $modelId,
            'user_id' => $userId,
            'organization_id' => $organizationId,
            'request_tokens' => $response['prompt_tokens'] ?? 0,
            'response_tokens' => $response['response_tokens'] ?? 0,
            'latency_ms' => $response['latency_ms'] ?? 0,
            'estimated_cost' => 0, // Calculate based on model rates
        ]);
    }
}
