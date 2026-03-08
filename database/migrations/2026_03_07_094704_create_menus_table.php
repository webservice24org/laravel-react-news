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
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('url')->nullable();

            $table->enum('type', ['category', 'subcategory', 'custom'])->default('category');

            $table->foreignId('category_id')->nullable()->constrained()->cascadeOnDelete(); 
            $table->foreignId('sub_category_id')->nullable()->constrained('sub_categories')->cascadeOnDelete(); 
            $table->foreignId('parent_id')->nullable()->constrained('menus')->cascadeOnDelete(); 

            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
