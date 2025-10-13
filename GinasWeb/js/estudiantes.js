console.log("Conexión exitosa");

// Lista de usarios
let usuarios = [];

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

    // Cragar contenedor de rol si es admin
    if (sesion.rol === ROLES.ADMIN) {
        document.getElementById('contenedor_rol').style.display = 'block';
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
        const nombre = document.getElementById('nombre').value;
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

        const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id_usuario)) + 1 : 1;

        // Crear nuevo usuario
        const nuevoUsuario = {
            id_usuario: nuevoId,
            nombre: nombre,
            correo: correo,
            contraseña: contraseña,
            rol: sesion.rol === ROLES.ADMIN ? (document.getElementById('rol').value || ROLES.USUARIO) : ROLES.USUARIO, 
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

    document.getElementById('btn_GuardarNota').addEventListener('click', guardarEdicionUsuario);
});

function esAdminPrincipal(usuario) {
    return usuario.correo === 'admin@gmail.com' && usuario.rol === ROLES.ADMIN;
}

// Función para mostrar usuarios en la tabla
function mostrarUsuarios() {
    const contenedor = document.getElementById('lista_estudiantes');
    if (!contenedor) {
        console.log('No se encontró el contenedor de la tabla');
        return;
    }

    // Limpiar la tabla
    contenedor.innerHTML = '';

    const datos = filtrarPorRol(usuarios);
    
    // Verificar si no hay usuarios
    if (datos.length === 0) {
        contenedor.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">No hay estudiantes registrados</td>
            </tr>
        `;
        return;
    }
    
    // Agregar cada usuario a la tabla
    datos.forEach(usuario => {
        const fila = document.createElement('tr');

        // Hacer la fila
        fila.innerHTML = `
            <th>${usuario.id_usuario}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.rol}</td>
            <td>
                <div>
                    <button class="btn btn-sm btn-nota boton_primary_tema me-1" onclick="mostrarModalEditarUsuario('${usuario.correo}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-nota boton_danger_tema" onclick="eliminarUsuario('${usuario.correo}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;

        // Agregar la fila
        contenedor.appendChild(fila);
    });
}

function filtrarPorRol(datos) {
    if (sesion.rol === ROLES.ADMIN) {
        return datos;
    } else {
        return datos.filter(item => item.id_usuario === sesion.id_usuario);
    }
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
    const usuario = usuarios.find(user => user.correo === correo);

    if (!usuario) {
        mostrarError('Usuario no encontrado');
        return;
    }

    // Verificar si es el admin principal
    if (esAdminPrincipal(usuario)) {
        mostrarError('No se puede eliminar el administrador principal');
        return;
    }

    if(usuario.id_usuario === sesion.id_usuario){
        mostrarError("No te puedes eliminar a ti mismo, hable a un administrador");
        return;
    }

    mostrarConfirmacion(
        `¿Estás seguro de que quieres eliminar al estudiante ${usuario.nombre} (${correo})? Esta acción no se puede deshacer.`,
        function() {
            usuarios = usuarios.filter(user => user.correo !== correo);
            guardarEnLocalStorage();
            mostrarUsuarios(); 
            console.log(`Usuario ${correo} eliminado`);
            mostrarSuccess('Estudiante eliminado correctamente');
        }
    );
}

// Función para mostrar modal de edición
function mostrarModalEditarUsuario(correo) {
    const usuario = usuarios.find(user => user.correo === correo);
    
    if (!usuario) {
        mostrarError('Usuario no encontrado');
        return;
    }
    
    // Verificar si es el admin principal
    if (esAdminPrincipal(usuario)) {
        mostrarError('No se puede editar el administrador principal');
        return;
    }
    
    // Verificar permisos
    if (sesion.rol !== ROLES.ADMIN && usuario.correo !== sesion.correo) {
        mostrarError("No tienes permisos para editar este usuario");
        return;
    }
    
    document.getElementById('modal_titulo').textContent = 'Editar Usuario';
    document.getElementById('nombre_edicion').value = usuario.nombre;
    document.getElementById('correo_edicion').value = usuario.correo;
    document.getElementById('contraseña_edicion').value = usuario.contraseña;
    
    document.getElementById('correo_edicion').setAttribute('data-correo-original', usuario.correo);
    
    const rolContainer = document.getElementById('editar_contenedor_rol');
    if (sesion.rol === ROLES.ADMIN) {
        rolContainer.style.display = 'block';
        document.getElementById('rol_edicion').value = usuario.rol;
    } else {
        rolContainer.style.display = 'none';
    }
    
    const modal = new bootstrap.Modal(document.getElementById('modal_edicion_usuario'));
    modal.show();
}

// Función para guardar edición
function guardarEdicionUsuario() {
    const correoOriginal = document.getElementById('correo_edicion').getAttribute('data-correo-original');
    const nombre = document.getElementById('nombre_edicion').value.trim();
    const correo = document.getElementById('correo_edicion').value.trim();
    const contraseña = document.getElementById('contraseña_edicion').value;
    const rol = sesion.rol === ROLES.ADMIN ? document.getElementById('rol_edicion').value : undefined;

    // Validaciones
    if (!nombre || !correo || !contraseña) {
        mostrarError('Todos los campos son obligatorios');
        return false;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        mostrarError('Por favor, ingrese un correo electrónico válido');
        return false;
    }

    // Verificar si el correo ya existe
    if (correo !== correoOriginal) {
        const correoExistente = usuarios.find(user => user.correo === correo && user.correo !== correoOriginal);
        if (correoExistente) {
            mostrarError('Este correo electrónico ya está registrado');
            return false;
        }
    }

    // Encontrar y actualizar el usuario
    const usuarioIndex = usuarios.findIndex(user => user.correo === correoOriginal);
    if (usuarioIndex === -1) {
        mostrarError('Usuario no encontrado');
        return false;
    }

    // Actualizar datos del usuario
    usuarios[usuarioIndex].nombre = nombre;
    usuarios[usuarioIndex].correo = correo;
    usuarios[usuarioIndex].contraseña = contraseña;
    
    if (rol) {
        usuarios[usuarioIndex].rol = rol;
    }

    guardarEnLocalStorage();
    mostrarUsuarios();

    const modal = bootstrap.Modal.getInstance(document.getElementById('modal_edicion_usuario'));
    modal.hide();

    mostrarSuccess('Usuario actualizado correctamente');

    return true;
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