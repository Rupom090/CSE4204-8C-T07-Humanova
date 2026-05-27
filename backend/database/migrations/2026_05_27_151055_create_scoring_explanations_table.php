<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scoring_explanations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('confidence_score_id')->constrained('confidence_scores')->cascadeOnDelete();
            
            $table->string('explanation_type'); // booster, penalty
            $table->text('explanation_text');
            $table->decimal('impact_score', 5, 2);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scoring_explanations');
    }
};
