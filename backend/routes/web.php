<?php

use Illuminate\Support\Facades\Route;

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Single Page Application (SPA) catch-all route for frontend
Route::get('/{any?}', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath);
    }
    return response()->json([
        'status' => 'online',
        'app' => 'MGM Hardware Management System API',
        'health' => '/health',
        'api' => '/api',
    ]);
})->where('any', '^(?!api).*$');

