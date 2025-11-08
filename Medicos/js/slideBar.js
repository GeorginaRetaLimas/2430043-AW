// Cuando se da click al botón de cierre de sesión
function cerrarSesion(){
    Swal.fire({
        title: '¿Estás seguro que quieres cerrar sesion?',
        text: "No he implementado guardar algo sjjsnss",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, me voy!',
        cancelButtonText: 'Cancelar'
        
    }).then((result) => {
        // Reedirigimos hacia el index con el login
        if (result.isConfirmed) {
            window.location.href = "../pages/";
        }
    });
}