<?php

namespace App\Services;

use Spatie\Analytics\Facades\Analytics;
use Spatie\Analytics\Period;
use App\Models\AnalyticsConfig;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class AnalyticsService
{
    private function loadConfig()
    {
        $config = AnalyticsConfig::first();

        if (!$config) {
            return;
        }

        config(['analytics.property_id' => $config->property_id]);

        $directory = storage_path('app/analytics');

        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        $path = $directory.'/service-account-credentials.json';

        if (!file_exists($path)) {
            file_put_contents($path, $config->service_account_json);
        }
    }

    public function getDashboardData()
    {
        return Cache::remember('analytics.dashboard', 300, function () {

            $this->loadConfig();

            $period = Period::days(30);

            $analyticsData = Analytics::fetchTotalVisitorsAndPageViews($period);

            $visitors = $analyticsData->sum('visitors');
            $pageViews = $analyticsData->sum('pageViews');

            $sessionsData = Analytics::get(
                period: $period,
                metrics: ['sessions'],
                dimensions: ['date']
            );

            $sessions = collect($sessionsData)->sum('sessions');

            $byDate = collect($analyticsData)
                ->keyBy(fn ($r) => Carbon::parse($r['date'])->format('Y-m-d'));

            $bySessions = collect($sessionsData)->keyBy('date');

            $dailyStats = collect(range(0, 29))
                ->map(fn ($i) => Carbon::today()->subDays(29 - $i)->format('Y-m-d'))
                ->map(function ($ymd) use ($byDate, $bySessions) {

                    return [
                        'date' => Carbon::parse($ymd)->format('M d'),
                        'visitors' => (int) ($byDate[$ymd]['visitors'] ?? 0),
                        'pageViews' => (int) ($byDate[$ymd]['pageViews'] ?? 0),
                        'sessions' => (int) ($bySessions[$ymd]['sessions'] ?? 0),
                    ];

                })->values();

            $topPages = Analytics::fetchMostVisitedPages($period, 5)
                ->map(fn ($r) => [
                    'url' => $r['pagePath'] ?? null,
                    'pageTitle' => $r['pageTitle'] ?? 'N/A',
                    'pageViews' => $r['pageViews'] ?? 0,
                ])
                ->toArray();

            $countries = Analytics::get(
                period: $period,
                metrics: ['totalUsers'],
                dimensions: ['country']
            );

            $topCountries = collect($countries)
                ->sortByDesc('totalUsers')
                ->take(5)
                ->values();

            $devices = Analytics::get(
                period: $period,
                metrics: ['totalUsers'],
                dimensions: ['deviceCategory']
            );

            $deviceBreakdown = collect($devices)->values();

            return [
                'visitors' => $visitors,
                'pageViews' => $pageViews,
                'sessions' => $sessions,
                'dailyStats' => $dailyStats,
                'topPages' => $topPages,
                'topCountries' => $topCountries,
                'deviceBreakdown' => $deviceBreakdown
            ];

        });
    }

    public function getProDashboard()
    {
        return Cache::remember('analytics.pro.dashboard', 300, function () {

            $this->loadConfig();

            $period = Period::days(30);

            $analyticsData = Analytics::fetchTotalVisitorsAndPageViews($period);

            $visitors = $analyticsData->sum('visitors');
            $pageViews = $analyticsData->sum('pageViews');

            $today = Period::days(1);

            $hourly = Analytics::get(
                period: $today,
                metrics: ['sessions'],
                dimensions: ['hour']
            );

            $hourlyTraffic = collect($hourly)->map(fn($r)=>[
                'hour' => $r['hour'] ?? '0',
                'sessions' => (int)($r['sessions'] ?? 0)
            ]);

            $topPagesToday = Analytics::fetchMostVisitedPages($today,10)
                ->map(fn($r)=>[
                    'title'=>$r['pageTitle'] ?? 'N/A',
                    'url'=>$r['pagePath'] ?? '',
                    'views'=>$r['pageViews'] ?? 0
                ]);

            $sources = Analytics::get(
                period: $period,
                metrics:['sessions'],
                dimensions:['sessionDefaultChannelGroup']
            );

            $trafficSources = collect($sources)->map(fn($r)=>[
                'source'=>$r['sessionDefaultChannelGroup'] ?? 'Unknown',
                'sessions'=>$r['sessions'] ?? 0
            ]);

            $referrers = Analytics::get(
                period:$period,
                metrics:['sessions'],
                dimensions:['pageReferrer']
            );

            $topReferrers = collect($referrers)
                ->sortByDesc('sessions')
                ->take(10)
                ->values();

            $countries = Analytics::get(
                period:$period,
                metrics:['totalUsers'],
                dimensions:['country']
            );

            $countryData = collect($countries)->map(fn($r)=>[
                'country'=>$r['country'],
                'users'=>$r['totalUsers']
            ]);

            $devices = Analytics::get(
                period:$period,
                metrics:['totalUsers'],
                dimensions:['deviceCategory']
            );

            $devices = collect($devices)->map(fn($r)=>[
                'device'=>$r['deviceCategory'],
                'users'=>$r['totalUsers']
            ]);

            return [

                'visitors'=>$visitors,
                'pageViews'=>$pageViews,

                'hourlyTraffic'=>$hourlyTraffic,

                'topPagesToday'=>$topPagesToday,

                'trafficSources'=>$trafficSources,

                'topReferrers'=>$topReferrers,

                'countries'=>$countryData,

                'devices'=>$devices

            ];
        });
    }

    public function getRealtimeUsers()
    {
        return Cache::remember('analytics.realtime', 60, function () {

            $this->loadConfig();

            $realtime = Analytics::getRealtime(
                period: Period::create(Carbon::today(), Carbon::today()),
                metrics: ['activeUsers']
            );

            return $realtime['activeUsers'] ?? 0;

        });
    }
}