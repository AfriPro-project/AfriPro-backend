import { createState } from '@hookstate/core';

export const dialogState = createState({
   show:false,
   title:"",
   body:""
})

export function showDialog(title:string, body:string){
    dialogState.show.set(true);
    dialogState.title.set(title);
    dialogState.body.set(body);
}


export function closeDialog(){
    dialogState.show.set(false);
}
