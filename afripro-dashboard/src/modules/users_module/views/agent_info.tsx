import { CheckCircle, Mail, Phone } from "@mui/icons-material";
import { Divider, Chip, Button, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import SizedBox from "../../../components/sizedBox";
import TextInput from "../../../components/textInput";

type Props={
    agentInfo:any
}


function AgentInfo({agentInfo}:Props){
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
                        {agentInfo.service_id != null ? <CheckCircle sx={{color:"#049256",marginRight:1}}/> : null }

                        <span style={{fontSize:20}}>{agentInfo.first_name+" "+agentInfo.last_name}</span>
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
                  {agentInfo.service_id != null ?
                  <Box>
                      <Chip color="success" label="Premium"/>
                       <span style={{marginLeft:10}}>Ex: {agentInfo.expiry}</span>
                  </Box>
                  : <p>No Subscription</p>}
                </Box>

                <SizedBox height={20}/>
                <Button
                onClick={()=>{
                    let link = `mailto:`;
                    link += agentInfo.email;
                    window.open(link,'_blank');
                }}
                variant="contained" startIcon={<Mail />}>
                    E-Mail Agent
                </Button>

                <SizedBox height={20}/>
                <Button
                onClick={()=>{
                    let link = `tel:`;
                    link += agentInfo.phone_number_prefix+""+agentInfo.phone_number;
                    window.open(link,'_blank');
                }}
                variant="contained" color="success" startIcon={<Phone />}>
                   Call Agent
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
                            label="Country Licensed in "
                            value={agentInfo.country_license}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1}}>
                            <TextInput
                            label="Country Located in "
                            value={agentInfo.country_located}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1, marginTop:3}}>
                            <TextInput
                            label="Certified by Fifa "
                            value={agentInfo.certified_by_fifa}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1, marginTop:3}}>
                            <TextInput
                            label="Has mandate for players "
                            value={agentInfo.is_mandate_for_players}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1, marginTop:3}}>
                            <TextInput
                            label="Number of players to register "
                            value={agentInfo.number_of_players_to_register}
                            isPassword={false}
                            onChanged={(value:string)=>{

                            }}
                            />
                         </Grid>

                         <Grid item xs={12} sm={12} md={6} lg={6} sx={{p:1, marginTop:3}}>
                            <TextInput
                            label="Phone Number "
                            value={agentInfo.phone_number_prefix+""+agentInfo.phone_number}
                            isPassword={false}
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

export default AgentInfo;
