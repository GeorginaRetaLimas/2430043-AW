console.log("Conexión exitosa");

// Lista de usarios
let usuarios = [{
    correo : "admin@gmail.com",
    contraseña : "admin"
}];

// Cuando se inicializa
document.addEventListener('DOMContentLoaded', function(){
    // Verificamos si en el localStorage hay sesion
    if(localStorage.getItem('sesion')){
        sesion = JSON.parse(localStorage.getItem('sesion'));
        console.log("Sesión activa:", sesion);
    } else {
        window.location.href = "index.html";
    }

    // Manejar el envío del formulario
    document.getElementById('form_notas').addEventListener('submit', function(e){
        e.preventDefault();

        
    });
});



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

function mostrarConfirmacion(mensaje, callbackAceptar, callbackCancelar = null) {
    // Crear el contenedor del modal si no existe
    let modalContainer = document.getElementById('modal-confirm-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-confirm-container';
        document.body.appendChild(modalContainer);
    }

    // Crear el modal de confirmación
    const modalHTML = `
        <div class="modal-overlay" id="modal-confirm-overlay">
            <div class="modal-custom modal-confirm">
                <button class="modal-close-btn" id="modal-confirm-close-btn">
                    <i class="bi bi-x-lg"></i>
                </button>
                <div class="modal-icon">
                    <i class="bi bi-exclamation-triangle-fill text-warning"></i>
                </div>
                <div class="modal-mensaje">
                    ${mensaje}
                </div>
                <div class="modal-buttons">
                    <button class="modal-cancel-btn boton_secondary_tema" id="modal-cancel-btn">
                        Cancelar
                    </button>
                    <button class="modal-ok-btn boton_danger_tema" id="modal-confirm-ok-btn">
                        Sí, eliminar
                    </button>
                </div>
            </div>
        </div>
    `;

    modalContainer.innerHTML = modalHTML;

    // Agregar animación de entrada
    setTimeout(() => {
        const overlay = document.getElementById('modal-confirm-overlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    }, 10);

    // Función para cerrar el modal
    function cerrarModal() {
        const overlay = document.getElementById('modal-confirm-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                modalContainer.innerHTML = '';
            }, 300);
        }
    }

    document.getElementById('modal-confirm-ok-btn').addEventListener('click', function() {
        cerrarModal();
        if (callbackAceptar) callbackAceptar();
    });

    document.getElementById('modal-cancel-btn').addEventListener('click', function() {
        cerrarModal();
        if (callbackCancelar) callbackCancelar();
    });

    document.getElementById('modal-confirm-close-btn').addEventListener('click', cerrarModal);

    document.getElementById('modal-confirm-overlay').addEventListener('click', function(e) {
        if (e.target.id === 'modal-confirm-overlay') {
            cerrarModal();
            if (callbackCancelar) callbackCancelar();
        }
    });
}