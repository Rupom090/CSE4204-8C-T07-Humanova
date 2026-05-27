<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pdf_exports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->string('export_type'); // Enum: ExportType
            $table->foreignId('scan_id')->nullable()->constrained('scans')->nullOnDelete();
            
            $table->string('file_path')->nullable();
            $table->string('export_status')->default('queued'); // Enum: ExportStatus
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pdf_exports');
    }
};
