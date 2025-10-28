console.log("Conexión exitosa");

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById("formCantidadMaterias").addEventListener("submit", function(e){
        e.preventDefault();
        mostrarCantidadMaterias()
    });
});

function mostrarCantidadMaterias(){

    let cantidad = document.getElementById("cantidad_alumnos").value;
    console.log(cantidad);

    const contenedor = document.getElementById('contenido');
    contenedor.innerHTML = '';

    for (let i = 0; i < cantidad; i++) {
        const card = document.createElement('div');

        card.innerHTML = `
            <div class="card overflow-auto mb-3">
                <div class="card-body">
                    <h3 id="encabezado">Materia ${i+1}</h3>
                    <form id="formUnidades">
                        <label for="u1">Unidad 1</label>
                        <input type="number" id="u1" class="form-control" min="0">

                        <label for="u2">Unidad 2</label>
                        <input type="number" id="u2" class="form-control" min="0">

                        <label for="u3">Unidad 3</label>
                        <input type="number" id="u3" class="form-control" min="0">

                        <label for="u4">Unidad 4</label>
                        <input type="number" id="u4" class="form-control" min="0">

                        <button class="btn btn-primary rounded-pill px-3 mt-3" onclick="calificar('${i}')">
                            Calificar
                        </button>
                    </form>
                </div>

                <div class="card-footer">
                    <h4 id="respuestaGrande">Respuesta</h4>
                    <p id="respuestaChiquita">Aqui se vera tu respuesta</p>
                </div>
            </div>
        `;

        contenedor.appendChild(card);
        
    }
    
};

/*
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


*/