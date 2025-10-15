console.log("Conexión exitosa");

// Lista de usarios
let tareas = [];

const ROLES = {
    ADMIN: 'admin',
    USUARIO: 'usuario'
};

cargarProyectosEnSelect();
cargarUsuariosEnSelect();

// Cuando se inicializa
document.addEventListener('DOMContentLoaded', function(){
    // Verificamos si en el localStorage hay sesion
    if(localStorage.getItem('sesion')){
        sesion = JSON.parse(localStorage.getItem('sesion'));
        console.log("Sesión activa:", sesion);
    } else {
        window.location.href = "index.html";
    }

    if(!localStorage.getItem('proyectos')){
        mostrarError("No hay ningun proyecto creado, primero cree uno luego asigne tareas");
    }

    // Cargar tareas existentes del localStorage
    if(localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'));
        console.log("Tareas cargados:", tareas);
    }

    // Mostrar tareas en la tabla al cargar la página
    mostrarTareas();

    // Manejar el envío del formulario
    document.getElementById('form_tareas').addEventListener('submit', function(e){
        e.preventDefault();
        
        const id = tareas.length > 0 ? Math.max(...tareas.map(p => p.id_tarea)) + 1 : 1;

        // Obtener valores del formulario
        const proyecto = document.getElementById('proyecto').value || null;
        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const estado = document.getElementById('estado').value;
        const prioridad = document.getElementById('prioridad').value;
        const vencimiento = document.getElementById('fecha_vencimiento').value;
        const asignado = document.getElementById('asignado').value;

        // Crear nuevo usuario
        const nuevaTarea = {
            id_tarea: id,
            id_proyecto: proyecto,
            titulo: titulo,
            descripcion: descripcion,
            estado: estado,
            prioridad: prioridad,
            fecha_vencimiento: vencimiento,
            asignado_a: asignado
        };

        // Agregar a la lista de tareas
        tareas.push(nuevaTarea);

        // Guardar en localStorage
        guardarEnLocalStorage();

        // Mostrar mensaje de éxito
        mostrarSuccess("Tarea registrado exitosamente");

        // Actualizar la tabla
        mostrarTareas();

        // Limpiar el formulario
        document.getElementById('form_tareas').reset();

        console.log('Tarea registrado:', nuevaTarea);
        console.log('Total de tareas:', tareas);
    });

    // Manejar cierre de sesión
    document.getElementById('btn_cerrar_sesion').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('sesion');
        window.location.href = "index.html";
    });
});

function cargarProyectosEnSelect() {
    const selectProyecto = document.getElementById('proyecto');
    const proyectos = JSON.parse(localStorage.getItem('proyectos')) || [];
    
    proyectos.forEach(proyecto => {
        const option = document.createElement('option');
        option.value = proyecto.id_proyecto;
        option.textContent = proyecto.nombre;
        selectProyecto.appendChild(option);
    });
}

function cargarUsuariosEnSelect() {
    const selectAsignado = document.getElementById('asignado');
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    usuarios.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.id_usuario;
        option.textContent = usuario.correo;
        selectAsignado.appendChild(option);
    });
}

