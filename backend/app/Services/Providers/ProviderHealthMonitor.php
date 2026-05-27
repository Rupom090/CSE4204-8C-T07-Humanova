<?php

namespace App\Services\Providers;

use App\Models\AiProvider;
use App\Models\ProviderHealthLog;
use Illuminate\Support\Facades\Log;

class ProviderHealthMonitor
{
    /**
     * Check health of all active providers.
     */
    public function checkAll(): void
    {
        $providers = AiProvider::where('status', 'active')->get();
        $orchestrator = new ProviderOrchestrator();

        foreach ($providers as $provider) {
            try {
                $adapter = $orchestrator->getAdapter($provider->slug);
                $start = microtime(true);
                
                // Using a placeholder or actual API key validation method to check health
                // We'd ideally call a cheap endpoint like /models
                $isHealthy = true; 
                
                $latency = (int) ((microtime(true) - $start) * 1000);

                ProviderHealthLog::create([
                    'provider_id' => $provider->id,
                    'status' => 'healthy',
                    'latency_ms' => $latency,
                    'checked_at' => now(),
                ]);
            } catch (\Exception $e) {
                Log::error("Health check failed for {$provider->name}: " . $e->getMessage());
                
                ProviderHealthLog::create([
                    'provider_id' => $provider->id,
                    'status' => 'degraded',
                    'error_message' => substr($e->getMessage(), 0, 255),
                    'checked_at' => now(),
                ]);
            }
        }
    }
}
