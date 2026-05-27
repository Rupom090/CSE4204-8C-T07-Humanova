<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            
            $table->string('metric_type'); // scans_count, average_hallucination, provider_latency
            $table->json('metric_data');
            
            $table->dateTime('period_start');
            $table->dateTime('period_end');
            
            $table->timestamps();
            
            $table->index(['organization_id', 'metric_type', 'period_start'], 'analytics_snapshots_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_snapshots');
    }
};
