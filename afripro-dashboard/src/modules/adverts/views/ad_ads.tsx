import { useState } from "@hookstate/core";
import Grid from "@mui/material/Grid";
import Box from "@mui/system/Box";
import CustomButton from "../../../components/button";
import CustomDateInput from "../../../components/custom_date_time";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import TextInput from "../../../components/textInput";
import { getDateTime } from "../../events/states/events_state";
import { adsState,onImageChange,addAdvert } from "../states/adverts_state";

function AddAdvert(){
    const {title,sponsorName,adUrl,expiryDate,rank,image} = useState(adsState);

    return(
        <Layout
            children={
                <>
                 <Preloader/>
                 <CustomDialog/>

                 <Title
                    title="Add New Ad"
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
                        label={"Submit"}
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

export default AddAdvert;
