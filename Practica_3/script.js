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

    document.getElementById('alumnosForm').addEventListener('submit', function(e){
        e.preventDefault(); 
        validarAlumno();
    });

    document.getElementById('alumnosForm_Editar').addEventListener('submit', function(e){
        e.preventDefault(); 
        guardarEdicion();
    });
});

function validarAlumno(){
    let datosCorrectos = true;

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
    guardarEnLocalStorage();
    actualizarTabla();
        
    document.getElementById('alumnosForm').reset();
}

function inicializarTabla(){
    actualizarTabla();
}

function actualizarTabla(){
    const tbody = document.getElementById('studentTableBody');

    if(alumnos.length === 0){
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay datos disponibles en la tabla</td>
            </tr>
        `;
        return;
    }

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

function editarAlumno(index) {
    // Alumno a editar
    const alumno = alumnos[index];

    document.getElementById('matricula_Editar').value = alumno.matricula;
    document.getElementById('nombre_Editar').value = alumno.nombre;
    document.getElementById('carrera_Editar').value = alumno.carrera;
    document.getElementById('email_Editar').value = alumno.email;
    document.getElementById('telefono_Editar').value = alumno.telefono;

    indiceEdicionActual = index;

    const modal = new bootstrap.Modal(document.querySelector('.modal'));
    modal.show();
}

function guardarEdicion(){
    const index = indiceEdicionActual;

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

    const alumnoActualizado  = {
        matricula,
        nombre, 
        carrera, 
        email,
        telefono
    };

    alumnos.splice(index, 1, alumnoActualizado);
    guardarEnLocalStorage();
    actualizarTabla();

    const modal = bootstrap.Modal.getInstance(document.querySelector('.modal'));
    modal.hide();

    indiceEdicionActual = null;
}


// Eliminar alumno
function eliminarAlumno(index){
    if(confirm('¿Está seguro de que desea eliminar este alumnos?')) {
        alumnos.splice(index, 1);
        guardarEnLocalStorage();
        actualizarTabla();
        alert('Alumno eliminado exitosamente')
    }
}

// Función de guardar en localStorage
function guardarEnLocalStorage(){
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
}
