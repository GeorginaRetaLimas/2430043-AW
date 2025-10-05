console.log("Conexión exitosa");

var sesion;
let dragSrcEl = null;
let tareas = [];
let proyectos = [];

// Cuando se inicializa
document.addEventListener('DOMContentLoaded', function(){
    // Verificamos si en localStorage hay sesion
    if(localStorage.getItem('sesion')){
        sesion = JSON.parse(localStorage.getItem('sesion'));
        const correo = sesion.correo;
        document.getElementById('datos_sesion').textContent = "Bienvenido, " + correo;
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
    proyectos.forEach(proyecto => {
        const option = document.createElement('option');
        option.value = proyecto.id_proyecto;
        option.textContent = proyecto.nombre;
        select.appendChild(option);
    });
}

function mostrarTareas(proyectoId) {
    const lista = document.getElementById('lista-tareas');
    lista.innerHTML = '';

    // Filtrar tareas según el proyecto seleccionado
    let tareasFiltradas = tareas;
    if(proyectoId !== 'todos') {
        tareasFiltradas = tareas.filter(t => t.id_proyecto == proyectoId);
    }
    if(tareasFiltradas.length === 0) {
        lista.innerHTML = `
            <div class="no-tareas">
                <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                <p>No hay tareas para este proyecto</p>
            </div>
        `;
        return;
    }

    // Ordenar por orden_prioridad si existe, sino por el orden original
    tareasFiltradas.sort((a, b) => {
        const ordenA = a.orden_prioridad !== undefined ? a.orden_prioridad : 999;
        const ordenB = b.orden_prioridad !== undefined ? b.orden_prioridad : 999;
        return ordenA - ordenB;
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

        // Convertir prioridad
        let prioridadClase = 'prioridad-baja';
        let prioridadTexto = tarea.prioridad;
        if(tarea.prioridad === 'pendiente' || tarea.prioridad === 'Alta') {
            prioridadClase = 'prioridad-alta';
            prioridadTexto = 'Alta';
        } else if(tarea.prioridad === 'en_proceso' || tarea.prioridad === 'Media') {
            prioridadClase = 'prioridad-media';
            prioridadTexto = 'Media';
        } else {
            prioridadTexto = 'Baja';
        }

        div.innerHTML = `
            <div class="tarea-titulo">
                <i class="bi bi-grip-vertical me-2"></i>
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
        div.addEventListener('dragstart', dragStart);
        div.addEventListener('dragover', dragOver);
        div.addEventListener('drop', drop);
        div.addEventListener('dragend', dragEnd);
        div.addEventListener('dragenter', dragEnter);
        div.addEventListener('dragleave', dragLeave);

        lista.appendChild(div);
    });
}

function dragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function dragEnter(e) {
    if(dragSrcEl !== this) {
        this.classList.add('drag-over');
        }
}

function dragLeave(e) {
    this.classList.remove('drag-over');
}

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

function dragEnd(e) {
    this.classList.remove('dragging');
            
    // Limpiar todas las clases drag-over
    document.querySelectorAll('.tarea-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function guardarOrden() {
    const items = document.querySelectorAll('.tarea-item');
    const proyectoActual = document.getElementById('select-proyecto').value;
    
    // Obtener IDs en el nuevo orden
    const ordenActual = [];
    items.forEach((item, index) => {
        ordenActual.push({
            id: parseInt(item.dataset.tareaId),
            orden: index
        });
    });

    console.log('Nuevo orden:', ordenActual);

    // Si estamos viendo un proyecto específico, solo actualizamos esas tareas
    if(proyectoActual !== 'todos') {
        // Actualizar solo las tareas del proyecto actual
        ordenActual.forEach(item => {
            const tareaIndex = tareas.findIndex(t => t.id_tarea === item.id);
            if(tareaIndex !== -1) {
                tareas[tareaIndex].orden_prioridad = item.orden;
            }
        });
    } else {
        // Actualizar todas las tareas visibles
        ordenActual.forEach(item => {
            const tareaIndex = tareas.findIndex(t => t.id_tarea === item.id);
            if(tareaIndex !== -1) {
                tareas[tareaIndex].orden_prioridad = item.orden;
            }
        });
    }

    // Guardar en localStorage
    localStorage.setItem('tareas', JSON.stringify(tareas));
    console.log('Orden guardado en localStorage');
    console.log('Tareas actualizadas:', tareas);
}