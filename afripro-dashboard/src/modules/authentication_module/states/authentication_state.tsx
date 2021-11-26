import { createState } from '@hookstate/core';
import { showDialog } from '../../../components/dialog/dialog_state';
import preloaderState from '../../../components/preloader/preloader_state';
import {Convert, UserModel} from '../../../models/user_model';
import { post } from '../../../services/api';

export const authenticationState = createState({
   email:"",
   password:"",
   userData:"",
   userName:"",
   oldPassword:""
})

export function sessionManager(path:string){
    var userData = localStorage.getItem("userData");
    var loggedinRoutes = ['/home','/users','/opportunities','/verification_docs','/scholars','/events','/ads','/referral_codes','/messages','/chat_forum','/settings'];
    if(userData){
        if(loggedinRoutes.indexOf(path) > -1){
            return false;
        }
        return true;
    }

    if(loggedinRoutes.indexOf(path) > -1) return true;
    return false;
}

export function logout(){
    localStorage.removeItem("userData");
    return true;
}

export function getUserData():UserModel{
    var userData = localStorage.getItem("userData");
    var userModel = Convert.toUserModel(userData!);
   if(userData != null){
    authenticationState.userName.set(userModel.user.first_name);
   }
    return userModel;
}

export async function updateAdminInfo(e:any){
    e.preventDefault();
    try{
        const {userName, password,oldPassword} = authenticationState;
        preloaderState.loading.set(true);
        if(password.get().trim().length > 0 ){
            let ndata ={
                'old_password':oldPassword.get(),
                'new_password':password.get(),
                'user_id': getUserData().user.id
            };
            let res = await post('/update_password',ndata);
            if(res['status'] === 'failed'){
                showDialog("Failed","Your old password is incorrect");
                return;
            }
        }


        let data ={
            'first_name':userName.get(),
            'user_id': getUserData().user.id
        };

        let response = await post('/update_registration',data);

        localStorage.setItem('userData',JSON.stringify(response));
        showDialog("Done","Profile updated");
        window.location.reload();

    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
}
