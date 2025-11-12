<?php
    $pdo = new PDO("mysql:host=localhost;dbname=futbol;", "admin", "72b3c6aa122d856cd739bc4e41b070d6ba90a8e516e285d4");

    // Traemos los datos
    $nombre = $_POST['nombre_form'];
    $apellido = $_POST['apellido_form'];
    $correo = $_POST['correo_form'];
    $telefono = $_POST['telefono_form'];
    $numeroDorsal = $_POST['numeroDorsal_form'];
    $sexo = $_POST['sexo_form'];
    $equipo = $_POST['equipo_form'];

    
    //Prueba datos - Si funciona pipiipipip porque no me reconoce el post

    /*$nombre = "Jared";
    $apellido = "Olazaran";
    $correo = "jared@gmail.com";
    $telefono = "8341585398";
    $numeroDorsal = "1";
    $sexo = "masculino";
    $equipo = "Jared_Team";*/

    if($sexo == "femenino"){
        echo "Es un equipo varonil";
        return;
    }

    // Sentencia sql
    $sql = "INSERT INTO jugadores (nombre, apellido, correo, telefono, numeroDorsal, sexo, equipo) 
        VALUES (:nombre, :apellido, :correo, :telefono, :numeroDorsal, :sexo, :equipo)";
    
    // Preparamos la sentencia
    $stmt = $pdo->prepare($sql);

    // Parametros
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':apellido', $apellido);
    $stmt->bindParam(':correo', $correo);
    $stmt->bindParam(':telefono', $telefono);
    $stmt->bindParam(':numeroDorsal', $numeroDorsal);
    $stmt->bindParam(':sexo', $sexo);
    $stmt->bindParam(':equipo', $equipo);

    $stmt->execute();
?>