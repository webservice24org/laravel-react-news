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
        Schema::create('news_posts', function (Blueprint $table) {
            $table->id();
            $table->string('top_title')->nullable();
            $table->string('news_title');
            $table->string('hanger_title')->nullable();

            $table->string('slug')->unique();

            $table->longText('news_description');

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('news_thumbnail');
            $table->string('thumbnail_caption')->nullable();

            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            $table->boolean('is_lead')->nullable();
            $table->boolean('is_sub_lead')->nullable();

            $table->unsignedBigInteger('view_count')->default(0);

            $table->enum('status', ['draft', 'published', 'scheduled'])
                ->default('draft');

            $table->timestamp('scheduled_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news_posts');
    }
};
