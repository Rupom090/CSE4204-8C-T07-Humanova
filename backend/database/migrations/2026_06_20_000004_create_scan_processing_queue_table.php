<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scan_processing_queue', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scan_id')->constrained('scans')->cascadeOnDelete();

            // Job type maps to the chained job class name
            $table->string('job_type', 100); // claim_extraction, evidence_retrieval, link_verification, confidence_scoring

            $table->enum('status', ['queued', 'processing', 'completed', 'failed', 'retrying', 'cancelled'])
                  ->default('queued');

            $table->tinyInteger('attempts')->default(0);
            $table->tinyInteger('max_attempts')->default(3);
            $table->text('error_message')->nullable();
            $table->json('payload')->nullable(); // optional debug context

            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('next_retry_at')->nullable();

            $table->timestamps();

            // Lookup indexes
            $table->index(['scan_id', 'job_type']);
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scan_processing_queue');
    }
};
