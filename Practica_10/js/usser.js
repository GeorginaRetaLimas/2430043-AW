let usuarios = [];
let usuarioEditando = null;

// Cargar usuarios al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarUsuarios();
    
    // Event listener para el rol
    document.getElementById('rol').addEventListener('change', function() {
        const idMedicoContainer = document.getElementById('id_medico_container');
        if (this.value === 'medico') {
            idMedicoContainer?.classList.remove('d-none');
        } else {
            idMedicoContainer?.classList.add('d-none');
        }
    });
});

function cargarUsuarios() {
    const formData = new FormData();
    formData.append('action', 'get_users');
    
    fetch('../php/user_create.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            usuarios = data.users;
            mostrarUsuarios();
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

function mostrarUsuarios() {
   console.log('Usuarios cargados:', usuarios);
    
    const tbody = document.getElementById('lista_Usuario');
    const busqueda = document.getElementById('buscar').value.toLowerCase();
    const filtroRol = document.getElementById('filtro-rol').value;
    const filtroEstatus = document.getElementById('filtro-categoria').value;
    
    console.log('Filtros:', {busqueda, filtroRol, filtroEstatus});
    
    let usuariosFiltrados = usuarios.filter(user => {
        const coincideBusqueda = user.Usuario.toLowerCase().includes(busqueda);
        const coincideRol = !filtroRol || user.Rol.toLowerCase() === filtroRol;
        const coincideEstatus = !filtroEstatus || 
            (filtroEstatus === 'activo' && user.Activo) ||
            (filtroEstatus === 'inactivo' && !user.Activo);
        
        return coincideBusqueda && coincideRol && coincideEstatus;
    });

    // Aplicar ordenamiento
    const orden = document.getElementById('ordenar').value;
    switch(orden) {
        case 'nombre-asc':
            usuariosFiltrados.sort((a, b) => a.Usuario.localeCompare(b.Usuario));
            break;
        case 'nombre-desc':
            usuariosFiltrados.sort((a, b) => b.Usuario.localeCompare(a.Usuario));
            break;
        case 'acceso-reciente':
            usuariosFiltrados.sort((a, b) => new Date(b.UltimoAcceso) - new Date(a.UltimoAcceso));
            break;
        case 'acceso-antiguo':
            usuariosFiltrados.sort((a, b) => new Date(a.UltimoAcceso) - new Date(b.UltimoAcceso));
            break;
    }

    tbody.innerHTML = '';

    if (usuariosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No se encontraron usuarios</td></tr>';
        return;
    }

    usuariosFiltrados.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.IdUsuario}</td>
            <td>${user.Usuario}</td>
            <td>••••••••</td>
            <td>${user.Rol}</td>
            <td>${user.IdMedico || '-'}</td>
            <td><span class="badge ${user.Activo ? 'bg-success' : 'bg-danger'}">${user.Activo ? 'Activo' : 'Inactivo'}</span></td>
            <td>${user.UltimoAcceso ? new Date(user.UltimoAcceso).toLocaleString() : 'Nunca'}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarUsuario(${user.IdUsuario})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${user.IdUsuario})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function aplicarFiltros() {
    mostrarUsuarios();
}

function mostrarRegistroUsuario() {
    usuarioEditando = null;
    const modal = new bootstrap.Modal(document.getElementById('registro_Usuario'));
    document.getElementById('modal_titulo_usuario').textContent = 'Registro de Usuario';
    document.getElementById('detalles_edicion_usuario').classList.add('hidden');
    document.getElementById('form_Usuario').reset();
    
    document.getElementById('contrasena').closest('.form-floating').classList.remove('d-none');
    document.getElementById('confirmar_contrasena').closest('.form-floating').classList.remove('d-none');
    
    modal.show();
}

function editarUsuario(id) {
    const usuario = usuarios.find(u => u.IdUsuario === id);
    if (!usuario) return;

    usuarioEditando = usuario;
    const modal = new bootstrap.Modal(document.getElementById('registro_Usuario'));
    
    document.getElementById('modal_titulo_usuario').textContent = 'Editar Usuario';
    document.getElementById('detalles_edicion_usuario').classList.remove('hidden');
    
    document.getElementById('contrasena').closest('.form-floating').classList.remove('d-none');
    document.getElementById('confirmar_contrasena').closest('.form-floating').classList.remove('d-none');
    document.getElementById('contrasena').value = '';
    document.getElementById('confirmar_contrasena').value = '';
    document.getElementById('contrasena').required = false;
    
    // Llenar formulario
    document.getElementById('usuario').value = usuario.Usuario;
    document.getElementById('rol').value = usuario.Rol.toLowerCase();
    document.getElementById('estatus_usuario_form').value = usuario.Activo ? 'activo' : 'inactivo';
    
    // Mostrar detalles de edición
    document.getElementById('fecha_Reg_usuario').textContent = `Último acceso: ${usuario.UltimoAcceso ? new Date(usuario.UltimoAcceso).toLocaleString() : 'Nunca'}`;
    document.getElementById('estatus_usuario').textContent = `ID: ${usuario.IdUsuario}`;
    
    modal.show();
}

function guardarUsuario() {
    const formData = new FormData();
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmar_contrasena').value;
    const rol = document.getElementById('rol').value;
    const estatus = document.getElementById('estatus_usuario_form').value;

    console.log('Datos del formulario:', { usuario, rol, estatus, contrasena }); // Debug

    // Validaciones básicas
    if (!usuario || !rol) {
        Swal.fire('Error', 'Complete todos los campos obligatorios', 'error');
        return;
    }

    if (usuarioEditando) {
        // Editar usuario existente
        formData.append('action', 'update_user');
        formData.append('id', usuarioEditando.IdUsuario);
        formData.append('usuario', usuario);
        formData.append('rol', rol);
        formData.append('estatus_usuario_form', estatus);
        
        if (contrasena) {
            formData.append('contrasena', contrasena);
            formData.append('confirmar_contrasena', confirmarContrasena);
        }
    } else {
        // Crear nuevo usuario
        if (!contrasena) {
            Swal.fire('Error', 'La contraseña es obligatoria', 'error');
            return;
        }
        
        formData.append('action', 'create_user');
        formData.append('usuario', usuario);
        formData.append('contrasena', contrasena);
        formData.append('confirmar_contrasena', confirmarContrasena);
        formData.append('rol', rol);
        formData.append('estatus_usuario_form', estatus);
    }

    console.log('Enviando datos al servidor:');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    fetch('../php/user_create.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        if (data.success) {
            Swal.fire('Éxito', data.message, 'success').then(() => {
                // Cerrar modal y recargar lista
                bootstrap.Modal.getInstance(document.getElementById('registro_Usuario')).hide();
                cargarUsuarios();
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

function eliminarUsuario(id) {
    const usuario = usuarios.find(u => u.IdUsuario === id);
    if (!usuario) return;

    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Eliminar al usuario "${usuario.Usuario}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('action', 'delete_user');
            formData.append('id', id);

            fetch('../php/user_create.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Eliminado', data.message, 'success');
                    cargarUsuarios();
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