<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\SubCategoryController;
use App\Http\Controllers\Admin\DivisionController;
use App\Http\Controllers\Admin\DistrictController;
use App\Http\Controllers\Admin\UpazilaController;
use App\Http\Controllers\Admin\UnionController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\NewsPostController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Admin\HomeSectionController;
use App\Http\Controllers\Admin\AuthorAnalyticsController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\LogoController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\OfficeInfoController;
use App\Http\Controllers\Admin\SocialConnectionController;
use App\Http\Controllers\Admin\AnalyticsConfigController;
use App\Http\Controllers\Admin\AnalyticsDashboardController;
use App\Http\Controllers\Admin\MailConfigController;
use App\Http\Controllers\Admin\FallbackImageController;
use App\Http\Controllers\Admin\AdvertisementAssignmentController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\FrontendSettingController;

use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\FrontendController;
use App\Http\Controllers\Frontend\SectionController;
use App\Http\Controllers\Frontend\SearchController;
use App\Http\Controllers\Frontend\ArchiveController;
use FontLib\Font;
use Dompdf\Options;

use App\Models\Page;




Route::get('/', [HomeController::class, 'index'])->name('home');




Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth'])->group(function () {

    Route::middleware('role:Admin')->prefix('admin/')->name('admin.')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::post('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::get('users/{id}/view', [UserController::class, 'userProfileView'])->name('users.view');

        /** Category Management */
        Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
        Route::patch('categories/{category}/toggle-status', [CategoryController::class, 'toggleStatus'])->name('categories.toggle-status');
        Route::post('categories/bulk-delete',[CategoryController::class, 'bulkDelete'])->name('categories.bulk-delete');

        /** Sub Category Management */

        Route::get('sub-categories', [SubCategoryController::class, 'index'])->name('subcategories.index');
        Route::post('sub-categories', [SubCategoryController::class, 'store'])->name('subcategories.store');
        Route::put('sub-categories/{subCategory}', [SubCategoryController::class, 'update'])->name('subcategories.update');
        Route::delete('sub-categories/{subCategory}', [SubCategoryController::class, 'destroy'])->name('subcategories.destroy');
        Route::patch('sub-categories/{subCategory}/toggle-status', [SubCategoryController::class, 'toggleStatus'])->name('subcategories.toggle-status');
        Route::post('sub-categories/bulk-delete', [SubCategoryController::class, 'bulkDestroy'])->name('subcategories.bulk-delete');

        /** Division Management */
        Route::get('divisions', [DivisionController::class, 'index'])->name('divisions.index');
        Route::post('divisions', [DivisionController::class, 'store'])->name('divisions.store');
        Route::put('divisions/{division}', [DivisionController::class, 'update'])->name('divisions.update');
        Route::delete('divisions/{division}', [DivisionController::class, 'destroy'])->name('divisions.destroy');
        Route::patch('divisions/{division}/toggle-status', [DivisionController::class, 'toggleStatus'])->name('divisions.toggle-status');
        Route::post('divisions/bulk-delete', [DivisionController::class, 'bulkDestroy'])->name('divisions.bulk-delete');

        /** District Management */

        Route::get('districts', [DistrictController::class, 'index'])->name('districts.index');
        Route::post('districts', [DistrictController::class, 'store'])->name('districts.store');
        Route::put('districts/{district}', [DistrictController::class, 'update'])->name('districts.update');
        Route::delete('districts/{district}', [DistrictController::class, 'destroy'])->name('districts.destroy');
        Route::patch('districts/{district}/toggle-status', [DistrictController::class, 'toggleStatus'])->name('districts.toggle-status');
        Route::post('districts/bulk-delete', [DistrictController::class, 'bulkDestroy'])->name('districts.bulk-delete');

        /** Upazila Management */
        Route::get('upazilas', [UpazilaController::class, 'index'])->name('upazilas.index');
        Route::post('upazilas', [UpazilaController::class, 'store'])->name('upazilas.store');
        Route::put('upazilas/{upazila}', [UpazilaController::class, 'update'])->name('upazilas.update');
        Route::delete('upazilas/{upazila}', [UpazilaController::class, 'destroy'])->name('upazilas.destroy');
        Route::patch('upazilas/{upazila}/toggle-status', [UpazilaController::class, 'toggleStatus'])->name('upazilas.toggle-status');
        Route::post('upazilas/bulk-delete', [UpazilaController::class, 'bulkDestroy'])->name('upazilas.bulk-delete');

        /** Union Management */
        Route::get('unions', [UnionController::class, 'index'])->name('unions.index');
        Route::post('unions', [UnionController::class, 'store'])->name('unions.store');
        Route::put('unions/{union}', [UnionController::class, 'update'])->name('unions.update');
        Route::delete('unions/{union}', [UnionController::class, 'destroy'])->name('unions.destroy');
        Route::patch('unions/{union}/toggle-status', [UnionController::class, 'toggleStatus'])->name('unions.toggle-status');
        Route::post('unions/bulk-delete', [UnionController::class, 'bulkDestroy'])->name('unions.bulk-delete');

        /** Tag Management */
        Route::get('tags', [TagController::class, 'index'])->name('tags.index');
        Route::post('tags', [TagController::class, 'store'])->name('tags.store');
        Route::put('tags/{tag}', [TagController::class, 'update'])->name('tags.update');
        Route::delete('tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');
        Route::post('tags/bulk-delete', [TagController::class, 'bulkDestroy'])->name('tags.bulk-delete');

        /** News Post  */
        Route::get('news-posts', [NewsPostController::class, 'index'])->name('news-posts.index');
        Route::get('news-posts/create', [NewsPostController::class, 'create'])->name('news-posts.create');
        Route::post('news-posts', [NewsPostController::class, 'store'])->name('news-posts.store');

        Route::post('news-posts/bulk-destroy', [NewsPostController::class, 'bulkDestroy'])->name('news-posts.bulk-destroy');

        Route::get('news-posts/{newsPost}/edit', [NewsPostController::class, 'edit'])->name('news-posts.edit');
        Route::post('news-posts/{newsPost}', [NewsPostController::class, 'update'])->name('news-posts.update');
        Route::delete('news-posts/{newsPost}', [NewsPostController::class, 'destroy'])->name('news-posts.destroy');
        Route::patch('news-posts/{newsPost}/toggle-status', [NewsPostController::class, 'toggleStatus'])->name('news-posts.toggle-status');


        Route::post('uploads/images', [UploadController::class, 'image'])->name('uploads.images');
        Route::delete('uploads/images', [UploadController::class, 'destroyImage'])->name('uploads.images.destroy');


         Route::get('homepage-builder', [HomeSectionController::class, 'index'])
        ->name('homepage-builder');

        Route::post('homepage-builder', [HomeSectionController::class, 'store'])
            ->name('homepage-builder.store');

        Route::put('homepage-builder/{homepage_builder}', [HomeSectionController::class, 'update'])
            ->name('homepage-builder.update');

        Route::delete('homepage-builder/{homepage_builder}', [HomeSectionController::class, 'destroy'])
            ->name('homepage-builder.destroy');

        Route::post('homepage-builder/order', [HomeSectionController::class, 'updateOrder'])
            ->name('homepage-builder.order');

        Route::put('homepage-builder/{section}/status', [HomeSectionController::class, 'updateStatus'])
            ->name('homepage-builder.status');



        Route::get('authors/analytics', [AuthorAnalyticsController::class, 'analyticsDashboard'])->name('authors.analytics');

        Route::get('menus', [MenuController::class,'index'])->name('menus');
        Route::post('menus', [MenuController::class,'store'])->name('menus.store');
        Route::post('menus/order',[MenuController::class,'order'])->name('menus.order');
        Route::delete('menus/{id}', [MenuController::class, 'destroy'])->name('menus.destroy');


        Route::get('logos', [LogoController::class, 'index'])->name('logos.index');
        Route::post('logos', [LogoController::class, 'store'])->name('logos.store');
       
        Route::get('settings', [SettingController::class,'index'])->name('settings.index');
        Route::post('settings', [SettingController::class,'store'])->name('settings.store');

        Route::get('frontend-settings', [FrontendSettingController::class, 'edit'])->name('frontend-settings.edit');

        Route::post('frontend-settings',[FrontendSettingController::class, 'update'])->name('frontend-settings.update');

        Route::get('office-info', [OfficeInfoController::class, 'index'])->name('office-info.index');
        Route::post('office-info', [OfficeInfoController::class, 'store'])->name('office-info.store');

        Route::get('social-connections', [SocialConnectionController::class,'index'])->name('social-connections.index');
        Route::post('social-connections', [SocialConnectionController::class,'store'])->name('social-connections.store');

        Route::get('analytics-config', [AnalyticsConfigController::class,'index'])->name('analytics-config.index');
        Route::post('analytics-config', [AnalyticsConfigController::class,'store'])->name('analytics-config.store');

        Route::get('analytics-dashboard',[AnalyticsDashboardController::class,'analytics'])->name('analytics.dashboard');
        Route::get('pro-analytics-dashboard',[AnalyticsDashboardController::class,'index'])->name('pro.analytics.dashboard');

        Route::get('mail-config', [MailConfigController::class, 'index'])->name('mail-config.index');
        Route::post('mail-config', [MailConfigController::class, 'store'])->name('mail-config.store');

        Route::get('fallback-image', [FallbackImageController::class, 'index'])->name('fallback-image.index');
        Route::post('fallback-image', [FallbackImageController::class, 'store'])->name('fallback-image.store');
        
        Route::get('advertisements', [AdvertisementAssignmentController::class, 'index'])->name('advertisements.index');
        Route::get('advertisements/create', [AdvertisementAssignmentController::class, 'create'])->name('advertisements.create');
        Route::post('advertisements/store', [AdvertisementAssignmentController::class, 'store'])->name('advertisements.store');
        Route::get('advertisements/{advertisement}/edit', [AdvertisementAssignmentController::class,'edit'])->name('advertisements.edit');
        Route::post('advertisements/{advertisement}/update',[AdvertisementAssignmentController::class,'update'])->name('advertisements.update');
        Route::patch('advertisements/{advertisement}/toggle-status',[AdvertisementAssignmentController::class, 'toggleStatus'])->name('advertisements.toggleStatus');
        Route::delete('advertisements/{advertisement}', [AdvertisementAssignmentController::class, 'destroy'])->name('advertisements.destroy');

        Route::get('pages', [PageController::class, 'index'])->name('pages.index');
        Route::get('pages/create', [PageController::class, 'create'])->name('pages.create');
        Route::post('pages', [PageController::class, 'store'])->name('pages.store');
        Route::get('pages/{page}/edit', [PageController::class, 'edit'])->name('pages.edit');
        Route::post('pages/{page}', [PageController::class, 'update'])->name('pages.update');
        Route::delete('pages/{page}', [PageController::class, 'destroy'])->name('pages.destroy');

    });

    Route::get('/user/details', [UserController::class, 'editDetails'])->name('profile.details.edit');
    Route::post('/user/details', [UserController::class, 'updateDetails'])->name('profile.details.update');


    Route::get('/api/category-news', [SectionController::class, 'getCategoryNews']);

    

    

});

    Route::get('/news/{newsPost:slug}', [FrontendController::class, 'show'])
        ->name('news.show');

    Route::get('/news/{slug}/download', [FrontendController::class, 'downloadPdf'])
        ->name('news.download');

    Route::get('/category/{slug}', [FrontendController::class, 'category'])
        ->name('category.show');

    Route::get('/category/{categorySlug}/{subSlug}', [FrontendController::class, 'subCategory'])
        ->name('subcategory.show');

    Route::get('/author/{id}', [FrontendController::class, 'author'])
        ->name('author.show');

    Route::get('/top-writers', [FrontendController::class, 'topWriters'])
        ->name('author.top');



    /*
    |--------------------------------------------------------------------------
    | Search Routes
    |--------------------------------------------------------------------------
    */

    Route::get('/search', [SearchController::class, 'index'])
        ->name('search');

    Route::get('/search/suggestions', [SearchController::class, 'suggestions'])
        ->name('search.suggestions');

    Route::get('/archive/{date}', [ArchiveController::class, 'showArchiveByDate'])
    ->name('archive.show');

    

    

    /*
    |--------------------------------------------------------------------------
    | CMS Pages (KEEP THIS LAST)
    |--------------------------------------------------------------------------
    */

    Route::get('/{slug}', [PageController::class, 'show'])
        ->name('page.show');

require __DIR__.'/settings.php';
