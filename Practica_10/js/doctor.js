// Variables globales
let datosMedicos = [];
let idMedicoEditando = null;
let especialidadesDisponibles = [];
let especialidadesFiltro = [];

// Cargar médicos y especialidades al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarMedicos();
    cargarEspecialidadesSelect();
    cargarEspecialidadesFiltro();
});

// Cargar especialidades para el select
function cargarEspecialidadesSelect() {
    const datosFormulario = new FormData();
    datosFormulario.append('action', 'get_especialidades_select');

    fetch('../php/doctor_create.php', {
        method: 'POST',
        body: datosFormulario
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.success) {
            especialidadesDisponibles = datos.especialidades;
            llenarSelectEspecialidades();
        }
    })
    .catch(error => {
        console.error('Error al cargar especialidades:', error);
    });
}

// En esta funcion hacemos la peticion de las especialidades
function cargarEspecialidadesFiltro() {
    const datosFormulario = new FormData();
    datosFormulario.append('action', 'get_especialidades_filtro');

    fetch('../php/doctor_create.php', {
        method: 'POST',
        body: datosFormulario
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.success) {
            especialidadesFiltro = datos.especialidades;
            llenarFiltroEspecialidades();
        }
    })
    .catch(error => {
        console.error('Error al cargar especialidades para filtro:', error);
    });
}

// Para llenar el filtro
function llenarFiltroEspecialidades() {
    const selectFiltro = document.getElementById('filtro-especialidad-medico');
    selectFiltro.innerHTML = '<option value="">Todas las especialidades</option>';
    
    especialidadesFiltro.forEach(especialidad => {
        const option = document.createElement('option');
        option.value = especialidad.NombreEspecialidad;
        option.textContent = especialidad.NombreEspecialidad;
        selectFiltro.appendChild(option);
    });
}

// Llenar el select de especialidades
function llenarSelectEspecialidades() {
    const select = document.getElementById('especialidad_medico');
    select.innerHTML = '<option value="" selected disabled>Seleccione una especialidad</option>';
    
    especialidadesDisponibles.forEach(especialidad => {
        const option = document.createElement('option');
        option.value = especialidad.IdEspecialidad;
        option.textContent = especialidad.NombreEspecialidad;
        select.appendChild(option);
    });
}

// Preparar el modal de registro
function mostrarRegistroMedico() {
    idMedicoEditando = null;
    const modal = new bootstrap.Modal(document.getElementById('registro_Medico'));
    
    document.getElementById('modal_titulo_medico').textContent = 'Registro de Médico';
    document.getElementById('detalles_edicion_medico').classList.add('hidden');
    document.getElementById('form_Medico').reset();
    document.getElementById('estatus_medico_form').value = 'activo';
    
    modal.show();
}

// Mostrar el modal de registro con el modo de edición
function mostrarEdicionMedico(id) {
    const medico = datosMedicos.find(med => med.IdMedico == id);
    if (!medico) return;

    idMedicoEditando = id;
    const modal = new bootstrap.Modal(document.getElementById('registro_Medico'));
    
    document.getElementById('modal_titulo_medico').textContent = 'Editar Médico';
    document.getElementById('detalles_edicion_medico').classList.remove('hidden');
    
    document.getElementById('nombre_medico').value = medico.NombreCompleto || '';
    document.getElementById('cedula_medico').value = medico.CedulaProfesional || '';
    document.getElementById('telefono_medico').value = medico.Telefono || '';
    document.getElementById('correo_medico').value = medico.CorreoElectronico || '';
    // La especialidad ahora viene de la relación con la tabla medico_especialidades
    document.getElementById('especialidad_medico').value = medico.IdEspecialidad || '';
    document.getElementById('horario_medico').value = medico.HorarioAtencion || '';
    document.getElementById('estatus_medico_form').value = medico.Estatus == 1 ? 'activo' : 'inactivo';
    
    // Mostrar detalles de edición
    document.getElementById('fecha_Reg_medico').textContent = `ID: ${medico.IdMedico}`;
    document.getElementById('estatus_medico').textContent = medico.Estatus == 1 ? 'Activo' : 'Inactivo';
    
    modal.show();
}

