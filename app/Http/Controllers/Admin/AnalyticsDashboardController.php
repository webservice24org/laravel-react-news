<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AnalyticsService;
use Inertia\Inertia;

class AnalyticsDashboardController extends Controller
{
   public function index(AnalyticsService $analytics)
    {
        $data = $analytics->getProDashboard();

        $activeUsers = $analytics->getRealtimeUsers();

        return Inertia::render('Admin/AnalyticsConfig/ProDashboard',[
            ...$data,
            'activeUsers'=>$activeUsers
        ]);
    }
    
    public function analytics(AnalyticsService $analytics)
    {
        $data = $analytics->getDashboardData();

        $activeUsers = $analytics->getRealtimeUsers();

        return Inertia::render('Admin/AnalyticsConfig/Dashboard',[
            ...$data,
            'activeUsers'=>$activeUsers
        ]);
    }






 }

