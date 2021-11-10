import './styles/button.css';
interface CustomButtonOptions{
    label:string
}

function CustomButton({label}:CustomButtonOptions){
    return (
        <button className="button-fill">{label}</button>
    );
}

export default CustomButton;
