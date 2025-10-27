console.log("Conexión exitosa");

document.getElementById("Inicio").addEventListener("submit", function(e){ 
    e.prevent

    let n = document.getElementById("cantidad_alumnos").value;
    console.log(n);

    let materia = [n];

    materia.forEach(materia => {
        /*
        `
            <div class="d-none">
                <div>
                    <h1>Formulario alumno</h1>
                    <form id="Materias">
                        <p>Materia 1</p><br>
                        <input type="number" id="mat1" min="0">
                        <p>Materia 2</p><br>
                        <input type="number" id="mat2" min="0">
                        <p>Materia 3</p><br>
                        <input type="number" id="mat3" min="0">
                        <p>Materia 4</p><br>
                        <input type="number" id="mat4" min="0">

                        <input type="submit">
                    </form>
                </div>

                <div>
                    <h1>Respuesta</h1>
                    <p id="respuesta"></p>
                </div>
            </div>
        `
        */
    });

});


document.getElementById("Materias").addEventListener("submit", function(e){ 
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