// Función del formulario para registrar médicos
function guardarMedico() {
    // Traemos los valores del formulario
    const nombre = document.getElementById('nombre_medico').value.trim();
    const cedula = document.getElementById('cedula_medico').value.trim();
    const telefono = document.getElementById('telefono_medico').value.trim();
    const correo = document.getElementById('correo_medico').value.trim();
    const especialidad = document.getElementById('especialidad_medico').value;
    const horario = document.getElementById('horario_medico').value;
    const estatus = document.getElementById('estatus_medico_form').value;

    // Validaciones básicas en JavaScript
    if (!nombre || !cedula || !especialidad) {
        Swal.fire('Error', 'Nombre, cédula y especialidad son obligatorios', 'error');
        return;
    }

    if (cedula.length < 5) {
        Swal.fire('Error', 'La cédula debe tener al menos 5 caracteres', 'error');
        return;
    }

    if (correo && !validarEmail(correo)) {
        Swal.fire('Error', 'El formato del correo electrónico no es válido', 'error');
        return;
    }

    // Creamos el objeto FormData
    const datosFormulario = new FormData();

    // Mandamos la accion a hacer, si se esta editando algo decimos que es una actualización,
    // si no, decimos que es la creacion de un medico
    datosFormulario.append('action', idMedicoEditando ? 'update_medicos' : 'create_medicos');

    // Pasamos los datos
    datosFormulario.append('nombre_medico', nombre);
    datosFormulario.append('cedula_medico', cedula);
    datosFormulario.append('telefono_medico', telefono);
    datosFormulario.append('correo_medico', correo);
    datosFormulario.append('especialidad_medico', especialidad);
    datosFormulario.append('horario_medico', horario);
    datosFormulario.append('estatus_medico_form', estatus);
    
    // Y si se esta editando pasamos el id
    if (idMedicoEditando) {
        datosFormulario.append('id', idMedicoEditando);
    }

    // Enviamos la petición al servidor
    fetch('../php/doctor_create.php', {
        method: 'POST',
        body: datosFormulario
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.success) {
            Swal.fire('Éxito', datos.message, 'success').then(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('registro_Medico'));
                modal.hide();
                cargarMedicos();
            });
        } else {
            Swal.fire('Error', datos.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al guardar el médico', 'error');
    });
}

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Cargar médicos
function cargarMedicos() {
    const datosFormulario = new FormData();
    datosFormulario.append('action', 'get_medicos');

    fetch('../php/doctor_create.php', {
        method: 'POST',
        body: datosFormulario
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.success) {
            datosMedicos = datos.medicos;
            mostrarMedicos(datosMedicos);
            actualizarEspecialidadesFiltro();
        } else {
            Swal.fire('Error', 'Error interno al cargar los médicos', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al cargar los médicos', 'error');
    });
}

// Mostrar médicos en la tabla
function mostrarMedicos(medicos) {
    const cuerpoTabla = document.getElementById('lista_Pacientes');
    cuerpoTabla.innerHTML = '';

    if (medicos.length === 0) {
        cuerpoTabla.innerHTML = '<tr><td colspan="9" class="text-center">No se encontraron médicos</td></tr>';
        return;
    }

    medicos.forEach(medico => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${medico.IdMedico}</td>
            <td>${medico.NombreCompleto}</td>
            <td>${medico.CedulaProfesional || '-'}</td>
            <td>${medico.Telefono || '-'}</td>
            <td>${medico.CorreoElectronico || '-'}</td>
            <td>${medico.HorarioAtencion || '-'}</td>
            <td>${medico.FechaIngreso ? new Date(medico.FechaIngreso).toLocaleDateString() : '-'}</td>
            <td>
                <span class="badge ${medico.Estatus == 1 ? 'bg-success' : 'bg-danger'}">
                    ${medico.Estatus == 1 ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="mostrarEdicionMedico(${medico.IdMedico})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarMedico(${medico.IdMedico})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

// Eliminar un médico
function eliminarMedico(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            const datosFormulario = new FormData();
            datosFormulario.append('action', 'delete_medicos');
            datosFormulario.append('id', id);

            fetch('../php/doctor_create.php', {
                method: 'POST',
                body: datosFormulario
            })
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.success) {
                    Swal.fire('Eliminado', datos.message, 'success');
                    cargarMedicos();
                } else {
                    Swal.fire('Error', datos.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Error al eliminar el médico', 'error');
            });
        }
    });
}

function aplicarFiltrosMedicos() {
    const busqueda = document.getElementById('buscar_medico').value.toLowerCase();
    const filtroEstatus = document.getElementById('filtro-estatus-medico').value;
    const filtroEspecialidad = document.getElementById('filtro-especialidad-medico').value;
    const orden = document.getElementById('ordenar-medicos').value;

    let medicosFiltrados = [...datosMedicos];

    // Aplicar filtro de búsqueda
    if (busqueda) {
        medicosFiltrados = medicosFiltrados.filter(med => 
            med.NombreCompleto.toLowerCase().includes(busqueda) ||
            (med.CedulaProfessional && med.CedulaProfessional.toLowerCase().includes(busqueda)) ||
            (med.CorreoElectronico && med.CorreoElectronico.toLowerCase().includes(busqueda))
        );
    }

    // Aplicar filtro de estatus
    if (filtroEstatus) {
        const valorEstatus = filtroEstatus === 'activo' ? 1 : 0;
        medicosFiltrados = medicosFiltrados.filter(med => med.Estatus == valorEstatus);
    }

    // Aplicar filtro de especialida
    if (filtroEspecialidad) {
        medicosFiltrados = medicosFiltrados.filter(med => 
            med.NombreEspecialidad && 
            med.NombreEspecialidad.toLowerCase() === filtroEspecialidad.toLowerCase()
        );
    }

    // Aplicar ordenamiento
    if (orden) {
        switch(orden) {
            case 'nombre-asc':
                medicosFiltrados.sort((a, b) => a.NombreCompleto.localeCompare(b.NombreCompleto));
                break;
            case 'nombre-desc':
                medicosFiltrados.sort((a, b) => b.NombreCompleto.localeCompare(a.NombreCompleto));
                break;
            case 'fecha-ingreso-asc':
                medicosFiltrados.sort((a, b) => new Date(a.FechaIngreso) - new Date(b.FechaIngreso));
                break;
            case 'fecha-ingreso-desc':
                medicosFiltrados.sort((a, b) => new Date(b.FechaIngreso) - new Date(a.FechaIngreso));
                break;
        }
    }

    mostrarMedicos(medicosFiltrados);
}

// Actualizar las especialidades del filtro cuando se cargan/actualizan médicos
function actualizarEspecialidadesFiltro() {
    // Extraer especialidades únicas de los médicos cargados
    const especialidadesUnicas = [...new Set(datosMedicos
        .filter(medico => medico.NombreEspecialidad)
        .map(medico => medico.NombreEspecialidad)
    )].sort();

    const selectFiltro = document.getElementById('filtro-especialidad-medico');
    selectFiltro.innerHTML = '<option value="">Todas las especialidades</option>';
    
    especialidadesUnicas.forEach(especialidad => {
        const option = document.createElement('option');
        option.value = especialidad;
        option.textContent = especialidad;
        selectFiltro.appendChild(option);
    });
}