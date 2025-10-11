console.log("Conexión exitosa");

let notas = [];
let editandoNotaId = null;

sesion = JSON.parse(localStorage.getItem('sesion'));

// Cuando se inicializa
document.addEventListener('DOMContentLoaded', function(){
    // Verificamos si en el localStorage hay sesion
    if(sesion){
        console.log("Sesión activa:", sesion);
        cargarNotas();
    } else {
        window.location.href = "index.html";
    }

    document.getElementById('btn_AgregarNota').addEventListener('click', mostrarModalNuevaNota);
    document.getElementById('btn_CrearNota').addEventListener('click', mostrarModalNuevaNota);

    document.getElementById('btn_GuardarNota').addEventListener('click', guardarNota);

    // Cerrar sesión
    document.getElementById('btn_cerrar_sesion').addEventListener('click', function() {
        localStorage.removeItem('sesion');
        window.location.href = "index.html";
    });
});

function mostrarModalNuevaNota(){
    editandoNotaId = null;

    document.getElementById('modal_titulo').textContent = 'Nueva Nota';
    document.getElementById('titulo').value = '';
    document.getElementById('contenido').value = '';
    document.getElementById('nota_id').value = '';
}

function validarFormulario(){
    let titulo = document.getElementById("titulo").value;
    let contenido = document.getElementById("contenido").value;

    console.log("Titulo: ", titulo);
    console.log("Contenido: ", contenido);

    let datosValidos = true;
    let mensaje;

    if(titulo === ""){
        mensaje = "No se puede guardar una nota sin titulo";
        datosValidos = false;
    }

    if(contenido === ""){
        mensaje += "No se puede guardar una nota sin contenido";
        datosValidos = false;
    }

    if (datosValidos){
        const año = fechaEnvio.getFullYear();
        const mes = obtenerMes();
        const dia = fechaEnvio.getDate();

        const fecha = dia + " " + mes + " " + año;

        guardarNota(titulo, contenido, fecha);
    } else {
        mostrarError(mensaje);
    }

}

function obtenerMes(){
    const mes = fechaEnvio.getMonth() + 1;
    switch(mes){
        case 1: return "Enero"; break;
        case 2: return "Febrero"; break;
        case 3: return "Marzo"; break;
        case 4: return "Abril"; break;
        case 5: return "Mayo"; break;
        case 6: return "Junio"; break;
        case 7: return "Julio"; break;
        case 8: return "Agosto"; break;
        case 9: return "Septiembre"; break;
        case 10: return "Octubre"; break;
        case 11: return "Noviembre"; break;
        case 12: return "Diciembre"; break;
    }
}

function guardarNota(titulo, contenido, fecha){
    id = notas.length > 0 ? Math.max(...notas.map(n => n.id_notas)) + 1 : 1;

    console.log(fecha);

    let nuevaNota = {
        id_notas: id,
        id_usuario: sesion.id_usuario,
        titulo: titulo,
        contenido: contenido,
        fecha: fecha
    };

    console.log(nurvaNota);
}



function mostrarSuccess(mensaje) {
    mostrarModal(mensaje, 'success');
}

function mostrarError(mensaje) {
    mostrarModal(mensaje, 'error');
}

function mostrarModal(mensaje, tipo) {
    // Crear el contenedor del modal si no existe
    let modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
    }

    // Determinar el icono y color según el tipo
    const iconos = {
        success: '<i class="bi bi-check-circle-fill"></i>',
        error: '<i class="bi bi-x-circle-fill"></i>'
    };

    const colores = {
        success: 'modal-success',
        error: 'modal-error'
    };

    // Crear el modal
    const modalHTML = `
        <div class="modal-overlay" id="modal-overlay">
            <div class="modal-custom ${colores[tipo]}">
                <button class="modal-close-btn" id="modal-close-btn">
                    <i class="bi bi-x-lg"></i>
                </button>
                <div class="modal-icon">
                    ${iconos[tipo]}
                </div>
                <div class="modal-mensaje">
                    ${mensaje}
                </div>
                <button class="modal-ok-btn boton_primary_tema" id="modal-ok-btn">
                    Aceptar
                </button>
            </div>
        </div>
    `;

    modalContainer.innerHTML = modalHTML;

    // Agregar animación de entrada
    setTimeout(() => {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    }, 10);

    // Función para cerrar el modal
    function cerrarModal() {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                modalContainer.innerHTML = '';
            }, 300);
        }
    }

    // Event listeners para cerrar el modal
    // Boton Ok
    document.getElementById('modal-ok-btn').addEventListener('click', cerrarModal);
    // Tachita
    document.getElementById('modal-close-btn').addEventListener('click', cerrarModal);
    // Click afuera del modal
    document.getElementById('modal-overlay').addEventListener('click', function(e) {
        if (e.target.id === 'modal-overlay') {
            cerrarModal();
        }
    });
}