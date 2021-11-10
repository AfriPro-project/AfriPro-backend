import '../styles/index.css';
import TextInput from '../../../components/textInput';
import SizedBox from '../../../components/sizedBox';
import CustomButton  from '../../../components/button';
import { useState } from '@hookstate/core';
import authenticationState from '../states/authentication_state';
import {post} from '../../../services/api';

function Login(){
    const {email, password} = useState(authenticationState);

    async function submitLogin(e:any){
        e.preventDefault();
        let data = {
            'email':email.get(),
            'password':password.get()
        }
        let response = await post('/login',data);
        console.log(response);
    }

    return (
        <>
            <form className="form" onSubmit={submitLogin}>
                <h3>Sign in</h3>
                <TextInput
                 label="Email"
                 value={email.get()}
                 isPassword={false}
                 onChanged={(value:string)=>{
                    email.set(value);
                 }}
                />
                <SizedBox
                 height={40}
                />
                <TextInput
                 label="Password"
                 value={password.get()}
                 isPassword={true}
                 onChanged={(value:string)=>{
                     password.set(value);
                 }}
                />
                <SizedBox
                 height={40}
                />
                <CustomButton
                 label="Proceed"
                />
            </form>
        </>
    );
}

export default Login;
