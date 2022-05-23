import axios from 'axios';
import { getUserData } from '../modules/authentication_module/states/authentication_state';

export async function get(path:string){
    let url = process.env.REACT_APP_API_URL+path;
    let userModel = getUserData();
    let token = userModel != null ? userModel.token :  "";
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    var response = await axios.get(url,config);
    return response.data;
}

export async function post(path:string,data:any){
    var url = process.env.REACT_APP_API_URL+path;

    let userModel = getUserData();

    let token = userModel != null ? userModel.token :  "";
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;application/json',
        },
    };


    var response = await axios.post(url,data,config);
    return response.data;
}

export async function uploadFile(image:any,previousFilePath?:string){
    const formData = new FormData();
    formData.append("file", image);
    let path = '/upload_file';

    let userModel = getUserData();

    let token = userModel != null ? userModel.token :  "";

    if(previousFilePath){
        formData.append('previousFilePath',previousFilePath!);
        path = '/update_file';
    }
    var url = process.env.REACT_APP_API_URL+path;

    let response = await axios.post(url, formData, {
        headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
        }
    })
    return response.data;
}
