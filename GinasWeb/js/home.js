console.log("Conexión exitosa");

var sesion;
let dragSrcEl = null;
let tareas = [];
let proyectos = [];

const ROLES = {
    ADMIN: 'admin',
    USUARIO: 'usuario'
};

// Cuando se inicializa
document.addEventListener('DOMContentLoaded', function(){
    // Verificamos si en localStorage hay sesion
    if(localStorage.getItem('sesion')){
        sesion = JSON.parse(localStorage.getItem('sesion'));
        const correo = sesion.correo;

        mostrarInfoUsuario();
    } else {
        window.location.href = "index.html";
    }

    // Cargar tareas y proyectos
    cargarDatos();
    cargarProyectosEnSelect();
    mostrarTareas('todos');

    // Evento para cambiar de proyecto
    document.getElementById('select-proyecto').addEventListener('change', function(e) {
        mostrarTareas(e.target.value);
    });

    // Manejar cierre de sesión
    document.getElementById('btn_cerrar_sesion').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('sesion');
        window.location.href = "index.html";
    });
});

// Cargar info del usuario
function mostrarInfoUsuario() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioActual = usuarios.find(u => u.id_usuario === sesion.id_usuario);
    
    if (usuarioActual) {
        console.log('Usuario actual:', usuarioActual.nombre, '- Rol:', usuarioActual.rol);
        
        const header = document.querySelector('h1');
        if (header) {
            header.innerHTML = `Panel de Control 
                <span class="badge ${usuarioActual.rol === ROLES.ADMIN ? 'bg-admin' : 'bg-primary'} ms-2">
                    ${usuarioActual.rol === ROLES.ADMIN ? 'Administrador' : 'Usuario'}
                </span>`;
        }
    }
}

function cargarDatos() {
    if(localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'));
    }
    if(localStorage.getItem('proyectos')) {
        proyectos = JSON.parse(localStorage.getItem('proyectos'));
        
    }
}

function cargarProyectosEnSelect() {
    const select = document.getElementById('select-proyecto');
    select.innerHTML = '<option value="todos">Todas las tareas</option>';
    
    const proyectosFiltrados = filtrarProyectosPorRol(proyectos);
    
    proyectosFiltrados.forEach(proyecto => {
        const option = document.createElement('option');
        option.value = proyecto.id_proyecto;
        option.textContent = proyecto.nombre;
        select.appendChild(option);
    });

    if (proyectosFiltrados.length === 0 && sesion.rol !== ROLES.ADMIN) {
        const option = document.createElement('option');
        option.value = "sin_proyectos";
        option.textContent = "No tienes proyectos asignados";
        option.disabled = true;
        select.appendChild(option);
    }
}

function mostrarTareas(proyectoId) {
    const lista = document.getElementById('lista-tareas');
    lista.innerHTML = '';

    // Filtrar tareas por rol primero
    let tareasFiltradas = filtrarTareasPorRol(tareas);
    
    // Luego filtrar por proyecto si es necesario
    if(proyectoId !== 'todos') {
        tareasFiltradas = tareasFiltradas.filter(t => t.id_proyecto == proyectoId);
    }

    // Mostrar mensaje según el rol si no hay tareas
    if(tareasFiltradas.length === 0) {
        let mensaje = 'No hay tareas para este proyecto';
        if (sesion.rol !== ROLES.ADMIN && proyectoId === 'todos') {
            mensaje = 'No tienes tareas asignadas';
        } else if (sesion.rol !== ROLES.ADMIN && proyectoId !== 'todos') {
            mensaje = 'No tienes tareas asignadas en este proyecto';
        }
        
        lista.innerHTML = `
            <div class="no-tareas">
                <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                <p>${mensaje}</p>
            </div>
        `;
        return;
    }

    // Ordenar por orden_prioridad si existe, sino por el orden original
    tareasFiltradas.sort((a, b) => {
        const ordenA = a.orden_prioridad !== undefined ? a.orden_prioridad : 999;
        const ordenB = b.orden_prioridad !== undefined ? b.orden_prioridad : 999;
        return ordenA - ordenB; // orden ascendente por orden de prioridad
    });

    // Agregar cada tarea a la lista
    tareasFiltradas.forEach((tarea, index) => {
        const div = document.createElement('div');
        div.className = 'tarea-item';
        div.draggable = true;
        div.dataset.tareaId = tarea.id_tarea;

        // Obtener nombre del proyecto
        const proyecto = proyectos.find(p => p.id_proyecto == tarea.id_proyecto);
        const nombreProyecto = proyecto ? proyecto.nombre : 'Sin proyecto';

        // Convertir
        let prioridadClase = 'prioridad-baja';
        let prioridadTexto = tarea.prioridad;
        if(tarea.prioridad === 'alta') {
            prioridadClase = 'prioridad-alta';
            prioridadTexto = 'Alta';
        } else if(tarea.prioridad === 'media') {
            prioridadClase = 'prioridad-media';
            prioridadTexto = 'media';
        } else {
            prioridadTexto = 'baja';
        }

        div.innerHTML = `
            <div class="tarea-titulo">
            
                <i class="bi bi-tornado me-2"></i>
                ${tarea.titulo}
            </div>

            <div class="tarea-descripcion">${tarea.descripcion}</div>
            <div class="tarea-meta">
                <span class="prioridad-badge ${prioridadClase}">
                    <i class="bi bi-flag-fill me-1"></i>${prioridadTexto}
                </span>
                <span class="estado-badge estado-${tarea.estado}">
                    ${tarea.estado.replace('_', ' ')}
                </span>
                <span class="text-muted">
                    <i class="bi bi-folder me-1"></i>${nombreProyecto}
                </span>
                ${tarea.fecha_vencimiento ? `
                    <span class="text-muted">
                        <i class="bi bi-calendar-event me-1"></i>${tarea.fecha_vencimiento}
                    </span>
                ` : ''}
            </div>
        `;

        // Agregar eventos de drag and drop
        div.addEventListener('dragstart', dragStart); // cuando empieza a arrastrarse
        div.addEventListener('dragover', dragOver); // Mientras se pasa sobre otro
        div.addEventListener('drop', drop); // cuando se suelta sobre otro
        div.addEventListener('dragend', dragEnd); // cuando termina el arrastre
        div.addEventListener('dragenter', dragEnter); // Entra en limites de div
        div.addEventListener('dragleave', dragLeave); // Sale de los limites

        lista.appendChild(div); //agrega el nuevo elemento a la lista
    });
}

