console.log("Conexión exitosa");

// Constructor de usuarios
let usuarios = [];

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
            correo: "admin@gmail.com",
            contraseña: "admin",
            tareas: [{
                id: 0,
                titulo: "Diseño de Vector",
                descripcion: "Crear un nuevo vector de tareas"
            }]
        });

        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        console.log("Admin creado y guardado en localStorage");
    }
    
    console.log(usuarios);

    // Verificamos si en el localStorage hay datos de sesion
    if(localStorage.getItem('sesion')){
        localStorage.setItem('sesion', null);
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
                window.location.href = "../html/home.html";
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
            }, 2000);

        } else {
            mensajeErrorRegistro.textContent = resultado.mensaje;
            mensajeErrorRegistro.style.display = 'block';
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
            mensaje: "Ese usuario no esta en los registros"
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
        mensaje: "¡Usuario registrado exitosamente!"
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