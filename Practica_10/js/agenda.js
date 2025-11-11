function mostrarRegistroCita() {
    const modal = new bootstrap.Modal(document.getElementById('registro_Cita'));
    document.getElementById('modal_titulo_cita').textContent = 'Registro de Cita';
    document.getElementById('detalles_edicion_cita').classList.add('hidden');
    document.getElementById('form_Cita').reset();
    modal.show();
}