<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Prompt;
use App\Models\AiProvider;
use App\Models\ProviderModel;
use App\Jobs\ProcessAiGeneration;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GenerationController extends Controller
{
    use ApiResponse;

    /**
     * Dispatch single-provider AI generation.
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'prompt_id' => 'required|exists:prompts,id',
            'provider_id' => 'required|exists:ai_providers,id',
            'model_id' => 'required|exists:provider_models,id',
            'response_mode' => 'nullable|string|in:concise,balanced,detailed,enterprise',
        ]);

        $prompt = Prompt::findOrFail($validated['prompt_id']);
        
        // Authorization check
        if ($prompt->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        $provider = AiProvider::findOrFail($validated['provider_id']);
        $model = ProviderModel::findOrFail($validated['model_id']);

        // Dispatch background job
        ProcessAiGeneration::dispatch(
            $request->user()->organization_id,
            $request->user()->id,
            $prompt->id,
            $provider->id,
            $model->id,
            $validated['response_mode'] ?? 'balanced'
        )->onQueue('generation');

        return $this->success(null, 'AI generation job queued successfully', 202);
    }

    /**
     * Multi-provider comparison.
     */
    public function compare(Request $request)
    {
        $validated = $request->validate([
            'prompt_id' => 'required|exists:prompts,id',
            'provider_model_pairs' => 'required|array|min:2|max:3',
            'provider_model_pairs.*.provider_id' => 'required|exists:ai_providers,id',
            'provider_model_pairs.*.model_id' => 'required|exists:provider_models,id',
        ]);

        $prompt = Prompt::findOrFail($validated['prompt_id']);

        if ($prompt->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        foreach ($validated['provider_model_pairs'] as $pair) {
            ProcessAiGeneration::dispatch(
                $request->user()->organization_id,
                $request->user()->id,
                $prompt->id,
                $pair['provider_id'],
                $pair['model_id'],
                'balanced'
            )->onQueue('generation');
        }

        return $this->success(null, 'Multiple AI generation jobs queued for comparison', 202);
    }
}
