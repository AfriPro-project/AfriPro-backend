import './styles/textInput.css'


interface TextInputInterface{
    label:string,
    onChanged:any,
    isPassword:boolean,
    value:string,
    readonly?:boolean
}

function TextInput({label,onChanged,isPassword,value,readonly}:TextInputInterface){

    return(
        <>
            <label>{label}</label>
            <input  disabled={readonly === undefined ? false : true} value={value} type={isPassword ? "password" : "text"} onChange={(event)=>onChanged(event.target.value)}/>
        </>
    );
}

export default TextInput;
