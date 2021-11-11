import {Box} from '@mui/material';
import logo from '../assets/images/logo.svg';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {toggleDrawer,drawerState} from './drawer/drawer_state';
import { useState } from '@hookstate/core';

function CustomAppBar(){
    const {open} = useState(drawerState)
    return (
        <Box
         sx={{display:{md:"none",sm:"block"}}}
        >
        <Box
         sx={{
             zIndex:200,
             background:"#0C0C0C",
             display:"flex",
             justifyContent:"space-between",
             flexDirection:"row",
             alignItems:'center',
             p:2,
         }}
        >
            <img src={logo} alt="logo" style={{width: 100}}/>
            <div
             onClick={toggleDrawer}
             style={{cursor:"pointer"}}
            >
                 {!open.get() ?
                 <MenuIcon
                  sx={{color:"white"}}
                 /> :
                  <CloseIcon
                 sx={{color:"white"}}
                />}
            </div>
        </Box>
     </Box>
    );
}

export default CustomAppBar;
