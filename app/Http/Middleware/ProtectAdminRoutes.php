<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ProtectAdminRoutes
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if(auth()->user()->user_type != 'admin'){
            return redirect(route('header_token'));
        }else{
            return $next($request);
        }
    }
}
