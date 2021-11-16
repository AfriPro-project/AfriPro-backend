import '../styles/index.css';
import TextInput from '../../../components/textInput';
import SizedBox from '../../../components/sizedBox';
import CustomButton  from '../../../components/button';
import Preloader from '../../../components/preloader/preloader';
import {Convert} from '../../../models/user_model';
import CustomDialog from '../../../components/dialog/dialog';

import { useState } from '@hookstate/core';
import {post} from '../../../services/api';
import { useNavigate,useLocation } from 'react-router-dom';
import { useEffect } from 'react';

//import my global states
import {authenticationState,sessionManager} from '../states/authentication_state';
import preloaderState from '../../../components/preloader/preloader_state';
import {showDialog} from '../../../components/dialog/dialog_state';

function Login(){
    const {email, password,userData} = useState(authenticationState);
    const {loading} = useState(preloaderState);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Update the document title using the browser API
        var redirect = sessionManager(location.pathname);
        if(redirect) navigate('/home');
    },[navigate,location]);


    async function submitLogin(e:any){
        try{
            e.preventDefault();
            let data = {
                'email':email.get(),
                'password':password.get(),
                'type':'admin'
            }

            loading.set(true);
            let response = await post('/login',data);

            const userModel = Convert.toUserModel(JSON.stringify(response));
            if(userModel.status === "error"){
                showDialog("Login Failed",response['message']);
            }else{
                userData.set(JSON.stringify(response));
                localStorage.setItem('userData',JSON.stringify(response));
                navigate("/home");
            }
        }catch(e){
            console.log(e);
            showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
        }finally{
            loading.set(false);
        }
    }

    return (
        <>
            <Preloader/>
            <CustomDialog/>
            <form className="form" onSubmit={submitLogin}>
                <h3>Sign in</h3>
                <TextInput
                 label="Email"
                 value={email.get()}
                 isPassword={false}
                 onChanged={(value:string)=>{
                    email.set(value);
                 }}
                />
                <SizedBox
                 height={40}
                />
                <TextInput
                 label="Password"
                 value={password.get()}
                 isPassword={true}
                 onChanged={(value:string)=>{
                     password.set(value);
                 }}
                />
                <SizedBox
                 height={40}
                />
                <CustomButton
                 label="Proceed"
                />
            </form>
        </>
    );
}

export default Login;
