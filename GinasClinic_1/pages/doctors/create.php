<?php
// Incluir configuración de base de datos
require_once '../../config/config.php';

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Obtener datos del formulario
$nombre = $_POST['nombre'] ?? '';
$especialidad = $_POST['especialidad'] ?? '';
$cedula = $_POST['cedula'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$correo = $_POST['correo'] ?? '';
$direccion = $_POST['direccion'] ?? '';
$estatus = $_POST['estatus'] ?? 'activo';

// Validar campos requeridos
if (empty($nombre) || empty($cedula)) {
    http_response_code(400);
    echo json_encode(['error' => 'Nombre y cédula son requeridos']);
    exit;
}

// Preparar consulta SQL
$sql = "INSERT INTO medicos (nombre, especialidad, cedula, telefono, correo, direccion, 
        fecha_registro, estatus) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la preparación de la consulta']);
    exit;
}

$stmt->bind_param("sssssss", $nombre, $especialidad, $cedula, $telefono, $correo, 
                  $direccion, $estatus);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Médico registrado exitosamente',
        'id' => $stmt->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar el médico']);
}

$stmt->close();
$conn->close();
?>