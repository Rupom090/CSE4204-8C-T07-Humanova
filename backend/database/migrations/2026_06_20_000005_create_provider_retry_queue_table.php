<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provider_retry_queue', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained('ai_providers')->cascadeOnDelete();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();

            // Failure tracking for circuit breaker logic
            $table->string('failure_type', 50); // timeout, rate_limit, outage, invalid_response
            $table->tinyInteger('failure_count')->default(0);
            $table->tinyInteger('max_failures')->default(5); // circuit opens after this many

            $table->timestamp('last_failure_at')->nullable();
            $table->timestamp('next_retry_at')->nullable();

            // Circuit breaker state
            $table->boolean('is_blocked')->default(false);
            $table->timestamp('blocked_at')->nullable();
            $table->timestamp('cooldown_until')->nullable();

            $table->timestamps();

            $table->index(['provider_id', 'is_blocked']);
            $table->index(['organization_id', 'provider_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provider_retry_queue');
    }
};
