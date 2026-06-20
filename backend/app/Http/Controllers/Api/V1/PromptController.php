<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Prompt;
use App\Models\PromptVersion;
use App\Models\EnhancedPrompt;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Jobs\ProcessPromptEnhancement;

class PromptController extends Controller
{
    use ApiResponse;

    /**
     * List all prompts for the organization.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Prompt::class);

        $prompts = Prompt::where('organization_id', $request->user()->current_organization_id)
            ->with(['latestVersion', 'enhancements'])
            ->paginate(15);

        return $this->paginated($prompts, 'Prompts retrieved successfully');
    }

    /**
     * Store a new prompt.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Prompt::class);

        $validated = $request->validate([
            'original_prompt' => 'required|string',
            'optimization_mode' => 'nullable|string|in:professional,concise,research,structured,low_hallucination',
        ]);

        $tokenEstimate = (int) ceil(strlen($validated['original_prompt']) / 4);

        $prompt = Prompt::create([
            'organization_id' => $request->user()->current_organization_id,
            'user_id' => $request->user()->id,
            'original_prompt' => $validated['original_prompt'],
            'optimization_mode' => $validated['optimization_mode'] ?? 'professional',
            'token_estimate' => $tokenEstimate,
        ]);

        PromptVersion::create([
            'prompt_id' => $prompt->id,
            'version_number' => 1,
            'content' => $prompt->original_prompt,
            'metadata' => ['created_by' => $request->user()->id]
        ]);

        return $this->created($prompt, 'Prompt saved successfully');
    }

    /**
     * Display the specified prompt.
     */
    public function show(Request $request, Prompt $prompt): JsonResponse
    {
        $this->authorize('view', $prompt);

        $prompt->load(['versions', 'enhancements']);
        return $this->success($prompt, 'Prompt retrieved successfully');
    }

    /**
     * Remove the specified prompt.
     */
    public function destroy(Request $request, Prompt $prompt): JsonResponse
    {
        $this->authorize('delete', $prompt);

        $prompt->delete();
        return $this->noContent('Prompt deleted successfully');
    }

    /**
     * Enhance a prompt asynchronously.
     */
    public function enhance(Request $request, Prompt $prompt): JsonResponse
    {
        $this->authorize('update', $prompt);

        // Dispatch async job
        ProcessPromptEnhancement::dispatch($prompt, $request->user());

        return $this->success(null, 'Prompt enhancement queued successfully', 202);
    }

    /**
     * View history/versions of a prompt.
     */
    public function history(Request $request, Prompt $prompt): JsonResponse
    {
        $this->authorize('view', $prompt);

        $versions = $prompt->versions()->orderBy('version_number', 'desc')->get();
        return $this->success($versions, 'Prompt history retrieved');
    }
}
