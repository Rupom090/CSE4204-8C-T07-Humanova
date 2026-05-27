<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evidence_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('verification_result_id')->constrained('verification_results')->cascadeOnDelete();
            
            $table->string('source_type'); // e.g. web, document, internal_kb
            $table->text('source_url')->nullable();
            $table->text('source_title')->nullable();
            
            $table->decimal('authority_score', 5, 2)->nullable();
            $table->decimal('retrieval_score', 5, 2)->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evidence_sources');
    }
};
