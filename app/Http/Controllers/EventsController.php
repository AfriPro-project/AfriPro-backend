<?php

namespace App\Http\Controllers;

use App\Models\EventAttendees;
use Illuminate\Http\Request;
use App\Models\Events;
use Illuminate\Support\Facades\DB;


class EventsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $event = Events::create($request->all());
        return $event;
    }

    /**
     * Display the specified resource.
     * @return \Illuminate\Http\Response
     */
    public function showAll(Request $request)
    {

        if($request->upcoming){
            $events = Events::where('start_date_time','>',date('Y-m-d h:i'))->orderBy('id', 'desc')->paginate(12);
        }else{
            $events = Events::where('id','!=',null)->orderBy('id', 'desc')->paginate(12);
        }

        return $events;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $event = Events::find($request->id);
        $event['attendees'] = EventAttendees::where('event_id','=',$request->id)
        ->leftJoin('users','event_attendees.user_id','users.id')
        ->get();
        return $event;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
      $event = Events::find($request->id);
      $event->update($request->all());
      return ["status"=>"success","message"=>"done"];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
      $event = Events::find($request->id);
      $event->delete();
      return ["status"=>"success","message"=>"done"];
    }

    public function fetchEventsForAdmin()
    {
       $events = Events::select('events.title',DB::raw('date_format(events.start_date_time, \'%d-%b-%Y %h:%i\') as start_date_time'),'events.id',DB::raw('count(event_attendees.id) as attendees'))
       ->leftJoin('event_attendees','events.id','event_attendees.event_id')
       ->where('events.id','!=',0)
       ->orderBy('events.id','desc')
       ->groupBy('events.id')
       ->get();


       return $events;
    }


}
