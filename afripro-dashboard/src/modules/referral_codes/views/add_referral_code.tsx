import { useState } from "@hookstate/core";
import Grid from "@mui/material/Grid";
import Box from "@mui/system/Box";
import CustomButton from "../../../components/button";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import TextInput from "../../../components/textInput";
import { referralCodesState,addReferralCode } from "../states/referral_codes_state";

function AddReferralCode(){
    const {referralCode} = useState(referralCodesState);

    return(
        <Layout
            children={
                <>
                 <Preloader/>
                 <CustomDialog/>

                 <Title
                    title="Add Referral Code"
                    showBackIcon={true}
                    trailingButton={false}
                    />

                <SizedBox
                 height={40}
                />

        <Box
         >
                <Grid container >
                    <Grid item xs={12} md={6}  sx={{p:3}}>
                        <TextInput
                        label="Referral Code"
                        value={referralCode.get()}
                        isPassword={false}
                        onChanged={(value:string)=>{
                            referralCode.set(value);
                        }}
                        />
                    </Grid>


                </Grid>
                <Box sx={{p:3,width:150}}>
                    <CustomButton
                        label={"Add Code"}
                         onPressed={()=>{
                            addReferralCode();
                         }}
                    />
                    </Box>
                </Box>
                </>
            }
        />
    );
}

export default AddReferralCode;
