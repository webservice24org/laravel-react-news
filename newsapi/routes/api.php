<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DistrictController;
use App\Http\Controllers\Api\DivisionController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\SubCategoryController;
use App\Http\Controllers\Api\TagController;
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

Route::get('/post-list', [PostController::class, 'postList']);

Route::apiResource('/tags', TagController::class);


// Api for front end display posts


Route::get('/lead-post', [FrontEndDisplayController::class, 'getLeadPost']);
Route::get('/lead-posts', [FrontEndDisplayController::class, 'getLeadPostsExceptLatest']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
