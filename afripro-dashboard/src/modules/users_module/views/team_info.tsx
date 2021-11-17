import { Check, CheckCircle, Close, Mail, Phone } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/system/Box";
import SizedBox from "../../../components/sizedBox";
import TextInput from "../../../components/textInput";
import { activateTeamAccount } from "../states/users_state";

type Props={
    teamInfo:any
}

function TeamInfo({teamInfo}:Props){
    return(
        <>
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
                    backgroundImage:`url(${process.env.REACT_APP_BACKEND_APP_URL}storage/files/default_avatar.jpg)`,
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
                     <Box
                     sx={{
                         display:"flex",
                         alignItems:'center',
                         alignSelf:"center"
                     }}
                     >
                        {teamInfo.service_id != null ? <CheckCircle sx={{color:"#049256",marginRight:1}}/> : null }

                        <span style={{fontSize:20}}>{teamInfo.first_name+" "+teamInfo.last_name}</span>
                     </Box>
                    </Box>

                </Box>

                <SizedBox height={20}/>
                <Button
                onClick={()=>{
                    let link = `mailto:`;
                    link += teamInfo.email;
                    window.open(link,'_blank');
                }}
                variant="contained" startIcon={<Mail />}>
                    E-Mail Club Offical
                </Button>

                <SizedBox height={20}/>
                <Button
                onClick={()=>{
                    let link = `tel:`;
                    link += teamInfo.phone_number_prefix+""+teamInfo.phone_number;
                    window.open(link,'_blank');
                }}
                variant="contained" color="success" startIcon={<Phone />}>
                   Call  Club Offical
                </Button>

                <SizedBox height={20}/>
                <Button
                onClick={()=>{
                    if(teamInfo.verified === "true"){
                        var value = "false";
                    }else{
                        value = "true";
                    }
                    activateTeamAccount(teamInfo.club_official_id,value);
                }}
                variant="outlined" color="success" startIcon={teamInfo.verified === "true" ? <Check /> : <Close />}>
                   {teamInfo.verified === "true" ? "ACCOUNT ACTIVATED" : "ACTIVATE ACCOUNT"}
                </Button>

              </Box>

              <Box sx={{
                        flexGrow:1,
                        marginLeft:{sm:0,md:1},
                }}>
                    <Box
                    sx={{
                        borderRadius:2,
                        backgroundColor:"#171717",
                        marginTop:5,
                    }}
                    >
                    <Grid
                       container
                        sx={{
                            padding:3,
                        }}
                    >
                        <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1}}>
                            <TextInput
                            label="Name of Team "
                            value={teamInfo.name_of_team}
                            isPassword={false}
                            readonly={true}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1}}>
                            <TextInput
                            label="Country  "
                            value={teamInfo.country_of_team}
                            isPassword={false}
                            readonly={true}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1, marginTop:3}}>
                            <TextInput
                            label="City  "
                            value={teamInfo.city_of_team}
                            isPassword={false}
                            readonly={true}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1, marginTop:3}}>
                            <TextInput
                            label="Need assistance in african transfer "
                            value={teamInfo.is_assistenance_needed_in_african_transfer}
                            isPassword={false}
                            readonly={true}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1, marginTop:3}}>
                            <TextInput
                            label="Team is acquisition within the next 12 months? "
                            value={teamInfo.is_to_make_quisition_in_next_twelve_month}
                            isPassword={false}
                            readonly={true}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1, marginTop:3}}>
                            <TextInput
                            label="Positions looking for "
                            value={teamInfo.player_position_looking_for}
                            isPassword={false}
                            readonly={true}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1, marginTop:3}}>
                            <TextInput
                            label="Transfer status of player looking for "
                            value={teamInfo.transfer_status_of_player}
                            isPassword={false}
                            readonly={true}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1, marginTop:3}}>
                            <TextInput
                            label="Role in team "
                            value={teamInfo.role_in_team}
                            isPassword={false}
                            readonly={true}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>


                    </Grid>
                    </Box>
                </Box>

         </Box>
        </>
    );
}

export default TeamInfo;
