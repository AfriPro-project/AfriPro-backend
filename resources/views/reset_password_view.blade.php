<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>AfriPro</title>
    <link rel="stylesheet" href="{{ URL::asset('public/css/emailVerification.css') }}">

</head>
<body>
    <center>
        <br/><br/>
        <img width="300px"  src="{{ URL::asset('public/images/logo.png') }}"/>
    </center>


           <div class="pass-form">
                <input type="hidden" id="email" value="{{ $email }}"/>
                <h1>Reset your password</h1>
                <div>
                    <label>New Password</label><br/><br/>
                    <input type="password" id="newPassword"/>
                </div>
                <br/><br/>
                <div>
                    <label>Confirm Password</label><br/><br/>
                    <input type="password" id="confirmPassword"/>
                </div><br/><br/>
                <div>
                    <button id="btn" onclick="resetPassword()" class="btn">Reset Password</button>
                </div>
            </div>
</body>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
    async function resetPassword(){
        var password = document.getElementById('newPassword').value;
        var confirm_pasword = document.getElementById('confirmPassword').value;
        var email = document.getElementById('email').value;
        if(password.trim().length > 0 || confirm_pasword.trim().length){
            if(password != confirm_pasword){
                alert('Passwords do not match');
                return;
            }else{
                if(password.trim().length < 5){
                    alert('Your password is not strong');
                    return;
                }else{
                    try{
                        var btn = document.getElementById('btn');
                        btn.style.opacity = 0.5;
                        btn.innerHTML = "Please wait....";
                        var data = await axios.post('https://afripro.biztrustgh.com/backend/api/resetpassword',{
                            email:email,
                            password: password
                        });
                        document.getElementsByClassName('pass-form')[0].innerHTML ='<center>Your password has been updated</center>';
                        window.open('https://afri.pro','_self');return;

                    }catch(e){
                        console.log(e);
                    }finally{
                        btn.style.opacity = 1;
                        btn.innerHTML = "Reset Password";
                    }
                }
            }
        }else{
            alert('We need your new password');
        }
    }
</script>
</html>
