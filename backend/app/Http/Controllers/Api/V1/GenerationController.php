<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Prompt;
use App\Models\AiGeneration;
use App\Models\AiProvider;
use App\Models\ProviderModel;
use App\Jobs\ProcessAiGeneration;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GenerationController extends Controller
{
    use ApiResponse;

    /**
     * List all generations for the organization.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', AiGeneration::class);

        $generations = AiGeneration::where('organization_id', $request->user()->current_organization_id)
            ->with(['prompt', 'provider', 'model'])
            ->paginate(15);

        return $this->paginated($generations, 'Generations retrieved successfully');
    }

    /**
     * Display a specific generation.
     */
    public function show(Request $request, AiGeneration $generation): JsonResponse
    {
        $this->authorize('view', $generation);

        $generation->load(['prompt', 'provider', 'model']);

        return $this->success($generation, 'Generation retrieved successfully');
    }

    /**
     * Remove the specified generation (soft delete).
     */
    public function destroy(Request $request, AiGeneration $generation): JsonResponse
    {
        $this->authorize('delete', $generation);

        $generation->delete();

        return $this->noContent('Generation deleted successfully');
    }

    /**
     * Dispatch single-provider AI generation.
     */
    public function generate(Request $request): JsonResponse
    {
        $this->authorize('create', AiGeneration::class);

        $validated = $request->validate([
            'prompt_id' => 'required|exists:prompts,id',
            'provider_id' => 'required|exists:ai_providers,id',
            'model_id' => 'required|exists:provider_models,id',
            'response_mode' => 'nullable|string|in:concise,balanced,detailed,enterprise',
        ]);

        $prompt = Prompt::findOrFail($validated['prompt_id']);
        
        if ($prompt->organization_id !== $request->user()->current_organization_id) {
            return $this->forbidden();
        }

        $provider = AiProvider::findOrFail($validated['provider_id']);
        $model = ProviderModel::findOrFail($validated['model_id']);

        ProcessAiGeneration::dispatch(
            $request->user()->current_organization_id,
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
    public function compare(Request $request): JsonResponse
    {
        $this->authorize('create', AiGeneration::class);

        $validated = $request->validate([
            'prompt_id' => 'required|exists:prompts,id',
            'provider_model_pairs' => 'required|array|min:2|max:3',
            'provider_model_pairs.*.provider_id' => 'required|exists:ai_providers,id',
            'provider_model_pairs.*.model_id' => 'required|exists:provider_models,id',
        ]);

        $prompt = Prompt::findOrFail($validated['prompt_id']);

        if ($prompt->organization_id !== $request->user()->current_organization_id) {
            return $this->forbidden();
        }

        foreach ($validated['provider_model_pairs'] as $pair) {
            ProcessAiGeneration::dispatch(
                $request->user()->current_organization_id,
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
