function confirmarDescarga() {
    Swal.fire({
        title: '¿Descargar la base de datos?',
        text: 'Se descargará el archivo SQL que contiene la base de datos',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Descargar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        // Descargar archivo
        if (result.isConfirmed) {
            // ruta a la base de datos
            const url = '../bd/clinica_db.sql';

            // Creamos el enlace de manera dinamica
            const link = document.createElement('a');

            // le establecemos este link
            link.href = url;

            // Y el atributo de descarga, se bajará la fecha y agrega el .sql
            link.download = 'Backup_GinasClinic_' + new Date().toISOString() + '.sql';
                    
            // Agregamos este enlace al cuerpo del documento
            document.body.appendChild(link);

            // Simulamos un click y esto dispara la descarga
            link.click();

            // Eliminamos el enlace
            document.body.removeChild(link);
                    
            Swal.fire(
                'Descargado',
                'La base de datos se ha descargado correctamente.',
                'success'
            );
        }
    });
}

function mandarGithub(){
    window.open("https://github.com/GeorginaRetaLimas/2430043-AW/tree/main/Practica_9", "_blank");
}