console.log("Conexión exitosa");

var sesion;

// Cuando se inicializa
document.addEventListener('DOMContentLoaded', function(){
    // Verificamos si en el localStorage hay sesion
    if(localStorage.getItem('sesion')){
        sesion = JSON.parse(localStorage.getItem('sesion'));
        //console.log(sesion);
        
        const correo = sesion.correo;
        document.getElementById('datos_sesion').textContent = "Bienvenido, " + correo;
    } else {
        window.location.href = "index.html";
    }
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