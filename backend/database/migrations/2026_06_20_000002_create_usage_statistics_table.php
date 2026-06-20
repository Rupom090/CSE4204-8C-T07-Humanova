<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usage_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();

            // Metric identification
            $table->string('metric_key', 100);  // e.g. 'total_scans', 'token_usage', 'active_users'
            $table->json('metric_value');        // flexible value storage (supports scalars and breakdowns)

            // Aggregation period
            $table->enum('period_type', ['daily', 'weekly', 'monthly'])->default('daily');
            $table->timestamp('period_start');
            $table->timestamp('period_end');

            $table->timestamps();

            // Primary lookup index
            $table->index(['organization_id', 'metric_key', 'period_start'], 'us_org_metric_period');
            $table->index(['organization_id', 'period_type'], 'us_org_period_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usage_statistics');
    }
};
