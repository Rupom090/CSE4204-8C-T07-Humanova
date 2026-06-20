<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provider_rankings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained('ai_providers')->cascadeOnDelete();

            // Composite rank score (weighted formula from Analytics Spec §5)
            $table->decimal('rank_score', 5, 2)->default(0.00);

            // Component metrics (each 0.00–1.00)
            $table->decimal('verification_accuracy', 5, 2)->default(0.00); // weight 0.4
            $table->decimal('citation_accuracy', 5, 2)->default(0.00);     // weight 0.2
            $table->decimal('response_consistency', 5, 2)->default(0.00);  // weight 0.2
            $table->decimal('token_efficiency', 5, 2)->default(0.00);      // weight 0.2

            // Supporting counters for the period
            $table->unsignedBigInteger('total_requests')->default(0);
            $table->unsignedBigInteger('successful_requests')->default(0);
            $table->decimal('avg_latency_ms', 10, 2)->default(0.00);
            $table->unsignedBigInteger('total_tokens_used')->default(0);

            // Aggregation period
            $table->enum('period_type', ['hourly', 'daily', 'weekly', 'monthly'])->default('daily');
            $table->timestamp('period_start');
            $table->timestamp('period_end');

            $table->timestamps();

            // Performance indexes
            $table->index(['organization_id', 'provider_id', 'period_start'], 'pr_org_provider_period');
            $table->index(['organization_id', 'rank_score'], 'pr_org_rank');
            $table->index('period_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provider_rankings');
    }
};
