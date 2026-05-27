<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('link_checks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scan_id')->constrained('scans')->cascadeOnDelete();
            
            $table->text('url');
            $table->integer('http_status')->nullable();
            $table->boolean('ssl_valid')->default(false);
            $table->json('redirect_chain')->nullable();
            $table->integer('response_time_ms')->nullable();
            $table->decimal('trust_score', 5, 2)->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('link_checks');
    }
};
