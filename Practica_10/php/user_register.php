<?php
require_once '../config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtenemos los datos del formulario
    $usuario = trim($_POST['usuario_registro']);
    $password = $_POST['contraseña_registro'];
    $confirmar_password = $_POST['confirmar_registro'];

    // Lista de posibles errores
    $errores = [];

    if ($password !== $confirmar_password) {
        $errores[] = "Las contraseñas no coinciden";
    }

    if (strlen($password) < 5) {
        $errores[] = "La contraseña debe tener al menos 5 caracteres";
    }

    if (strlen($usuario) < 3) {
        $errores[] = "El usuario debe tener al menos 3 caracteres";
    }

    // Si hay errores mostrar
    if (!empty($errores)) {
        foreach ($errores as $error) {
            echo "$error";
        }
        exit;
    }

    try {
        // Verificamos si el usuario ya existe
        $sql_verificar_usuario = "SELECT IdUsuario FROM usuarios WHERE Usuario = :usuario";
        $stmt_verificar_user = $pdo->prepare($sql_verificar_usuario);
        $stmt_verificar_user->bindParam(':usuario', $usuario);
        $stmt_verificar_user->execute();

        // Si hay un usuario con el nombre
        if ($stmt_verificar_user->rowCount() > 0) {
            echo "El usuario ya está registrado";
            exit;
        }

        // Hashear la contraseña
        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        // Insertar nuevo usuario con nombres diferentes para que no truene
        $sql_insert = "INSERT INTO usuarios (Usuario, ContraseñaHash, Rol, Activo) 
            VALUES (:user, :pass, 'Secretario', 1)";

        $stmt = $pdo->prepare($sql_insert);
        $stmt->bindParam(':user', $usuario);
        $stmt->bindParam(':pass', $password_hash);

        if ($stmt->execute()) {
            echo "Usuario registrado con éxito";
        } else {
            echo "Error al registrar el usuario";
        }

    } catch (PDOException $e) {
        echo "Error en el servidor: " . $e->getMessage();
    }
}
?>