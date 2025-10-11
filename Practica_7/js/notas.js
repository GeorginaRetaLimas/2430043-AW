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
    const nota = notas.find(n => n.id_notas === id);

    if (nota) {
        editandoNotaId = id;

        document.getElementById('modal_titulo').textContent = 'Editar Nota';
        document.getElementById('titulo').value = nota.titulo;
        document.getElementById('contenido').value = nota.contenido;
        document.getElementById('nota_id').value = nota.id_notas;
        
        const modal = new bootstrap.Modal(document.getElementById('modal_nota'));
        modal.show();
    } else {
        mostrarError("No se encontro la nota");
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
    const mes = obtenerMes(fechaEnvio.getMonth());
    const dia = fechaEnvio.getDate();

    const fecha = dia + " " + mes + " " + año;
    //console.log(fecha);

    // Si hay una nota en edición
    if (editandoNotaId) {
        const index = notas.find(n => n.id_notas === editandoNotaId);

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
            id_notas: id,
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
    modal.hide;

    mostrarSuccess(editandoNotaId ? "Nota actualizada correctamente" : "Nota creada exitosamente");
    console.log(notas);

    cargarNotas();
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

function cargarNotas(){
    // Cargar desde LocalStorage
    const notasGuardadas = localStorage.getItem('notas');
    if (notasGuardadas) {
        notas = JSON.parse(notasGuardadas);
    }

    // Filtrar por el usuario actual
    const notasUsuario = notas.filter(nota => nota.id_usuario === sesion.id_usuario);

    const listaNotas = document.getElementById('lista_notas');
    const noNotas = document.getElementById('no_notas');

    if(notasUsuario.length === 0){
        listaNotas.innerHTML = ''
        noNotas.style.display = 'block';
        return;
    }

    noNotas.style.display = 'none';

    let html = '';
    notasUsuario.forEach(nota => { html += `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card card-nota">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span class="text-truncate>${nota.titulo}</span>
                    
                    <div>
                        <button class="btn btn-sm btn-nota btn_primary_tema me-1"
                            onclick="mostrarModarEditarNota(${nota.id_notas})">
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button class="btn btn-sm btn-nota btn_danger_tema" 
                            onclick="eliminarNota(${nota.id_notas})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>

                <div class="card-body">
                    <p class="card-text">${nota.contenido}</p>
                <div>
                
                <div class="card-footer d-flex justify-content-between">
                    <small>${nota.fecha}</small>
                    <small>${sesion.nombre}</small>
                </div>
            </div>
        </div>

        `
    });

    listaNotas.innerHTML = html;
}

function eliminarNota(id) {
    if (confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
        notas = notas.filter(nota => nota.id_notas !== id);
        localStorage.setItem('notas', JSON.stringify(notas));
        mostrarSuccess("Nota eliminada correctamente");
        cargarNotas();
    }
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