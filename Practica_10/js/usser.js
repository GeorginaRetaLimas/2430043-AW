function mostrarRegistroUsuario() {
    const modal = new bootstrap.Modal(document.getElementById('registro_Usuario'));
    document.getElementById('modal_titulo_usuario').textContent = 'Registro de Usuario';

    // Desactivamos edicion
    document.getElementById('detalles_edicion_usuario').classList.add('hidden');

    // limpiamos
    document.getElementById('form_Usuario').reset();

    modal.show();
}
document.getElementById('rol').addEventListener('change', function() {
    const idMedicoContainer = document.getElementById('id_medico_container');
    if (this.value === 'medico') {
        idMedicoContainer.classList.remove('d-none');
    } else {
        idMedicoContainer.classList.add('d-none');
    }
});