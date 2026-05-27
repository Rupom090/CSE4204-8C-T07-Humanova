<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AiProviderSeeder extends Seeder
{
    public function run(): void
    {
        $providers = [
            [
                'name' => 'OpenAI',
                'slug' => 'openai',
                'provider_type' => 'openai',
                'status' => 'active',
                'api_base_url' => 'https://api.openai.com/v1',
                'default_model' => 'gpt-4o',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Google Gemini',
                'slug' => 'gemini',
                'provider_type' => 'gemini',
                'status' => 'active',
                'api_base_url' => 'https://generativelanguage.googleapis.com/v1beta',
                'default_model' => 'gemini-1.5-pro',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('ai_providers')->insertOrIgnore($providers);
        
        $providerId1 = DB::table('ai_providers')->where('slug', 'openai')->value('id');
        $providerId2 = DB::table('ai_providers')->where('slug', 'gemini')->value('id');

        if ($providerId1 && $providerId2) {
            DB::table('provider_models')->insertOrIgnore([
                [
                    'provider_id' => $providerId1,
                    'name' => 'GPT-4o',
                    'slug' => 'gpt-4o',
                    'input_rate' => 0.005,
                    'output_rate' => 0.015,
                    'max_tokens' => 128000,
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'provider_id' => $providerId2,
                    'name' => 'Gemini 1.5 Pro',
                    'slug' => 'gemini-1.5-pro',
                    'input_rate' => 0.0035,
                    'output_rate' => 0.0105,
                    'max_tokens' => 1048576,
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}
