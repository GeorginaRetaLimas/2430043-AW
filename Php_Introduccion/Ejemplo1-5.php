<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejemplo 1-5</title>

    <style>
        *{
            background-color: pink;
        }    

        p{
            color: cyan;
        }
    </style>
</head>
<body>
    <?php
        // Ejemplo 0
        echo "Hola, soy un script PHP";

        // Ejemplo 1
        echo '<p>Hola Mundo</p>';

        // Ejemplo 2
        phpinfo();

        if(str_contains($_SERVER['HTTP_USER_AGENT'], 'Firefox')) {
            echo 'Esta utilizando Firefox';
        } else {
            echo 'No esta utilizando Firefox';
        }
    ?>
</body>
</html>