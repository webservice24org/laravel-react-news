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
         Schema::create('frontend_settings', function (Blueprint $table) {
            $table->id();

            $table->string('sub_lead_title')->default('Sub Lead News');
            $table->string('latest_news_title')->default('Latest News');
            $table->string('most_viewed_title')->default('Most Viewed');
            $table->string('related_news_title')->default('Related News');

            $table->string('previous_news_text')->default('Previous');
            $table->string('next_news_text')->default('Next');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('frontend_settings');
    }
};
