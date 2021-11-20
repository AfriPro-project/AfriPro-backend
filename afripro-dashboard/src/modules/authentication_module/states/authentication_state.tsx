import { createState } from '@hookstate/core';
import {Convert, UserModel} from '../../../models/user_model';

export const authenticationState = createState({
   email:"",
   password:"",
   userData:""
})

export function sessionManager(path:string){
    var userData = localStorage.getItem("userData");
    var loggedinRoutes = ['/home','/users','/opportunities','/verification_docs','/scholars','/events','/ads','/referral_codes'];
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
    return userModel;
}

