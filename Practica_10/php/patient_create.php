<?php
    require_once '../config/config.php';

    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $action = $_POST['action'] ?? '';
        
        try {
            switch($action) {
                case 'get_patients':
                    getPatients($pdo);
                    break;
                case 'create_patient':
                    createPatient($pdo);
                    break;
                case 'update_patient':
                    updatePatient($pdo);
                    break;
                case 'delete_patient':
                    deletePatient($pdo);
                    break;
                case 'get_patient_details':
                    getPatientDetails($pdo);
                    break;
                default:
                    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
        }
    }

    function getPatients($pdo) {
        $sql = "SELECT idPaciente, NombreCompleto, CURP, FechaNacimiento, Sexo, Telefono, CorreoElectronico, 
            FechaRegistro, Estatus FROM pacientes ORDER BY idPaciente DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'patients' => $patients]);
    }

    function getPatientDetails($pdo) {
        $id = $_POST['id'];
        
        $sql = "SELECT * FROM pacientes WHERE idPaciente = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $patient = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($patient) {
            echo json_encode(['success' => true, 'patient' => $patient]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Paciente no encontrado']);
        }
    }

    function createPatient($pdo) {
        // Datos personales
        $nombre = trim($_POST['nombre']);
        $curp = trim($_POST['curp']);
        $fecha_nac = $_POST['fecha_Nac'];
        $sexo = $_POST['sexo'];
        $telefono = trim($_POST['telefono']);
        $correo = trim($_POST['correo']);
        $direccion = trim($_POST['direccion']);
        
        // Contacto emergencia
        $contacto_emergencia = trim($_POST['cont_emergencia']);
        $telefono_emergencia = trim($_POST['tel_emergencia']);
        
        // Datos médicos
        $alergias = trim($_POST['alergias']);
        $antecedentes = trim($_POST['antecedente']);
        
        // Validaciones básicas
        if (empty($nombre)) {
            echo json_encode(['success' => false, 'message' => 'El nombre es obligatorio']);
            return;
        }
        
        // Verificar si el CURP ya existe
        if (!empty($curp)) {
            $sql_verificar = "SELECT idPaciente FROM pacientes WHERE CURP = ?";
            $stmt_verificar = $pdo->prepare($sql_verificar);
            $stmt_verificar->execute([$curp]);
            
            if ($stmt_verificar->rowCount() > 0) {
                echo json_encode(['success' => false, 'message' => 'El CURP ya está registrado']);
                return;
            }
        }
        
        // Insertar paciente
        $sql_insert = "INSERT INTO pacientes (NombreCompleto, CURP, FechaNacimiento, Sexo, Telefono, CorreoElectronico, Direccion, 
            ContactoEmergencia, TelefonoEmergencia, Alergias, AntecedentesMedicos, Estatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo')";
        
        $stmt_insert = $pdo->prepare($sql_insert);
        
        if ($stmt_insert->execute([
            $nombre, $curp, $fecha_nac, $sexo, $telefono, $correo, $direccion,
            $contacto_emergencia, $telefono_emergencia, $alergias, $antecedentes
        ])) {
            echo json_encode(['success' => true, 'message' => 'Paciente creado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al crear el paciente']);
        }
    }

    function updatePatient($pdo) {
        $id = $_POST['id'];
        
        // Datos personales
        $nombre = trim($_POST['nombre']);
        $curp = trim($_POST['curp']);
        $fecha_nac = $_POST['fecha_Nac'];
        $sexo = $_POST['sexo'];
        $telefono = trim($_POST['telefono']);
        $correo = trim($_POST['correo']);
        $direccion = trim($_POST['direccion']);
        
        // Contacto emergencia
        $contacto_emergencia = trim($_POST['cont_emergencia']);
        $telefono_emergencia = trim($_POST['tel_emergencia']);
        
        // Datos médicos
        $alergias = trim($_POST['alergias']);
        $antecedentes = trim($_POST['antecedente']);
        $estatus = $_POST['estatus'] ?? 'activo';
        
        // Validaciones
        if (empty($nombre)) {
            echo json_encode(['success' => false, 'message' => 'El nombre es obligatorio']);
            return;
        }
        
        if (!empty($curp)) {
            $sql_verificar = "SELECT idPaciente FROM pacientes WHERE CURP = ? AND idPaciente != ?";
            $stmt_verificar = $pdo->prepare($sql_verificar);
            $stmt_verificar->execute([$curp, $id]);
            
            if ($stmt_verificar->rowCount() > 0) {
                echo json_encode(['success' => false, 'message' => 'El CURP ya está registrado']);
                return;
            }
        }
        
        // Actualizar paciente
        $sql_update = "UPDATE pacientes SET  NombreCompleto = ?, CURP = ?, FechaNacimiento = ?, Sexo = ?, 
            Telefono = ?, CorreoElectronico = ?, Direccion = ?, ContactoEmergencia = ?, TelefonoEmergencia = ?, 
            Alergias = ?, AntecedentesMedicos = ?, Estatus = ? WHERE idPaciente = ?";
        
        $stmt_update = $pdo->prepare($sql_update);
        
        if ($stmt_update->execute([
            $nombre, $curp, $fecha_nac, $sexo, $telefono, $correo, $direccion,
            $contacto_emergencia, $telefono_emergencia, $alergias, $antecedentes, $estatus, $id
        ])) {
            echo json_encode(['success' => true, 'message' => 'Paciente actualizado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar el paciente']);
        }
    }

    function deletePatient($pdo) {
        $id = $_POST['id'];
        
        $sql_delete = "DELETE FROM pacientes WHERE idPaciente = ?";
        $stmt_delete = $pdo->prepare($sql_delete);
        
        if ($stmt_delete->execute([$id])) {
            echo json_encode(['success' => true, 'message' => 'Paciente eliminado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar el paciente']);
        }
    }
?>