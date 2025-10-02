console.log("Conexión exitosa");

// Constructor de usurios
let usuarios = [{
    correo : "admin@gmail.com",
    contraseña : "admin",
    tareas: [{
        id: 0,
        titulo: "Diseo de Vector",
        descripcion: "Craer un nuevo vector de tareas"
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
    }
    

    // Verificamos si en el localStorage hay datos de correos
    if(localStorage.getItem('usuarios')){
        usuarios = JSON.parse(localStorage.getItem('usuarios'));
        console.log(usuarios);
    }

    // Verificamos si en el localStorage hay datos de correos
    if(localStorage.getItem('sesion')){
        localStorage.setItem('sesion', null);
    }

    // Detección de envio de formulario 
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
});


function buscarRegistro(correo, contraseña){
    console.log("Entrar a la funcion buscar");

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
            usuario: usuario,
            mensaje: "Ese usuario no esta en los registros"
        };
    }
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