let pacientes = [];
let pacienteEditando = null;

// Cargar pacientes al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarPacientes();
});

function cargarPacientes() {
    const formData = new FormData();
    formData.append('action', 'get_patients');
    
    fetch('../php/patient_create.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            pacientes = data.patients;
            mostrarPacientes();
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

function mostrarPacientes() {
    const tbody = document.getElementById('lista_Pacientes');
    const busqueda = document.getElementById('buscar').value.toLowerCase();
    const filtroEstatus = document.getElementById('filtro-categoria').value;
    
    let pacientesFiltrados = pacientes.filter(paciente => {
        const coincideBusqueda = paciente.NombreCompleto.toLowerCase().includes(busqueda) ||
            paciente.CURP?.toLowerCase().includes(busqueda) ||
            paciente.CorreoElectronico?.toLowerCase().includes(busqueda);

        const coincideEstatus = !filtroEstatus || 
            (filtroEstatus === 'activo' && paciente.Estatus === 'activo') ||
            (filtroEstatus === 'inactivo' && paciente.Estatus === 'inactivo');
        
        return coincideBusqueda && coincideEstatus;
    });

    // Aplicar ordenamiento
    const orden = document.getElementById('ordenar').value;
    switch(orden) {
        case 'nombre-asc':
            pacientesFiltrados.sort((a, b) => a.NombreCompleto.localeCompare(b.NombreCompleto));
            break;
        case 'nombre-desc':
            pacientesFiltrados.sort((a, b) => b.NombreCompleto.localeCompare(a.NombreCompleto));
            break;
    }

    tbody.innerHTML = '';

    if (pacientesFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center">No se encontraron pacientes</td></tr>';
        return;
    }

    pacientesFiltrados.forEach(paciente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${paciente.idPaciente}</td>
            <td>${paciente.NombreCompleto}</td>
            <td>${paciente.CURP || '-'}</td>
            <td>${paciente.FechaNacimiento || '-'}</td>
            <td>${paciente.Sexo || '-'}</td>
            <td>${paciente.Telefono || '-'}</td>
            <td>${paciente.CorreoElectronico || '-'}</td>
            <td>${paciente.FechaRegistro ? new Date(paciente.FechaRegistro).toLocaleDateString() : '-'}</td>
            <td><span class="badge ${paciente.Estatus === 'activo' ? 'bg-success' : 'bg-danger'}">${paciente.Estatus === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <button class="btn btn-sm btn-info text-center" onclick="mostrarDetallesPaciente(${paciente.idPaciente})">
                    <i class="bi bi-eye"></i> Ver
                </button>
            </td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarPaciente(${paciente.idPaciente})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarPaciente(${paciente.idPaciente})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function aplicarFiltros() {
    mostrarPacientes();
}

function mostrarRegistroPaciente(){
    pacienteEditando = null;
    const modal = new bootstrap.Modal(document.getElementById('registro_Paciente'));
    document.getElementById('modal_titulo').textContent = "Nuevo registro Paciente";
    document.getElementById('detalles_edicion').classList.add('hidden');
    document.getElementById('form_Paciente').reset();
    
    modal.show();
}

function editarPaciente(id) {
    const paciente = pacientes.find(p => p.idPaciente === id);
    if (!paciente) return;

    pacienteEditando = paciente;
    const modal = new bootstrap.Modal(document.getElementById('registro_Paciente'));
    
    document.getElementById('modal_titulo').textContent = 'Editar Paciente';
    document.getElementById('detalles_edicion').classList.remove('hidden');
    
    // Llenar formulario
    document.getElementById('nombre').value = paciente.NombreCompleto;
    document.getElementById('curp').value = paciente.CURP || '';
    document.getElementById('fecha_Nac').value = paciente.FechaNacimiento || '';
    document.getElementById('sexo').value = paciente.Sexo || '';
    document.getElementById('telefono').value = paciente.Telefono || '';
    document.getElementById('correo').value = paciente.CorreoElectronico || '';
    document.getElementById('direccion').value = paciente.Direccion || '';
    document.getElementById('cont_emergencia').value = paciente.ContactoEmergencia || '';
    document.getElementById('tel_emergencia').value = paciente.TelefonoEmergencia || '';
    document.getElementById('alergias').value = paciente.Alergias || '';
    document.getElementById('antecedente').value = paciente.AntecedentesMedicos || '';
    
    document.getElementById('fecha_Reg').textContent = `Fecha registro: ${paciente.FechaRegistro ? new Date(paciente.FechaRegistro).toLocaleDateString() : 'N/A'}`;
    document.getElementById('estatus').textContent = `ID: ${paciente.idPaciente}`;
    
    modal.show();
}

function guardarPaciente() {
    const formData = new FormData();
    const nombre = document.getElementById('nombre').value;
    const curp = document.getElementById('curp').value;
    const fechaNac = document.getElementById('fecha_Nac').value;
    const sexo = document.getElementById('sexo').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;
    const direccion = document.getElementById('direccion').value;
    const contEmergencia = document.getElementById('cont_emergencia').value;
    const telEmergencia = document.getElementById('tel_emergencia').value;
    const alergias = document.getElementById('alergias').value;
    const antecedente = document.getElementById('antecedente').value;

    // Validaciones básicas
    if (!nombre || !curp || !fechaNac || !sexo) {
        Swal.fire('Error', 'Los campos son obligatorios', 'error');
        return;
    }

    if (pacienteEditando) {
        // Editar paciente existente
        formData.append('action', 'update_patient');
        formData.append('id', pacienteEditando.idPaciente);
        formData.append('estatus', pacienteEditando.Estatus);
    } else {
        // Crear nuevo paciente
        formData.append('action', 'create_patient');
    }

    // Agregar datos comunes
    formData.append('nombre', nombre);
    formData.append('curp', curp);
    formData.append('fecha_Nac', fechaNac);
    formData.append('sexo', sexo);
    formData.append('telefono', telefono);
    formData.append('correo', correo);
    formData.append('direccion', direccion);
    formData.append('cont_emergencia', contEmergencia);
    formData.append('tel_emergencia', telEmergencia);
    formData.append('alergias', alergias);
    formData.append('antecedente', antecedente);

    fetch('../php/patient_create.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Éxito', data.message, 'success').then(() => {
                // Cerrar modal y recargar lista
                bootstrap.Modal.getInstance(document.getElementById('registro_Paciente')).hide();
                cargarPacientes();
            });
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

function eliminarPaciente(id) {
    const paciente = pacientes.find(p => p.idPaciente === id);
    if (!paciente) return;

    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Eliminar al paciente "${paciente.NombreCompleto}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('action', 'delete_patient');
            formData.append('id', id);

            fetch('../php/patient_create.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Eliminado', data.message, 'success');
                    cargarPacientes();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Error de conexión', 'error');
            });
        }
    });
}

function mostrarDetallesPaciente(id) {
    const formData = new FormData();
    formData.append('action', 'get_patient_details');
    formData.append('id', id);

    fetch('../php/patient_create.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarModalDetalles(data.patient);
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

function mostrarModalDetalles(paciente) {
    // Formatear alergias para mostrar mejor
    const alergiasFormateadas = paciente.Alergias ? 
        paciente.Alergias.split(',').map(a => a.trim()).join(', ') : 
        'Ninguna';

    const detallesHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6 class="mb-3">Datos Personales</h6>
                <div class="d-flex mb-2">
                    <strong class="me-2">Nombre:</strong>
                    <span>${paciente.NombreCompleto}</span>
                </div>
                <div class="d-flex mb-2">
                    <strong class="me-2">CURP:</strong>
                    <span>${paciente.CURP || 'No especificado'}</span>
                </div>
                <div class="d-flex mb-2">
                    <strong class="me-2">Fecha Nacimiento:</strong>
                    <span>${paciente.FechaNacimiento || 'No especificado'}</span>
                </div>
                <div class="d-flex mb-2">
                    <strong class="me-2">Sexo:</strong>
                    <span>${paciente.Sexo || 'No especificado'}</span>
                </div>
                <div class="d-flex mb-2">
                    <strong class="me-2">Teléfono:</strong>
                    <span>${paciente.Telefono || 'No especificado'}</span>
                </div>
                <div class="d-flex mb-2">
                    <strong class="me-2">Correo:</strong>
                    <span>${paciente.CorreoElectronico || 'No especificado'}</span>
                </div>
            </div>
            
            <div class="col-md-6">
                <h6 class="mb-3">Dirección</h6>
                <div class="mb-2">
                    <span>${paciente.Direccion || 'No especificado'}</span>
                </div>
                
                <h6 class="mt-4 mb-3">Contacto de Emergencia</h6>
                <div class="d-flex mb-2">
                    <strong class="me-2">Nombre:</strong>
                    <span>${paciente.ContactoEmergencia || 'No especificado'}</span>
                </div>
                <div class="d-flex mb-2">
                    <strong class="me-2">Teléfono:</strong>
                    <span>${paciente.TelefonoEmergencia || 'No especificado'}</span>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-12">
                <h6 class="mb-3">Datos Médicos</h6>
                <div class="d-flex mb-2">
                    <strong class="me-2">Alergias:</strong>
                    <span>${alergiasFormateadas}</span>
                </div>
                <div class="d-flex mb-2">
                    <strong class="me-2">Antecedentes Médicos:</strong>
                    <span>${paciente.AntecedentesMedicos || 'No especificado'}</span>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-md-6">
                <div class="d-flex mb-2">
                    <strong class="me-2">Fecha Registro:</strong>
                    <span>${paciente.FechaRegistro ? new Date(paciente.FechaRegistro).toLocaleString() : 'N/A'}</span>
                </div>
            </div>
            <div class="col-md-6">
                <div class="d-flex mb-2">
                    <strong class="me-2">Estatus:</strong>
                    <span class="badge ${paciente.Estatus === 'activo' ? 'bg-success' : 'bg-danger'}">${paciente.Estatus === 'activo' ? 'Activo' : 'Inactivo'}</span>
                </div>
            </div>
        </div>
        `;

    Swal.fire({
        title: `Detalles del Paciente - ${paciente.NombreCompleto}`,
        html: detallesHTML,
        width: 800,
        confirmButtonText: 'Cerrar'
    });
}

// Función para validar alergias
function validarAlergias() {
    const textareaAlergias = document.getElementById('alergias');
    const valor = textareaAlergias.value.trim();
    
    // Validar longitud máxima
    if (valor.length > 500) {
        Swal.fire('Advertencia', 'Las alergias no pueden exceder los 500 caracteres', 'warning');
        textareaAlergias.value = valor.substring(0, 500);
    }
    
    // Opcional: Contador de caracteres
    const contador = document.getElementById('contador-alergias');
    if (!contador) {
        const contadorElement = document.createElement('small');
        contadorElement.id = 'contador-alergias';
        contadorElement.className = 'text-muted float-end';
        textareaAlergias.parentNode.appendChild(contadorElement);
    }
    
    document.getElementById('contador-alergias').textContent = `${valor.length}/500 caracteres`;
}

// Función para formatear las alergias (opcional)
function formatearAlergias(alergiasTexto) {
    if (!alergiasTexto || alergiasTexto.trim() === '') {
        return 'Ninguna';
    }
    
    // Separar por comas y limpiar espacios
    const alergiasArray = alergiasTexto.split(',')
        .map(alergia => alergia.trim())
        .filter(alergia => alergia !== '');
    
    return alergiasArray.join(', ');
}