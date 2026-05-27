<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('extracted_claims', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scan_id')->constrained('scans')->cascadeOnDelete();
            
            $table->text('claim_text');
            $table->string('claim_type'); // Enum: ClaimType
            $table->decimal('confidence', 5, 2)->nullable(); // NLP extraction confidence
            $table->integer('entity_count')->default(0);
            
            // Text positioning mapping
            $table->integer('position_start')->nullable();
            $table->integer('position_end')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('extracted_claims');
    }
};
