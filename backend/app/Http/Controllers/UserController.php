<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('employee')->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:50|unique:users',
            'email' => 'required|email|max:100|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,user',
            'status' => 'required|in:active,inactive,suspended',
            'employee_id' => 'nullable|integer|exists:employees,employee_id',
        ]);

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
            'status' => $request->status,
            'employee_id' => $request->employee_id,
        ]);

        return response()->json($user->load('employee'), 201);
    }

    public function show(int $id)
    {
        $user = User::with('employee')->findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'username' => "required|string|max:50|unique:users,username,{$id},user_id",
            'email' => "required|email|max:100|unique:users,email,{$id},user_id",
            'role' => 'required|in:admin,user',
            'status' => 'required|in:active,inactive,suspended',
            'employee_id' => 'nullable|integer|exists:employees,employee_id',
            'password' => 'nullable|string|min:6',
        ]);

        $data = $request->only(['username', 'email', 'role', 'status', 'employee_id']);
        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $user->update($data);
        return response()->json($user->load('employee'));
    }

    public function destroy(int $id)
    {
        $user = User::findOrFail($id);

        if ($user->user_id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete your own account'], 422);
        }

        $user->update(['status' => 'inactive']);
        return response()->json(['message' => 'User deactivated successfully']);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'email' => "required|email|max:100|unique:users,email,{$user->user_id},user_id",
            'username' => "required|string|max:50|unique:users,username,{$user->user_id},user_id",
        ]);

        $user->update($request->only(['email', 'username']));
        return response()->json($user->load('employee'));
    }
}
