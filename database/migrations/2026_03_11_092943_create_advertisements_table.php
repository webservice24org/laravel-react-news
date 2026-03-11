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
         Schema::create('advertisements', function (Blueprint $table) {
            $table->id();
            $table->string('ad_name');          // Name of the ad
            $table->string('ad_image')->nullable(); // Image path
            $table->string('ad_url')->nullable();   // Optional external URL
            $table->text('ad_code')->nullable();    // Custom HTML/JS code
            $table->boolean('is_global')->default(false); // Show site-wide
            $table->boolean('status')->default(true);     // Active or inactive
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertisements');
    }
};
