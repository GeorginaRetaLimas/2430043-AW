// Variables globales
let datosEspecialidades = [];
let idEspecialidadEditando = null;

// Cargar especialidades al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarEspecialidades();
});

// Preparar el modal de registro
function mostrarRegistroEspecialidad() {
    // Descartar la edición
    idEspecialidadEditando = null;
    
    // Definir el modal
    const modal = new bootstrap.Modal(document.getElementById('registro_Especialidad'));

    // Definir sus datos
    document.getElementById('modal_titulo_especialidad').textContent = 'Registro de Especialidad';
    document.getElementById('detalles_edicion_especialidad').classList.add('hidden');

    // Limpiar el formulario
    document.getElementById('form_Especialidad').reset();
    document.getElementById('estatus_especialidad_form').value = 'activo';

    // Mostrar el modal
    modal.show();
}

// Mostrar el modal de registro con el modo de edición
function mostrarEdicionEspecialidad(id) {
    // Definimos el nombre de la especialidad con el id
    const especialidad = datosEspecialidades.find(esp => esp.IdEspecialidad == id);

    // Definimos el id de la especialidad a editar
    idEspecialidadEditando = id;

    // Nos traemos el modal de registro
    const modal = new bootstrap.Modal(document.getElementById('registro_Especialidad'));
    
    // Cambiamos el titulo a editar
    document.getElementById('modal_titulo_especialidad').textContent = 'Editar Especialidad';

    // Definimos visbles lod atos de edicion
    document.getElementById('detalles_edicion_especialidad').classList.remove('hidden');
    
    // Llenar formulario con datos existentes
    document.getElementById('nombre_especialidad').value = especialidad.nombreEspecialidad || '';
    document.getElementById('descripcion_especialidad').value = especialidad.Descripcion || '';
    document.getElementById('estatus_especialidad_form').value = especialidad.Estatus == 1 ? 'activo' : 'inactivo';
    
    // Mostrar detalles de edición
    document.getElementById('fecha_Reg_especialidad').textContent = `ID: ${especialidad.IdEspecialidad}`;
    document.getElementById('estatus_especialidad').textContent = especialidad.Estatus == 1 ? 'Activo' : 'Inactivo';
    
    // Mostrar el modal
    modal.show();
}

// Funcion del formulario para registrar especialidades
function guardarEspecialidad() {
    // Traemos los valores del formulario y con trim quitamos los espacios de mas o tabulaciones
    const nombre = document.getElementById('nombre_especialidad').value.trim();
    const descripcion = document.getElementById('descripcion_especialidad').value.trim();
    const estatus = document.getElementById('estatus_especialidad_form').value;

    // Verificamos que se hayan ingresado los datos de nombre y descripción
    if (!nombre || !descripcion) {
        Swal.fire('Error', 'Nombre y descripción son obligatorios', 'error');
        return;
    }

    // La especialidad debe tener 3 caracteres o mas
    if (nombre.length < 3) {
        Swal.fire('Error', 'La especialidad debe tener al menos 3 caracteres', 'error');
        return;
    }

    if (descripcion.length < 5) {
        Swal.fire('Error', 'La descripción debe tener al menos 5 caracteres', 'error');
        return;
    }

    // Creamos un obejto de dato formulario para mandarlo al php
    const datosFormulario = new FormData();

    // Mandamos la accion a realizar en el php, si hay una especialidad en edicion 
    // decimos que es una actualizacion, si no, definimos que es la creacion de una nueva especialidad
    datosFormulario.append('action', idEspecialidadEditando ? 'update_especialities' : 'create_especialities');
    
    // Mandamos los datos del formulario
    datosFormulario.append('nombre_especialidad', nombre);
    datosFormulario.append('descripcion_especialidad', descripcion);
    datosFormulario.append('estatus_especialidad_form', estatus);
    
    // Si estamos editando también mandamos el id de la especialidad a editar
    if (idEspecialidadEditando) {
        datosFormulario.append('id', idEspecialidadEditando);
    }

    // Enviamos esta peticion al php a traves del servidor
    fetch('../php/specialties_create.php', {
        // Aqui establecemos que se enviaran con el método POST
        method: 'POST',
        // Y adjuntamos el formulario que ya creamos
        body: datosFormulario
    })
    // Cuando el servidor conteste su respuesta se convierte en un json
    .then(respuesta => respuesta.json())
    // Manejamos los datos recibidos
    .then(datos => {
        // Si el servidor contesto con true
        if (datos.success) {
            // Damos el aviso de succes
            Swal.fire('Éxito', datos.message, 'success').then(() => {
                // Escondamos el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('registro_Especialidad'));
                modal.hide();

                // Actualizamos los datos de especialidades
                cargarEspecialidades();
            });
        // Si el servidor contesto con false
        } else {
            // Recibimos el mensaje y mostramos
            Swal.fire('Error', datos.message, 'error');
        }
    })
    // Manejaos los errores y mostramos
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al guardar la especialidad', 'error');
    });
}

