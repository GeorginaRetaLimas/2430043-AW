console.log("Conexión exitosa");

// Lista de usarios
let proyectos = [];

const ROLES = {
    ADMIN: 'admin',
    USUARIO: 'usuario'
};

// Cuando se inicializa
document.addEventListener('DOMContentLoaded', function(){
    // Verificamos si en el localStorage hay sesion
    if(localStorage.getItem('sesion')){
        sesion = JSON.parse(localStorage.getItem('sesion'));
        console.log("Sesión activa:", sesion);
    } else {
        window.location.href = "index.html";
    }

    // Cargar proyectos existentes del localStorage
    if(localStorage.getItem('proyectos')) {
        proyectos = JSON.parse(localStorage.getItem('proyectos'));
        console.log("Proyectos cargados:", proyectos);
    }

    // Mostrar proyectos en la tabla al cargar la página
    mostrarProyectos();

    // Manejar el envío del formulario
    document.getElementById('form_proyecto').addEventListener('submit', function(e){
        e.preventDefault();
        
        const id = proyectos.length > 0 ? Math.max(...proyectos.map(p => p.id_proyecto)) + 1 : 1;

        // Obtener valores del formulario
        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const estado = document.getElementById('estado').value;
        const fechaInicio = document.getElementById('fecha_inicio').value;
        const fechaFin = document.getElementById('fecha_fin').value;

        //Nota a mi misma: Validar las fechas despues, que no ingrese una fecha fin antes de fecha inicio

        // Crear nuevo usuario
        const nuevoProyecto = {
            id_proyecto: id,
            nombre: nombre,
            descripcion: descripcion,
            estado: estado,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
        };

        // Agregar a la lista de proyectos
        proyectos.push(nuevoProyecto);

        // Guardar en localStorage
        guardarEnLocalStorage();

        // Mostrar mensaje de éxito
        mostrarSuccess('Proyecto registrado exitosamente');

        // Actualizar la tabla
        mostrarProyectos();

        // Limpiar el formulario
        document.getElementById('form_proyecto').reset();

        console.log('Proyecto registrado:', nuevoProyecto);
        console.log('Total de proyectos:', proyectos);
    });

    // Manejar cierre de sesión
    document.getElementById('btn_cerrar_sesion').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('sesion');
        window.location.href = "index.html";
    });
});

