<?php
    // Configuraciones globales de la base de dato
    require_once '../config/config.php';

    // Definimos como tipo Json
    header('Content-Type: application/json');

    // Si el server detecta un envio de formulario
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Trae el action
        $action = $_POST['action'] ?? '';
        
        // Hace diferentes cosas dependiendo a que cosa llame el action
        try {
            switch($action) {
                // Obtener lista de alumnos
                case 'get_users':
                    getUsers($pdo);
                    break;
                // Registrar a un nuevo usuario
                case 'create_user':
                    createUser($pdo);
                    break;
                // Actualizar a un alumno
                case 'update_user':
                    updateUser($pdo);
                    break;
                // Borrar usuario
                case 'delete_user':
                    deleteUser($pdo);
                    break;
                // Si ninguno aunque no se como pueda pasar 
                default:
                    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
            }
        } catch (PDOException $e) { // Si el action no se pudo leer
            echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
        }
    }

    // Obtener lista de alumnos
    function getUsers($pdo) {
        // Seleccionamos todos los datos de la base de datos y ordenamos en base a los id
        $sql = "SELECT * FROM usuarios ORDER BY IdUsuario DESC";

        // Preparamos la sentencia para evitar una inyección
        $stmt = $pdo->prepare($sql);

        // Ejecutamos
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Mostramos en json el success y la lista de usuarios
        echo json_encode(['success' => true, 'users' => $users]);
    }

    // Registrar a un usuario
    function createUser($pdo) {
        // Treamos los datos del formulario
        $usuario = trim($_POST['usuario']);
        $contrasena = $_POST['contrasena'];
        $confirmar_contrasena = $_POST['confirmar_contrasena'];
        $rol = $_POST['rol'];
        
        // Traemos y definimos el usuario
        $estatus = $_POST['estatus_usuario_form'] ?? 'activo';

        // Pasamos de string a booleano
        $activo = ($estatus === 'activo') ? 1 : 0;
        $activo = intval($activo);

        // Hacemos un error log
        error_log("CREATE USER - Usuario: $usuario, Rol: $rol, Estatus: $estatus, Activo: $activo");

        // Validaciones campos obligatorios
        if (empty($usuario) || empty($contrasena)) {
            echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
            return;
        }

        // Contraseñas no coinciden
        if ($contrasena !== $confirmar_contrasena) {
            echo json_encode(['success' => false, 'message' => 'Las contraseñas no coinciden']);
            return;
        }

        // Contraseñas de 5 caracteres
        if (strlen($contrasena) < 5) {
            echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 5 caracteres']);
            return;
        }

        // Verificar si el usuario ya existe con una seleccion
        $sql_verificar = "SELECT IdUsuario FROM usuarios WHERE Usuario = ?";
        $stmt_verificar = $pdo->prepare($sql_verificar);
        $stmt_verificar->execute([$usuario]);
        
        // Si hay uno avisar
        if ($stmt_verificar->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'El usuario ya existe']);
            return;
        }

        // Hashear la contraseña
        $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);

        // Registrar al usuario los demas valores son por defecto
        $sql_insert = "INSERT INTO usuarios (Usuario, ContraseñaHash, Rol, Activo) VALUES (?, ?, ?, ?)";
        $stmt_insert = $pdo->prepare($sql_insert);
        
        // Mostramos error o success
        if ($stmt_insert->execute([$usuario, $contrasena_hash, $rol, $activo])) {
            echo json_encode(['success' => true, 'message' => 'Usuario creado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al crear el usuario']);
        }
    }

    // Actualizar el usuario
    function updateUser($pdo) {
        // Traemos los datos que nos este mandando el js
        $id = $_POST['id'];
        $usuario = trim($_POST['usuario']);
        $rol = $_POST['rol'];
        
        // Hacemos la conversion de estatus
        $estatus = $_POST['estatus_usuario_form'] ?? 'activo';
        $activo = ($estatus === 'activo') ? 1 : 0;
        $activo = intval($activo);
        
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