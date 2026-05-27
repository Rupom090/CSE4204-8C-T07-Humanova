<?php

namespace App\Services\Providers;

use App\Contracts\AiProviderInterface;
use Illuminate\Support\Facades\Http;
use Exception;

class GeminiAdapter implements AiProviderInterface
{
    protected string $apiKey;
    protected string $baseUrl;

    public function __construct(?string $apiKey = null)
    {
        $this->apiKey = $apiKey ?? config('services.gemini.key');
        $this->baseUrl = config('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta');
    }

    public function generateResponse(string $prompt, array $options = []): array
    {
        $model = $options['model'] ?? 'gemini-1.5-pro';
        
        $response = Http::withHeaders([
            'x-goog-api-key' => $this->apiKey,
            'Content-Type' => 'application/json'
        ])
        ->baseUrl($this->baseUrl)
        ->post("/models/{$model}:generateContent", [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ]
        ]);

        if ($response->failed()) {
            $this->handleError(new Exception('Gemini API Error: ' . $response->body()));
        }

        return $this->normalizeResponse($response->json());
    }

    public function validateKey(string $apiKey): bool
    {
        $response = Http::withHeaders([
            'x-goog-api-key' => $apiKey,
        ])
        ->baseUrl($this->baseUrl)
        ->get('/models');
            
        return $response->successful();
    }

    public function estimateTokens(string $prompt): int
    {
        return (int) ceil(strlen($prompt) / 4);
    }

    public function normalizeResponse(mixed $response): array
    {
        return [
            'text' => $response['candidates'][0]['content']['parts'][0]['text'] ?? '',
            'prompt_tokens' => $response['usageMetadata']['promptTokenCount'] ?? 0,
            'response_tokens' => $response['usageMetadata']['candidatesTokenCount'] ?? 0,
            'total_tokens' => $response['usageMetadata']['totalTokenCount'] ?? 0,
            'raw_response' => $response,
        ];
    }

    public function handleError(\Throwable $exception): void
    {
        throw $exception;
    }
}
