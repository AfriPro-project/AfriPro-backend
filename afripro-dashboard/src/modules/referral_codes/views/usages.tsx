import { useState } from "@hookstate/core";
import Box from "@mui/system/Box";
import { useEffect, useState as reactUseState } from "react";
import { useParams } from "react-router-dom";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import {Bar} from 'react-chartjs-2'
import { referralCodesState,fetchReferralCodeUsage } from "../states/referral_codes_state";


function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

function ReferralCodeUsage(){
    const {referralCode,paidUsers, normalUsers} = useState(referralCodesState);

    const [windowDimensions, setWindowDimensions] = reactUseState(getWindowDimensions());

    const hasWindow = typeof window !== 'undefined';


    let {id} = useParams();
    useEffect(()=>{

        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        fetchReferralCodeUsage(id!);

        if (hasWindow) {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }

    },[id,hasWindow,setWindowDimensions])


    const options={
        responsive: true,
        legend: {
            display: false,
        },
        type:'bar'
    }


    return(
        <Layout
            children={
                <>
                 <Preloader/>
                 <CustomDialog/>

                 <Title
                    title="Referral Code Usage"
                    showBackIcon={true}
                    trailingButton={false}
                    trailingText={referralCode.get()}
                    />

                <SizedBox
                 height={40}
                />

                <Box
                sx={{
                    p:5,
                    borderRadius:10,
                    background:"#2D2D2D",
                }}
                >
                <Bar
                        data={{
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','July','Aug','Sep','Oct','Nov','Dec'],
                            datasets: [
                              {
                                label: 'Paid Users',
                                borderRadius:100,
                                data:JSON.parse(JSON.stringify(paidUsers.get())),
                                backgroundColor: '#049256',
                                barPercentage: 0.6,
                                categoryPercentage: 0.3
                              },
                              {
                                label: 'Normal Users',
                                data: JSON.parse(JSON.stringify(normalUsers.get())),
                                borderRadius:100,
                                backgroundColor: '#A1A1A1',
                                barPercentage: 0.6,
                                categoryPercentage:0.3
                              }
                            ],
                          }}
                        width={100}
                        height={windowDimensions.width! > 500 ? 30 : 90}
                        options={options}
                    />
                </Box>
                </>
            }
        />
    );
}

export default ReferralCodeUsage;
