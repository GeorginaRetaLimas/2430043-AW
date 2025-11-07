function mostrarRegistroEspecialidad() {
    const modal = new bootstrap.Modal(document.getElementById('registro_Especialidad'));
    document.getElementById('modal_titulo_especialidad').textContent = 'Registro de Especialidad';
    document.getElementById('detalles_edicion_especialidad').classList.add('hidden');
    document.getElementById('form_Especialidad').reset();
    modal.show();
}