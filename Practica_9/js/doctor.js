function mostrarRegistroMedico() {
    const modal = new bootstrap.Modal(document.getElementById('registro_Medico'));
    document.getElementById('modal_titulo_medico').textContent = 'Registro de Médico';
    document.getElementById('detalles_edicion_medico').classList.add('hidden');
    document.getElementById('form_Medico').reset();
    modal.show();
}