<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Prompt;
use App\Models\AiProvider;
use App\Models\ProviderModel;
use App\Models\AiGeneration;
use App\Models\UserApiKey;
use App\Services\Providers\ProviderOrchestrator;
use Illuminate\Support\Facades\Log;

class ProcessAiGeneration implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [10, 30, 60];

    protected $organizationId;
    protected $userId;
    protected $promptId;
    protected $providerId;
    protected $modelId;
    protected $responseMode;

    public function __construct(
        int $organizationId,
        int $userId,
        int $promptId,
        int $providerId,
        int $modelId,
        string $responseMode = 'balanced'
    ) {
        $this->organizationId = $organizationId;
        $this->userId = $userId;
        $this->promptId = $promptId;
        $this->providerId = $providerId;
        $this->modelId = $modelId;
        $this->responseMode = $responseMode;
    }

    public function handle(ProviderOrchestrator $orchestrator): void
    {
        $prompt = Prompt::findOrFail($this->promptId);
        $provider = AiProvider::findOrFail($this->providerId);
        $model = ProviderModel::findOrFail($this->modelId);

        // Fetch custom API key if user/org provided one, else null (use system default)
        $apiKeyRecord = UserApiKey::where('organization_id', $this->organizationId)
            ->where('provider_id', $this->providerId)
            ->where('status', 'active')
            ->first();

        $apiKey = $apiKeyRecord ? $apiKeyRecord->encrypted_key : null;

        $generation = AiGeneration::create([
            'organization_id' => $this->organizationId,
            'user_id' => $this->userId,
            'provider_id' => $this->providerId,
            'model_id' => $this->modelId,
            'prompt_id' => $this->promptId,
            'response_mode' => $this->responseMode,
            'status' => 'processing',
        ]);

        try {
            $options = [
                'model' => $model->slug,
                'temperature' => $this->getTemperatureForMode($this->responseMode),
            ];

            $result = $orchestrator->generate($prompt->original_prompt, $provider->slug, $options, $apiKey);

            $generation->update([
                'response_text' => $result['text'],
                'prompt_tokens' => $result['prompt_tokens'],
                'response_tokens' => $result['response_tokens'],
                'latency_ms' => $result['latency_ms'],
                'status' => 'completed',
            ]);

            // Log usage
            $orchestrator->logUsage($result, $provider->id, $model->id, $this->userId, $this->organizationId);

            // Phase 6 will dispatch Verification Pipeline here

        } catch (\Exception $e) {
            Log::error("Generation Job failed: " . $e->getMessage());
            $generation->update(['status' => 'failed']);
            throw $e;
        }
    }

    protected function getTemperatureForMode(string $mode): float
    {
        return match ($mode) {
            'concise', 'enterprise' => 0.2, // Low hallucination
            'detailed', 'balanced' => 0.7,
            default => 0.7,
        };
    }
}
