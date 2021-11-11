import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from '@hookstate/core';
import preloaderState from './preloader_state';

function Preloader(){
    const {loading} = useState(preloaderState);

    return (
        <>
        <Backdrop
        sx={{ color: '#049256', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading.get()}
        >
         <CircularProgress color="inherit" />
        </Backdrop>
        </>
    )
}

export default Preloader;

