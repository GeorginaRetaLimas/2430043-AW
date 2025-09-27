console.log("Conexion exitosa");

let alumnos = [];
let dataTable;

// Inicializar la app con el dom
document.addEventListener('DOMContentLoaded', function(){
    // Cargar
    if(localStorage.getItem('alumnos')){
        alumnos = JSON.parse(localStorage.getItem('alumnos'));
    }

    document.getElementById('alumnosForm').addEventListener('submit', function(e){
        e.preventDefault(); 
        guardarAlumno();
        
    });

    inicializarTabla();
});

function guardarAlumno(){
    const matricula = document.getElementById('matricula').value;
    const nombre = document.getElementById('nombre').value;
    const carrera = document.getElementById('carrera').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    // Validar que la matricula no este duplicada
    if(alumnos.some(alumno => alumnos.matricula == matricula)){
        alert('La matricula ya existe. Por favor, ingrese una matricula única');
        return;
    }

    // Validar que la email no este duplicada
    if(alumnos.some(alumno => alumnos.email == email)){
        alert('El email ya existe. Por favor, ingrese un email único');
        return;
    }

    // Validar que la telefono no este duplicada
    if(alumnos.some(alumno => alumnos.telefono == telefono)){
        alert('El telefono ya existe. Por favor, ingrese un email único');
        return;
    }
        
    
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
    const modal = document.querySelector('.modal');
    const botonCerrar = document.querySelector('.cerrar-modal');

    function cerrarModal() {
        modal.classList.remove('mostrar');
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }

    botonCerrar.addEventListener('click', cerrarModal);

    // Cerrar
    modal.addEventListener('click', (e) =>{
        if(e.target === modal) {
            cerrarModal();
        }
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) =>{
        if(e.key === 'Escape' && modal.classList.contains('mostrar')){
            cerrarModal();
        }
    });

    document.getElementById('alumnosEditForm').addEventListener('submit', function(e){
        e.preventDefault(); 
        
        const matricula = document.getElementById('matricula').value;
        const nombre = document.getElementById('nombre').value;
        const carrera = document.getElementById('carrera').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;

        // Validar que la matricula no este duplicada
        if(alumnos.some(alumno => alumnos.matricula == matricula)){
            alert('La matricula ya existe. Por favor, ingrese una matricula única');
            return;
        }

        // Validar que la email no este duplicada
        if(alumnos.some(alumno => alumnos.email == email)){
            alert('El email ya existe. Por favor, ingrese un email único');
            return;
        }

        // Validar que la telefono no este duplicada
        if(alumnos.some(alumno => alumnos.telefono == telefono)){
            alert('El telefono ya existe. Por favor, ingrese un email único');
            return;
        }

        const alumno = {
            matricula,
            nombre, 
            carrera, 
            email,
            telefono
        };

        alumnos.splice(index, 1, alumno);
        actualizarTabla();

    });
}

// Eliminar alumno
function eliminarAlumnos(index){
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
