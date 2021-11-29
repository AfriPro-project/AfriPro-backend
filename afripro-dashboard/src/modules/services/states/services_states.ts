import { createState } from '@hookstate/core';
import { showDialog } from '../../../components/dialog/dialog_state';
import preloaderState from '../../../components/preloader/preloader_state';
import { post,get } from '../../../services/api';

export const servicesState = createState({
   basicAmountForPlayers:"0",
   premiumAmountForPlayers:"0",
   basicAmountForAgents:"0",
   onboardingAmount:"0",
})

export const fetchServices=async()=>{
   try{
    const {basicAmountForAgents, basicAmountForPlayers, premiumAmountForPlayers, onboardingAmount} = servicesState;
    preloaderState.loading.set(true);
    let response = await get('/services');
    basicAmountForPlayers.set(response.amount_for_player.basic);
    premiumAmountForPlayers.set(response.amount_for_player.premium);
    basicAmountForAgents.set(response.amount_for_agent.premium);
    onboardingAmount.set(response.amount_for_agent.player_onboard);
   }catch(e){
       console.log(e);
       showDialog("Failed","We are having a problem connecting to our server at the moment");
   }finally{
    preloaderState.loading.set(false);
   }
}

export const updateServices=async(e:any)=>{
    e.preventDefault();
    try{
        const {basicAmountForAgents, basicAmountForPlayers, premiumAmountForPlayers, onboardingAmount} = servicesState;

        let data ={
            'service_id':1,
            'amount_for_player':basicAmountForPlayers.get(),
            "amount_for_agent": basicAmountForAgents.get()
        };
        preloaderState.loading.set(true);
        await post('/services/update',data);
        let data2 ={
            'service_id':2,
            'amount_for_player':premiumAmountForPlayers.get(),
            "amount_for_agent":onboardingAmount.get()
        };
        await post('/services/update',data2);
        showDialog("Success","Services updated");
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
}
