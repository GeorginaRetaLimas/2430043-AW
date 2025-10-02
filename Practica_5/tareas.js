console.log("Conexión exitosa - Tareas");

var sesion;
var tareas = [];

// Cuando se inicializa
document.addEventListener('DOMContentLoaded', function(){
    // Verificamos si en el localStorage hay sesion
    if(localStorage.getItem('sesion')){
        sesion = JSON.parse(localStorage.getItem('sesion'));
        
        // Cargar tareas del usuario actual
        if(sesion.tareas) {
            tareas = sesion.tareas;
        }
        
        mostrarTareas();
    } else {
        window.location.href = "index.html";
    }

    // Manejar cierre de sesión
    document.getElementById('btn_cerrar_sesion').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('sesion');
        window.location.href = "index.html";
    });

    // Manejar envío de formulario de tarea
    document.getElementById('form_tarea').addEventListener('submit', function(e){
        e.preventDefault();
        
        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        
        agregarTarea(titulo, descripcion);
    });
});

function agregarTarea(titulo, descripcion) {
    // Generar ID único cin e tamaño de tareas y Math.max
    const id = tareas.length > 0 ? Math.max(...tareas.map(t => t.id)) + 1 : 1;
    
    // Creamos una nueva tarea
    const nuevaTarea = {
        id: id,
        titulo: titulo,
        descripcion: descripcion
    };
    
    tareas.push(nuevaTarea);
    
    // Actualizar sesión en localStorage
    sesion.tareas = tareas;
    localStorage.setItem('sesion', JSON.stringify(sesion));
    
    // Actualizar lista de usuarios
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioIndex = usuarios.findIndex(user => user.correo === sesion.correo);
    if (usuarioIndex !== -1) {
        usuarios[usuarioIndex].tareas = tareas;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
    
    // Limpiar formulario y mostrar tareas
    document.getElementById('form_tarea').reset();
    mostrarTareas();
}

function mostrarTareas() {
    const listaTareas = document.getElementById('lista_tareas');
    listaTareas.innerHTML = '';
    
    if (tareas.length === 0) {
        listaTareas.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">No hay tareas registradas</td>
            </tr>
        `;
        return;
    }
    
    tareas.forEach(tarea => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${tarea.id}</td>
            <td>${tarea.titulo}</td>
            <td>${tarea.descripcion}</td>
            <td>
                <button class="btn btn-sm boton_danger_tema" onclick="eliminarTarea(${tarea.id})">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        `;
        listaTareas.appendChild(fila);
    });
}

function eliminarTarea(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        tareas = tareas.filter(tarea => tarea.id !== id);
        
        // Actualizar sesión en localStorage
        sesion.tareas = tareas;
        localStorage.setItem('sesion', JSON.stringify(sesion));
        
        // Actualizar lista de usuarios
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioIndex = usuarios.findIndex(user => user.correo === sesion.correo);
        if (usuarioIndex !== -1) {
            usuarios[usuarioIndex].tareas = tareas;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
        
        mostrarTareas();
    }
}