function mostrarProyectos() {
    const contenedor = document.getElementById('lista_proyectos');
    if (!contenedor) {
        console.log('No se encontró el contenedor de la tabla');
        return;
    }

    // Limpiar la tabla
    contenedor.innerHTML = '';
    
    const datosFiltrados = filtrarProyectosPorRol(proyectos);
    
    // Verificar si no hay proyectos
    if (datosFiltrados.length === 0) {
        contenedor.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No hay proyectos registrados</td>
            </tr>
        `;
        return;
    }
    
    // Agregar cada proyecto a la tabla
    datosFiltrados.forEach(proyecto => {
        const fila = document.createElement('tr');
        
        const puedeEditar = tienePermisosProyecto(proyecto);
        const botones = puedeEditar ? `
            <button class="btn btn-sm boton_primary_tema me-1" onclick="mostrarModalEditarProyecto(${proyecto.id_proyecto})">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm boton_danger_tema" onclick="eliminarProyecto(${proyecto.id_proyecto})">
                <i class="bi bi-trash"></i>
            </button>
        ` : '<span class="text-muted">Sin permisos</span>';

        // Hacer la fila
        fila.innerHTML = `
            <td>${proyecto.id_proyecto}</td>
            <td>${proyecto.nombre}</td>
            <td>${proyecto.descripcion}</td>
            <td>
                <span class="badge ${obtenerClaseEstado(proyecto.estado)}">${proyecto.estado}</span>
            </td>
            <td>${formatearFecha(proyecto.fecha_inicio)}</td>
            <td>${formatearFecha(proyecto.fecha_fin)}</td>
            <td>
                <div class="btn-group">
                    ${botones}
                </div>
            </td>
        `;

        contenedor.appendChild(fila);
    });
}

function obtenerClaseEstado(estado) {
    const clases = {
        'pendiente': 'bg-warning',
        'en_proceso': 'bg-primary',
        'hecha': 'bg-success'
    };
    return clases[estado] || 'bg-secondary';
}

function formatearFecha(fecha) {
    if (!fecha) return 'No definida';
    return new Date(fecha).toLocaleDateString('es-ES');
}

function filtrarProyectosPorRol(datos) {
    if (sesion.rol === ROLES.ADMIN) {
        return datos;
    } else {
        return datos;
    }
}

function tienePermisosProyecto(proyecto) {
    if (sesion.rol === ROLES.ADMIN) {
        return true;
    }
    return true;
}

// Función de guardar en localStorage
function guardarEnLocalStorage(){
    localStorage.setItem('proyectos', JSON.stringify(proyectos));
    console.log('Datos guardados en localStorage');
}


function mostrarModalEditarProyecto(idProyecto) {
    const proyecto = proyectos.find(p => p.id_proyecto === idProyecto);
    
    if (!proyecto) {
        mostrarError('Proyecto no encontrado');
        return;
    }
    
    // Verificar permisos
    if (!tienePermisosProyecto(proyecto)) {
        mostrarError('No tienes permisos para editar este proyecto');
        return;
    }
    
    // Llenar formulario de edición (necesitarás crear un modal similar al de estudiantes)
    document.getElementById('nombre_edicion').value = proyecto.nombre;
    document.getElementById('descripcion_edicion').value = proyecto.descripcion;
    document.getElementById('estado_edicion').value = proyecto.estado;
    document.getElementById('fecha_inicio_edicion').value = proyecto.fecha_inicio;
    document.getElementById('fecha_fin_edicion').value = proyecto.fecha_fin;
    
    // Guardar el ID del proyecto que se está editando
    document.getElementById('proyecto_id_edicion').value = proyecto.id_proyecto;
    
    // Mostrar modal (necesitarás crear este modal en el HTML)
    const modal = new bootstrap.Modal(document.getElementById('modal_edicion_proyecto'));
    modal.show();
}

// Función para guardar edición de proyecto
function guardarEdicionProyecto() {
    const idProyecto = parseInt(document.getElementById('proyecto_id_edicion').value);
    const nombre = document.getElementById('nombre_edicion').value.trim();
    const descripcion = document.getElementById('descripcion_edicion').value.trim();
    const estado = document.getElementById('estado_edicion').value;
    const fechaInicio = document.getElementById('fecha_inicio_edicion').value;
    const fechaFin = document.getElementById('fecha_fin_edicion').value;

    // Validaciones
    if (!nombre || !descripcion) {
        mostrarError('Nombre y descripción son obligatorios');
        return false;
    }

    // Validar fechas
    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
        mostrarError('La fecha de fin no puede ser anterior a la fecha de inicio');
        return false;
    }

    // Encontrar y actualizar el proyecto
    const proyectoIndex = proyectos.findIndex(p => p.id_proyecto === idProyecto);
    if (proyectoIndex === -1) {
        mostrarError('Proyecto no encontrado');
        return false;
    }

    // Actualizar datos del proyecto
    proyectos[proyectoIndex].nombre = nombre;
    proyectos[proyectoIndex].descripcion = descripcion;
    proyectos[proyectoIndex].estado = estado;
    proyectos[proyectoIndex].fecha_inicio = fechaInicio;
    proyectos[proyectoIndex].fecha_fin = fechaFin;

    // Guardar en localStorage
    guardarEnLocalStorage();

    // Actualizar tabla
    mostrarProyectos();

    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal_edicion_proyecto'));
    modal.hide();

    // Mostrar mensaje de éxito
    mostrarSuccess('Proyecto actualizado correctamente');

    return true;
}

// Eliminar proyecto
function eliminarProyecto(idProyecto) {
    const proyecto = proyectos.find(p => p.id_proyecto === idProyecto);

    if (!proyecto) {
        mostrarError('Proyecto no encontrado');
        return;
    }

    // Verificar permisos
    if (!tienePermisosProyecto(proyecto)) {
        mostrarError('No tienes permisos para eliminar este proyecto');
        return;
    }

    const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    const tareasAsociadas = tareas.filter(t => t.id_proyecto === idProyecto);
    
    if (tareasAsociadas.length > 0) {
        mostrarError(`No se puede eliminar el proyecto. Tiene ${tareasAsociadas.length} tarea(s) asociada(s).`);
        return;
    }

    mostrarConfirmacion(
        `¿Estás seguro de que quieres eliminar el proyecto "${proyecto.nombre}"? Esta acción no se puede deshacer.`,
        function() {
            proyectos = proyectos.filter(p => p.id_proyecto !== idProyecto);
            guardarEnLocalStorage();
            mostrarProyectos(); 
            console.log(`Proyecto ${idProyecto} eliminado`);
            mostrarSuccess('Proyecto eliminado correctamente');
        },
        function() {
            console.log('Eliminación cancelada');
        }
    );
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
    let modalContainer = document.getElementById('modal-confirm-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-confirm-container';
        document.body.appendChild(modalContainer);
    }

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

    setTimeout(() => {
        const overlay = document.getElementById('modal-confirm-overlay');
        if (overlay) overlay.classList.add('show');
    }, 10);

    function cerrarModal() {
        const overlay = document.getElementById('modal-confirm-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => modalContainer.innerHTML = '', 300);
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