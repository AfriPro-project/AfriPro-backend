import './styles/button.css';
interface CustomButtonOptions{
    label:string,
    onPressed?:any
}

function CustomButton({label,onPressed}:CustomButtonOptions){
    return (
        <button className="button-fill"
        onClick={onPressed != null ? onPressed : null}
        >{label}</button>
    );
}

export default CustomButton;
