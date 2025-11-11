<!-- Header -->
<header class="p-2"> 
    <div class="container-fluid"> 
        <div class="d-flex justify-content-between align-items-center"> 
            <!-- Botón para abrir el slide bar -->
            <button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#menu_Lateral">
                <i class="bi bi-list"></i>
            </button>

            <a href="<?php echo $base_path; ?>dashboard.php" class="text-white text-decoration-none mb-0">
                <img src="<?php echo $base_path; ?>assets/img/logo_line_transparent.png" height="35px">
            </a>

            <!-- Botones -->
            <div class="text-end"> 
                <button type="button" class="btn btn-secondary btn-sm" onclick="cerrarSesion()">Cerrar</button> 
            </div> 
        </div> 
    </div> 
</header>