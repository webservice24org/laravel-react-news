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
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Admin\HomeSectionController;

use App\Http\Controllers\Frontend\SectionController;




Route::get('/', [HomeController::class, 'index'])->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function () {

    Route::middleware('role:Admin')->prefix('admin/')->name('admin.')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
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


        Route::get('homepage-builder', [HomeSectionController::class, 'index'])->name('homepage-builder');
        Route::post('homepage-builder/order', [HomeSectionController::class, 'updateOrder'])->name('homepage-builder.order');

        

    });

    Route::get('/user/details', [UserController::class, 'editDetails'])->name('profile.details.edit');
    Route::post('/user/details', [UserController::class, 'updateDetails'])->name('profile.details.update');


    Route::get('/api/category-news', [SectionController::class, 'getCategoryNews']);

    

});


require __DIR__.'/settings.php';
