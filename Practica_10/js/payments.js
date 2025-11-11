function mostrarRegistroPago() {
    const modal = new bootstrap.Modal(document.getElementById('registro_Pago'));
    document.getElementById('modal_titulo_pago').textContent = 'Registro de Pago';
    document.getElementById('detalles_edicion_pago').classList.add('hidden');
    document.getElementById('form_Pago').reset();
    modal.show();
}