// Función para mostrar Tareas en la tabla
function mostrarTareas() {
    const contenedor = document.getElementById('lista_tareas');
    if (!contenedor) {
        console.log('No se encontró el contenedor de la tabla');
        return;
    }

    // Limpiar la tabla
    contenedor.innerHTML = '';
    
    const datosFiltrados = filtrarTareasPorRol(tareas);
    
    // Verificar si no hay tareas
    if (datosFiltrados.length === 0) {
        contenedor.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">No hay tareas registradas</td>
            </tr>
        `;
        return;
    }
    
    // Agregar cada tarea a la tabla
    datosFiltrados.forEach(tarea => {
        const fila = document.createElement('tr');
        
        const puedeEditar = tienePermisosTarea(tarea);
        const botones = puedeEditar ? `
            <button class="btn btn-sm boton_primary_tema me-1" onclick="mostrarModalEditarTarea(${tarea.id_tarea})">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm boton_danger_tema" onclick="eliminarTarea(${tarea.id_tarea})">
                <i class="bi bi-trash"></i>
            </button>
        ` : '<span class="text-muted">Sin permisos</span>';

        // Obtener nombre del proyecto y usuario
        const proyecto = obtenerNombreProyecto(tarea.id_proyecto);
        const usuario = obtenerNombreUsuario(tarea.asignado_a);

        // Hacer la fila
        fila.innerHTML = `
            <td>${tarea.id_tarea}</td>
            <td>${proyecto}</td>
            <td>${tarea.titulo}</td>
            <td>${tarea.descripcion}</td>
            <td>
                <span class="badge ${obtenerClaseEstadoTarea(tarea.estado)}">${tarea.estado}</span>
            </td>
            <td>
                <span class="badge ${obtenerClasePrioridad(tarea.prioridad)}">${tarea.prioridad}</span>
            </td>
            <td>${formatearFecha(tarea.fecha_vencimiento)}</td>
            <td>${usuario}</td>
            <td>
                <div class="btn-group">
                    ${botones}
                </div>
            </td>
        `;

        // Agregar la fila
        contenedor.appendChild(fila);
    });
}

function obtenerNombreProyecto(idProyecto) {
    const proyectos = JSON.parse(localStorage.getItem('proyectos')) || [];
    const proyecto = proyectos.find(p => p.id_proyecto === idProyecto);
    return proyecto ? proyecto.nombre : 'Sin proyecto';
}

function obtenerNombreUsuario(idUsuario) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.id_usuario === idUsuario);
    return usuario ? usuario.nombre : 'Sin asignar';
}

// Función para obtener clase CSS según prioridad (CORREGIR)
function obtenerClasePrioridad(prioridad) {
    const clases = {
        'alta': 'bg-danger',
        'media': 'bg-warning',
        'baja': 'bg-info'
    };
    return clases[prioridad] || 'bg-secondary';
}

// Función para obtener clase CSS según estado de tarea (CORREGIR)
function obtenerClaseEstadoTarea(estado) {
    const clases = {
        'pendiente': 'bg-warning',
        'en_proceso': 'bg-primary',
        'hecha': 'bg-success'
    };
    return clases[estado] || 'bg-secondary';
}

// Función para formatear fecha (CORREGIR)
function formatearFecha(fecha) {
    if (!fecha) return 'No definida';
    try {
        return new Date(fecha).toLocaleDateString('es-ES');
    } catch (error) {
        return 'Fecha inválida';
    }
}

function filtrarTareasPorRol(datos) {
    if (sesion.rol === ROLES.ADMIN) {
        return datos;
    } else {
        return datos.filter(tarea => tarea.asignado_a === sesion.id_usuario);
    }
}

function tienePermisosTarea(tarea) {
    if (sesion.rol === ROLES.ADMIN) {
        return true;
    }
    return tarea.asignado_a === sesion.id_usuario;
}

function mostrarModalEditarTarea(idTarea) {
    const tarea = tareas.find(t => t.id_tarea === idTarea);
    
    if (!tarea) {
        mostrarError('Tarea no encontrada');
        return;
    }
    
    // Verificar permisos
    if (!tienePermisosTarea(tarea)) {
        mostrarError('No tienes permisos para editar esta tarea');
        return;
    }
    
    // Llenar formulario de edición
    document.getElementById('proyecto_edicion').value = tarea.id_proyecto;
    document.getElementById('titulo_edicion').value = tarea.titulo;
    document.getElementById('descripcion_edicion').value = tarea.descripcion;
    document.getElementById('estado_edicion').value = tarea.estado;
    document.getElementById('prioridad_edicion').value = tarea.prioridad;
    document.getElementById('fecha_vencimiento_edicion').value = tarea.fecha_vencimiento;
    document.getElementById('asignado_edicion').value = tarea.asignado_a;
    
    // Guardar el ID de la tarea que se está editando
    document.getElementById('tarea_id_edicion').value = tarea.id_tarea;
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modal_edicion_tarea'));
    modal.show();
}

// Función para guardar edición de tarea
function guardarEdicionTarea() {
    const idTarea = parseInt(document.getElementById('tarea_id_edicion').value);
    const proyecto = document.getElementById('proyecto_edicion').value;
    const titulo = document.getElementById('titulo_edicion').value.trim();
    const descripcion = document.getElementById('descripcion_edicion').value.trim();
    const estado = document.getElementById('estado_edicion').value;
    const prioridad = document.getElementById('prioridad_edicion').value;
    const vencimiento = document.getElementById('fecha_vencimiento_edicion').value;
    const asignado = document.getElementById('asignado_edicion').value;

    // Validaciones
    if (!titulo || !descripcion) {
        mostrarError('Título y descripción son obligatorios');
        return false;
    }

    // Encontrar y actualizar la tarea
    const tareaIndex = tareas.findIndex(t => t.id_tarea === idTarea);
    if (tareaIndex === -1) {
        mostrarError('Tarea no encontrada');
        return false;
    }

    // Actualizar datos de la tarea
    tareas[tareaIndex].id_proyecto = proyecto;
    tareas[tareaIndex].titulo = titulo;
    tareas[tareaIndex].descripcion = descripcion;
    tareas[tareaIndex].estado = estado;
    tareas[tareaIndex].prioridad = prioridad;
    tareas[tareaIndex].fecha_vencimiento = vencimiento;
    tareas[tareaIndex].asignado_a = asignado;

    // Guardar en localStorage
    guardarEnLocalStorage();

    // Actualizar tabla
    mostrarTareas();

    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal_edicion_tarea'));
    modal.hide();

    // Mostrar mensaje de éxito
    mostrarSuccess('Tarea actualizada correctamente');

    return true;
}

// Eliminar tarea
function eliminarTarea(idTarea) {
    const tarea = tareas.find(t => t.id_tarea === idTarea);

    if (!tarea) {
        mostrarError('Tarea no encontrada');
        return;
    }

    // Verificar permisos
    if (!tienePermisosTarea(tarea)) {
        mostrarError('No tienes permisos para eliminar esta tarea');
        return;
    }

    const titulo = tarea.titulo;

    mostrarConfirmacion(
        `¿Estás seguro de que quieres eliminar la tarea "${tarea.titulo}"? Esta acción no se puede deshacer.`,
        function() {
            tareas = tareas.filter(t => t.id_tarea !== idTarea);
            guardarEnLocalStorage();
            mostrarTareas(); 
            console.log(`Tarea ${idTarea} eliminada`);
            mostrarSuccess('Tarea eliminada correctamente');
        },
        function() {
            console.log('Eliminación cancelada');
        }
    );
}

// Función de guardar en localStorage
function guardarEnLocalStorage(){
    localStorage.setItem('tareas', JSON.stringify(tareas));
    console.log('Datos guardados en localStorage');
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