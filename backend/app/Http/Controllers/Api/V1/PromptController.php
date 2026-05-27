<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Prompt;
use App\Models\PromptVersion;
use App\Models\EnhancedPrompt;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PromptController extends Controller
{
    use ApiResponse;

    /**
     * Store a new prompt.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'original_prompt' => 'required|string',
            'optimization_mode' => 'nullable|string|in:professional,concise,research,structured,low_hallucination',
        ]);

        // Simple token estimate
        $tokenEstimate = (int) ceil(strlen($validated['original_prompt']) / 4);

        $prompt = Prompt::create([
            'organization_id' => $request->user()->organization_id,
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
     * Enhance a prompt (Mock implementation, normally calls an LLM to rewrite).
     */
    public function enhance(Request $request, Prompt $prompt)
    {
        if ($prompt->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        // Normally we'd call an AI provider here to rewrite the prompt.
        // Mocking for Phase 5 structure.
        $enhancedContent = "Enhanced version of: " . $prompt->original_prompt;
        
        $enhanced = EnhancedPrompt::create([
            'prompt_id' => $prompt->id,
            'enhanced_prompt' => $enhancedContent,
            'enhancement_strategy' => $prompt->optimization_mode,
            'token_reduction_percent' => 10.5, // Mock data
        ]);

        return $this->success($enhanced, 'Prompt enhanced successfully');
    }

    /**
     * View history/versions of a prompt.
     */
    public function history(Request $request, Prompt $prompt)
    {
        if ($prompt->organization_id !== $request->user()->organization_id) {
            return $this->forbidden();
        }

        $versions = $prompt->versions()->orderBy('version_number', 'desc')->get();
        return $this->success($versions, 'Prompt history retrieved');
    }
}
