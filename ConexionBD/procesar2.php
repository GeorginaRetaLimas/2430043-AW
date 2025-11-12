<?php
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=localhost;dbname=hospital;charset=utf8", "root", "");

    // Obtener datos del formulario
    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];

    // Insertar en la base de datos
    $sql = "INSERT INTO especialidades (NombreEspecialidad, Descripcion, Estatus) VALUES (:nombre, :descripcion, 1)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':descripcion', $descripcion);
    $stmt->execute();

    // Redirigir automáticamente
    // header("Location: form.html");
    // exit;
?>