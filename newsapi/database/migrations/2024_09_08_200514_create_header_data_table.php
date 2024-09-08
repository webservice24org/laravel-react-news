<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('header_data', function (Blueprint $table) {
            $table->id();
            $table->string('header_logo')->nullable(); 
            $table->string('fave_icon')->nullable(); 
            $table->string('video_btn_text')->default('Video'); 
            $table->string('video_link')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('header_data');
    }
};
