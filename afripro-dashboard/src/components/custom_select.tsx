import { Select, MenuItem } from '@mui/material';
import './styles/textInput.css'


interface InputInterface{
    label:string,
    onChanged:any,
    value:string,
    options:string[]
}

function CustomSelect({label,onChanged,options,value}:InputInterface){

    return(
        <>
            <label>{label}</label>
            <Select
            id="demo-simple-select"
            value={value}
            color="success"
            sx={{width:"100%",marginTop:2,backgroundColor:"#2D2D2D",color:"white",border:"none","&:hover":{outline:"3px solid #049256"}}}
            onChange={(e)=>{
                onChanged(e.target.value);
            }}
            >
            {options.map((option,index)=>(
                    <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
            </Select>

        </>
    );
}

export default CustomSelect;
