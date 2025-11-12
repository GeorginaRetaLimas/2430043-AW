function cargarEspecialidades() {
    const formData = new FormData();
    formData.append('action', 'get_especialidades');
    
    fetch('specialties_create.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Mostrar datos en tabla
            console.log(data.especialidades);
        }
    });
}