console.log("Conexión exitosa");

// Limpiar local storage 
localStorage.clear();

// Variables globales
let usuarios = [];
let proyectos = [];
let tareas = [];

// Referencias a elementos
const vistaInicio = document.getElementById('vista_inicio');
const vistaRegistro = document.getElementById('vista_registro');

// bool
var inicioActivo;

// Cuando se inicializa
document.addEventListener('DOMContentLoaded', function(){
    // Verificamos que vista inicio esta activa
    if(localStorage.getItem('inicioActivo')){
        inicioActivo = JSON.parse(localStorage.getItem('inicioActivo'));
        
        if(inicioActivo === true){
            activarVistaInicio();
        } else {
            activarVistaRegistro();
        }
    }
    

    // Verificamos si en el localStorage hay datos de correos
    if(localStorage.getItem('usuarios')){
        console.log("Obteniendo usuarios...");
        usuarios = JSON.parse(localStorage.getItem('usuarios'));
    } else {
        console.log("No hay usuarios en localStorage");
        usuarios = [];
    }

    const adminExiste = usuarios.some(user => user.correo === "admin@gmail.com");
    console.log("¿Admin existe?", adminExiste);

    if(!adminExiste){
        crearUsuarioAdmin();
    }

    // Creamos el usuario de Admin
    function crearUsuarioAdmin(){
        console.log("Creando cuenta admin...");
        usuarios.push({
            id_usuario: 0,
            correo: "admin@gmail.com",
            contraseña: "admin",
        });

        proyectos.push({
            id_proyecto: 0,
            nombre: "Practica 6",
            descripcion: "Pagina web que nos permita registrar alumnos, darles tareas y proyectos",
            estado: "pendiente",
            fecha_inicio: "01-01-2025",
            fecha_fin: "02-01-2025",
        });

        tareas.push({
            id_tarea: 0,
            id_proyecto: 0,
            titulo: "Agregar Proyectos a las tareas",
            descripcion: "A lo visto en la practica 5 añadirle la funcionalidad de tareas y proyectos",
            estado: "pendiente",
            prioridad: "maxima",
            fecha_vencimiento: "02-01-2025",
            asignado_a: [{
                id_usuario: 0
            }]
        });

    
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('proyectos', JSON.stringify(proyectos));
        localStorage.setItem('tareas', JSON.stringify(tareas));
        
        console.log("Admin creado y guardado en localStorage");
    }
    
    console.log(usuarios);

    // Verificamos si en el localStorage hay datos de sesion
    if(localStorage.getItem('sesion')){
        localStorage.setItem('sesion', null);
    }

    // Detección de envio de formulario de INICIO
    document.getElementById('form_inicio_sesion').addEventListener('submit', function(e) {
        e.preventDefault();
                
        const correo = document.getElementById('correo').value;
        const contraseña = document.getElementById('contraseña').value;
                
        const resultado = buscarRegistro(correo, contraseña);
                
        if (resultado.valido) {
            console.log(`Usuario autentificado: ${resultado.usuario.correo}`);
            mostrarSuccess(resultado.mensaje);
                    
            localStorage.setItem('sesion', JSON.stringify(resultado.usuario));
                    
            setTimeout(function() {
                console.log("Redirigiendo a home...");
                window.location.href = "../html/home.html";
            }, 1500);
        } else {
            mostrarError(resultado.mensaje);
        }
    });

    // Detección de envio de formulario de REGISTRO
    document.getElementById('form_registro').addEventListener('submit', function(e){
        e.preventDefault();

        const correo = document.getElementById('correo_registro').value;
        const contraseña = document.getElementById('contraseña_registro').value;

        const resultado = registrarUsuario(correo, contraseña);

        if(resultado.valido) {
            console.log(`Usuario registrado: ${resultado.usuario.correo}!`);
            
            // Mostrar mensaje de éxito
            mostrarSuccess(resultado.mensaje);

            // Limpiar formulario
            document.getElementById('form_registro').reset();

            // Cambiar a vista de inicio después de 2 segundos
            setTimeout(function() {
                activarVistaInicio();
            }, 1500);

        } else {
            mostrarError(resultado.mensaje);
        }
    });
});

function buscarRegistro(correo, contraseña){
    console.log("Entrar a la funcion buscar");
    console.log(usuarios);

    const usuario = usuarios.find(user => user.correo === correo);

    if(usuario && usuario.contraseña === contraseña){
        return {
            valido: true,
            usuario: usuario,
            mensaje: `¡Bienvenido, ${usuario.correo}!`
        };
    } else {
        return {
            valido: false,
            usuario: null,
            mensaje: "Ese usuario no coincide con los registros"
        };
    }
}

function registrarUsuario(correo, contraseña) {
    console.log("Entrar a la función registrar");

    // Verificar si el usuario ya existe
    const usuarioExistente = usuarios.find(user => user.correo === correo);
    
    if (usuarioExistente) {
        return {
            valido: false,
            mensaje: "Este correo ya está registrado"
        };
    }

    const id = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id_usuario)) + 1 : 1;

    // Crear nuevo usuario
    const nuevoUsuario = {
        id: id,
        correo: correo,
        contraseña: contraseña
    };

    // Agregar a la lista de usuarios
    usuarios.push(nuevoUsuario);
    
    // Actualizar localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    return {
        valido: true,
        usuario: nuevoUsuario,
        mensaje: "¡Usuario registrado exitosamente!"
    };
}

// Funcion que va a activar los datos de registro, desplegar y ocultar
function activarVistaRegistro() {
    vistaInicio.classList.add('d-none');
    vistaRegistro.classList.remove('d-none');
    localStorage.setItem('inicioActivo', 'false');
}

function activarVistaInicio() {
    vistaRegistro.classList.add('d-none');
    vistaInicio.classList.remove('d-none');
    localStorage.setItem('inicioActivo', 'true');
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