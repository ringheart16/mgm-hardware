<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        $user = User::where('username', $request->username)
            ->orWhere('email', $request->username)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->isActive()) {
            throw ValidationException::withMessages([
                'username' => ['Your account has been deactivated. Contact an administrator.'],
            ]);
        }

        $expiration = $request->remember ? null : now()->addHours(8);
        $token = $user->createToken('auth-token', ['*'], $expiration)->plainTextToken;

        return response()->json([
            'user' => $user->load('employee'),
            'token' => $token,
            'message' => 'Login successful',
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:50|unique:users',
            'email' => 'required|email|max:100|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
        ]);

        // Create an employee record for the registered user
        $employee = \App\Models\Employee::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'position' => 'Staff',
            'department' => 'Sales',
            'phone' => '',
            'email' => $request->email,
        ]);

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => $request->password,
            'role' => 'user',
            'status' => 'active',
            'employee_id' => $employee->employee_id,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('employee'),
            'token' => $token,
            'message' => 'Account created successfully',
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->load('employee'));
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->update(['password' => $request->password]);

        return response()->json(['message' => 'Password changed successfully']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'If the email exists, a reset link has been sent.']);
        }

        // For simplicity, generate a temporary password
        $tempPassword = strtoupper(substr(md5(time()), 0, 8));
        $user->update(['password' => $tempPassword]);

        return response()->json([
            'message' => 'Temporary password generated.',
            'temp_password' => $tempPassword,
            'note' => 'Please change your password after logging in.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6|confirmed',
            'temp_password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->temp_password, $user->password)) {
            throw ValidationException::withMessages([
                'temp_password' => ['Invalid temporary password.'],
            ]);
        }

        $user->update(['password' => $request->password]);

        return response()->json(['message' => 'Password reset successfully. You may now log in.']);
    }
}
