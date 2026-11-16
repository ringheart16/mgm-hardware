<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::all();
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.setting_id' => 'required|exists:system_settings,setting_id',
            'settings.*.setting_value' => 'required|string|max:255',
        ]);

        foreach ($request->settings as $setting) {
            SystemSetting::where('setting_id', $setting['setting_id'])
                ->update(['setting_value' => $setting['setting_value']]);
        }

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => SystemSetting::all(),
        ]);
    }
}
