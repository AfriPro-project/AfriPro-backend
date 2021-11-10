import { createState } from '@hookstate/core';

const authenticationState = createState({
   email:"",
   password:"",
   userData:""
})

export default authenticationState;
