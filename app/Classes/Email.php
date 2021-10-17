<?php
namespace App\Classes;
use Illuminate\Support\Facades\Mail;

class Email{
    public $template;
    public $email_data;
    public $subject;
    public $from;

    function __construct($template, $email_data, $subject, $from){
        $this->template = $template;
        $this->email_data = $email_data;
        $this->subject = $subject;
        $this->from = $from;
    }

  public function send(){
    $email_data = $this->email_data;
    $subject = $this->subject;
    $from = $this->from;
    try{
        Mail::send($this->template, $this->email_data, function ($message) use ($email_data, $subject, $from) {
            $message->to($email_data['email'], $email_data['name'])
                ->subject($subject)
                ->from($from, 'AfriPro');
        });
    }catch (\Exception $e) {

    }
  }
}
