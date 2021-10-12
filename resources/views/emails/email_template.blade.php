<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ $title }}</title>
</head>

@include('styles.email_styles')
<body>
    @include('components.header')
        <div class="conatainer">
                {!! $body !!}
        </div>
    @include('components.footer')
</body>
</html>
