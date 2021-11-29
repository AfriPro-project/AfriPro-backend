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
import {servicesState,fetchServices, updateServices} from "../states/services_states";

function ServicesPage(){
    const {basicAmountForAgents, basicAmountForPlayers, premiumAmountForPlayers, onboardingAmount} = useState(servicesState);

    const navigate = useNavigate();
    const location = useLocation();


    useEffect(()=>{

        fetchServices();
    },[navigate,location])

    return (
            <Layout
            children={
                <>
                <Preloader/>
                <CustomDialog/>

                <Title
                title="Services"
                showBackIcon={false}
                trailingButton={false}
                />
                <SizedBox
                height={40}
                />
                 <form  style={{width:"100%", maxWidth: 600, padding: 40, borderRadius: 20, backgroundColor:"#363636"}} onSubmit={updateServices}>
                <TextInput
                 label="Player Basic Subscription (Euro)"
                 value={basicAmountForPlayers.get()}
                 isPassword={false}
                 onChanged={(value:string)=>{
                    basicAmountForPlayers.set(value);
                 }}
                />

                <SizedBox
                 height={40}
                />
                <TextInput
                 label="Player Premium Subscription (Euros)"
                 value={premiumAmountForPlayers.get()}
                 isPassword={false}
                 onChanged={(value:string)=>{
                    premiumAmountForPlayers.set(value);
                 }}
                />
                 <SizedBox
                 height={40}
                />
                <TextInput
                 label="Agent Subscription Amount (Euros)"
                 value={basicAmountForAgents.get()}
                 isPassword={false}
                 onChanged={(value:string)=>{
                     basicAmountForAgents.set(value);
                 }}
                />
                <SizedBox
                 height={40}
                />

                <TextInput
                 label="Player Onboarding (Euros)"
                 value={onboardingAmount.get()}
                 isPassword={false}
                 onChanged={(value:string)=>{
                     onboardingAmount.set(value);
                 }}
                />
                <SizedBox
                 height={40}
                />
                <CustomButton
                 label="Update Services"
                />
            </form>
            </>
            }
        />
    );
}


export default ServicesPage;
