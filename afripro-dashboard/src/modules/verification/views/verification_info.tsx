import { Check } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import { Box, Button } from "@mui/material";
import { useEffect,useState as useReactState } from "react";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import { verificationDocsState,fetchverificationDoc, verifyverificationDoc, rejectverificationDoc } from "../state/verificaton_docs_state";
import {useState} from '@hookstate/core';
import { useParams } from "react-router";
import Carousel, { Modal, ModalGateway } from "react-images";

function VerificationInfo(){
    const [currentImage, setCurrentImage] = useReactState(0);
    const [viewerIsOpen, setViewerIsOpen] = useReactState(false);


    const {passport,photo,status} = useState(verificationDocsState);
    const {id} = useParams();
    useEffect(()=>{

        fetchverificationDoc(id!);
    },[id])

    const openLightbox = (index:number) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
      };

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    return (
            <Layout
            children={
                <>
                <Preloader/>
                <CustomDialog/>

                <Title
                title="Verification Info"
                showBackIcon={true}
                trailingButton={false}
                />
                <SizedBox
                height={40}
                />
                <Box
                sx={{
                    display:{sm:"block",md:"flex"},
                    alignItems:"center",
                    justifyContent:"space-evenly",
                    width:"100%",
                    maxWidth:1200,
                    margin:"auto"
                }}
                >
                       <div onClick={()=>{openLightbox(0)}}style={{cursor:"pointer"}}>
                    <Box
                    sx={{
                        width:"100%",
                        maxWidth:600,
                        maxHeight:600,
                        textAlign:'center'
                    }}
                    >
                        <p style={{fontSize:20}}>Pasport</p>
                        <Box
                        sx={{
                            width:{xs: 300, sm:300, md:550},
                            height:{xs: 300, sm:300, md:550},
                            boxShadow:"px 2px 20px 20px rgba(0, 0, 0, 1)",
                            backgroundColor:"black",
                            backgroundSize:"cover",
                            backgroundPosition:"center",
                            backgroundRepeat:"no-repeat",
                            marginTop:5,
                            margin:"auto",
                            backgroundImage:`url(${process.env.REACT_APP_BACKEND_APP_URL}${passport.get().replace('public','storage')})`,
                            borderRadius:5}}
                        >

                </Box>
                    </Box></div>

                    <div onClick={()=>{openLightbox(1)}} style={{cursor:"pointer"}}>
                    <Box
                    sx={{
                        width:"100%",
                        maxWidth:600,
                        maxHeight:600,
                        textAlign:'center'
                    }}
                    >
                        <p style={{fontSize:20}}>Photo</p>
                        <Box
                        sx={{
                            width:{xs: 300, sm:300, md:550},
                            height:{xs: 300, sm:300, md:550},
                            boxShadow:"px 2px 20px 20px rgba(0, 0, 0, 1)",
                            backgroundColor:"black",
                            backgroundSize:"cover",
                            backgroundPosition:"center",
                            backgroundRepeat:"no-repeat",
                            marginTop:5,
                            margin:"auto",
                            backgroundImage:`url(${process.env.REACT_APP_BACKEND_APP_URL}${photo.get().replace('public','storage')})`,
                            borderRadius:5}}
                        >

                </Box>
                    </Box></div>
                </Box>
                {/* Buttons */}

                {status.get() !== "pending"  ?
                    <Box
                    sx={{
                        textAlign:'center',
                        marginTop:5
                    }}
                    >
                    {status.get() === "rejected" ?   <Button sx={{width:200,alignSelf:"center"}} variant="contained" color="error" startIcon={<Close/>}>Rejected</Button> :
                    <Button sx={{width:200,alignSelf:"center"}} variant="contained" color="success" startIcon={<Check/>}>Verified</Button> }
                    </Box>
                : <Box
                sx={{
                    textAlign:'center',
                    marginTop:5
                }}
                >
                <Button variant="outlined"
                   onClick={()=>{
                       rejectverificationDoc(id!);
                   }}
                   color={"error"}
                    sx={{width:70,height:70,borderRadius:35,lineHeight: 35}}>
                        <Close/>
                </Button>

                <Button variant="outlined"
                onClick={()=>{
                    verifyverificationDoc(id!);
                }}
                   color={"success"}
                    sx={{width:70,height:70,borderRadius:35,lineHeight: 35,marginLeft:2}}>
                        <Check/>
                </Button>
                </Box>}


                <ModalGateway>
                {viewerIsOpen ? (
                <Modal onClose={closeLightbox}>
                    <Carousel
                    currentIndex={currentImage}
                    views={[{ source: `${process.env.REACT_APP_BACKEND_APP_URL}${passport.get().replace('public','storage')}` }, { source: `${process.env.REACT_APP_BACKEND_APP_URL}${photo.get().replace('public','storage')}` }]}
                    />
                </Modal>
                ) : null}
            </ModalGateway>

            </>
            }
        />
    );
}


export default VerificationInfo;
