console.log("Conexión exitosa");

document.getElementById("Inicio").onsubmit(this.e, function(){ 
    e.preventDefault();

    let n = document.getElementById("cantidad_alumnos").value;
    console.log(n);
});


document.getElementById("Materias").onsubmit(this.e, function() {
    e.preventDefault();
    
    let m1 = document.getElementById("mat1").value;
    let m2 = document.getElementById("mat2").value;
    let m3 = document.getElementById("mat3").value;
    let m4 = document.getElementById("mat4").value;

    let promedio;
    let mensaje;
    

    if(m1 >= 70 && m2 >= 70 && m3 >= 70 && m4 >= 70){
        promedio = (m1 + m2 + m3 + m4) / 4;
        mensaje = "Aprobado: " + promedio;
    } else {
        promedio = 60;
        mensaje = "Reprobado: " + promedio;
    }


    console.log(mensaje);
    document.getElementById("respuesta").value = mensaje;
    alert(mensaje);
});