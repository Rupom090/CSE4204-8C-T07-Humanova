<?php

namespace App\Services\Providers;

use App\Contracts\AiProviderInterface;
use Illuminate\Support\Facades\Http;
use Exception;

class OpenAiAdapter implements AiProviderInterface
{
    protected string $apiKey;
    protected string $baseUrl;

    public function __construct(?string $apiKey = null)
    {
        $this->apiKey = $apiKey ?? config('services.openai.key');
        $this->baseUrl = config('services.openai.base_url', 'https://api.openai.com/v1');
    }

    public function generateResponse(string $prompt, array $options = []): array
    {
        $model = $options['model'] ?? 'gpt-4o';
        
        $response = Http::withToken($this->apiKey)
            ->baseUrl($this->baseUrl)
            ->post('/chat/completions', [
                'model' => $model,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => $options['temperature'] ?? 0.7,
            ]);

        if ($response->failed()) {
            $this->handleError(new Exception('OpenAI API Error: ' . $response->body()));
        }

        return $this->normalizeResponse($response->json());
    }

    public function validateKey(string $apiKey): bool
    {
        $response = Http::withToken($apiKey)
            ->baseUrl($this->baseUrl)
            ->get('/models');
            
        return $response->successful();
    }

    public function estimateTokens(string $prompt): int
    {
        // Simple heuristic: 1 token ~= 4 chars in English
        return (int) ceil(strlen($prompt) / 4);
    }

    public function normalizeResponse(mixed $response): array
    {
        return [
            'text' => $response['choices'][0]['message']['content'] ?? '',
            'prompt_tokens' => $response['usage']['prompt_tokens'] ?? 0,
            'response_tokens' => $response['usage']['completion_tokens'] ?? 0,
            'total_tokens' => $response['usage']['total_tokens'] ?? 0,
            'raw_response' => $response,
        ];
    }

    public function handleError(\Throwable $exception): void
    {
        // In a real scenario, this might log or throw a custom exception
        throw $exception;
    }
}
