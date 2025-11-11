<?php
require_once '../config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtenemos los datos del formulario
    $usuario = trim($_POST['usuario']);
    $password = $_POST['contraseña'];

    try {
        // Buscar el usuario en la base de datos
        $sql = "SELECT IdUsuario, Usuario, ContraseñaHash, Rol, Activo FROM usuarios WHERE Usuario = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$usuario]);
        
        if ($stmt->rowCount() === 1) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verificar si el usuario está activo
            if (!$user['Activo']) {
                echo "Usuario desactivado";
                exit;
            }
            
            // Verificar la contraseña
            if (password_verify($password, $user['ContraseñaHash'])) {
                // Iniciar sesión
                session_start();
                $_SESSION['user_id'] = $user['IdUsuario'];
                $_SESSION['usuario'] = $user['Usuario'];
                $_SESSION['rol'] = $user['Rol'];
                $_SESSION['loggedin'] = true;
                
                // Actualizar último acceso
                $sql_update = "UPDATE usuarios SET UltimoAcceso = NOW() WHERE IdUsuario = ?";
                $stmt_update = $pdo->prepare($sql_update);
                $stmt_update->execute([$user['IdUsuario']]);
                
                echo "Login exitoso";
                echo "<script>setTimeout(() => { window.location.href = '../pages/dashboard.php'; }, 1500);</script>";
                
            } else {
                echo "Contraseña incorrecta";
            }
            
        } else {
            echo "Usuario no encontrado";
        }

    } catch (PDOException $e) {
        echo "Error en el servidor: " . $e->getMessage();
    }
}
?>