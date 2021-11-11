import {Box} from '@mui/material';

type Props={
    title:string,
    label:string
}

function DashbaordCard({title,label}:Props){
    return (
        <Box
        sx={{
            borderRadius:10,
            background:"#2D2D2D",
            p:{xs:3, sm:2, md: 5},
            display:{xs:"flex",sm:"flex",md:"block"},
            justifyContent:{xs:"space-between"},
            alignItems:"center",
            paddingRight:{xs:10,sm:10}
        }}
        >
            <h1 style={{fontWeight:400}}>{title}</h1>
            <p>{label}</p>
        </Box>
    );
}

export default DashbaordCard;
