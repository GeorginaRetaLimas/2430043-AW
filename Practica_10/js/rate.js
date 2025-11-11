function mostrarRegistroTarifa() {
    const modal = new bootstrap.Modal(document.getElementById('registro_Tarifa'));
    document.getElementById('modal_titulo_tarifa').textContent = 'Registro de Tarifa';
    document.getElementById('detalles_edicion_tarifa').classList.add('hidden');
    document.getElementById('form_Tarifa').reset();
    modal.show();
}