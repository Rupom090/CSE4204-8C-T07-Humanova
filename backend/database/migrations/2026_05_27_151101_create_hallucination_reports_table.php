<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hallucination_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('scan_id')->nullable()->constrained('scans')->nullOnDelete();
            $table->foreignId('claim_id')->nullable()->constrained('extracted_claims')->nullOnDelete();
            
            $table->string('report_reason'); // Enum: ReportReason
            $table->text('description')->nullable();
            $table->string('severity')->default('medium'); // Enum: Severity
            
            $table->string('moderation_status')->default('pending'); // Enum: ModerationStatus
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hallucination_reports');
    }
};
