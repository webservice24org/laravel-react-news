<?php

use App\Http\Controllers\Api\AdvertisingController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DistrictController;
use App\Http\Controllers\Api\DivisionController;
use App\Http\Controllers\Api\FooterInfoController;
use App\Http\Controllers\Api\HeaderInfoController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\SubCategoryController;
use App\Http\Controllers\Api\SubMenuController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\VideoNewsController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\PermissionController;
use App\Http\Controllers\Auth\RoleController;
use App\Http\Controllers\Api\FrontEndDisplayController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth',
],function($router){
    Route::get('/index', [AuthController::class, 'index']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/show/{id}', [AuthController::class, 'show']);
    Route::put('/register/{id}', [AuthController::class, 'update']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::get('/profile', [AuthController::class, 'profile'])->middleware('auth:api');
});
Route::put('/user/block-unblock/{id}', [AuthController::class, 'blockUnblock']);
Route::get('/user/roles-permissions', [AuthController::class, 'getUserWithRoleAndPermissions']);
Route::apiResource('/permissions', PermissionController::class);
Route::apiResource('/roles', RoleController::class);

//Route::get('all-permissions', [RoleController::class, 'getAllPermissions']);

Route::get('roles/{roleId}/permissions', [RoleController::class, 'getRolePermissions']);
Route::post('roles/{roleId}/permissions', [RoleController::class, 'assignPermissionsToRole']);

Route::apiResource('/divisions', DivisionController::class);
Route::apiResource('/districts', DistrictController::class);
Route::apiResource('/categories', CategoryController::class);
Route::apiResource('/sub-categories', SubCategoryController::class);
Route::apiResource('/posts', PostController::class);
Route::post('/update/{id}', [PostController::class, 'updatePost']);
Route::post('/posts/{id}/increment-view-count', [PostController::class, 'incrementViewCount']);

//Route::get('/post-list', [PostController::class, 'postList']);

Route::apiResource('/tags', TagController::class);



Route::get('/latest-posts', [FrontEndDisplayController::class, 'getLatestPosts']);
Route::get('/most-viewed-posts', [FrontEndDisplayController::class, 'mostViewedPosts']);


Route::get('/lead-post', [FrontEndDisplayController::class, 'getLeadPost']);
Route::get('/lead-posts', [FrontEndDisplayController::class, 'getLeadPostsExceptLatest']);

Route::get('/posts/category/{categoryId}', [FrontEndDisplayController::class, 'getPostsByCategory']);
Route::get('/posts/category/{categoryId}/subcategory/{subcatId}', [FrontEndDisplayController::class, 'getPostsBySubCategories']);
Route::get('/posts-by-category', [FrontEndDisplayController::class, 'getPostsByIndividualCategory']);
Route::get('/posts-by-subcategory', [FrontEndDisplayController::class, 'getPostsByIndividualSubCategory']);

Route::get('/categories/{categoryId}/subcategories', [CategoryController::class, 'getCategoryWithSubCategories']);

Route::get('/division-news/{divisionId}', [FrontEndDisplayController::class, 'getDivisionWiseNews']);

Route::get('/division/{divisionId}/districts', [DistrictController::class, 'getDistrictsByDivision']);

Route::get('/district-news/{districtId}', [FrontEndDisplayController::class, 'getDistrictWiseNews']);

Route::apiResource('/footer-infos', FooterInfoController::class);
Route::post('/footer-infos-update/{id}', [FooterInfoController::class, 'updateData']);

Route::apiResource('/header-data', HeaderInfoController::class);
Route::post('/header-data-update/{id}', [HeaderInfoController::class, 'updateData']);

Route::apiResource('/video-news', VideoNewsController::class);
Route::post('/video-news/{id}', [VideoNewsController::class, 'updateVideo']);
Route::get('/top-videos', [VideoNewsController::class, 'topVideos']);

Route::apiResource('/advertising', AdvertisingController::class);
Route::post('/advertising/{id}', [AdvertisingController::class, 'updateAdvert']);
Route::apiResource('/menu', MenuController::class);
Route::resource('/sub-menu', controller: SubMenuController::class);

Route::get('/menu/{menu}/sub-menus', [SubMenuController::class, 'getSubMenusByMenu']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
