<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('verification_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('claim_id')->constrained('extracted_claims')->cascadeOnDelete();
            
            $table->string('verification_status'); // Enum: VerificationStatus
            $table->decimal('evidence_score', 5, 2)->nullable();
            $table->decimal('contradiction_score', 5, 2)->nullable();
            
            $table->text('explanation')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verification_results');
    }
};
