<?php
    require_once '../config/config.php';

    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $action = $_POST['action'] ?? '';
        
        try {
            switch($action) {
                case 'get_users':
                    getUsers($pdo);
                    break;
                case 'create_user':
                    createUser($pdo);
                    break;
                case 'update_user':
                    updateUser($pdo);
                    break;
                case 'delete_user':
                    deleteUser($pdo);
                    break;
                default:
                    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
        }
    }

    function getUsers($pdo) {
        $sql = "SELECT IdUsuario, Usuario, Rol, Activo, UltimoAcceso, IdMedico FROM usuarios ORDER BY IdUsuario DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'users' => $users]);
    }

    function createUser($pdo) {
        $usuario = trim($_POST['usuario']);
        $contrasena = $_POST['contrasena'];
        $confirmar_contrasena = $_POST['confirmar_contrasena'];
        $rol = $_POST['rol'];
        
        $estatus = $_POST['estatus_usuario_form'] ?? 'activo';
        $activo = ($estatus === 'activo') ? 1 : 0;

        error_log("CREATE USER - Usuario: $usuario, Rol: $rol, Estatus: $estatus, Activo: $activo");

        // Validaciones
        if (empty($usuario) || empty($contrasena)) {
            echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
            return;
        }

        if ($contrasena !== $confirmar_contrasena) {
            echo json_encode(['success' => false, 'message' => 'Las contraseñas no coinciden']);
            return;
        }

        if (strlen($contrasena) < 5) {
            echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 5 caracteres']);
            return;
        }

        // Verificar si el usuario ya existe
        $sql_verificar = "SELECT IdUsuario FROM usuarios WHERE Usuario = ?";
        $stmt_verificar = $pdo->prepare($sql_verificar);
        $stmt_verificar->execute([$usuario]);
        
        if ($stmt_verificar->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'El usuario ya existe']);
            return;
        }

        // Hash de la contraseña
        $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);

        // Insertar usuario
        $sql_insert = "INSERT INTO usuarios (Usuario, ContraseñaHash, Rol, Activo) VALUES (?, ?, ?, ?)";
        $stmt_insert = $pdo->prepare($sql_insert);
        
        if ($stmt_insert->execute([$usuario, $contrasena_hash, $rol, $activo])) {
            echo json_encode(['success' => true, 'message' => 'Usuario creado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al crear el usuario']);
        }
    }

    function updateUser($pdo) {
        $id = $_POST['id'];
        $usuario = trim($_POST['usuario']);
        $rol = $_POST['rol'];
        
        $estatus = $_POST['estatus_usuario_form'] ?? 'activo';
        $activo = ($estatus === 'activo') ? 1 : 0;
        
        $contrasena = $_POST['contrasena'] ?? '';
        $confirmar_contrasena = $_POST['confirmar_contrasena'] ?? '';

        error_log("UPDATE USER - ID: $id, Usuario: $usuario, Rol: $rol, Estatus: $estatus, Activo: $activo");

        // Validaciones
        if (empty($usuario)) {
            echo json_encode(['success' => false, 'message' => 'El usuario es obligatorio']);
            return;
        }

        $sql_verificar = "SELECT IdUsuario FROM usuarios WHERE Usuario = ? AND IdUsuario != ?";
        $stmt_verificar = $pdo->prepare($sql_verificar);
        $stmt_verificar->execute([$usuario, $id]);
        
        if ($stmt_verificar->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'El usuario ya existe']);
            return;
        }

        if (!empty($contrasena)) {
            if ($contrasena !== $confirmar_contrasena) {
                echo json_encode(['success' => false, 'message' => 'Las contraseñas no coinciden']);
                return;
            }
            
            if (strlen($contrasena) < 5) {
                echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 5 caracteres']);
                return;
            }
            
            $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);
            $sql_update = "UPDATE usuarios SET Usuario = ?, ContraseñaHash = ?, Rol = ?, Activo = ? WHERE IdUsuario = ?";
            $params = [$usuario, $contrasena_hash, $rol, $activo, $id];
        } else {
            $sql_update = "UPDATE usuarios SET Usuario = ?, Rol = ?, Activo = ? WHERE IdUsuario = ?";
            $params = [$usuario, $rol, $activo, $id];
        }

        $stmt_update = $pdo->prepare($sql_update);
        
        if ($stmt_update->execute($params)) {
            echo json_encode(['success' => true, 'message' => 'Usuario actualizado correctamente']);
        } else {
            $errorInfo = $stmt_update->errorInfo();
            error_log("Error SQL: " . $errorInfo[2]);
            echo json_encode(['success' => false, 'message' => 'Error al actualizar el usuario: ' . $errorInfo[2]]);
        }
    }

    function deleteUser($pdo) {
        $id = $_POST['id'];
        
        $sql_delete = "DELETE FROM usuarios WHERE IdUsuario = ?";
        $stmt_delete = $pdo->prepare($sql_delete);
        
        if ($stmt_delete->execute([$id])) {
            echo json_encode(['success' => true, 'message' => 'Usuario eliminado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar el usuario']);
        }
    }
?>