function mostrarRegistroPaciente(){
    document.getElementById('modal_titulo').textContent = "Nuevo registro Paciente";

    const modal = new bootstrap.Modal(document.getElementById('registro_Paciente'));
                
    // Mostrar el modal
    modal.show();
}