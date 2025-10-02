console.log("Conexión exitosa");

// Constructor de usuarios
let usuarios = [{
    correo : "admin@gmail.com",
    contraseña : "admin",
    tareas: [{
        id: 0,
        titulo: "Diseño de Vector",
        descripcion: "Crear un nuevo vector de tareas"
    }]
}];

// Vistas
const vistaInicio = document.getElementById('vista_inicio');
const vistaRegistro = document.getElementById('vista_registro');

// bool
var inicioActivo;

// Cuando se inicializa
document.addEventListener('DOMContentLoaded', function(){
    // Ocultamos los mensajes cuando recargamos
    document.getElementById('mensajeError').style.display = 'none';
    document.getElementById('mensajeExito').style.display = 'none';

    // Verificamos que vista inicio esta activa
    if(localStorage.getItem('inicioActivo')){
        inicioActivo = JSON.parse(localStorage.getItem('inicioActivo'));
        
        if(inicioActivo === true){
            activarVistaInicio();
        } else {
            activarVistaRegistro();
        }
    } else {
        // Por defecto mostrar vista de inicio
        activarVistaInicio();
    }
    

    // Verificamos si en el localStorage hay datos de correos
    if(localStorage.getItem('usuarios')){
        usuarios = JSON.parse(localStorage.getItem('usuarios'));
        console.log("Usuarios cargados:", usuarios);
    } else {
        // Guardar usuarios por defecto si no existen
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    // Limpiar sesión si existe
    if(localStorage.getItem('sesion')){
        localStorage.removeItem('sesion');
    }

    // Detección de envio de formulario de INICIO
    document.getElementById('form_inicio_Sesion').addEventListener('submit', function(e){
        e.preventDefault();

        // Ocultar mensajes previos
        document.getElementById('mensajeError').style.display = 'none';
        document.getElementById('mensajeExito').style.display = 'none';

        const correo = document.getElementById('correo').value;
        const contraseña = document.getElementById('contraseña').value;

        const resultado = buscarRegistro(correo, contraseña);

        if(resultado.valido) {
            console.log(`Usuario autentificado ${resultado.usuario.correo}!`);
            document.getElementById('mensajeExito').textContent = resultado.mensaje;
            document.getElementById('mensajeExito').style.display = 'block';

            localStorage.setItem('sesion', JSON.stringify(resultado.usuario));

            setTimeout(function() {
                window.location.href = "home.html";
            }, 1000);

        } else {
            document.getElementById('mensajeError').textContent = resultado.mensaje;
            document.getElementById('mensajeError').style.display = 'block';
        }
    });

    // Detección de envio de formulario de REGISTRO
    document.getElementById('form_registro').addEventListener('submit', function(e){
        e.preventDefault();

        // Ocultar mensajes previos
        const mensajeErrorRegistro = document.getElementById('mensajeError_registro');
        mensajeErrorRegistro.style.display = 'none';

        const correo = document.getElementById('correo_registro').value;
        const contraseña = document.getElementById('contraseña_registro').value;

        const resultado = registrarUsuario(correo, contraseña);

        if(resultado.valido) {
            console.log(`Usuario registrado: ${resultado.usuario.correo}!`);
            
            // Mostrar mensaje de éxito
            const mensajeExito = document.createElement('div');
            mensajeExito.className = 'alert alert-success';
            mensajeExito.textContent = resultado.mensaje;
            document.getElementById('form_registro').prepend(mensajeExito);

            // Limpiar formulario
            document.getElementById('form_registro').reset();

            // Cambiar a vista de inicio después de 2 segundos
            setTimeout(function() {
                activarVistaInicio();
                // Remover el mensaje de éxito
                mensajeExito.remove();
            }, 2000);

        } else {
            mensajeErrorRegistro.textContent = resultado.mensaje;
            mensajeErrorRegistro.style.display = 'block';
        }
    });
});

function buscarRegistro(correo, contraseña){
    console.log("Entrar a la funcion buscar");

    // Cargar usuarios actualizados del localStorage
    if(localStorage.getItem('usuarios')){
        usuarios = JSON.parse(localStorage.getItem('usuarios'));
    }

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
            mensaje: "Correo o contraseña incorrectos"
        };
    }
}

// Función para registrar nuevos usuarios
function registrarUsuario(correo, contraseña){
    console.log("Entrar a la función registrar");

    // Cargar usuarios actualizados del localStorage
    if(localStorage.getItem('usuarios')){
        usuarios = JSON.parse(localStorage.getItem('usuarios'));
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = usuarios.find(user => user.correo === correo);
    
    if(usuarioExistente) {
        return {
            valido: false,
            mensaje: "Este correo ya está registrado"
        };
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
        correo: correo,
        contraseña: contraseña,
        tareas: []
    };

    // Agregar a la lista de usuarios
    usuarios.push(nuevoUsuario);
    
    // Actualizar localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    return {
        valido: true,
        usuario: nuevoUsuario,
        mensaje: "¡Usuario registrado exitosamente! Redirigiendo al inicio de sesión..."
    };
}

// Funcion que va a activar los datos de registro, desplegar y ocultar
function activarVistaRegistro(){
    vistaInicio.classList.add("d-none"); 
    vistaRegistro.classList.remove("d-none");

    inicioActivo = false;
    localStorage.setItem('inicioActivo', JSON.stringify(inicioActivo));
}

// Funcion que va a activar los datos de inicio, desplegar y ocultar
function activarVistaInicio(){
    vistaInicio.classList.remove("d-none"); 
    vistaRegistro.classList.add("d-none");

    inicioActivo = true;
    localStorage.setItem('inicioActivo', JSON.stringify(inicioActivo));
}