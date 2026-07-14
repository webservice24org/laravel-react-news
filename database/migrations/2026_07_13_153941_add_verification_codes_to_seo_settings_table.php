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
        Schema::table('seo_settings', function (Blueprint $table) {
            $table->text('google_verification_code')
                ->nullable()
                ->after('index_site');

            $table->text('bing_verification_code')
                ->nullable()
                ->after('google_verification_code');
            
            $table->text('copyright_credit')
                ->nullable()
                ->after('bing_verification_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('seo_settings', function (Blueprint $table) {
            $table->dropColumn([
                'google_verification_code',
                'bing_verification_code',
                'copyright_credit'
            ]);
        });
    }
};