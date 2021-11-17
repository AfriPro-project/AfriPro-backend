import { useState } from "@hookstate/core";
import { Chip, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import CustomButton from "../../../components/button";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import CustomTable from "../../../components/table";
import TextArea from "../../../components/textarea";
import TextInput from "../../../components/textInput";
import { onImageChange, addOpportunity, opportunitiesState, fetchOpportunity,  sortOpportunities } from "../states/opportunities_state";

function Opportunity(){
    const {image, title, description,submissions} = useState(opportunitiesState);
    let {id} = useParams();
    useEffect(()=>{
        fetchOpportunity(id!);
    },[id])

    function getRows(data:any[]){

        data = JSON.parse(JSON.stringify(data))
        data.forEach(row => {
            row['name'] = <Link to={`/users/${row.id}/${row.role}`} style={{color:"white"}}>{row.name}</Link>
            row['subscription'] = <Chip label={row.subscription} sx={{color:"white",backgroundColor:"#494949",fontFamily:"Avenir"}}  />
            delete row.id;
            delete row.role;
        });
        return data;
    }

    return (
            <Layout
            children={
                <>
                <Preloader/>
                <CustomDialog/>

                <Title
                title="Opportunity info"
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
                        label="Opportunity title"
                        value={title.get()}
                        isPassword={false}
                        onChanged={(value:string)=>{
                            title.set(value);
                        }}
                        />
                    </Grid>

                    <Grid item xs={12}  sx={{p:3,marginTop:2}}>
                        <TextArea
                        label="Opportunity Description (>30 characters)"
                        value={description.get()}
                        onChanged={(value:string)=>{
                            description.set(value);
                        }}
                        />
                    </Grid>
                    <Box sx={{p:3,width:150}}>
                        <CustomButton
                            label={"Update Info"}
                            onPressed={()=>{
                                addOpportunity();
                            }}
                        />
                    </Box>


                </Grid>


                </Box>

                <Box sx={{backgroundColor:"#181818",borderRadius:5,p:3}}>
                <Grid item xs={12}  sx={{marginBottom:4}}>
                    <Box
                    sx={{
                        height:60,
                        backgroundColor:"#2D2D2D"
                    }}
                    >
                        <Box sx={{height:60, width:200,backgroundColor:"#0D0606",display:"grid",placeItems:"center"}}>
                             Submissions
                        </Box>
                        </Box>
                    </Grid>
                <CustomTable
                label={"Search Players"}
                rows={getRows(submissions.get())}
                onPageChanged={(page:number)=>{
                    ///currentPage.set(page);
                }}
                onRowsPerPageChange={(page:number)=>{
                    //rowsPerPage.set(page);
                }}
                search={"search.get()"}
                currentPage={0}
                rowsPerPage={submissions.get().length}
                showActionButton={false}
                menus={['Delete']}
                onMenuClicked={(menu:string,index:any)=>{

                }}
                onSortBy={(key:string)=>{
                    sortOpportunities(key);
                }}
                headings={[
                    {
                        "label":"Player Name",
                        "sortKey":"name"
                    },
                    {
                        "label":"Date Applied",
                        "sortKey":"date_created"
                    },
                    {
                        "label":"Subscription",
                        "sortKey":"submissions"
                    }
                ]}
                /></Box>
            </>
            }
        />
    );
}

export default Opportunity;
