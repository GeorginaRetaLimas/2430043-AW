console.log("Conexion exitosa");

let alumnos = [];
let dataTable;
let indiceEdicionActual = null;

// Inicializar la app con el dom
document.addEventListener('DOMContentLoaded', function(){

    // Cargar datos al iniciar
    if(localStorage.getItem('alumnos')){
        alumnos = JSON.parse(localStorage.getItem('alumnos'));
        actualizarTabla();
    }

    // Detección de registro de alumno
    document.getElementById('alumnosForm').addEventListener('submit', function(e){
        e.preventDefault(); 
        validarAlumno();
    });

    // Deteccion de edición de alumno
    document.getElementById('alumnosForm_Editar').addEventListener('submit', function(e){
        e.preventDefault(); 
        guardarEdicion();
    });
});

// Validar registro
function validarAlumno(){
    let datosCorrectos = true;

    // Traer datos del html con las id
    const matricula = document.getElementById('matricula').value;
    const nombre = document.getElementById('nombre').value;
    const carrera = document.getElementById('carrera').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    // Validar que la matricula no este duplicada
    if(alumnos.some(alumno => alumno.matricula == matricula)){
        alert('La matricula ya existe. Por favor, ingrese una matricula única');
        datosCorrectos = false;
        return;
    }

    // Validar que la email no este duplicada
    if(alumnos.some(alumno => alumno.email == email)){
        alert('El email ya existe. Por favor, ingrese un email único');
        datosCorrectos = false;
        return;
    }

    // Validar que la telefono no este duplicada
    if(alumnos.some(alumno => alumno.telefono == telefono)){
        alert('El telefono ya existe. Por favor, ingrese un telefono único');
        datosCorrectos = false;
        return;
    }

    // Si no detecto ningun error guarda
    if(datosCorrectos == true){
        guardarAlumno(matricula, nombre, carrera, email, telefono);
    }
}

function guardarAlumno(matricula, nombre, carrera, email, telefono){
    // Crear un objeto de alumno
    const alumno = {
        matricula,
        nombre, 
        carrera, 
        email,
        telefono
    };

    //Agregar a la lista y actualizar
    alumnos.push(alumno);

    // Guardamos en localStorage y actualizamos tabla
    guardarEnLocalStorage();
    actualizarTabla();
        
    // Limpiamos el fomr
    document.getElementById('alumnosForm').reset();
}

// Volvemos a hacer la tabla
function actualizarTabla(){
    // Obtenemos la tabla
    const tbody = document.getElementById('contenido_Tabla');

    // Si no hay registros manda un mensaje de no gay datos
    if(alumnos.length === 0){
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay datos disponibles en la tabla</td>
            </tr>
        `;
        return;
    }

    // Con un map obtenemos los datos del objeto y creamos las columnas y las filas
    tbody.innerHTML = alumnos.map((alumno, index) => `
        <tr>
            <td>${alumno.matricula}</td>
            <td>${alumno.nombre}</td>
            <td>${alumno.carrera}</td>
            <td>${alumno.email}</td>
            <td>${alumno.telefono}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarAlumno(${index})">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger" id="eliminarAlumno" onclick="eliminarAlumno(${index})">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

// Cuando se da click al boton de editar se invoca el modal de editar
function editarAlumno(index) {
    // Obtenemo el alumno a editar
    const alumno = alumnos[index];

    // Escribimos sus datos en el formulario
    document.getElementById('matricula_Editar').value = alumno.matricula;
    document.getElementById('nombre_Editar').value = alumno.nombre;
    document.getElementById('carrera_Editar').value = alumno.carrera;
    document.getElementById('email_Editar').value = alumno.email;
    document.getElementById('telefono_Editar').value = alumno.telefono;

    // Establecemos el indice de edicion actual en la variable global
    indiceEdicionActual = index;

    // Definimos el modal con los datos de bootstrap y mostramos
    const modal = new bootstrap.Modal(document.querySelector('.modal'));
    modal.show();
}

// Cuando se da click al submit del formulario editar_Alumno
function guardarEdicion(){
    // Pasamos el index como una constante
    const index = indiceEdicionActual;

    // Obtenemos los datos del formulario
    const matricula = document.getElementById('matricula_Editar').value;
    const nombre = document.getElementById('nombre_Editar').value;
    const carrera = document.getElementById('carrera_Editar').value;
    const email = document.getElementById('email_Editar').value;
    const telefono = document.getElementById('telefono_Editar').value;

    // Exluir al alumno en la validacion
    if(alumnos.some((alumno, i) => i !== index && alumno.matricula == matricula) && alumnos[index] ){
        alert('La matricula ya existe. Por favor, ingrese una matricula única');
        return;
    }

    // Validar que la email no este duplicada
    if(alumnos.some((alumno, i) => i !== index && alumno.email == email)){
        alert('El email ya existe. Por favor, ingrese un email único');
        return;
    }

    // Validar que la telefono no este duplicada
    if(alumnos.some((alumno, i) => i !== index && alumno.telefono == telefono)){
        alert('El telefono ya existe. Por favor, ingrese un telefono único');
        return;
    }

    // Creamos el objeto del alumno Actualizado
    const alumnoActualizado  = {
        matricula,
        nombre, 
        carrera, 
        email,
        telefono
    };

    // Con splice y el index cambiamos el valor de 
    // esa posición con el objeto del alumno actualizado
    alumnos.splice(index, 1, alumnoActualizado);

    // Guardamos y actualizamos la tabla
    guardarEnLocalStorage();
    actualizarTabla();

    // Definimos el modal y lo ocultamos
    const modal = bootstrap.Modal.getInstance(document.querySelector('.modal'));
    modal.hide();

    // Limpiamos el indice de edición
    indiceEdicionActual = null;
}


// Eliminar alumno
function eliminarAlumno(index){
    if(confirm('¿Está seguro de que desea eliminar este alumnos?')) {
        // Lo borramos del array
        alumnos.splice(index, 1);

        // Guardamos cambios y actualizamos la tabla
        guardarEnLocalStorage();
        actualizarTabla();
        
        // Mostramos el mensaje de exito
        alert('Alumno eliminado exitosamente')
    }
}

// Función de guardar en localStorage
function guardarEnLocalStorage(){
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
}
