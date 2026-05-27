<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provider_models', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained('ai_providers')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('input_rate', 10, 6)->default(0); // Cost per 1K tokens
            $table->decimal('output_rate', 10, 6)->default(0); // Cost per 1K tokens
            $table->integer('max_tokens')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provider_models');
    }
};
