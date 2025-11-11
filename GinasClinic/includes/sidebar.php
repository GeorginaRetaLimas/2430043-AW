<!-- Slide Bar -->
<div class="offcanvas offcanvas-start" tabindex="-1" id="menu_Lateral" aria-labelledby="menu_Lateral_Label">
    <div class="offcanvas-header">
        <img src="<?php echo $base_path; ?>assets/img/logo_line_transparent.png" height="40px" href="dashboard.php">
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <div class="list-group list-group-flush">
            <a href="<?php echo $base_path; ?>dashboard.php" class="list-group-item list-group-item-action <?php echo ($current_page == 'dashboard') ? 'list-group-item-select' : ''; ?>">
                <i class="bi bi-house-check"></i>
                Dashboard
            </a>
            
           <a href="<?php echo $base_path; ?>pages/users/index.php" class="list-group-item list-group-item-action <?php echo ($current_page == 'usser') ? 'list-group-item-select' : ''; ?>">
                <i class="bi bi-person-gear"></i>
                Control de Usuarios
            </a>
            
            <a href="<?php echo $base_path; ?>pages/patients/index.php" class="list-group-item list-group-item-action <?php echo ($current_page == 'patient') ? 'list-group-item-select' : ''; ?>">
                <i class="bi bi-person-bounding-box"></i>
                Control de Pacientes
            </a>

            <a href="agenda.html" class="list-group-item list-group-item-action">
                <i class="bi bi-calendar2-plus"></i>
                Control de Agenda
            </a>

            <a href="doctor.html" class="list-group-item list-group-item-action">
                <i class="bi bi-people"></i>
                Control de médicos
            </a>

            <a href="report.html" class="list-group-item list-group-item-action">
                <i class="bi bi-file-earmark-diff"> </i>
                Reportes
            </a>

            <a href="payments.html" class="list-group-item list-group-item-action">
                <i class="bi bi-coin"></i>
                Pagos
            </a>

            <a href="rate.html" class="list-group-item list-group-item-action">
                <i class="bi bi-cash-coin"> </i>
                Gestor de tarifas
            </a>

            <a href="logbooks.html" class="list-group-item list-group-item-action">
                <i class="bi bi-journal"></i>
                Bitacoras de usuarios
            </a>

            <a href="specialties.html" class="list-group-item list-group-item-action">
                <i class="bi bi-eyeglasses"></i>
                Especialiddes médicas
            </a>
            
            <hr class="my-3">

            <a href="database.html" class="list-group-item list-group-item-action">
                <i class="bi bi-database-check"></i>
                Ver base de datos
            </a>

            <hr class="my-3">
            
            <a href="#" class="list-group-item list-group-item-action text-danger" onclick="cerrarSesion()">
                <i class="bi bi-box-arrow-left me-2"></i>
                Cerrar sesión
            </a>
        </div>
    </div>
</div>
<!-- Fin de Slide Bar -->