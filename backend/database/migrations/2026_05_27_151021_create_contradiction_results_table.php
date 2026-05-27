<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contradiction_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('claim_id')->constrained('extracted_claims')->cascadeOnDelete();
            
            $table->text('contradicting_source')->nullable();
            $table->decimal('contradiction_probability', 5, 2)->nullable();
            
            $table->string('severity'); // Enum: Severity
            $table->text('explanation')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contradiction_results');
    }
};
