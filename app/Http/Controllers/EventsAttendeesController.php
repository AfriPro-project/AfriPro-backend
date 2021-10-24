<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventAttendees;
use App\Http\Controllers\EventsController;

class EventsAttendeesController extends Controller
{
     /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
            EventAttendees::create([
                'user_id'=>$request->user_id,
                'event_id'=>$request->id
            ]);
            $event = new EventsController();
            $event = $event->show($request);
            return $event;

    }

}
