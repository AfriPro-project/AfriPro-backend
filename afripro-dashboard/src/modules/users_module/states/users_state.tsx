import { createState } from "@hookstate/core";
import {sort,filter} from '../../../utils/globalFunctions/sort_filter_function';
import { get,post } from "../../../services/api";
import countries from '../../../utils/counties';
import {showDialog} from '../../../components/dialog/dialog_state';
import preloaderState from "../../../components/preloader/preloader_state";

export const usersState = createState({
    users:[],
    userInfo:{} as any,
    staticUsers:[],
    currentPage:0,
    rowsPerPage:10,
    search:"",
    sortedKey:"",
    firstName:"",
    lastName:"",
    emailAddress:"",
    phoneNumber:""
 })


export const toggleBlock=async(userId:string)=>{

    const {users,staticUsers} = usersState;
    let newUsers = JSON.parse(JSON.stringify(users.get()));
    let newStaticUsers = JSON.parse(JSON.stringify(staticUsers.get()));
    let index = newUsers.findIndex((user:any)=>user.id === userId);
    let index2 = newStaticUsers.findIndex((user:any)=>user.id === userId);

    await post('/toggle_blocked',{"user_id":userId});

    if(index > -1){
        newUsers[index]['blocked'] = newUsers[index]['blocked'] === 'true' ? 'false' : 'true';
        newStaticUsers[index2]['blocked'] = newUsers[index]['blocked'];
        staticUsers.set(newStaticUsers);
        users.set(newUsers);
    }
}

export const fetchUsers=async ()=>{
    const {users,staticUsers} = usersState;
  let response = await get('/users');
  staticUsers.set(response);
  users.set(response);
}

 export const filterUsers=(value:string)=>{
    const {users,staticUsers, search,currentPage} = usersState;
    let data = filter(value,"name",staticUsers.get());
    users.set(data);
    search.set(value);
    currentPage.set(0);
}

export const sortUsers=(key:any)=>{
   const {sortedKey, users} = usersState;
   let asend  = true;
   if(sortedKey.get() === key){
       asend = false;
       sortedKey.set("");
   }else{
    sortedKey.set(key);
   }
   let data = sort(key,users.get(),asend);
   users.set(data);
}

export const addUser=async()=>{
    const {firstName, lastName, emailAddress, phoneNumber} = usersState;
    if(validateEmail(emailAddress.get()) === false){
        showDialog("Attention","Please enter a valid email");
        return;
    }

    if(firstName.get().length < 2 || lastName.get().length < 2){
        showDialog("Attention","Please fill the form correctly");
        return;
    }

    if(phoneNumber.get().length < 9){
        showDialog("Attention","Please enter a valid phone number");
        return;
    }

    const phone = findCountry(usersState.phoneNumber.get());
    let data = {
        "first_name":firstName.get(),
        "last_name":lastName.get(),
        "phone_number_prefix":phone?.dial_code,
        "phone_number":phone?.phoneNumber,
        "email":emailAddress.get(),
        "country_code":phone?.countryCode,
        "user_type":"club_official",
        "agent":null,
        "fcmToken":null,
        "admin":"true"
    }


    try{
        preloaderState.loading.set(true);
        var response = await post("/register",data);

        let teamData = {
            "club_official_id":response['user']['id'],
            "name_of_team":"",
            "country_of_team":"",
            "city_of_team":"",
            "role_in_team":"",
            "transfer_status_of_player":"",
            "player_position_looking_for":"",
            "is_to_make_quisition_in_next_twelve_month":"",
            "is_assistenance_needed_in_african_transfer":""
        };

        await post("/save_team_bio",teamData);

        if(response['status'] === 'error'){
            showDialog("Registration Failed",response['message']);
        }else{
            let user = response['user'];
            let data:any = {};
            data['name'] = user.first_name+" "+user.last_name;
            data['role'] = user.user_type;
            data['last_active'] = '';
            data['subscription'] = 'None';
            data['id'] = user.id;
            data['blocked'] = user.blocked;
            await fetchUsers();
            usersState.search.set("");
            usersState.currentPage.set(0);
            usersState.rowsPerPage.set(10);
            firstName.set("");
            lastName.set("");
            emailAddress.set("");
            phoneNumber.set(phone?.dial_code!);
            showDialog("Done","User Added successfully");
        }
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
}

export const getUserInfo=async(userId:string,userType:string)=>{
  try{
    usersState.userInfo.set({});
    preloaderState.loading.set(true);
    let response;
    if(userType === 'player'){
        response = await get(`/players/${userId}/1`);
    }else if(userType === 'agent'){
        let data = {
            'user_id':userId
        }
        response = await post(`/get_agent_bio`,data);
    }else{
        let data = {
            'user_id':userId
        }
        response = await post(`/get_team_bio`,data);
    }

    if(response['user_type'] === 'player'){
        response['title'] = 'Player Info';
    }else if(response['user_type'] === 'agent'){
        response['title'] = 'Agent Info';
    }else{
        response['title'] = 'Club official Info';
    }

    usersState.userInfo.set(response);
   // console.log(response);
  }catch(e){
    console.log(e);
    showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
 }finally{
      preloaderState.loading.set(false);
  }
}

export const getPlayerAge=(dateString:string)=>{
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const activateTeamAccount=async(id:any,value:string)=>{
    try{
        preloaderState.loading.set(true);
        let data = {
            "verified":value,
            "club_official_id":id
        }
        await post('/update_team_bio',data);
        await getUserInfo(id,"club_official");
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }

}

function validateEmail(email:string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function findCountry(phoneNumber:any) {

    phoneNumber = `+${phoneNumber}`;
    for (let index = 0; index < countries.length; index++) {
        if(phoneNumber.includes(countries[index].dial_code)){
            let countryCode =  countries[index].code;
            let dial_code = countries[index].dial_code;
            phoneNumber = phoneNumber.replace(dial_code,'');
            return {countryCode,phoneNumber, dial_code};
        }
    }
}
