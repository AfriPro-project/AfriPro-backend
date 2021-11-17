import { CheckCircle, Download, OpenInNew, Visibility,Check, Clear, Mail,Phone } from "@mui/icons-material";
import { Button, Chip, Divider, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/system/Box";
import SizedBox from "../../../components/sizedBox";
import TextInput from "../../../components/textInput";
import {getPlayerAgent} from '../states/users_state';

type Props={
    playerInfo:any
}


function PlayerInfo({playerInfo}:Props){
    return (
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
                    backgroundImage:`url(${process.env.REACT_APP_BACKEND_APP_URL}${playerInfo.pictures.replace('public','storage')})`,
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
                    <span style={{ alignSelf:"center"}}>{playerInfo.primary_position}</span>
                    <SizedBox height={10}/>
                     <Box
                     sx={{
                         display:"flex",
                         alignItems:'center',
                         alignSelf:"center"
                     }}
                     >
                        {playerInfo.status === "verified" ? <CheckCircle sx={{color:"#049256",marginRight:1}}/> : null }

                        <span style={{fontSize:20}}>{playerInfo.first_name+" "+playerInfo.last_name}, {getPlayerAgent(playerInfo.date_of_birth)}</span>
                     </Box>
                    </Box>

                </Box>


                    {/* subscription info */}
                <Box
                    sx={{
                        borderRadius:2,
                        backgroundColor:"#171717",
                        padding:3,
                        marginTop:2
                    }}
                    >
                  Subscription Info
                  <SizedBox height={10}/>
                  <Divider/>
                  <SizedBox height={10}/>
                  {playerInfo.service_id != null ?
                  <Box>
                      <Chip color={playerInfo.service_id === 1 ? "primary" : "success"} label={playerInfo.service_id === 1 ? "Basic" : "Premium"} />
                       <span style={{marginLeft:10}}>Ex: {playerInfo.expiry}</span>
                  </Box>
                  : <p>No Subscription</p>}
                </Box>


                {/* SKILLS */}
                <Box
                    sx={{
                        borderRadius:2,
                        backgroundColor:"#171717",
                        padding:3,
                        marginTop:2
                    }}
                    >
                  Skills
                  <SizedBox height={10}/>
                  <Divider/>
                  <SizedBox height={10}/>
                  {Object.keys(JSON.parse(playerInfo.skill_set)).map((skill)=>(
                      <Box
                      key={skill}
                      sx={{
                          display:"flex",
                          flexDirection:"row",
                          justifyContent:"space-between",
                          alignItems:"center",
                          marginBottom:2
                      }}
                     >
                           <span style={{width:80}}>{skill}</span> <LinearProgress sx={{width:120}} color="success" variant="determinate" value={parseInt(JSON.parse(playerInfo.skill_set)[skill]) * 20} />  <span>{JSON.parse(playerInfo.skill_set)[skill]}</span>
                     </Box>
                  ))}
                </Box>
                {playerInfo.agentDetails == null ?  <Box
                    sx={{
                        borderRadius:2,
                        backgroundColor:"#171717",
                        padding:3,
                        marginTop:2
                    }}
                    >

                    <Box sx={{display:"flex",alignItems:"center"}}>{playerInfo.is_looking_for_an_angent === "true" ? <Check sx={{color:"#049256"}}/> : <Clear sx={{color:"#922F04"}}/>} <SizedBox width={5}/>looking for a club</Box>

                    <SizedBox height={10}/>
                    <Box sx={{display:"flex",alignItems:"center"}}>{playerInfo.is_looking_for_an_angent === "true" ? <Check sx={{color:"#049256"}}/> : <Clear sx={{color:"#922F04"}}/>} <SizedBox width={5}/>looking for an agent</Box>

                </Box> : null}
                <SizedBox height={20}/>
                <Button
                onClick={()=>{
                    let link = `mailto:`;
                    if(playerInfo.agentDetails == null){
                        link += playerInfo.email;
                    }else{
                        link += playerInfo.agentDetails.email;
                    }
                    window.open(link,'_blank');
                }}
                variant="contained" startIcon={<Mail />}>
                    {playerInfo.agentDetails == null ? "E-Mail Player" : "E-Mail Agent"}
                </Button>

                <SizedBox height={20}/>
                <Button
                onClick={()=>{
                    let link = `tel:`;
                    if(playerInfo.agentDetails == null){
                        link += playerInfo.phone_number_prefix+""+playerInfo.phone_number;
                    }else{
                        link += playerInfo.agentDetails.phone_number_prefix+""+playerInfo.agentDetails.phone_number;
                    }
                    window.open(link,'_blank');
                }}
                variant="contained" color="success" startIcon={<Phone />}>
                   {playerInfo.agentDetails == null ? "Call Player" : "Call Agent"}
                </Button>

                <Box>

                </Box>
              </Box>


              <Box sx={{
                        flexGrow:1,
                        marginLeft:{sm:0,md:1},
                }}>
                <Box
                    sx={{
                        display:"flex",
                        alignItems:"center",
                        height:20,
                        borderRadius:2,
                        backgroundColor:"#171717",
                        padding:3,
                        maxWidth:400,
                        marginTop:5,
                    }}
                    >
                        <SizedBox width={10}/> <Visibility/> <SizedBox width={10}/> {playerInfo.views} Profile Views
                    </Box>

                    <Box
                    sx={{
                        borderRadius:2,
                        backgroundColor:"#171717",
                        marginTop:1,
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
                            label="Citzenship"
                            value={playerInfo.citizenship}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1}}>
                            <TextInput
                            label="Location"
                            value={playerInfo.current_country}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <TextInput
                            label="Secondary Positon"
                            value={playerInfo.secondary_position}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <TextInput
                            label="Primary Position"
                            value={playerInfo.primary_position}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>


                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <TextInput
                            label="height (cm)"
                            value={playerInfo.height_cm}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <TextInput
                            label="Preferred Foot"
                            value={playerInfo.preferred_foot}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <TextInput
                            label="Playing Level"
                            value={playerInfo.playing_level}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <TextInput
                            label="Languages spoken"
                            value={playerInfo.languages_spoken}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>


                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <TextInput
                            label="Contract Status"
                            value={playerInfo.contract_status}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <TextInput
                            label="Subscription"
                            value={playerInfo.service_id === 2  ?  "Premium" : "Basic"}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                    </Grid>

                    {playerInfo.agentDetails != null ? <><Box
                    sx={{
                        height:60,
                        backgroundColor:"#2D2D2D"
                    }}
                    >
                        <Box sx={{height:60, width:200,backgroundColor:"#0D0606",display:"grid",placeItems:"center"}}>
                             Agent Details
                        </Box>
                    </Box>
                       <Grid
                       container
                        sx={{
                            padding:3,
                        }}
                    >
                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <TextInput
                            label="Agent Name"
                            value={playerInfo.agentDetails.first_name+" "+playerInfo.agentDetails.last_name}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <TextInput
                            label="Agent Number"
                            value={playerInfo.agentDetails.phone_number_prefix+""+playerInfo.agentDetails.phone_number}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                    </Grid> </> : null}

                    <Box
                    sx={{
                        height:60,
                        backgroundColor:"#2D2D2D"
                    }}
                    >
                        <Box sx={{height:60, width:200,backgroundColor:"#0D0606",display:"grid",placeItems:"center"}}>
                             Additional Docs
                        </Box>
                    </Box>

                    <Grid
                       container
                        sx={{
                            padding:3,
                        }}
                    >
                       {playerInfo.cv_document != null ? <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <Box
                            sx={{
                                backgroundColor:"#2D2D2D",
                                padding:3,
                                borderRadius:2,
                                display:"flex",
                                flexDirection:"row",
                                justifyContent:"space-between"
                            }}
                            >
                                CV DOCUMENT
                                <IconButton
                                sx={{width:20,color:'white',height:20}}
                                 onClick={()=>{
                                     window.open(`${process.env.REACT_APP_BACKEND_APP_URL}${playerInfo.cv_document.replace('public','storage')}`,'_blank');
                                 }}
                                >
                                 <Download/>
                                </IconButton>
                            </Box>
                         </Grid>  : null}


                         {playerInfo.school_transcript_document != null ? <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <Box
                            sx={{
                                backgroundColor:"#2D2D2D",
                                padding:3,
                                borderRadius:2,
                                display:"flex",
                                flexDirection:"row",
                                justifyContent:"space-between"
                            }}
                            >
                                SCHOOL TRANSCRIPT
                                <IconButton
                                sx={{width:20,color:'white',height:20}}
                                 onClick={()=>{
                                     window.open(`${process.env.REACT_APP_BACKEND_APP_URL}${playerInfo.school_transcript_document.replace('public','storage')}`,'_blank');
                                 }}
                                >
                                 <Download/>
                                </IconButton>
                            </Box>
                         </Grid>  : null}


                         {playerInfo.transfermarket_link != null ? <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <Box
                            sx={{
                                backgroundColor:"#2D2D2D",
                                padding:3,
                                borderRadius:2,
                                display:"flex",
                                flexDirection:"row",
                                justifyContent:"space-between"
                            }}
                            >
                                {playerInfo.transfermarket_link}
                                <IconButton
                                sx={{width:20,color:'white',height:20}}
                                 onClick={()=>{
                                     window.open(playerInfo.transfermarket_link,'_blank');
                                 }}
                                >
                                 <OpenInNew/>
                                </IconButton>
                            </Box>
                         </Grid>  : null}

                         {playerInfo.youtube_link != null ? <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1,marginTop:3}}>
                            <Box
                            sx={{
                                backgroundColor:"#2D2D2D",
                                padding:3,
                                borderRadius:2,
                                display:"flex",
                                flexDirection:"row",
                                justifyContent:"space-between"
                            }}
                            >
                                {playerInfo.youtube_link}
                                <IconButton
                                sx={{width:20,color:'white',height:20}}
                                 onClick={()=>{
                                     window.open(playerInfo.youtube_link,'_blank');
                                 }}
                                >
                                 <OpenInNew/>
                                </IconButton>
                            </Box>
                         </Grid>  : null}

                    </Grid>

                    </Box>
               </Box>

        </Box>
        </>
    );
}

export default PlayerInfo;
