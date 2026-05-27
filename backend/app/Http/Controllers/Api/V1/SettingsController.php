<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class SettingsController extends Controller
{
    use ApiResponse;

    public function profile(Request $request)
    {
        return $this->success($request->user(), 'Profile retrieved');
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'username' => 'sometimes|required|string|max:255|unique:users,username,' . $request->user()->id,
            'avatar' => 'nullable|string',
        ]);

        $request->user()->update($validated);

        return $this->success($request->user(), 'Profile updated');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return $this->success(null, 'Password updated');
    }
}
