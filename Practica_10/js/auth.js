console.log("Conexión exitosa a auth.js");

let registroActivo;

const modalInicio = document.getElementById('modal_Inicio');
const modalRegistro = document.getElementById('modal_Registro');

document.addEventListener('DOMContentLoaded', function(){
    registroActivo = JSON.parse(localStorage.getItem('registroActivo')) || false;
    cambiarVista();

    // Inicio de Sesión
    document.getElementById('form_inicio').addEventListener('submit', function(e){
        e.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const contraseña = document.getElementById('contraseña').value;

        // Validaciones básicas, no
        if (!usuario || !contraseña) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor completa todos los campos',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Enviar al servidor para autenticación real
        const formData = new FormData();
        formData.append('usuario', usuario);
        formData.append('contraseña', contraseña);
            
        fetch('../php/user_login.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes('exitoso')) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Login exitoso!',
                    html: data,
                    confirmButtonText: 'Aceptar',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "../pages/dashboard.php";
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el login',
                    html: data,
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor',
                confirmButtonText: 'Aceptar'
            });
        });
    });

    // Registro de Usuario
    document.getElementById('form_registro').addEventListener('submit', function(e){
        e.preventDefault();

        const usuario = document.getElementById('usuario_registro').value;
        const contraseña = document.getElementById('contraseña_registro').value;
        const confirmar = document.getElementById('confirmar_registro').value;

        // Validaciones usuario
        if (usuario.length < 3) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El usuario debe tener al menos 3 caracteres',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Contraseña de más de 5 caracteres
        if (contraseña.length < 5) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La contraseña debe tener al menos 5 caracteres',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        if (contraseña !== confirmar) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Cuando pase las calidaciones lo mandamos al servidor
        const formData = new FormData();
        formData.append('usuario_registro', usuario);
        formData.append('contraseña_registro', contraseña);
        formData.append('confirmar_registro', confirmar);
            
        // Aqui mandamos al servidor
        fetch('../php/user_register.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // Verificamos si la respuesta contiene mensajes de éxito o error
            if (data.includes('xito')) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    html: data,
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Cambiamos al modal de inicio después
                        cambiarInicio();
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el registro',
                    html: data,
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor',
                confirmButtonText: 'Aceptar'
            });
        });
    });
});

function cambiarRegistro(){
    registroActivo = true;
    cambiarVista();
}

function cambiarInicio(){
    registroActivo = false;
    cambiarVista();
}

function cambiarVista(){
    // Si registro esta activo, desactivamos inicio
    if(registroActivo){
        modalInicio.classList.add('d-none');
        modalRegistro.classList.remove('d-none');
        localStorage.setItem('registroActivo', 'true');
    } else { // Si no esta activo, mostramos inicio y ocultamos registro
        modalRegistro.classList.add('d-none');
        modalInicio.classList.remove('d-none');
        localStorage.setItem('registroActivo', 'false');
    }
}