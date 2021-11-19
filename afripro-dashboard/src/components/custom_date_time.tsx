import './styles/textInput.css'


interface TextInputInterface{
    label:string,
    onChanged:any,
    value:string,
    minDate:string
}

function CustomDateInput({label,onChanged,value,minDate}:TextInputInterface){

    return(
        <>
            <label>{label}</label>
            <input min={minDate}  value={value} type="datetime-local" onChange={(event)=>onChanged(event.target.value)}/>
        </>
    );
}

export default CustomDateInput;
