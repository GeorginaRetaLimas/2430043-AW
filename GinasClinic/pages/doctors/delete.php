<?php
// Incluir configuración de base de datos
require_once '../../config/config.php';

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Obtener ID del médico
$id = $_POST['id'] ?? '';

// Validar que se proporcione el ID
if (empty($id)) {
    http_response_code(400);
    echo