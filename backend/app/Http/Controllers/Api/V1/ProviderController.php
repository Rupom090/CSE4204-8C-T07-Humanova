<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AiProvider;
use App\Models\ProviderModel;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    use ApiResponse;

    /**
     * List all providers with health status.
     */
    public function index()
    {
        $providers = AiProvider::with('models')
            ->where('status', 'active')
            ->get();
            
        return $this->success($providers, 'Providers retrieved successfully');
    }

    /**
     * List models for a specific provider.
     */
    public function models(AiProvider $provider)
    {
        $models = $provider->models()->where('status', 'active')->get();
        
        return $this->success($models, 'Models retrieved successfully');
    }
}
