import { createState } from '@hookstate/core';
import {get} from '../../../services/api';
import {Convert} from '../../../models/dashbaord_model';

export const dashboardState = createState({
   users:"0",
   premiumSubscriptions:"0",
   profileViews:"0",
   paidUers:"[]",
   normalUsers:"[]"
})

export async function getData(){
    try{
        var responseData = await get('/dashboard');
        if(responseData['status']==='success'){
            var dashboardModel = Convert.toDashboardModel(JSON.stringify(responseData));
            dashboardState.users.set(dashboardModel.data.users)
            dashboardState.premiumSubscriptions.set(dashboardModel.data.premiumSubscriptions)
            dashboardState.profileViews.set(dashboardModel.data.profileViews)
            dashboardState.paidUers.set(JSON.stringify(dashboardModel.data!.paidUsers))
            dashboardState.normalUsers.set(JSON.stringify(dashboardModel.data!.normalUsers))
        }
    }catch(e){
        console.log(e);
    }
}
