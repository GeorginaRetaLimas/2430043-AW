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
            mostrarError('Por favor, complete todos los campos');
            return;
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = usuarios.find(user => user.correo === correo);
        
        if(usuarioExistente) {
            mostrarError('Estos datos ya están registrados');
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
        mostrarSuccess('Estudiante registrado exitosamente');

        // Actualizar la tabla
        mostrarUsuarios();

        // Limpiar el formulario
        document.getElementById('form_registro').reset();

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
    mostrarConfirmacion(
        `¿Estás seguro de que quieres eliminar al estudiante ${correo}? Esta acción no se puede deshacer.`,
        function() {
            // Código que se ejecuta si confirma
            usuarios = usuarios.filter(user => user.correo !== correo);
            guardarEnLocalStorage();
            mostrarUsuarios(); 
            console.log(`Usuario ${correo} eliminado`);
            mostrarSuccess('Estudiante eliminado correctamente');
        },
        function() {
            // Código que se ejecuta si cancela (opcional)
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