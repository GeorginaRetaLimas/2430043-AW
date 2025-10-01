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

    // Cargar usuarios existentes del localStorage
    if(localStorage.getItem('usuarios')) {
        usuarios = JSON.parse(localStorage.getItem('usuarios'));
        console.log("Usuarios cargados:", usuarios);
    }

    // Mostrar usuarios en la tabla al cargar la página
    mostrarUsuarios();

    // Manejar el envío del formulario
    document.getElementById('form_registro').addEventListener('submit', function(e){
        e.preventDefault();
        
        // Obtener valores del formulario
        const correo = document.getElementById('correo').value;
        const contraseña = document.getElementById('contraseña').value;

        // Validar que los campos no estén vacíos
        if(!correo || !contraseña) {
            alert('Por favor, complete todos los campos');
            return;
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = usuarios.find(user => user.correo === correo);
        
        if(usuarioExistente) {
            alert('Estos datos ya están registrados');
            return;
        }

        // Crear nuevo usuario
        const nuevoUsuario = {
            correo: correo,
            contraseña: contraseña
        };

        // Agregar a la lista de usuarios
        usuarios.push(nuevoUsuario);

        // Guardar en localStorage
        guardarEnLocalStorage();

        // Mostrar mensaje de éxito
        alert('Estudiante registrado exitosamente');

        // Actualizar la tabla
        mostrarUsuarios();

        // Limpiar el formulario
        document.getElementById('form_inicio_Sesion').reset();

        console.log('Nuevo usuario registrado:', nuevoUsuario);
        console.log('Total de usuarios:', usuarios);
    });

    // Manejar cierre de sesión
    document.getElementById('btn_cerrar_sesion').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('sesion');
        window.location.href = "index.html";
    });
});

// Función para mostrar usuarios en la tabla
function mostrarUsuarios() {
    const contenedor = document.getElementById('lista_estudiantes');
    if (!contenedor) {
        console.log('No se encontró el contenedor de la tabla');
        return;
    }

    // Limpiar la tabla
    contenedor.innerHTML = '';
    
    // Verificar si no hay usuarios
    if (usuarios.length === 0) {
        contenedor.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">No hay estudiantes registrados</td>
            </tr>
        `;
        return;
    }
    
    // Agregar cada usuario a la tabla
    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');

        // Hacer la fila
        fila.innerHTML = `
            <td>${usuario.correo}</td>
            <td>
                <button class="btn boton_danger_tema btn-sm" onclick="eliminarUsuario('${usuario.correo}')">
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
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    console.log('Datos guardados en localStorage');
}

// Cargar usuarios
function cargarUsuarios() {
    if(localStorage.getItem('usuarios')) {
        return JSON.parse(localStorage.getItem('usuarios'));
    }
    return [];
}

// Eliminar alumno
function eliminarUsuario(correo) {
    if(confirm(`¿Estás seguro de que quieres eliminar al estudiante ${correo}?`)) {
        usuarios = usuarios.filter(user => user.correo !== correo);
        guardarEnLocalStorage();
        mostrarUsuarios(); 
        console.log(`Usuario ${correo} eliminado`);
        alert('Estudiante eliminado correctamente');
    }
}