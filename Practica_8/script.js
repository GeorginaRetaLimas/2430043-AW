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

    if(cantidad <= 0){
        Swal.fire('Error cantidad minima', 'La cantidad mínima de materias es 1','warning');
        document.getElementById("cantidad_alumnos") = "";
        return;
    }

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
                        <input type="number" id="u1" class="form-control">

                        <label for="u2">Unidad 2</label>
                        <input type="number" id="u2" class="form-control">

                        <label for="u3">Unidad 3</label>
                        <input type="number" id="u3" class="form-control">

                        <label for="u4">Unidad 4</label>
                        <input type="number" id="u4" class="form-control">

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

function calificar(n){
    const u1 = document.getElementById('u1').value;
    const u2 = document.getElementById('u2').value;
    const u3 = document.getElementById('u3').value;
    const u4 = document.getElementById('u4').value;

    if(u1 <= 0 && u2 <= 0 && u3 <= 0 && u4 <= 0){
        Swal.fire('Error cantidad minima', 'La cantidad mínima es 0','warning');
    }

    if(u1 > 100 && u2 > 100 && u3 > 100 && u4 > 100){
        Swal.fire('Error cantidad maxima', 'La cantidad maxima es 10','success');
    }

    let promedio = (u1 + u2 + u3 + u4)/4;

    if(promedio >= 7){
        document.getElementById('respuestaGrande') = "APROBADO";
        let mensaje = "Aprobado " + promedio;
    } else {
        document.getElementById('respuestaGrande') = "REPROBADO";
        let mensaje = "Reprobado " + promedio;
    }
}