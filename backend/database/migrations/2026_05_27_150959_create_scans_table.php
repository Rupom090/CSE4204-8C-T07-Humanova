<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('generation_id')->nullable()->constrained('ai_generations')->nullOnDelete();
            
            $table->string('scan_type'); // Enum: internal, external
            $table->decimal('overall_confidence', 5, 2)->nullable();
            $table->decimal('hallucination_score', 5, 2)->nullable();
            
            $table->string('scan_status')->default('queued'); // Enum: ScanStatus
            
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scans');
    }
};
