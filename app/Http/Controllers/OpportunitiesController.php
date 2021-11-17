<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Opportunities;
use App\Models\OpportunitiesAppliedBy;
use App\Models\Subscriptions;
class OpportunitiesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request['user_id'] = auth()->user()->id;
        $opportunity = Opportunities::create($request->all());
        return $opportunity;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $opportunity = Opportunities::find($request->id);

        //check if player has applied to this opportunity
        $applied = OpportunitiesAppliedBy::where('player_id','=',$request->user_id)->where('opportunity_id','=',$request->id)->get()->first();
        if($applied){
            $opportunity['applied'] = true;

        }else{
            $opportunity['applied'] = false;
        }
        if(auth()->user()->user_type == 'admin'){
            $submissions = OpportunitiesAppliedBy::where('opportunity_id',$opportunity->id)
            ->leftJoin('users','users.id','opportunities_applied_bies.player_id')
            ->select('users.first_name','users.last_name','users.user_type','users.last_active','users.id as user_id','users.blocked','blocked','opportunities_applied_bies.created_at as date_applied')
            ->get();

            $results = array();
            foreach ($submissions as $user) {
                $data = array();
                $data['name'] = $user->first_name.' '.$user->last_name;
                $data['date_applied']=$user->date_applied;
                $data['id']=$user->user_id;
                $data['role']=$user->user_type;

                $premiumSub = Subscriptions::Where('service_id',2)
                ->where('user_id',$user->user_id)->get()->first();
                if($premiumSub){
                    $data['subscription'] = 'Premium';
                }else{
                    $data['subscription'] = 'Basic';
                }

                if($user->service_name==null){
                    $data['subscription'] = 'None';
                }


                array_push($results, $data);
            }

           $opportunity['submissions'] = $results;
        }
        return $opportunity;
    }

     /**
     * Display the specified resource.
     * @return \Illuminate\Http\Response
     */
    public function showAll(Request $request)
    {
         if($request->user_type == "club_official"){
            $opportunities = Opportunities::where('user_id','=',auth()->user()->id)->orderBy('id', 'desc')->paginate(12);
         }else{
            $opportunities = Opportunities::where('status','=','open')->orderBy('id', 'desc')->paginate(12);
        }
        return $opportunities;
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
        $opportunity = Opportunities::find($request->id);
        $opportunity->update($request->all());
        return response($opportunity,200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $res = Opportunities::find($request->id)->delete();
        if ($res){
            $data=[
            'status'=>'1',
            'msg'=>'success'
          ];
        }else{
            $data=[
            'status'=>'0',
            'msg'=>'fail'
          ];
        }
        return $data;
    }

    public function getAdminOpportunities(Request $request)
    {
         if($request->user_type == "club_official"){
            $opportunities = Opportunities::where('user_id','=',auth()->user()->id)->orderBy('id', 'desc')->get();
         }else{
            $opportunities = Opportunities::where('status','=','open')->orderBy('id', 'desc')->get();
        }

        $results = array();
        foreach ($opportunities as $opportunity) {
            $data = array();
            $date = $opportunity->created_at;
            $data['title'] = $opportunity->title;
            $data['date_created']=date('d M, Y',strtotime($date));
            $data['submissions'] = OpportunitiesAppliedBy::where('opportunity_id',$opportunity->id)->count();
            $data['id'] = $opportunity->id;
            array_push($results, $data);
        }

        return $results;
    }
}
