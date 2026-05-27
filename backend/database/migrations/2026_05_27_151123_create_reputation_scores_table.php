<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reputation_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            
            $table->integer('total_reports')->default(0);
            $table->integer('approved_reports')->default(0);
            $table->decimal('accuracy_rate', 5, 2)->default(0);
            $table->integer('reputation_level')->default(1);
            
            $table->timestamps();
            
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reputation_scores');
    }
};
