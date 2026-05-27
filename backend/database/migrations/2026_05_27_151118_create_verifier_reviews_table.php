<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('verifier_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained('hallucination_reports')->cascadeOnDelete();
            $table->foreignId('verifier_user_id')->constrained('users')->cascadeOnDelete();
            
            $table->string('decision'); // verified, rejected
            $table->text('review_notes')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verifier_reviews');
    }
};
