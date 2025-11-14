function mostrarRegistroCita() {
    const modal = new bootstrap.Modal(document.getElementById('registro_Cita'));
    document.getElementById('modal_titulo_cita').textContent = 'Registro de Cita';
    document.getElementById('detalles_edicion_cita').classList.add('hidden');
    document.getElementById('form_Cita').reset();
    modal.show();
}

// Inicialización de FullCalendar
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
            
    const eventosEjemplo = [
        {
            id: 1,
            title: 'Cita con Juan Pérez',
            start: new Date(new Date().setHours(10, 0, 0, 0)),
            end: new Date(new Date().setHours(11, 0, 0, 0)),
            extendedProps: {
                idPaciente: '1',
                idMedico: '1',
                motivo: 'Consulta general',
                estatus: 'programada',
                observaciones: 'Primera consulta'
            }
        }
    ];
            
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
        },
        events: eventosEjemplo,
        eventClick: function(info) {
            // Al hacer clic en un evento, mostrar detalles o editar
            mostrarDetallesCita(info.event);
        },
        dateClick: function(info) {
            // Al hacer clic en una fecha, abrir modal para agregar cita
            document.getElementById('fecha_cita').value = info.dateStr + 'T10:00';
            mostrarRegistroCita();
        },
        selectable: true,
        select: function(info) {
            // Al seleccionar un rango de fechas, abrir modal para agregar cita
            document.getElementById('fecha_cita').value = info.startStr + 'T10:00';
            mostrarRegistroCita();
        },
        eventColor: function(info) {
            // Colores según el estatus de la cita
            switch(info.event.extendedProps.estatus) {
                 case 'programada':
                    return '#9ccbf5ff';
                case 'confirmada':
                    return '#55ca78ff';
                case 'completada':
                    return '#cbced0ff';
                case 'cancelada':
                    return '#eca4abff';
                default:
                    return '#627795ff';
            }
        }
    });
            
    calendar.render();
            
    // Guardar referencia global del calendario
    window.calendar = calendar;
});
        
// Función para aplicar filtros
function aplicarFiltrosCitas() {
}