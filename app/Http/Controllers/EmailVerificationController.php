<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Verification_tokens;


class EmailVerificationController extends Controller
{


    public function verify(Request $request){
        return 'Hello world'.$request->email;
    }
}
