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
   <div class="container">
        <div>
            <div class="image">
                <center>
                    @if($alert =='success')
                     <img  src="{{ URL::asset('public/images/sucess.svg') }}"/>
                    @else
                    <img  src="{{ URL::asset('public/images/error.svg') }}"/>
                    @endif
                </center>
            </div>
              <div class="message-box"><p class="message">{{ $message }}<p></div>
            </div>
    </div>
</body>
</html>
