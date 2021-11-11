import axios from 'axios';

export async function get(path:string,token?:string){
    var url = process.env.REACT_APP_API_URL+path;
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    var response = await axios.get(url,config);
    return response.data;
}

export async function post(path:string,data:any,token?:string,){
    var url = process.env.REACT_APP_API_URL+path;


    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    var response = await axios.post(url,data,config);
    return response.data;
}
