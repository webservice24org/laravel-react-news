<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Spatie\Permission\Models\Role; 

class AuthController extends BaseController
{
    public function index(){
        $users = User::all();
        return response()->json(['success' => true, 'data' => $users, 'message' => 'User retrieved successfully.']);
    }
    public function register(Request $request) 
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:50|unique:users',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|string|min:8|same:password',
            'role_id' => 'required|exists:roles,id', 
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $input = $request->all();
        $input['password'] = Hash::make($input['password']);
        $user = User::create($input);

        $role = Role::findById($request->role_id);
        if ($role) {
            $user->assignRole($role);
        } else {
            return $this->sendError('Role not found', [], 404);
        }

        $success['token'] = $user->createToken('NewsUser')->accessToken;
        $success['user'] = $user;

        return $this->sendResponse($success, 'User registered successfully.');
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->sendError('User not found', [], 404);
        }

        $roles = $user->roles;

        $data = [
            'user' => $user,
            'roles' => $roles
        ];
        return $this->sendResponse($data, 'User retrieved successfully.');
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|string|email|max:50|unique:users,email,' . $request->id,
            'password' => 'sometimes|nullable|string|min:8',
            'password_confirmation' => 'sometimes|nullable|string|min:8|same:password',
            'role_id' => 'sometimes|exists:roles,id', 
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $user = User::find($request->id);

        if (!$user) {
            return $this->sendError('User not found', [], 404);
        }

        $input = $request->all();

        if ($request->has('password')) {
            $input['password'] = Hash::make($input['password']);
        } else {
            unset($input['password']);
        }

        $user->update($input);

        if ($request->has('role_id')) {
            $role = Role::findById($request->role_id);
            if ($role) {
                $user->syncRoles([$role]);
            } else {
                return $this->sendError('Role not found', [], 404);
            }
        }

        $success['user'] = $user;

        return $this->sendResponse($success, 'User updated successfully.');
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }

        if ($user->blocked) {
            return response()->json(['message' => 'Your account is blocked. Please contact support.'], 403);
        }

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 200);
    }

    public function logout(Request $request)
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'User successfully logged out']);
    }

    public function refresh() {}
    public function profile() {
        if (!auth()->check()) {
            return $this->sendError('Unauthenticated.', ['error' => 'User not logged in'], 401);
        }
    
        $success = auth()->user();
        return $this->sendResponse($success, 'User fetched successfully.');
    }

    public function getUserWithRoleAndPermissions()
    {

        $users = User::with('roles.permissions')->get();

        if ($users->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'No users found.'], 404);
        }

        $data = $users->map(function ($user) {
            $roles = $user->roles;
            $permissions = $roles->flatMap(function ($role) {
                return $role->permissions;
            })->unique('id');

            return [
                'user' => $user,
                'roles' => $roles,
                'permissions' => $permissions,
            ];
        });

        return response()->json(['success' => true, 'data' => $data, 'message' => 'Users retrieved successfully.']);
    }

    public function blockUnblock(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->blocked = $request->input('blocked');
        $user->save();

        return response()->json(['success' => true, 'message' => 'User status updated successfully']);
    }


    
}
