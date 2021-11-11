import { useState } from "@hookstate/core";
import {dialogState,closeDialog} from "./dialog_state";

import Backdrop from '@mui/material/Backdrop';
import CustomButton from "../button";

import '../styles/dialog.css';

function CustomDialog(){
    const {show,title,body} = useState(dialogState);


    return(
        <>
        <Backdrop
        sx={{ color: '#049256', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={show.get()}
        onClick={closeDialog}
        >

            <div className="dialog">
                <h3>{title.get()}</h3>
                <p>{body.get()}</p>
                <CustomButton
                  label="Okay"
                  onPressed={closeDialog}
                />
            </div>

        </Backdrop>
        </>
    );
}

export default CustomDialog;
