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
        Schema::table('video_news', function (Blueprint $table) {
            $table->string('video_thumbnail')->nullable()->after('video_link');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('video_news', function (Blueprint $table) {
            $table->dropColumn('video_thumbnail');
        });
    }
};
