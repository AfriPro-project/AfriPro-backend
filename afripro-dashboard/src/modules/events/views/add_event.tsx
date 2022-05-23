import { useState } from "@hookstate/core";
import Grid from "@mui/material/Grid";
import Box from "@mui/system/Box";
import CustomButton from "../../../components/button";
import CustomDateInput from "../../../components/custom_date_time";
import CustomSelect from "../../../components/custom_select";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import TextArea from "../../../components/textarea";
import TextInput from "../../../components/textInput";
import { addEvent,eventsState,onImageChange,getDateTime } from "../states/events_state";

function AddEvent(){
    const {title,description,image,venu,location,end_date_time,start_date_time} = useState(eventsState);

    return(
        <Layout
            children={
                <>
                 <Preloader/>
                 <CustomDialog/>

                 <Title
                    title="Add Event"
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


                </Box></label>

              </Box>


                <Grid container >
                    <Grid item xs={12}  sx={{p:3}}>
                        <TextInput
                        label="Event title"
                        value={title.get()}
                        isPassword={false}
                        onChanged={(value:string)=>{
                            title.set(value);
                        }}
                        />
                    </Grid>

                    <Grid item xs={12}  sx={{p:3}}>
                        <CustomSelect
                        label="Venue"
                        value={venu.get()}
                        options={['Online','Offline']}
                        onChanged={(value:string)=>{
                            venu.set(value);
                            location.set("");
                        }}
                        />
                    </Grid>

                    <Grid item xs={12}  sx={{p:3}}>
                        <TextInput
                            label={venu.get() === "Online" ? "Link" : "Location"}
                            value={location.get()}
                            isPassword={false}
                            onChanged={(value:string)=>{
                                location.set(value);
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}  sx={{p:3}}>
                        <CustomDateInput
                            label={"Start date & Time"}
                            minDate={getDateTime()}
                            value={start_date_time.get()}
                            onChanged={(value:string)=>{
                                start_date_time.set(value);
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{p:3}}>
                        <CustomDateInput
                            label={"End date & Date"}
                            value={end_date_time.get()}
                            minDate={getDateTime()}
                            onChanged={(value:string)=>{
                                end_date_time.set(value);
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}  sx={{p:3,marginTop:2}}>
                        <TextArea
                        label="Event Description (>30 characters)"
                        value={description.get()}
                        onChanged={(value:string)=>{
                            description.set(value);
                        }}
                        />
                    </Grid>
                    <Box sx={{p:3,width:150}}>
                    <CustomButton
                        label={"Submit"}
                         onPressed={()=>{
                            addEvent();
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

export default AddEvent;
