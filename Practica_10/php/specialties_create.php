<?php
    // Configuraciones globales de la base de datos
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
                // Obtener lista de especialidades
                case 'get_especialities':
                    getSpecialities($pdo);
                    break;
                // Registrar una nueva especialidad
                case 'create_especialities':
                    createSpecialities($pdo);
                    break;
                // Actualizar una especialidad
                case 'update_especialities':
                    updateSpecialities($pdo);
                    break;
                // Borrar especialidad
                case 'delete_especialities':
                    deleteSpecialities($pdo);
                    break;
                // Si ninguno aunque no se como pueda pasar 
                default:
                    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
            }
        } catch (PDOException $e) { // Si el action no se pudo leer
            echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
        }
    }

    // Obtener lista de especialidades
    function getSpecialities($pdo) {
        // Seleccionamos todos los datos de la base de datos y ordenamos en base a los id
        $sql = "SELECT * FROM especialidades ORDER BY IdEspecialidad DESC";

        // Preparamos la sentencia para evitar una inyección
        $stmt = $pdo->prepare($sql);

        // Ejecutamos
        $stmt->execute();
        $specialities = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Mostramos en json el success y la lista de especialidades
        echo json_encode(['success' => true, 'specialities' => $specialities]);
    }

    // Registrar una especialidad
    function createSpecialities($pdo) {
        // Traemos los datos del formulario
        $especialidad = trim($_POST['nombre_especialidad']);
        $descripcion = trim($_POST['descripcion_especialidad']);
        $estatus = $_POST['estatus_especialidad_form'] ?? 'activo';

        // Pasamos de string a booleano
        $activo = ($estatus === 'activo') ? 1 : 0;

        // Hacemos un error log
        error_log("CREATE SPECIALITY - Especialidad: $especialidad, Descripcion: $descripcion, Estatus: $estatus, Activo: $activo");

        // Verificar si la especialidad ya existe con una seleccion
        $sql_verificar = "SELECT IdEspecialidad FROM especialidades WHERE NombreEspecialidad = ?";
        $stmt_verificar = $pdo->prepare($sql_verificar);
        $stmt_verificar->execute([$especialidad]);
        
        // Si hay uno avisar
        if ($stmt_verificar->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'La especialidad ya existe']);
            return;
        }

        // Registrar la especialidad
        $sql_insert = "INSERT INTO especialidades (NombreEspecialidad, Descripcion, Estatus) VALUES (?, ?, ?)";
        $stmt_insert = $pdo->prepare($sql_insert);
        
        // Mostramos error o success
        if ($stmt_insert->execute([$especialidad, $descripcion, $activo])) {
            echo json_encode(['success' => true, 'message' => 'Especialidad creada correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al crear la especialidad']);
        }
    }

    // Actualizar la especialidad
    function updateSpecialities($pdo) {
        // Traemos los datos que nos este mandando el js
        $id = $_POST['id'];
        $especialidad = trim($_POST['nombre_especialidad']);
        $descripcion = trim($_POST['descripcion_especialidad']);
        $estatus = $_POST['estatus_especialidad_form'] ?? 'activo';
        
        // Hacemos la conversion de estatus a
        $activo = ($estatus === 'activo') ? 1 : 0;

        error_log("UPDATE ESPECIALIDAD - ID: $id, NombreEspecialidad: $especialidad, Descripcion: $descripcion, Estatus: $estatus, Activo: $activo");

        // Validaciones
        if (empty($especialidad) || empty($descripcion)) {
            echo json_encode(['success' => false, 'message' => 'Nombre y descripción son obligatorios']);
            return;
        }

        // Validaciones de longitud
        if (strlen($especialidad) < 3) {
            echo json_encode(['success' => false, 'message' => 'La especialidad debe tener al menos 3 caracteres']);
            return;
        }

        if (strlen($descripcion) < 5) {
            echo json_encode(['success' => false, 'message' => 'La descripción debe tener al menos 5 caracteres']);
            return;
        }

        // Verificar si la especialidad ya existe (excluyendo la actual)
        $sql_verificar = "SELECT IdEspecialidad FROM especialidades WHERE NombreEspecialidad = ? AND IdEspecialidad != ?";
        $stmt_verificar = $pdo->prepare($sql_verificar);
        $stmt_verificar->execute([$especialidad, $id]);
        
        if ($stmt_verificar->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'La especialidad ya existe']);
            return;
        }

        // Actualizar la especialidad
        $sql_update = "UPDATE especialidades SET NombreEspecialidad = ?, Descripcion = ?, Estatus = ? WHERE IdEspecialidad = ?";
        $params = [$especialidad, $descripcion, $activo, $id];

        $stmt_update = $pdo->prepare($sql_update);
        
        if ($stmt_update->execute($params)) {
            echo json_encode(['success' => true, 'message' => 'Especialidad actualizada correctamente']);
        } else {
            $errorInfo = $stmt_update->errorInfo();
            error_log("Error SQL: " . $errorInfo[2]);
            echo json_encode(['success' => false, 'message' => 'Error al actualizar la especialidad: ' . $errorInfo[2]]);
        }
    }

    function deleteSpecialities($pdo) {
        $id = $_POST['id'];
        
        $sql_delete = "DELETE FROM especialidades WHERE IdEspecialidad = ?";
        $stmt_delete = $pdo->prepare($sql_delete);
        
        if ($stmt_delete->execute([$id])) {
            echo json_encode(['success' => true, 'message' => 'Especialidad eliminada correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar la especialidad']);
        }
    }
?>