<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventAttendees;
use App\Http\Controllers\EventsController;
use App\Classes\Email;
use App\Models\User;


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

            $user  = User::find($request->user_id);
            // send email with the template
            $template = 'emails.email_template';
            // email data

            $body = '
            Hello '.$user->first_name.',<br/>
            you are invited to the '.$event->title.',
            Please find the event details below <br>
            Venue: <b>'.$event->venue.'</b><br/>
            From <b>'.date('M d, Y H:i A',strtotime($event->start_date_time)).'</b> to <b>'.date('M d, Y H:i A',strtotime($event->end_date_time)).'</b><br/>
            ';
            if($event->online_link != ''){
                $body .= 'Via: <b><a href="'.$event->online_link.'">'.$event->online_link.'</a></b>';
            }
            $body .= $event->about_event;

            $email_data = array(
                'email' => $user->email,
                'name'=>$user->first_name,
                'title' => $event->title,
                'body' => $body
            );

            $mailer = new Email(
                $template,
                $email_data,
                'Invitation to '.$event->title,
                'event@afri.pro'
            );
            $mailer->send();
            return $event;

    }

}
