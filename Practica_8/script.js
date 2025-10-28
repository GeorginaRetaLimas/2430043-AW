console.log("Conexión exitosa");

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById("formCantidadMaterias").addEventListener("submit", function(e){
        e.preventDefault();
        mostrarCantidadMaterias()
    });
});

function mostrarCantidadMaterias(){

    let cantidad = document.getElementById("cantidad_materias").value;
    console.log(cantidad);

    if(cantidad <= 0){
        Swal.fire('Error cantidad minima', 'La cantidad mínima de materias es 1','warning');
        document.getElementById("cantidad_materias").value = "";
        return;
    } else if(cantidad > 20){
        Swal.fire('Error cantidad maxima', 'La cantidad maxima es de materias es 20','warning');
        document.getElementById("cantidad_materias").value = "";
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
                    <div>
                        <label for="u1_${i}">Unidad 1</label>
                        <input type="number" id="u1_${i}" class="form-control">

                        <label for="u2_${i}">Unidad 2</label>
                        <input type="number" id="u2_${i}" class="form-control">

                        <label for="u3_${i}">Unidad 3</label>
                        <input type="number" id="u3_${i}" class="form-control">

                        <label for="u4_${i}">Unidad 4</label>
                        <input type="number" id="u4_${i}" class="form-control">

                        <button class="btn btn-primary rounded-pill px-3 mt-3" onclick="calificar('${i}')">
                            Calificar
                        </button>
                    </div>
                </div>

                <div class="card-footer">
                    <h4 id="respuestaGrande_${i}">Respuesta</h4>
                    <p id="respuestaChiquita_${i}">Aqui se vera tu respuesta</p>
                </div>
            </div>
        `;

        contenedor.appendChild(card);
        
    }
    
};

function calificar(n){
    event.preventDefault();
    event.stopPropagation();

    let u1 = parseFloat(document.getElementById(`u1_${n}`).value);
    let u2 = parseFloat(document.getElementById(`u2_${n}`).value);
    let u3 = parseFloat(document.getElementById(`u3_${n}`).value);
    let u4 = parseFloat(document.getElementById(`u4_${n}`).value);

    console.log(u1, " ", u2, " ", u3, " ", u4);

    if(u1 < 0 || u2 < 0 || u3 < 0 || u4 < 0){
        Swal.fire('Error cantidad minima', 'La cantidad mínima es 0','error');
        return;
    }

    if(u1 > 100 || u2 > 100 || u3 > 100 || u4 > 100){
        Swal.fire('Error cantidad maxima', 'La cantidad maxima es 10','error');
        return;
    }

    let promedio = (u1 + u2 + u3 + u4)/4;
    let respuestaGrande = document.getElementById(`respuestaGrande_${n}`);
    let respuestaChiquita = document.getElementById(`respuestaChiquita_${n}`);

    if(u1 >= 70 && u2 >= 70 && u3 >= 70 && u4 >= 70){
        if(promedio >= 70){
            respuestaGrande.textContent = "APROBADO";
            respuestaGrande.className = "text-success";
            respuestaChiquita.textContent = "Aprobado con promedio: " + promedio.toFixed(2);
        } else {
            respuestaGrande.textContent = "NO APROBADO";
            respuestaGrande.className = "text-danger";
            respuestaChiquita.textContent = "No aprobado con promedio: " + promedio.toFixed(2);
        }
    } else {
        respuestaGrande.textContent = "NO APROBADO";
        respuestaGrande.className = "text-danger";
        respuestaChiquita.textContent = "No aprobado con promedio: " + 60;
    }
}