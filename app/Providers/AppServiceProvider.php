<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Cache;
use App\Models\MailConfig;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        // Load mail configuration from DB if table exists
        if (Schema::hasTable('mail_configs')) {

            // Use cache to avoid querying DB on every request
            $settings = Cache::remember('mail_config', 60, fn() => MailConfig::first());

            if ($settings) {
                // Set default mailer
                Config::set('mail.default', $settings->mailer ?? 'smtp');

                // Configure SMTP mailer dynamically
                Config::set('mail.mailers.smtp', [
                    'transport' => $settings->mailer ?? 'smtp',
                    'host' => $settings->host ?? '127.0.0.1',
                    'port' => $settings->port ?? 2525,
                    'username' => $settings->username ?? null,
                    'password' => $settings->password ?? null,
                    'encryption' => $settings->encryption ?? 'tls',
                    'timeout' => null,
                    'auth_mode' => null,
                ]);

                // Configure global "from" address and name
                Config::set('mail.from', [
                    'address' => $settings->from_address ?? 'hello@example.com',
                    'name' => $settings->from_name ?? config('app.name'),
                ]);
            }
        }
    }

    /**
     * Configure default settings for dates, DB, and password rules
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(app()->isProduction());

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}