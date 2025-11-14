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
                // Obtener lista de médicos
                case 'get_medicos':
                    getMedicos($pdo);
                    break;
                // Registrar un nuevo médico
                case 'create_medicos':
                    createMedicos($pdo);
                    break;
                // Actualizar un médico
                case 'update_medicos':
                    updateMedicos($pdo);
                    break;
                // Borrar médico
                case 'delete_medicos':
                    deleteMedicos($pdo);
                    break;
                // Obtener especialidades para el select
                case 'get_especialidades_select':
                    getEspecialidadesSelect($pdo);
                    break;

                // Obtener las especialidades para el filtro
                case 'get_especialidades_filtro':
                    getEspecialidadesConMedicos($pdo);
                    break;
                default:
                    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
        }
    }

    // Obtener lista de médicos
    function getMedicos($pdo) {
        $sql = "SELECT m.*, e.NombreEspecialidad FROM medicos m 
            LEFT JOIN medico_especialidades me ON m.IdMedico = me.IdMedico 
            LEFT JOIN especialidades e ON me.IdEspecialidad = e.IdEspecialidad ORDER BY m.IdMedico DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $medicos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'medicos' => $medicos]);
    }

    // Obtener especialidades para el select
    function getEspecialidadesSelect($pdo) {
        $sql = "SELECT IdEspecialidad, NombreEspecialidad FROM especialidades WHERE Estatus = 1 ORDER BY NombreEspecialidad";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $especialidades = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'especialidades' => $especialidades]);
    }

    // Registrar un médico
    function createMedicos($pdo) {
        // Iniciar transacción para asegurar consistencia
        $pdo->beginTransaction();
        
        try {
            // Traemos los datos del formulario
            $nombre = trim($_POST['nombre_medico']);
            $cedula = trim($_POST['cedula_medico']);
            $telefono = trim($_POST['telefono_medico']);
            $correo = trim($_POST['correo_medico']);
            $especialidad = $_POST['especialidad_medico'];
            $horario = $_POST['horario_medico'];
            $estatus = $_POST['estatus_medico_form'] ?? 'activo';

            // Conversión de estatus
            $activo = ($estatus === 'activo') ? 1 : 0;

            // Validaciones en PHP
            if (empty($nombre) || empty($cedula) || empty($especialidad)) {
                echo json_encode(['success' => false, 'message' => 'Nombre, cédula y especialidad son obligatorios']);
                return;
            }

            // Validar longitud de cédula
            if (strlen($cedula) < 5) {
                echo json_encode(['success' => false, 'message' => 'La cédula debe tener al menos 5 caracteres']);
                return;
            }

            // Validar formato de email si se proporciona
            if (!empty($correo) && !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['success' => false, 'message' => 'El formato del correo electrónico no es válido']);
                return;
            }

            // Verificar si la cédula ya existe
            $sql_verificar = "SELECT IdMedico FROM medicos WHERE CedulaProfesional = ?";
            $stmt_verificar = $pdo->prepare($sql_verificar);
            $stmt_verificar->execute([$cedula]);
            
            if ($stmt_verificar->rowCount() > 0) {
                echo json_encode(['success' => false, 'message' => 'La cédula profesional ya está registrada']);
                return;
            }

            // Insertar el médico
            $sql_insert = "INSERT INTO medicos (NombreCompleto, CedulaProfesional, Telefono, CorreoElectronico, HorarioAtencion, Estatus) 
                VALUES (?, ?, ?, ?, ?, ?)";
            $stmt_insert = $pdo->prepare($sql_insert);
            
            if ($stmt_insert->execute([$nombre, $cedula, $telefono, $correo, $horario, $activo])) {
                // Obtener el ID del médico recién insertado
                $idMedico = $pdo->lastInsertId();
                
                // Insertar en la tabla de relación medico_especialidades
                $sql_relacion = "INSERT INTO medico_especialidades (IdMedico, IdEspecialidad) VALUES (?, ?)";
                $stmt_relacion = $pdo->prepare($sql_relacion);
                
                if ($stmt_relacion->execute([$idMedico, $especialidad])) {
                    $pdo->commit();
                    echo json_encode(['success' => true, 'message' => 'Médico creado correctamente']);
                } else {
                    $pdo->rollBack();
                    echo json_encode(['success' => false, 'message' => 'Error al asignar la especialidad']);
                }
            } else {
                $pdo->rollBack();
                echo json_encode(['success' => false, 'message' => 'Error al crear el médico']);
            }
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    }

    // Actualizar el médico
    function updateMedicos($pdo) {
        // Iniciar transacción
        $pdo->beginTransaction();
        
        try {
            // Nos traemos los datos del js
            $id = $_POST['id'];
            $nombre = trim($_POST['nombre_medico']);
            $cedula = trim($_POST['cedula_medico']);
            $telefono = trim($_POST['telefono_medico']);
            $correo = trim($_POST['correo_medico']);
            $especialidad = $_POST['especialidad_medico'];
            $horario = $_POST['horario_medico'];
            $estatus = $_POST['estatus_medico_form'] ?? 'activo';
            
            $activo = ($estatus === 'activo') ? 1 : 0;

            // Validaciones en PHP
            if (empty($nombre) || empty($cedula)) {
                echo json_encode(['success' => false, 'message' => 'Nombre y cédula son obligatorios (PHP)']);
                return;
            }

            if (empty($especialidad)) {
                echo json_encode(['success' => false, 'message' => 'Especialidad son obligatorios (PHP)']);
                return;
            }

            if (strlen($cedula) < 5) {
                echo json_encode(['success' => false, 'message' => 'La cédula debe tener al menos 5 caracteres']);
                return;
            }

            if (!empty($correo) && !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['success' => false, 'message' => 'El formato del correo electrónico no es válido']);
                return;
            }

            // Verificar si la cédula ya existe
            $sql_verificar = "SELECT IdMedico FROM medicos WHERE CedulaProfesional = ? AND IdMedico != ?";
            $stmt_verificar = $pdo->prepare($sql_verificar);
            $stmt_verificar->execute([$cedula, $id]);
            
            if ($stmt_verificar->rowCount() > 0) {
                echo json_encode(['success' => false, 'message' => 'La cédula profesional ya está registrada']);
                return;
            }

            // Actualizar el médico
            $sql_update = "UPDATE medicos SET NombreCompleto = ?, CedulaProfesional = ?, Telefono = ?, CorreoElectronico = ?, 
                HorarioAtencion = ?, Estatus = ? WHERE IdMedico = ?";
            $params = [$nombre, $cedula, $telefono, $correo, $horario, $activo, $id];

            $stmt_update = $pdo->prepare($sql_update);
            
            if ($stmt_update->execute($params)) {
                // Actualizar la relación en medico_especialidades
                // Primero verificar si ya existe una relación
                $sql_check_relacion = "SELECT IdMedico FROM medico_especialidades WHERE IdMedico = ?";
                $stmt_check = $pdo->prepare($sql_check_relacion);
                $stmt_check->execute([$id]);
                
                if ($stmt_check->rowCount() > 0) {
                    // Actualizar relación existente
                    $sql_update_relacion = "UPDATE medico_especialidades SET IdEspecialidad = ? WHERE IdMedico = ?";
                    $stmt_update_rel = $pdo->prepare($sql_update_relacion);
                    $stmt_update_rel->execute([$especialidad, $id]);
                } else {
                    // Insertar nueva relación
                    $sql_insert_relacion = "INSERT INTO medico_especialidades (IdMedico, IdEspecialidad) VALUES (?, ?)";
                    $stmt_insert_rel = $pdo->prepare($sql_insert_relacion);
                    $stmt_insert_rel->execute([$id, $especialidad]);
                }
                
                $pdo->commit();
                echo json_encode(['success' => true, 'message' => 'Médico actualizado correctamente']);
            } else {
                $pdo->rollBack();
                $errorInfo = $stmt_update->errorInfo();
                echo json_encode(['success' => false, 'message' => 'Error al actualizar el médico: ' . $errorInfo[2]]);
            }
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    }

    // Eliminar el medico
    function deleteMedicos($pdo) {
        // Iniciar transacción
        $pdo->beginTransaction();
        
        try {
            $id = $_POST['id'];
            
            // Primero eliminar las relaciones en medico_especialidades
            $sql_delete_relacion = "DELETE FROM medico_especialidades WHERE IdMedico = ?";
            $stmt_delete_rel = $pdo->prepare($sql_delete_relacion);
            $stmt_delete_rel->execute([$id]);
            
            // Luego eliminar el médico
            $sql_delete = "DELETE FROM medicos WHERE IdMedico = ?";
            $stmt_delete = $pdo->prepare($sql_delete);
            
            if ($stmt_delete->execute([$id])) {
                $pdo->commit();
                echo json_encode(['success' => true, 'message' => 'Médico eliminado correctamente']);
            } else {
                $pdo->rollBack();
                echo json_encode(['success' => false, 'message' => 'Error al eliminar el médico']);
            }
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    }

    // Obtener especialidades para filtro de doctores
    function getEspecialidadesConMedicos($pdo) {
    $sql = "SELECT DISTINCT e.IdEspecialidad, e.NombreEspecialidad 
        FROM especialidades e INNER JOIN medico_especialidades me ON e.IdEspecialidad = me.IdEspecialidad 
        INNER JOIN medicos m ON me.IdMedico = m.IdMedico WHERE e.Estatus = 1 AND m.Estatus = 1 ORDER BY e.NombreEspecialidad";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $especialidades = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'especialidades' => $especialidades]);
}
?>