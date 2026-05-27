<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generation_comparisons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('prompt_id')->constrained('prompts')->cascadeOnDelete();
            $table->json('generation_ids'); // Array of IDs from ai_generations
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generation_comparisons');
    }
};
