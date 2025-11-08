console.log("Conexión exitosa a auth.js");

let registroActivo;

const modalInicio = document.getElementById('modal_Inicio');
const modalRegistro = document.getElementById('modal_Registro');

document.addEventListener('DOMContentLoaded', function(){
    registroActivo = JSON.parse(localStorage.getItem('registroActivo'));
    cambiarVista();

    document.getElementById('form_inicio').addEventListener('submit', function(e){
        e.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const contraseña = document.getElementById('contraseña').value;

        if(usuario === "Admin" && contraseña === "admin"){
            Swal.fire('Éxito', 'Usuario logueado con éxito', 'success');

            localStorage.setItem('registroActivo', 'false');

            setTimeout(function() {
                window.location.href = "../pages/dashboard.html";
            }, 2000);
        } else {
            Swal.fire('Error', 'Usuario no reconocido', 'error');
        }
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

