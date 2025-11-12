<?php
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=localhost;dbname=hospital;charset=utf8", "root", "");

    // Obtener datos del formulario
    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];

    // Insertar en la base de datos
    $stmt = $pdo->prepare("INSERT INTO especialidades (NombreEspecialidad, Descripcion, Estatus) VALUES (?, ?, 1)");
    $stmt->execute([$nombre, $descripcion]);

    // Redirigir automáticamente
    // header("Location: form.html");
    // exit;
?>