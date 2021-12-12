<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscriptions;
use App\Http\Controllers\NotificationsController;
use Illuminate\Http\Request;

class SendSubscriptionNotice extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscription:notice';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(Request $request)
    {
        $users = Subscriptions::whereRaw("subscriptions.reminded is null and subscriptions.expiry >= CURDATE() and (subscriptions.expiry - curdate()) <= 7
        ")
        ->select('subscriptions.id as id','users.id as user_id','users.first_name as first_name','subscriptions.expiry as expiry','users.user_type as user_type','subscriptions.service_id as service_id')
        ->leftJoin('users','users.id','subscriptions.user_id')
        ->get();

        $notifcationsController = new NotificationsController();
        foreach ($users as $user) {
            if(($user->user_type == "player" && $user->service_id == "2") || ($user->user_type == "agent" && $user->service_id == "1")){
                $request['route'] = '/subscription_renew';
                $request['status'] = 'new';
                $request['user_id'] = $user->user_id;

                $request['message'] = "Hello ".$user->first_name.", your premium subscription is due and will expire on ".$user->expiry;

                $request->only(['message', 'route', 'status','user_id']);
                $notifcationsController->store($request);

                $subscription = Subscriptions::find($user->id);
                $subscription->update(['reminded'=>'true']);
            }
        }

        // info($users);
    }
}
