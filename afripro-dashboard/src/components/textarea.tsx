import './styles/textInput.css'

interface TextInputInterface{
    label:string,
    onChanged:any,
    value:string,
    readonly?:boolean
}

function TextArea({label,onChanged,value,readonly}:TextInputInterface){

    return(
        <>
            <label>{label}</label>
            <textarea style={{height: 200}} value={value} onChange={(e)=>onChanged(e.target.value)}></textarea>
        </>
    );
}

export default TextArea;
