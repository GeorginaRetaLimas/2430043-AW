function mostrarRegistroReporte() {
    const modal = new bootstrap.Modal(document.getElementById('registro_Reporte'));
    document.getElementById('modal_titulo_reporte').textContent = 'Generar Reporte';
    document.getElementById('detalles_edicion_reporte').classList.add('hidden');
    document.getElementById('form_Reporte').reset();
    modal.show();
}