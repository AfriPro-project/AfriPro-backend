import {Box, Button, IconButton} from '@mui/material';
import CheveronLeft from '@mui/icons-material/ChevronLeft'
import { useNavigate } from 'react-router-dom';

type Props={
    title:string,
    showBackIcon:boolean,
    trailingText?:string,
    trailingButton?:boolean
    onPressed?:any
}

function Title ({title, showBackIcon, trailingText, trailingButton,onPressed}:Props){
    const navigate = useNavigate();

    function goBack(){
        navigate(-1);
    }
    return(
        <Box
        sx={{
            display:"flex",
            alignItems:"center",
            marginTop:5,
            marginBottom:2,
            justifyContent:"space-between"

        }}
        >
            <Box
            sx={{
                display:"flex",
                alignItems:"center",
            }}
            >
                {showBackIcon ?
                <IconButton
                onClick={goBack}
                sx={{color:"white",width:50}}
                >
                    <CheveronLeft/>
                </IconButton>
                :null}
                <p style={{fontSize:20}}>{title}</p>
            </Box>
            {trailingText ? <Button
            onClick={()=>{
                if(onPressed){
                    onPressed();
                }
            }}
            sx={{
                width:140,
                height:40,
                color:trailingButton === true ? "black" : "white",
                fontFamily:"Avnir",
                background:trailingButton === true ? "white" : "transparent",
                fontWeight:500,
                lineHeight:40,
                borderRadius:20,
                '&:hover': {
                    color: "#fff",
                    background:trailingButton === true ? "#049256" : "transparent",
                 }
            }}
            >{trailingText}</Button>: null}
        </Box>
    );
}
export default Title;
