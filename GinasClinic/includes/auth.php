<?php
// Verificar si el usuario está logueado
function checkAuth() {
    if(!isset($_SESSION['user_id'])) {
        header("Location: ../index.php");
        exit();
    }
}

// Cerrar sesión
if(isset($_GET['logout'])) {
    session_destroy();
    header("Location: ../index.php");
    exit();
}