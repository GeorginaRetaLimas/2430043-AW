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
                <button class="btn btn-sm btn-danger" onclick="eliminarAlumno(${index})">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}
    function guardarEdicion() {
        // Tengo sueñooooooo
        const succesModal = new Bootstrap.modal(document);
        succesModal.show();
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



/*
    Como insertar en un vector con un push el valor de un formualrio

    Para mañana que guarde en un vector aunque no lo muestre pero guarde

    Guardar
    Eliminar
    Mostrar los valores
*/