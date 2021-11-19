import { createState } from "@hookstate/core";
import { showDialog } from "../../../components/dialog/dialog_state";
import preloaderState from "../../../components/preloader/preloader_state";
import { get, post, uploadFile } from "../../../services/api";
import { filter, sort } from "../../../utils/globalFunctions/sort_filter_function";


let imageData: any = null;
export const eventsState=createState({
    events:[],
    eventInfo:{} as any,
    staticEvents:[],
    currentPage:0,
    rowsPerPage:10,
    search:"",
    sortedKey:"",
    attendees:[],
    image:"",
    title:"",
    venu:"Online",
    description:"",
    location:"",
    start_date_time:getDateTime(),
    end_date_time:getDateTime()
});

export const filterEvents=(value:string)=>{
    const {events,staticEvents, search,currentPage} = eventsState;
    let data = filter(value,"title",staticEvents.get());
    events.set(data);
    search.set(value);
    currentPage.set(0);
}

export const sortEvents=(key:any)=>{
   const {sortedKey, events} = eventsState;
   let asend  = true;
   if(sortedKey.get() === key){
       asend = false;
       sortedKey.set("");
   }else{
    sortedKey.set(key);
   }
   let data = sort(key,events.get(),asend);
   events.set(data);
}

export const fetchEvents=async()=>{
    let response = await get('/events_admin');
    if(eventsState.search.get().length < 1) eventsState.events.set(response);
    eventsState.staticEvents.set(response);
}



export const onImageChange = (event:any) => {
    if (event.target.files && event.target.files[0]) {
      if(event.target.files[0] != null){
        const name = event.target.files[0].name;
        const lastDot = name.lastIndexOf('.');

        const ext = name.substring(lastDot + 1);
        const exts = ['png','jpg','gif','jpeg'];
        if(exts.includes(ext.toLowerCase()) === false){
            showDialog("Attention","Please choose a valid image");
            return;
        }
      }
      eventsState.image.set(URL.createObjectURL(event.target.files[0]));

      imageData = event.target.files[0];

    }
}

export const addEvent=async()=>{
    try{
     preloaderState.loading.set(true);
     const {title,description,venu, location, start_date_time, end_date_time,search,currentPage, rowsPerPage,image} = eventsState;

     if(title.get().trim().length < 1 || description.get().trim().length < 30 || location.get().trim().length < 1){
        showDialog("Attention","Please fill the form correctly");
        return;
    }



     if(venu.get() === "Online" && !validURL(location.get())){
        showDialog("Attention","Please Provid a valid url");
        return;
     }




     if(Object.keys(eventsState.eventInfo.get()).length > 0){
         var serverFile = eventsState.eventInfo.get().banner!;
     }else{
        if(Date.parse(start_date_time.get().replace('T',' ')) <= Date.parse(getDateTime().replace('T',' '))){
            showDialog("Attention","Current time should lesser than Event start time");
            return;
        }

        if(Date.parse(start_date_time.get().replace('T',' ')) >= Date.parse(end_date_time.get().replace('T',' '))){
            showDialog("Attention","Event start date and time should be less than event end date and date");
            return;
        }
     }

     if(imageData != null){
         let previousFile = Object.keys(eventsState.eventInfo.get()).length > 0 ? eventsState.eventInfo.get().banner : "";
         let response = await uploadFile(imageData,previousFile);
         serverFile = response.file.path;
     }

     if(serverFile == null){
         showDialog("Attention","Please choose event banner image");
         return;
     }



     interface LooseObject {
         [key: string]: any
     }

     let data:LooseObject = {
         "title":title.get(),
         "about_event":description.get(),
         "banner": serverFile,
         'venue': venu.get() === "Online" ? "Online" : location.get(),
         "online_link": venu.get() === "Online" ? location.get() : "",
         "start_date_time": start_date_time.get(),
         "end_date_time": end_date_time.get()
     };

     let msg = "Event Added successfully";
     if(Object.keys(eventsState.eventInfo.get()).length > 0){
         data['id'] = eventsState.eventInfo.get().id!;
         await post('/events_update',data)
         msg = "Event Updated successfully";
     }else{
         await post('/events',data);
         await fetchEvents();
         search.set("");
         currentPage.set(0);
         rowsPerPage.set(10);
         image.set("");
         start_date_time.set(getDateTime());
         end_date_time.set(getDateTime());
         location.set("");
         venu.set("Online");
         title.set("");
         description.set("");
         serverFile = null;
     };

     showDialog("Done",msg);
    }catch(e){
     console.log(e);
     showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
     preloaderState.loading.set(false);
    }
 }

 export const deleteEvent=async(id:string)=>{
    try{
        let data ={
            'id':id
        };
        preloaderState.loading.set(true);
        await post('/events_delete',data);
        showDialog("Done","Event deleted");
        let newEvents = JSON.parse(JSON.stringify(eventsState.events.get()))
        let staticEvents = JSON.parse(JSON.stringify(eventsState.staticEvents.get()))

        let index = newEvents.findIndex((opportunity:any)=>opportunity.id === id);
        let index2 = staticEvents.findIndex((opportunity:any)=>opportunity.id === id);

        newEvents.splice(index,1);
        staticEvents.splice(index2,1);
        eventsState.events.set(newEvents);
        eventsState.staticEvents.set(staticEvents);
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
 }


 export function getDateTime(){
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var hour = ("0" + (now.getHours())).slice(-2);
    var min = ("0" + (now.getMinutes())).slice(-2);
    var today = now.getFullYear() + "-" + month + "-" + day + "T" + hour + ":" + min;
    return today;
 }

 export function validURL(str:string) {
    var res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g);
    return (res !== null)
  }

  export const fetchEvent=async(id:string)=>{
    try{
     preloaderState.loading.set(true);
     const {title,description,venu,eventInfo,attendees, location, start_date_time, end_date_time,image} = eventsState;
     eventInfo.set("");
     image.set("");
     start_date_time.set(getDateTime());
     end_date_time.set(getDateTime());
     location.set("");
     venu.set("Online");
     title.set("");
     description.set("");
     let res = await get(`/events/${id}`);
     if(Object.keys(res).length === 1){
         window.open('/events','_self');
     }
     eventInfo.set(res);
     title.set(res.title);
     venu.set(res.venue === "Online" ? "Online" : "Offline")
     description.set(res.about_event);
     attendees.set(res.submissions);
     start_date_time.set(res.start_date_time.replace(" ","T"));
     end_date_time.set(res.end_date_time.replace(" ","T"));
     location.set(res.venue === "Online" ? res.online_link : res.venue);
     image.set(`${process.env.REACT_APP_BACKEND_APP_URL}${res.banner.replace('public','storage')}`);
    }catch(e){
     console.log(e);
     showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
     preloaderState.loading.set(false);
    }
 }
