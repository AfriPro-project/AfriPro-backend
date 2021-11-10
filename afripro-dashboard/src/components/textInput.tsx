import './styles/textInput.css'


interface TextInputInterface{
    label:string,
    onChanged:any,
    isPassword:boolean,
    value:string
}

function TextInput({label,onChanged,isPassword,value}:TextInputInterface){

    return(
        <>
            <label>{label}</label>
            <input value={value} type={isPassword ? "password" : "text"} onChange={(event)=>onChanged(event.target.value)}/>
        </>
    );
}

export default TextInput;
