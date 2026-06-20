<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('extracted_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('uploaded_file_id')->constrained('uploaded_files')->cascadeOnDelete();

            // Document metadata
            $table->string('document_type', 50)->default('unknown'); // pdf, docx, image, txt
            $table->longText('extracted_text')->nullable();
            $table->unsignedInteger('page_count')->nullable();
            $table->unsignedInteger('word_count')->nullable();
            $table->unsignedInteger('character_count')->nullable();
            $table->string('language', 10)->nullable();

            // Processing state
            $table->enum('processing_status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->text('processing_error')->nullable();
            $table->timestamp('processed_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['organization_id', 'processing_status']);
            $table->index('uploaded_file_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('extracted_documents');
    }
};
