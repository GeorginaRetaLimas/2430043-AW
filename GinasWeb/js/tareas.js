console.log("Conexión exitosa");

// Lista de usarios
let tareas = [];

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

        //Nota a mi misma: Validar las fechas despues, que no ingrese una fecha fin antes de fecha inicio

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
    
    // Verificar si no hay tareas
    if (tareas.length === 0) {
        contenedor.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">No hay proyectos registrados</td>
            </tr>
        `;
        return;
    }
    
    // Agregar cada usuario a la tabla
    tareas.forEach(tareas => {
        const fila = document.createElement('tr');

        // Hacer la fila
        fila.innerHTML = `
            <td>${tareas.id_tarea}</td>
            <td>${tareas.id_proyecto}</td>
            <td>${tareas.titulo}</td>
            <td>${tareas.descripcion}</td>
            <td>${tareas.estado}</td>
            <td>${tareas.prioridad}</td>
            <td>${tareas.fecha_vencimiento}</td>
            <td>${tareas.asignado_a}</td>
            <td>
                <button class="btn boton_danger_tema btn-sm" onclick="eliminarTarea('${tareas.id}')">
                    Eliminar
                </button>
            </td>
        `;

        // Agregar la fila
        contenedor.appendChild(fila);
    });
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