<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAccountStatus
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && !$request->user()->isActive()) {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Your account has been deactivated. Please contact an administrator.'
            ], 403);
        }

        return $next($request);
    }
}
