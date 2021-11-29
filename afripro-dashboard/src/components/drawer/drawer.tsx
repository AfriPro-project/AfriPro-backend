import {Drawer,Box,ListItem, List, IconButton} from '@mui/material';
import logo from '../../assets/images/logo.svg';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import SizedBox from '../sizedBox';
import {Convert, UserModel} from '../../models/user_model';
import { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import {drawerState,toggleDrawer} from './drawer_state';
import {useState as hUseState} from '@hookstate/core'
import {logout} from '../../modules/authentication_module/states/authentication_state';
import { Link } from 'react-router-dom';
type Props={
    variant:any,
}

function CustomDrawer({variant}:Props){
     const [user, setUser] =  useState<UserModel>();
     const navigate = useNavigate();
     const location = useLocation();
     const {open} = hUseState(drawerState);

     const menu = [
        {
            "label":"Dashboard",
            "path":"/home"
        },
        {
            "label":"Manage Users",
            "path":"/users"
        },
        {
            "label":"Manage Opportunities",
            "path":"/opportunities"
        },
        {
            "label":"Verification Docs",
            "path":"/verification_docs"
        },
        {
            "label":"Scholars",
            "path":"/scholars"
        },
        {
            "label":"Manage Events",
            "path":"/events"
        },
        {
            "label":"Manage Ads",
            "path":"/ads"
        },
        {
            "label":"Manage Referral Codes",
            "path":"/referral_codes"
        },
        {
            "label":"Messages",
            "path":"/messages"
        },
        {
            "label":"Activity Log",
            "path":"/activity_log"
        },
        {
            "label":"Chat Forum",
            "path":"/chat_forum"
        },
        {
            "label":"Services",
            "path":"/services"
        },
     ]

     useEffect(() => {
        // Update the document title using the browser API
        var userData = localStorage.getItem("userData");
        var userModel = Convert.toUserModel(userData!);
        setUser(userModel);
    },[]);

    function openPage(path:string){
        if(path === location.pathname) return;
        navigate(path);
    }

    function handleLogout(){
        if(logout()){
            window.open("/","_self");
        }
    }

    return (
        <Drawer
          variant={variant}
          sx={{
            zIndex:100,
            display: { xs: variant === "permanent" ? 'none' :'block', sm: variant === "permanent" ? 'none' :'block', md:"block" },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: {xs:260, sm: 300, md: 350},
            background: '#171717',
            color:"white"},
          }}
          onClose={toggleDrawer}
          open={open.get()}
        >
            <SizedBox height={20}/>
            <img src={logo} alt="logo" style={{width: 150,marginTop: 30, marginLeft:20}}/>
            <SizedBox height={20}/>
            <List
             sx={{
                 display:"flex",
                 flex:"2",
                 flexDirection:"column"
             }}
            >
                {menu.map(({label,path}, index) => (
                    <ListItem button
                     key={index}
                     onClick={()=>openPage(path)}
                     sx={{
                         color:location.pathname.includes(path) ? "white" : "rgba(255,255,255,0.5)",
                         fontWeight: location.pathname.includes(path) ? 900 : 300,
                         p:2,
                         '&:hover': {
                            color: "#fff",
                         }
                     }}
                    >
                        <span>{label}</span>
                    </ListItem>
                ))}
            </List>
            <Box
            sx={{
              display:"flex",
              justifyContent:"space-between",
              p:2,
              alignItems:"center"
            }}
            >
                <Link
                to={'/settings'}
                style={{width:50,color:"white"}}
                >
                <SettingsIcon/></Link>
                <p>{user?.user.first_name}</p>
                <IconButton
                onClick={handleLogout}
                sx={{width:50,color:"white"}}
                ><LogoutIcon/></IconButton>
            </Box>
        </Drawer>
    );
}

export default CustomDrawer;
