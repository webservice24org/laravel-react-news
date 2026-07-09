<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\UserProfile;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver; 


class UserController extends Controller
{
 /*   public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::with('roles')->get(),
            'roles' => Role::all(),
        ]);
    }*/

    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::with([
                'roles',
                'profile'
            ])->get(),

            'roles' => Role::all(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string',
            'email'         => 'required|email|unique:users',
            'password'      => 'required|min:8',
            'role'          => 'required',
            'is_active'     => 'boolean',
            'profile_photo' => 'nullable|image|max:5120',
        ]);

        $user = User::create([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'password'  => bcrypt($data['password']),
            'is_active' => $data['is_active'] ?? true,
        ]);

        $user->assignRole($data['role']);

        $profilePhoto = null;

        if ($request->hasFile('profile_photo')) {

            $manager = new ImageManager(new Driver());

            $image = $manager
                ->read($request->file('profile_photo'))
                ->toWebp(80);

            $path = 'profile_photos/' . uniqid() . '.webp';

            Storage::disk('public')->put(
                $path,
                (string) $image
            );

            $profilePhoto = $path;
        }

        UserProfile::create([
            'user_id'       => $user->id,
            'profile_photo' => $profilePhoto,
        ]);

        return back()->with('success', 'User created successfully');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'          => 'required|string',
            'email'         => 'required|email|unique:users,email,' . $user->id,
            'role'          => 'required',
            'is_active'     => 'boolean',
            'profile_photo' => 'nullable|image|max:5120',
        ]);

        $user->update([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        $user->syncRoles([$data['role']]);

        $profile = UserProfile::firstOrCreate(
            ['user_id' => $user->id]
        );

        if ($request->hasFile('profile_photo')) {

            if ($profile->profile_photo) {
                Storage::disk('public')->delete(
                    $profile->profile_photo
                );
            }

            $manager = new ImageManager(new Driver());

            $image = $manager
                ->read($request->file('profile_photo'))
                ->toWebp(80);

            $path = 'profile_photos/' . uniqid() . '.webp';

            Storage::disk('public')->put(
                $path,
                (string) $image
            );

            $profile->update([
                'profile_photo' => $path,
            ]);
        }

        return back()->with('success', 'User updated successfully');
    }

    public function toggleStatus(User $user)
    {
        $user->update([
            'is_active' => ! $user->is_active,
        ]);

        return back()->with('success', 'User status updated.');
    }

    public function editDetails(Request $request)
    {
        $user = $request->user()->load('profile');

        // 🔍 TEMP DEBUG
        dd($user->profile);

        return Inertia::render('user/details', [
            'auth' => [
                'user' => $user,
            ],
        ]);
    }


    public function updateDetails(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'profile_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'address' => ['nullable', 'string', 'max:255'],
            'about' => ['nullable', 'string'],
            'dob' => ['nullable', 'date'],
            'nid_number' => ['nullable', 'string', 'max:50'],
            'mobile_number' => ['nullable', 'string', 'max:20'],
        ]);

        if ($request->hasFile('profile_photo')) {
            // 🔹 Only delete old photo if a new one is uploaded
            if ($user->profile?->profile_photo) {
                Storage::disk('public')->delete($user->profile->profile_photo);
            }

            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('profile_photo'));

            // 🔥 Compress + convert to webp
            $image = $image->toWebp(80);

            $path = 'profile_photos/' . uniqid() . '.webp';
            Storage::disk('public')->put($path, (string) $image);

            $validated['profile_photo'] = $path;
        } else {
            // 🔹 Keep old photo path if no new photo uploaded
            $validated['profile_photo'] = $user->profile?->profile_photo ?? null;
        }

        UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return redirect()->back()->with('success', 'Profile details updated');
    }

    public function userProfileView($id)
    {
        // Eager load the user's profile
        $user = User::with('profile', 'roles')->findOrFail($id);

        return Inertia::render('Users/UserProfileView', [
            'user' => $user,
        ]);
    }


    public function destroy(User $user)
    {
        $user->delete();

        return back()->with('success', 'User deleted successfully!');
    }


}