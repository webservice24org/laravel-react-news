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
        Schema::create('posts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('post_upper_title')->nullable();
            $table->string('post_title');
            $table->string('post_sub_title')->nullable();
            $table->longText('post_details');
            $table->text('post_slug')->nullable();
            
            $table->string('reporter_name')->nullable();
            $table->unsignedBigInteger('division_id')->nullable();
            $table->unsignedBigInteger('district_id')->nullable();

            $table->string('post_thumbnail')->nullable();
            $table->string('thumbnail_caption')->nullable();
            $table->string('thumbnail_alt')->nullable();
            $table->integer('view_count')->default(0);
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('news_source')->nullable();
            $table->softDeletes();
            $table->timestamps();
        
            $table->foreign('division_id')->references('id')->on('divisions')->onDelete('set null');
            $table->foreign('district_id')->references('id')->on('districts')->onDelete('set null');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
