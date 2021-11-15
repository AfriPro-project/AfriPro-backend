import { useEffect,useState as reactUseState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import {Grid,Box} from '@mui/material'
import DashbaordCard from '../../../components/dashboard_card';
import Layout from '../../../components/layout/layout';
import Title from '../../../components/page_title';
import {Bar} from 'react-chartjs-2'
//import my global states
import {sessionManager} from '../../authentication_module/states/authentication_state';
import { useState } from '@hookstate/core';
import {dashboardState, getData} from '../states/dashboard_state';



function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }


function Dashboard(){
    const navigate = useNavigate();
    const location = useLocation();
    const {users, profileViews, premiumSubscriptions,paidUers, normalUsers} = useState(dashboardState);
    const [windowDimensions, setWindowDimensions] = reactUseState(getWindowDimensions());

    const hasWindow = typeof window !== 'undefined';



    useEffect(() => {
        // Update the document title using the browser API
        var redirect = sessionManager(location.pathname);
        if(redirect) navigate('/');
        //get dashboard data
        getData();


        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        if (hasWindow) {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }

    },[navigate,location,hasWindow,setWindowDimensions]);


    const options={
        responsive: true,
        legend: {
            display: false,
        },
        type:'bar'
    }



    return(
        <Layout
          children= {
              <>
                <Title
                title="Dashboard"
                showBackIcon={false}
                trailingButton={false}
                />
                <Grid container spacing={2}>

                <Grid item xs={12} sm={12} md={4} lg={3}>
                    <DashbaordCard
                    label="Users"
                    title={users.get()}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={3}>
                    <DashbaordCard
                    label="Premium Users"
                    title={premiumSubscriptions.get()}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={3}>
                    <DashbaordCard
                    label="Profile Views"
                    title={profileViews.get()}
                    />
                </Grid>

                </Grid>

                <Title
                title="User Activity Chart"
                showBackIcon={false}
                trailingButton={false}
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
                                data: JSON.parse(paidUers.get()),
                                backgroundColor: '#049256',
                                barPercentage: 0.6,
                                categoryPercentage: 0.3
                              },
                              {
                                label: 'Normal Users',
                                data: JSON.parse(normalUsers.get()),
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
    )
}

export default Dashboard;
