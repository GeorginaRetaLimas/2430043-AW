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

    const modal = new bootstrap.Modal(document.getElementById('modal_nota'));
    modal.show();
}

function mostrarModalEditarNota(id){
    const idNumero = parseInt(id);
    const nota = notas.find(n => n.id_notas === idNumero);

    console.log("Buscando nota con ID:", idNumero);
    console.log("Notas disponibles:", notas);

    if (nota && (sesion.rol === "admin" || nota.id_usuario === sesion.id_usuario)) {
        editandoNotaId = idNumero;

        document.getElementById('modal_titulo').textContent = 'Editar Nota';
        document.getElementById('titulo').value = nota.titulo;
        document.getElementById('contenido').value = nota.contenido;
        document.getElementById('nota_id').value = nota.id_notas;
        
        const modal = new bootstrap.Modal(document.getElementById('modal_nota'));
        modal.show();
    } else {
        mostrarError("No tienes permisos para editar esta nota");
    }
}

function guardarNota(){
    const titulo = document.getElementById("titulo").value.trim();
    const contenido = document.getElementById("contenido").value.trim();
    const id = document.getElementById("nota_id").value;

    if (!titulo || !contenido) {
        mostrarError("El título y el contenido son obligatorios");
        return;
    }

    const fechaEnvio = new Date();
    const año = fechaEnvio.getFullYear();
    const mes = obtenerMes(fechaEnvio.getMonth() + 1);
    const dia = fechaEnvio.getDate();

    const fecha = dia + " " + mes + " " + año;
    //console.log(fecha);

    // Si hay una nota en edición
    if (editandoNotaId) {
        const index = notas.findIndex(n => n.id_notas === editandoNotaId);

        if(index !== -1){
            notas[index].titulo = titulo;
            notas[index].contenido = contenido;
            notas[index].fecha = fecha;
        } else {
            mostrarError("Error al tratar de guardar la editación de la nota");
        }
    } else {
        const nuevoId = notas.length > 0 ? Math.max(...notas.map(n => n.id_notas)) + 1 : 1;

        const nuevaNota = {
            id_notas: nuevoId,
            id_usuario: sesion.id_usuario,
            titulo: titulo,
            contenido: contenido,
            fecha: fecha
        };

        notas.push(nuevaNota);
    }

    localStorage.setItem('notas', JSON.stringify(notas));

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal_nota'));
    modal.hide();

    mostrarSuccess(editandoNotaId ? "Nota actualizada correctamente" : "Nota creada exitosamente");
    console.log(notas);

    cargarNotas();
}

function obtenerMes(mes){
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

function cargarNotas(){
    // Cargar desde LocalStorage
    const notasGuardadas = localStorage.getItem('notas');
    if (notasGuardadas) {
        notas = JSON.parse(notasGuardadas);
    } else {
        notas = [];
    }

    let notasUsuario;

    if(sesion.rol === "admin"){
        console.log("Cargando todas las notas (admin)");
        notasUsuario = notas;
    } else {
        console.log("Cargando notas del usuario:", sesion.id_usuario);
        notasUsuario = notas.filter(nota => nota.id_usuario === sesion.id_usuario);
    }

    const listaNotas = document.getElementById('lista_notas');
    const noNotas = document.getElementById('no_notas');

    if(notasUsuario.length === 0){
        listaNotas.innerHTML = ''
        noNotas.style.display = 'block';
        return;
    }

    noNotas.style.display = 'none';

    let html = '';
    notasUsuario.forEach(nota => { 
        let autor = "Usuario";

        if(sesion.rol === "admin") {
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const usuarioNota = usuarios.find(u => u.id_usuario === nota.id_usuario);
            autor = usuarioNota ? usuarioNota.correo : "Usuario";
        } else {
            autor = sesion.correo || 'Usuario';
        }
        
        html += `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card card-nota">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span class="text-truncate">${nota.titulo}</span>
                    <div>
                        <button class="btn btn-sm btn-nota boton_secondary_tema me-1" onclick="mostrarModalEditarNota(${nota.id_notas})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-nota boton_danger_tema" onclick="eliminarNota(${nota.id_notas})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <p class="card-text">${nota.contenido}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <small>${nota.fecha}</small>
                    <small>${sesion.correo || 'Usuario'}</small>
                </div>
            </div>
        </div>
        `
    });

    listaNotas.innerHTML = html;
}

function eliminarNota(id) {
    const idNumero = parseInt(id);

    const nota = notas.find(n => n.id_notas === idNumero);

    if (!nota || (sesion.rol !== "admin" && nota.id_usuario !== sesion.id_usuario)) {
        mostrarError("No tienes permisos para eliminar esta nota");
        return;
    }

    mostrarConfirmacion("¿Estás seguro de que quieres eliminar esta nota?", 
        function(){
            notas = notas.filter(nota => nota.id_notas !== idNumero);
            localStorage.setItem('notas', JSON.stringify(notas));
            mostrarSuccess("Nota eliminada correctamente");
            cargarNotas();
        },
        function() {
            console.log('Eliminación cancelada');
        }
    )
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