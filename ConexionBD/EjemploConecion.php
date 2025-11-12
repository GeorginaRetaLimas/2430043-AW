<?php
    require_once 'ConexionBasica.php';
    header('Content-Type: application/json');

    if ($_POST['action'] == 'get_especialidades') {
        $stmt = $pdo->query("SELECT * FROM especialidades ORDER BY IdEspecialidad DESC");
        $especialidades = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'especialidades' => $especialidades]);
    }

    if ($_POST['action'] == 'create_especialidad') {
        $nombre = trim($_POST['nombre']);
        
        // Verificar si ya existe
        $stmt = $pdo->prepare("SELECT IdEspecialidad FROM especialidades WHERE NombreEspecialidad = ?");
        $stmt->execute([$nombre]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Ya existe']);
        } else {
            $stmt = $pdo->prepare("INSERT INTO especialidades (NombreEspecialidad, Descripcion, Estatus) VALUES (?, ?, 1)");
            if ($stmt->execute([$nombre, $_POST['descripcion']])) {
                echo json_encode(['success' => true, 'message' => 'Creado']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error']);
            }
        }
    }

    if ($_POST['action'] == 'delete_especialidad') {
        $stmt = $pdo->prepare("DELETE FROM especialidades WHERE IdEspecialidad = ?");
        if ($stmt->execute([$_POST['id']])) {
            echo json_encode(['success' => true, 'message' => 'Eliminado']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error']);
        }
    }
?>