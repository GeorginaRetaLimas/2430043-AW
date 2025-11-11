// Variable global con la que manejaremos el calendario
let fechaInicioSemana = new Date();

// Cada que se recargue la página
document.addEventListener('DOMContentLoaded', function() {
    generarSemana();
});

// Mostrar semana anterior
function semanaAnterior() {
    // Obtenemos el inicio actual y regresamos 7
    fechaInicioSemana.setDate(fechaInicioSemana.getDate() - 7);
    generarSemana();
}

// Mostrar semana siguiente
function semanaSiguiente() {
    // Obtenemos el inicio actual y agregamos 7
    fechaInicioSemana.setDate(fechaInicioSemana.getDate() + 7);
    generarSemana();
}

// Volvemos al dia actual y generamos
function irAHoy() {
    fechaInicioSemana = new Date();
    generarSemana();
}

// Generar el calendario semanal
function generarSemana() {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const hoy = new Date();
    
    // Calculamos el inicio de la semana con el Lunes
    const inicioSemana = new Date(fechaInicioSemana);
    inicioSemana.setDate(fechaInicioSemana.getDate() - fechaInicioSemana.getDay());
    
    // Obtenemos los nuevos datos de rango de semana
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    
    // Y los mostramos
    document.getElementById('rango-semana').textContent = `${inicioSemana.toLocaleDateString()} - ${finSemana.toLocaleDateString()}`;
    
    // Generamos los encabezados de días
    const diasSemanaHTML = document.querySelector('.dias-semana');
    diasSemanaHTML.innerHTML = '';
    
    // Generamos los cuerpo de la semana
    const cuerpoSemanaHTML = document.querySelector('.cuerpo-semana');
    cuerpoSemanaHTML.innerHTML = '';
    
    // Llenamos los dias con un for
    for (let i = 0; i < 7; i++) {
        const fechaDia = new Date(inicioSemana);
        fechaDia.setDate(inicioSemana.getDate() + i);
        
        // Declaramos el encabezado del dia
        const diaHeader = document.createElement('div');
        diaHeader.className = 'dia-semana';
        if (fechaDia.toDateString() === hoy.toDateString()) {
            diaHeader.classList.add('hoy');
        }
        
        // Añadimos el dia de la semana y el número
        diaHeader.innerHTML = `
            <div>${diasSemana[i]}</div>
            <div>${fechaDia.getDate()}</div>
        `;

        // Agregamos a la variable
        diasSemanaHTML.appendChild(diaHeader);
        
        // Cuerpo del día
        const diaCitas = document.createElement('div');
        diaCitas.className = 'dia-citas';

        // Mostramos el dia excluyendo los demas datos
        diaCitas.id = `dia-${fechaDia.toISOString().split('T')[0]}`;
        
        // Si es hoy lo mostramos
        if (fechaDia.toDateString() === hoy.toDateString()) {
            diaCitas.classList.add('hoy');
        }
        
        // Prueba de cita
        diaCitas.innerHTML = `
            <div class="cita-semanal text-center" onclick="seleccionarCita(1)">
                09:00 - Cita de ejemplo <br>
                wiwiwiwiw
            </div>
        `;
        
        // Añadimos los nuevos datos
        cuerpoSemanaHTML.appendChild(diaCitas);
    }
}

// Ejemplo para ver si jala al seleccionar una cita
function seleccionarCita(idCita) {
    console.log('Cita seleccionada:', idCita);
}