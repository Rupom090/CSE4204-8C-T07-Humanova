<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->foreignId('owner_user_id')->nullable(); // Can't constrain to users yet because it's created later. We will add a constraint later or just leave as foreignId without constraint here. Wait, users table is created before this. 0001_01...
            // Let's constrain it!
            $table->foreign('owner_user_id')->references('id')->on('users')->nullOnDelete();
            
            $table->string('subscription_plan')->default('free');
            $table->string('status')->default('active');
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
