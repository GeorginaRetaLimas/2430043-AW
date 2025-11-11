<?php
    // Configuración de la base de datos
    define('DB_HOST', 'localhost');
    define('DB_PORT', '3306');
    define('DB_USER', 'admin');
    define('DB_PASS', '72b3c6aa122d856cd739bc4e41b070d6ba90a8e516e285d4');
    define('DB_NAME', 'clinica_db');

    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8";
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        die("Error de conexión: " . $e->getMessage());
    }
?>