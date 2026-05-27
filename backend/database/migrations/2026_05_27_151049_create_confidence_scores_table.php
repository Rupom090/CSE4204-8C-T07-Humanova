<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('confidence_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scan_id')->constrained('scans')->cascadeOnDelete();
            
            $table->decimal('semantic_similarity_score', 5, 2)->default(0);
            $table->decimal('source_authority_score', 5, 2)->default(0);
            $table->decimal('citation_validity_score', 5, 2)->default(0);
            
            $table->decimal('contradiction_penalty', 5, 2)->default(0);
            $table->decimal('uncertainty_penalty', 5, 2)->default(0);
            $table->decimal('fabrication_penalty', 5, 2)->default(0);
            
            $table->decimal('community_weight', 5, 2)->default(0);
            
            $table->decimal('final_score', 5, 2)->default(0);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('confidence_scores');
    }
};
