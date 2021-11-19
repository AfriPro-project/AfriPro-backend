import { useState } from "@hookstate/core";
import { Check, Close } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/system/Box";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CustomButton from "../../../components/button";
import CustomDateInput from "../../../components/custom_date_time";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import TextInput from "../../../components/textInput";
import { getDateTime } from "../../events/states/events_state";
import { adsState,onImageChange,addAdvert, fetchAd } from "../states/adverts_state";

function AddInfo(){
    const {title,sponsorName,adUrl,expiryDate,rank,image,status} = useState(adsState);

    let {id} = useParams();
    useEffect(()=>{
        fetchAd(id!);
    },[id])

    return(
        <Layout
            children={
                <>
                 <Preloader/>
                 <CustomDialog/>

                 <Title
                    title="Ad Info"
                    showBackIcon={true}
                    trailingButton={false}
                    />

                <SizedBox
                 height={40}
                />

        <Box
         sx={{
             display:{sm:"inline-block",md:"flex"},
             width:"100%"
         }}
         >
                <Box
                sx={{
                    width:{xs:300,sm:300},
                }}
              >
                  <input type="file" accept="image/*" id="image" style={{display:"none"}} onChange={(e)=>{onImageChange(e)}}/>
                  <label htmlFor="image">
                  <Box
                sx={{
                    width:{xs:300,sm:300},
                    height:{xs:300,sm:300},
                    boxShadow:"px 2px 20px 20px rgba(0, 0, 0, 1)",
                    backgroundColor:"black",
                    backgroundSize:"cover",
                    backgroundPosition:"center",
                    backgroundRepeat:"no-repeat",
                    marginTop:5,
                    cursor:"pointer",
                    backgroundImage:`url(${image.get()})`,
                    borderRadius:5}}
                >
                    <Box
                    sx={{
                        width:{xs:300,sm:300},
                        height:{xs:300,sm:300},
                        background:"linear-gradient(to bottom,rgba(0,0,0,0.2),rgba(0,0,0,1));",
                        borderRadius:5,
                        display:"flex",
                        flexDirection:"column-reverse",
                        p:2,
                        boxSizing:"border-box"
                    }}
                    >
                    </Box>

                </Box></label>

                <Box height={5}/>

                <Button
                onClick={async ()=>{
                    if(status.get() === "active"){
                        var value = "inactive";
                    }else{
                        value = "active";
                    }
                    status.set(value);
                    await addAdvert();
                    //fetchAd(id!);
                }}
                variant="outlined" color="success" startIcon={status.get() === "inactive" ? <Check /> : <Close />}>
                   {status.get() === "active" ? "DE-ACTIVATE AD" : "ACTIVATE AD"}
                </Button>

              </Box>


                <Grid container >
                    <Grid item xs={12}  sx={{p:3}}>
                        <TextInput
                        label="Ad title"
                        value={title.get()}
                        isPassword={false}
                        onChanged={(value:string)=>{
                            title.set(value);
                        }}
                        />
                    </Grid>



                    <Grid item xs={12}  sx={{p:3}}>
                        <TextInput
                            label={"Sponsor Name"}
                            value={sponsorName.get()}
                            isPassword={false}
                            onChanged={(value:string)=>{
                                sponsorName.set(value);
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}  sx={{p:3}}>
                        <TextInput
                            label={"Ad Url"}
                            value={adUrl.get()}
                            isPassword={false}
                            onChanged={(value:string)=>{
                                adUrl.set(value);
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}   sx={{p:3}}>
                        <CustomDateInput
                            label={"Expry Date"}
                            minDate={getDateTime()}
                            value={expiryDate.get()}
                            onChanged={(value:string)=>{
                                expiryDate.set(value);
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{p:3}}>
                        <TextInput
                            label={"Rank"}
                            value={rank.get()}
                            isPassword={false}
                            onChanged={(value:string)=>{
                                rank.set(value);
                            }}
                        />
                    </Grid>



                    <Box sx={{p:3,width:150}}>
                    <CustomButton
                        label={"Update Info"}
                         onPressed={()=>{
                            addAdvert();
                         }}
                    />
                </Box>
                </Grid>


                </Box>
                </>
            }
        />
    );
}

export default AddInfo;
