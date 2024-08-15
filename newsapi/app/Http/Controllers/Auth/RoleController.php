<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{

    public function index()
    {
        $roles = Role::all();
        return response()->json(['success' => true, 'data' => $roles, 'message' => 'Roles retrieved successfully.']);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles',
        ]);

        $role = Role::create(['name' => $request->name]);

        return response()->json(['success' => true, 'data' => $role, 'message' => 'Role created successfully.']);
    }


    public function show(string $id)
    {
        $role = Role::findById($id);

        if (!$role) {
            return response()->json(['success' => false, 'message' => 'Role not found.'], 404);
        }

        return response()->json(['success' => true, 'data' => $role, 'message' => 'Role retrieved successfully.']);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
        ]);

        $role = Role::findById($id);
        if (!$role) {
            return response()->json(['success' => false, 'message' => 'Role not found.'], 404);
        }

        $role->name = $request->name;
        $role->save();

        return response()->json(['success' => true, 'data' => $role, 'message' => 'Role updated successfully.']);
    }

    public function destroy(string $id)
    {
        $role = Role::findById($id);

        if (!$role) {
            return response()->json(['success' => false, 'message' => 'Role not found.'], 404);
        }

        $role->delete();

        return response()->json(['success' => true, 'message' => 'Role deleted successfully.']);
    }

    public function getRolePermissions($roleId)
    {
        $role = Role::findById($roleId);
        if (!$role) {
            return response()->json(['success' => false, 'message' => 'Role not found.'], 404);
        }

        $assignedPermissions = $role->permissions()->pluck('id')->toArray();
        $allPermissions = Permission::all();

        return response()->json([
            'success' => true,
            'data' => [
                'assigned_permissions' => $assignedPermissions,
                'all_permissions' => $allPermissions,
            ]
        ]);
    }


       //  public function getAllPermissions()
       // {
       //     $permissions = Permission::all();

      //      return response()->json(['success' => true, 'data' => $permissions, 'message' => 'Permissions retrieved successfully.']);
      //  }



    public function assignPermissionsToRole(Request $request, $roleId)
    {
        $request->validate([
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        $role = Role::findById($roleId);
        if (!$role) {
            return response()->json(['success' => false, 'message' => 'Role not found.'], 404);
        }

        $permissions = Permission::whereIn('id', $request->permission_ids)->get();

        $role->syncPermissions($permissions);

        return response()->json(['success' => true, 'message' => 'Permissions assigned successfully.']);
    }

}