// Cuando se arrastre
function dragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

// Cuando pase por encima
function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

// Cuando este en los limites
function dragEnter(e) {
    if(dragSrcEl !== this) {
        this.classList.add('drag-over');
    }
}

// Cuando salga de los limites
function dragLeave(e) {
    this.classList.remove('drag-over');
}

// Cuando suelte
function drop(e) {
    e.preventDefault();
    e.stopPropagation();
            
    this.classList.remove('drag-over');

    if (dragSrcEl !== this) {
        // Obtener el contenedor padre
        const lista = document.getElementById('lista-tareas');
                
        // Obtener posición de ambos elementos
        const draggedIndex = Array.from(lista.children).indexOf(dragSrcEl);
        const targetIndex = Array.from(lista.children).indexOf(this);
                
        // Mover el elemento en el DOM
        if (draggedIndex < targetIndex) {
            this.parentNode.insertBefore(dragSrcEl, this.nextSibling);
        } else {
            this.parentNode.insertBefore(dragSrcEl, this);
        }
        // Guardar el nuevo orden en localStorage
        guardarOrden();
    }

    return false;
}

// Cuando termina el arrasre
function dragEnd(e) {
    this.classList.remove('dragging');
            
    // Limpiar todas las clases drag-over
    document.querySelectorAll('.tarea-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

// Función para filtrar tareas por rol
function filtrarTareasPorRol(datos) {
    if (sesion.rol === ROLES.ADMIN) {
        return datos;
    } else {
        return datos.filter(tarea => tarea.asignado_a === sesion.id_usuario);
    }
}

// Función para filtrar proyectos por rol
function filtrarProyectosPorRol(datos) {
    if (sesion.rol === ROLES.ADMIN) {
        return datos;
    } else {
        const tareasUsuario = tareas.filter(t => t.asignado_a === sesion.id_usuario);
        const proyectosIds = [...new Set(tareasUsuario.map(t => t.id_proyecto))];
        return datos.filter(proyecto => proyectosIds.includes(proyecto.id_proyecto));
    }
}


function guardarOrden() {
    const items = document.querySelectorAll('.tarea-item');
    const proyectoActual = document.getElementById('select-proyecto').value;
    
    // Obtener IDs en el nuevo orden
    let ordenActual = [];
    items.forEach((item, index) => {
        ordenActual.push({
            id: parseInt(item.dataset.tareaId),
            orden: index
        });
    });

    console.log('Nuevo orden:', ordenActual);
    const totalTareas = items.length;

    ordenActual.forEach((item, index) => {
        const tareaIndex = tareas.findIndex(t => t.id_tarea === item.id);
        if(tareaIndex !== -1) {
            // Calcular prioridad basada en la posición
            let nuevaPrioridad;
            
            if (index === 0) {
                // Primera posición = Alta prioridad
                nuevaPrioridad = 'alta';
            } else if (index === totalTareas - 1) {
                // Última posición = Baja prioridad
                nuevaPrioridad = 'baja';
            } else if (index < totalTareas / 2) {
                // Primera mitad = Media-alta prioridad
                nuevaPrioridad = 'media';
            } else {
                // Segunda mitad = Media-baja prioridad
                nuevaPrioridad = 'media';
            }
            
            // Actualizar tanto el orden como la prioridad
            tareas[tareaIndex].orden_prioridad = index;
            tareas[tareaIndex].prioridad = nuevaPrioridad;
        }
    });

    // Guardar en localStorage
    localStorage.setItem('tareas', JSON.stringify(tareas));
    console.log('Orden guardado en localStorage');
    console.log('Tareas actualizadas:', tareas);

    // Mostramos la tarea en la que nos encontramos
    mostrarTareas(proyectoActual);
}

function quitarInfo(){
    const vistaInfo = document.getElementById('info');
    vistaInfo.classList.add('d-none');
}