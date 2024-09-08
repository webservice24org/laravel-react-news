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
        Schema::create('footer_data', function (Blueprint $table) {
            $table->id();
            $table->string('footer_logo')->nullable();
            $table->text('footer_info')->nullable();
            $table->string('address_one')->default('address one');
            $table->string('address_two')->default('address two');
            $table->string('phone')->default('01831332732');
            $table->string('mobile')->default('01911555084');
            $table->string('chairman_name')->nullable();
            $table->string('chairman_designation')->nullable();
            $table->string('md_name')->nullable();
            $table->string('md_designation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('footer_data');
    }
};