// Reestablecemos la lista de especialidades
function cargarEspecialidades() {
    // Definimosla peticion
    const datosFormulario = new FormData();

    // Establecemos que la accion es obtener la lista de especialidades
    datosFormulario.append('action', 'get_especialities');

    // La mandamos a procesar
    fetch('../php/specialties_create.php', {
        method: 'POST',
        body: datosFormulario
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        // Si el servidor contesto true
        if (datos.success) {
            // Definimos la variable global de datos especialidades
            datosEspecialidades = datos.specialities;

            // mostramos esos valores en la tabla
            mostrarEspecialidades(datosEspecialidades);
        } else {
            // Si regreso errores mostramos
            Swal.fire('Error', 'Error al cargar las especialidades', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al cargar las especialidades', 'error');
    });
}

// Dibujamos la tabla de especialidades con los datos cargados
function mostrarEspecialidades(especialidades) {
    // Nos traemos el cuerpo de la tabla del html
    const cuerpoTabla = document.getElementById('lista_Pacientes');
    
    // Lo limpiamos
    cuerpoTabla.innerHTML = '';

    // Si no hay registros mostrarlo en una sola columna
    if (especialidades.length === 0) {
        cuerpoTabla.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron especialidades</td></tr>';
        return;
    }

    // Recorremos la lista de especialidades
    especialidades.forEach(especialidad => {
        // Definimos una nueva fila
        const fila = document.createElement('tr');
        // Ingresamos los datos con innerHTML
        fila.innerHTML = `
            <td>${especialidad.IdEspecialidad}</td>
            <td>${especialidad.NombreEspecialidad}</td>
            <td>${especialidad.Descripcion || '-'}</td>
            <td>
                <span class="badge ${especialidad.Estatus == 1 ? 'bg-success' : 'bg-danger'}">
                    ${especialidad.Estatus == 1 ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="mostrarEdicionEspecialidad(${especialidad.IdEspecialidad})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarEspecialidad(${especialidad.IdEspecialidad})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        // Lo agregamos al cuerpo
        cuerpoTabla.appendChild(fila);
    });
}

// Eliminar una especialidad
function eliminarEspecialidad(id) {
    // Por seguridad preguntamos primero
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((resultado) => {
        // Si contesto que si
        if (resultado.isConfirmed) {
            // Armamos la pediticion al sercidor
            const datosFormulario = new FormData();

            // En el action de esta peticion definimos que vamos a borrar un dato
            datosFormulario.append('action', 'delete_especialities');

            // Le mostramos que dato se va a borrar
            datosFormulario.append('id', id);

            // Se manda a procesar
            fetch('../php/specialties_create.php', {
                method: 'POST',
                body: datosFormulario
            })
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.success) {
                    // En caso que se mande un true se dice que ya quedo
                    Swal.fire('Eliminado', datos.message, 'success');
                    // Y volvemos a cargar las especialidades
                    cargarEspecialidades();
                } else {
                    Swal.fire('Error', datos.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Error al eliminar la especialidad', 'error');
            });
        }
    });
}

// Aplicacion de los 3 filtros de Especialidad
function aplicarFiltrosEspecialidades() {
    // Definimos cada filtro
    const busqueda = document.getElementById('buscar_especialidad').value.toLowerCase();
    const filtroEstatus = document.getElementById('filtro-estatus-especialidad').value;
    const orden = document.getElementById('ordenar-especialidades').value;

    // Por seguridad copiamos los datos de especialidades para filtrar
    let especialidadesFiltradas = [...datosEspecialidades];

    // Aplicar filtro de búsqueda
    if (busqueda) {
        especialidadesFiltradas = especialidadesFiltradas.filter(esp => 
            esp.NombreEspecialidad.toLowerCase().includes(busqueda) ||
            (esp.Descripcion && esp.Descripcion.toLowerCase().includes(busqueda))
        );
    }

    // Aplicar filtro de estatus
    if (filtroEstatus) {
        const valorEstatus = filtroEstatus === 'activo' ? 1 : 0;
        especialidadesFiltradas = especialidadesFiltradas.filter(esp => esp.Estatus == valorEstatus);
    }

    // Aplicar ordenamiento
    if (orden) {
        switch(orden) {
            case 'nombre-asc':
                especialidadesFiltradas.sort((a, b) => a.NombreEspecialidad.localeCompare(b.NombreEspecialidad));
                break;
            case 'nombre-desc':
                especialidadesFiltradas.sort((a, b) => b.NombreEspecialidad.localeCompare(a.NombreEspecialidad));
                break;
            case 'fecha-creacion-asc':
                especialidadesFiltradas.sort((a, b) => a.IdEspecialidad - b.IdEspecialidad);
                break;
            case 'fecha-creacion-desc':
                especialidadesFiltradas.sort((a, b) => b.IdEspecialidad - a.IdEspecialidad);
                break;
        }
    }

    // Cargamos diferencias
    mostrarEspecialidades(especialidadesFiltradas);
}