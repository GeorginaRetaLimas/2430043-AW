console.log("Conexion exitosa");

document.addEventListener('DOMContentLoaded', function (e){
    console.log("Iniciado");

    validarNombre();
    validarCorreo();
    validarContraseña();
    validarConfirmacion();

    document.getElementById("nombre").addEventListener('input', validarNombre);
    document.getElementById("correo").addEventListener('input', validarCorreo);
    document.getElementById("contraseña").addEventListener('input', validarContraseña)
    document.getElementById("confirmar").addEventListener('input', validarConfirmacion);

    document.getElementById("registro").addEventListener('submit', function(e){
        e.preventDefault();

        validarTodo()
    });
});

function camposObligatorios(nombre, correo, contraseña, confirmar){
    let mensaje = "Todos los campos son obligatorios";

    let valido = true;

    if(nombre == ""){
        valido = false;
    }

    if(correo == ""){
        valido = false;
    }

    if(contraseña == ""){
        valido = false;
    }

    if(confirmar == ""){
        valido = false;
    }

    return valido;
}

function validarTodo(){
    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let contraseña = document.getElementById("contraseña").value;
    let confirmar = document.getElementById("confirmar").value;

    let camposValido = camposObligatorios(nombre, correo, contraseña, confirmar);
    let correoValido = validarCorreo();
    let contraseñaValida = validarContraseña();
    let coincidenciaValida = validarConfirmacion();

    if (camposValido && correoValido && contraseñaValida && coincidenciaValida) {
        alert("Datos correctos");
    } else {
        alert("Datos incorrectos");
    }
}

function validarNombre() {
    let mensaje = "";
    let nombre = document.getElementById("nombre").value;
    if (nombre === "") {
        mensaje = "Todos los campos son obligatorios";
        document.getElementById("nombreValido").style.color = "red";
    } else {
        mensaje = "Nombre válido";
        document.getElementById("nombreValido").style.color = "green";
    }
    
    document.getElementById("nombreValido").textContent = mensaje;
    return nombre !== "";;
}

function validarCorreo(){
    let valido;
    let mensaje;

    let correo = document.getElementById("correo").value;

    if(correo === ""){
        mensaje = "Todos los campos son obligatorios";
        document.getElementById("correoValido").style.color = "red";
    } else {
        const regexCorreo = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (regexCorreo.test(correo.trim())) {
            mensaje = "Correo Valido";
            document.getElementById("correoValido").style.color = "green";
            valido = true;
        } else {
            mensaje = "Formato de correo invalido";
            document.getElementById("correoValido").style.color = "red";
            valido = false;
        }
    }

    document.getElementById("correoValido").textContent = mensaje;
    return valido;
}

function validarContraseña(){
    let valido;
    let mensaje;

    let contraseña = document.getElementById("contraseña").value;

    if(contraseña === ""){
        mensaje = "Todos los campos son obligatorios";
        document.getElementById("contraseñaValido").style.color = "red";
    } else {
        if(contraseña.length < 6){
            mensaje = "La contraseña debe tener mínimo 6 caracteres.";
            document.getElementById("contraseñaValido").style.color = "red";
            valido = false;
        } else {
            mensaje = "Contraseña valida";
            document.getElementById("contraseñaValido").style.color = "green";
            valido = true;
        }
    }

    document.getElementById("contraseñaValido").textContent = mensaje;
    //alert(mensaje);

    return valido;
}

function validarConfirmacion(){
    let valido = true;
    let mensaje;

    let contraseña = document.getElementById("contraseña").value;
    let confirmar = document.getElementById("confirmar").value;

    if (confirmar === "") {
        mensaje = "Todos los campos son obligatorios";
        document.getElementById("confirmarValido").style.color = "red";
    } else {
        if(contraseña == confirmar){
            mensaje = "Las contraseñas coinciden";
            document.getElementById("confirmarValido").style.color = "green";
        } else {
            mensaje = "Las contraseñas no coinciden";
            document.getElementById("confirmarValido").style.color = "red";
            valido = false;

        }
    }

    document.getElementById("confirmarValido").textContent = mensaje;
    //alert(mensaje);
    return valido;
}