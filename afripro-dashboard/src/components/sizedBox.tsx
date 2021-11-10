interface SizedBoxInterface{
    width?:number,
    height?:number
}

function SizedBox({width,height}:SizedBoxInterface){
    return (
        <div style={{width:width, height: height}}></div>
    )
}
export default SizedBox;
