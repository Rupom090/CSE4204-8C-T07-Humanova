<?php

namespace App\Contracts;

interface AiProviderInterface
{
    /**
     * Generate a response from the AI provider.
     */
    public function generateResponse(string $prompt, array $options = []): array;

    /**
     * Validate an API key against the provider.
     */
    public function validateKey(string $apiKey): bool;

    /**
     * Estimate the number of tokens for a given prompt.
     */
    public function estimateTokens(string $prompt): int;

    /**
     * Normalize the provider's specific response format into a standard array.
     */
    public function normalizeResponse(mixed $response): array;

    /**
     * Handle exceptions and errors specific to the provider.
     */
    public function handleError(\Throwable $exception): void;
}
