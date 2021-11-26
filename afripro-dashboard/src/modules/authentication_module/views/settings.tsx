import { useState } from "@hookstate/core";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "../../../components/button";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import TextInput from "../../../components/textInput";
import { authenticationState, sessionManager,getUserData,updateAdminInfo } from "../states/authentication_state";

function SettingsPage(){
    const {password,userName, oldPassword} = useState(authenticationState);

    const navigate = useNavigate();
    const location = useLocation();


    useEffect(()=>{
        let redirect = sessionManager(location.pathname);
        if(redirect) navigate('/');
        getUserData();
    },[navigate,location])

    return (
            <Layout
            children={
                <>
                <Preloader/>
                <CustomDialog/>

                <Title
                title="Settings"
                showBackIcon={false}
                trailingButton={false}
                />
                <SizedBox
                height={40}
                />
                 <form className="form" onSubmit={updateAdminInfo}>
                <TextInput
                 label="UserName"
                 value={userName.get()}
                 isPassword={false}
                 onChanged={(value:string)=>{
                    userName.set(value);
                 }}
                />

                <SizedBox
                 height={40}
                />
                <TextInput
                 label="Old Password"
                 value={oldPassword.get()}
                 isPassword={true}
                 onChanged={(value:string)=>{
                    oldPassword.set(value);
                 }}
                />
                 <SizedBox
                 height={40}
                />
                <TextInput
                 label="New Password"
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
                 label="Update Info"
                />
            </form>
            </>
            }
        />
    );
}


export default SettingsPage;
