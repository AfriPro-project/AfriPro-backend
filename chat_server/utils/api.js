require('dotenv').config();
const axios = require('axios');

async function get(path,token){
    var url = process.env.API_URL+path;
    const config = {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    };    
    var response = await axios.get(url,config);
    return response.data;
}

async function post(path,data,token){
    var url = process.env.API_URL+path;
    const config = {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    };     
    var response = await axios.post(url,data,config);
    return response.data;
}


module.exports = {get,post};