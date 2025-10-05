console.log("Conexión exitosa");

// Lista de usarios
let proyectos = [];

// Cuando se inicializa
document.addEventListener('DOMContentLoaded', function(){
    // Verificamos si en el localStorage hay sesion
    if(localStorage.getItem('sesion')){
        sesion = JSON.parse(localStorage.getItem('sesion'));
        console.log("Sesión activa:", sesion);
    } else {
        window.location.href = "index.html";
    }

    // Cargar proyectos existentes del localStorage
    if(localStorage.getItem('proyectos')) {
        proyectos = JSON.parse(localStorage.getItem('proyectos'));
        console.log("Proyectos cargados:", proyectos);
    }

    // Mostrar proyectos en la tabla al cargar la página
    mostrarProyectos();

    // Manejar el envío del formulario
    document.getElementById('form_proyecto').addEventListener('submit', function(e){
        e.preventDefault();
        
        const id = proyectos.length > 0 ? Math.max(...proyectos.map(p => p.id_proyecto)) + 1 : 1;

        // Obtener valores del formulario
        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const estado = document.getElementById('estado').value;
        const fechaInicio = document.getElementById('fecha_inicio').value;
        const fechaFin = document.getElementById('fecha_fin').value;

        //Nota a mi misma: Validar las fechas despues, que no ingrese una fecha fin antes de fecha inicio

        // Crear nuevo usuario
        const nuevoProyecto = {
            id_proyecto: id,
            nombre: nombre,
            descripcion: descripcion,
            estado: estado,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
        };

        // Agregar a la lista de proyectos
        proyectos.push(nuevoProyecto);

        // Guardar en localStorage
        guardarEnLocalStorage();

        // Mostrar mensaje de éxito
        alert('Proyecto registrado exitosamente');

        // Actualizar la tabla
        mostrarProyectos();

        // Limpiar el formulario
        document.getElementById('form_proyecto').reset();

        console.log('Proyecto registrado:', nuevoProyecto);
        console.log('Total de proyectos:', proyectos);
    });

    // Manejar cierre de sesión
    document.getElementById('btn_cerrar_sesion').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('sesion');
        window.location.href = "index.html";
    });
});

// Función para mostrar proyectos en la tabla
function mostrarProyectos() {
    const contenedor = document.getElementById('lista_proyectos');
    if (!contenedor) {
        console.log('No se encontró el contenedor de la tabla');
        return;
    }

    // Limpiar la tabla
    contenedor.innerHTML = '';
    
    // Verificar si no hay proyectos
    if (proyectos.length === 0) {
        contenedor.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">No hay proyectos registrados</td>
            </tr>
        `;
        return;
    }
    
    // Agregar cada usuario a la tabla
    proyectos.forEach(proyectos => {
        const fila = document.createElement('tr');

        // Hacer la fila
        fila.innerHTML = `
            <td>${proyectos.id_proyecto}</td>
            <td>${proyectos.nombre}</td>
            <td>${proyectos.descripcion}</td>
            <td>${proyectos.estado}</td>
            <td>${proyectos.fecha_inicio}</td>
            <td>${proyectos.fecha_fin}</td>
            <td>
                <button class="btn boton_danger_tema btn-sm" onclick="eliminarProyecto('${proyectos.id}')">
                    Eliminar
                </button>
            </td>
        `;

        // Agregar la fila
        contenedor.appendChild(fila);
    });
}

// Función de guardar en localStorage
function guardarEnLocalStorage(){
    localStorage.setItem('proyectos', JSON.stringify(proyectos));
    console.log('Datos guardados en localStorage');
}