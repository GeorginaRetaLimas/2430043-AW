console.log("Conexion exitosa");

let nombre = document.getElementById("nombre").value;
let correo = document.getElementById("correo").value;
let contraseña = document.getElementById("contraseña").value;
let confirmar = document.getElementById("confirmar").value;

let nombreValidacion = document.getElementById("nombreValidacion").value;
let correoValidacion = document.getElementById("correoValidacion").value;
let contraseñaValidacion = document.getElementById("contraseñaValidacion").value;
let confirmarValidacion = document.getElementById("confirmarValidacion").value;

document.addEventListener('DOMContentLoaded', function (e){
    e.preventDefault();
    console.log("Iniciado");

    camposObligatorios();
});

document.getElementById("registro").addEventListener('submit', function(e){
    e.preventDefault();

    let camposValido = camposObligatorios();
    let correoValido = validarCorreo();
    let contraseñaValida = validarContraseña();
    let coincidenciaValida = validarCoincidencia()


});

function camposObligatorios(){
    let mensaje = "Todos los campos son obligatorios";

    let valido = true;

    if(nombre == ""){
        console.log("Nombre null");
        document.getElementById("nombreValidacion").value = mensaje;
        alert("Campo nombre "+ mensaje);
        valido = false;
    }

    if(correo == ""){
        console.log("Correo null");
        document.getElementById("correoValidacion").value = mensaje;
        alert("Campo Correo "+ mensaje);
        valido = false;
    }

    if(contraseña == ""){
        console.log("Contraseña null");
        document.getElementById("contraseñaValidacion").value = mensaje;
        alert("Campo contraseña "+ mensaje);
        valido = false;
    }

    if(confirmar == ""){
        console.log("Confirmar contraseña null");
        document.getElementById("confirmarValidacion").value = mensaje;
        alert("Campo confirmar ", mensaje);
        valido = false;
    }

    return valido;
}

function validarCorreo(){
    let valido;
    let mensaje;
    if(correo.trim("@")){
        mensaje = "Correo Valido";
        valido = true;
    } else {
        mensaje = "Formato de correo invalido";
        valido = false;
    }

    document.getElementById("correoValidacion").value = mensaje;
    return valido;
}

function validarContraseña(){
    let valido;
    let mensaje;

    if(contraseña.length() < 6){
        mensaje = "La contraseña debe tener mínimo 6 caracteres.";
        valido = false;
    } else {
        mensaje = "Contraseña valida";
        valido = true;
    }

    document.getElementById("contraseñaValidacion").value = mensaje;
    alert(mensaje);

    return valido;
}

function validarCoincidencia(){
    let valido = true;
    let mensaje;

    if(contraseña == confirmar){
    } else {
        mensaje = "Las contraseñas no coinciden";
        valido = false;

    }

    document.getElementById("confirmarValidacion").value = mensaje;
    alert(mensaje);

    return false;
}