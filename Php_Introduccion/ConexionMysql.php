<?php
    $host = "localhost";
    $dbname = "hospital"
    $user = "root";
    $pass = "72b3c6aa122d856cd739bc4e41b070d6ba90a8e516e285d4";

    $dbh = new PDO('mysql:host=localhost;dbname=test', $user, $pass);
    // usar la conexión aquí
    $sth = $dbh->query('SELECT * FROM foo');

    // y ahora, cerrarla !
    $sth = null;
    $dbh = null;
?>