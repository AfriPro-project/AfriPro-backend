import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import './styles/phoneInput.css'

interface Props{
    label:string,
    country:any,
    onChanged:any,
    value:string
}



function PhoneNumberInput({label, country, value, onChanged}:Props){




    return (
        <>
        <label>{label}</label>
        <PhoneInput
        country={country}
        value={value}
        buttonClass={"btn"}
        inputClass={"input"}
        containerClass={"inputContainer"}
        dropdownClass={"dropdown"}
        onChange={phone => {
           onChanged(phone);
        }}
        />
        </>
    )
}
export default PhoneNumberInput;
