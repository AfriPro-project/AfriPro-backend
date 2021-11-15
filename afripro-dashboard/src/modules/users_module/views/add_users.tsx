import Layout from "../../../components/layout/layout";
import Preloader from '../../../components/preloader/preloader';
import CustomDialog from '../../../components/dialog/dialog';
import Title from '../../../components/page_title';
import SizedBox from "../../../components/sizedBox";
import { Grid } from "@mui/material";
import TextInput from "../../../components/textInput";
import {usersState, addUser} from '../states/users_state';
import { useState } from "@hookstate/core";
import PhoneNumberInput from "../../../components/phone_number_input";
import CustomButton from "../../../components/button";
import Box from '@mui/material/Box';


function AddUsers(){
    const {firstName,lastName,phoneNumber,emailAddress} = useState(usersState);


    return(
        <Layout
            children={
                <>
                 <Preloader/>
                 <CustomDialog/>

                 <Title
                    title="Add Users"
                    showBackIcon={true}
                    trailingButton={false}
                    />

                <SizedBox
                 height={40}
                />

                <Grid container >
                    <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:3}}>
                        <TextInput
                        label="First Name"
                        value={firstName.get()}
                        isPassword={false}
                        onChanged={(value:string)=>{
                            firstName.set(value);
                        }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:3}}>
                        <TextInput
                        label="Last Name"
                        value={lastName.get()}
                        isPassword={false}
                        onChanged={(value:string)=>{
                            lastName.set(value);
                        }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:3}}>
                        <TextInput
                        label="Email Address"
                        value={emailAddress.get()}
                        isPassword={false}
                        onChanged={(value:string)=>{
                            emailAddress.set(value);
                        }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:3}}>

                        <PhoneNumberInput
                        label="Phone Number"
                        country="ng"
                        value={phoneNumber.get()}
                        onChanged={(value:any)=>{
                            phoneNumber.set(value);
                        }}
                        />
                    </Grid>

                    <Box sx={{p:3,width:150}}>
                    <CustomButton
                        label={"Submit"}
                         onPressed={()=>{
                            addUser();
                         }}
                    />
                    </Box>

                </Grid>

                </>
            }
        />
    );
}

export default AddUsers;
