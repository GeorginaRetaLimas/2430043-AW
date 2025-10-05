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
        const asignadoSelect = document.getElementById('asignado');

        const usuariosAsignados = Array.from(asignadoSelect.selectedOptions)
            .map(option => option.value)
            .filter(value => value !== "");

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
            asignado_a: usuariosAsignados
        };

        // Agregar a la lista de tareas
        tareas.push(nuevaTarea);

        // Guardar en localStorage
        guardarEnLocalStorage();

        // Mostrar mensaje de éxito
        alert('Tarea registrado exitosamente');

        // Actualizar la tabla
        mostrarTareas();

        // Limpiar el formulario
        document.getElementById('form_tarea').reset();

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
        option.value = usuario.id_usuario || usuario.correo;
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
            <td>${tareas.fecha_fin}</td>
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