<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../assets/img/logo_icon_transparent.png" type="image/x-icon">
    <title>Control de Usuarios</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

    <!-- Estilos globales para la web -->
    <link rel="stylesheet" href="../assets/css/style.css" type="text/css">
</head>
<body>
    <!-- Header -->
    <header class="p-2"> 
        <div class="container-fluid"> 
            <div class="d-flex justify-content-between align-items-center"> 
                <!-- Botón para abrir el slide bar -->
                <button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#menu_Lateral">
                    <i class="bi bi-list"></i>
                </button>

                <a href="dashboard.php" class="text-white text-decoration-none mb-0">
                    <img src="../assets/img/logo_line_transparent.png" height="35px">
                </a>

                <!-- Botones -->
                <div class="text-end"> 
                    <button type="button" class="btn btn-secondary btn-sm" onclick="cerrarSesion()">Cerrar</button> 
                </div> 
            </div> 
        </div> 
    </header>

    <!-- Slide Bar -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="menu_Lateral" aria-labelledby="menu_Lateral_Label">
        <div class="offcanvas-header">
            <img src="../assets/img/logo_line_transparent.png" height="40px" href="dashboard.php">
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="list-group list-group-flush">
                <a href="dashboard.php" class="list-group-item list-group-item-action">
                    <i class="bi bi-house-check"></i>
                    Dashboard
                </a>

                <a href="usser.php" class="list-group-item list-group-item-action">
                    <i class="bi bi-person-gear"></i>
                    Control de Usuarios
                </a>
                
                <a href="patient.php" class="list-group-item list-group-item-action">
                    <i class="bi bi-person-bounding-box"></i>
                    Control de Pacientes
                </a>

                <a href="agenda.php" class="list-group-item list-group-item-action">
                    <i class="bi bi-calendar2-plus"></i>
                    Control de Agenda
                </a>

                <a href="doctor.php" class="list-group-item list-group-item-action">
                    <i class="bi bi-people"></i>
                    Control de médicos
                </a>

                <a href="report.php" class="list-group-item list-group-item-action">
                    <i class="bi bi-file-earmark-diff"> </i>
                    Reportes
                </a>

                <a href="payments.php" class="list-group-item list-group-item-action">
                    <i class="bi bi-coin"></i>
                    Pagos
                </a>

                <a href="rate.php" class="list-group-item list-group-item-action">
                    <i class="bi bi-cash-coin"> </i>
                    Gestor de tarifas
                </a>

                <a href="logbooks.php" class="list-group-item list-group-item-action">
                    <i class="bi bi-journal"></i>
                    Bitacoras de usuarios
                </a>

                <a href="specialties.php" class="list-group-item list-group-item-action">
                    <i class="bi bi-eyeglasses"></i>
                    Especialiddes médicas
                </a>
                
                <hr class="my-3">

                <a href="database.php" class="list-group-item list-group-item-action">
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

    <!-- Contenido principal de control pacientes -->
    <div class="row h-100 m-0">
        <main class="col mb-5 p-3 overflow-auto">
            <h1 class="text-center">
                Control de Usuarios
            </h1> 
            
            <!-- Búsqueda, filtros y registro -->
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div class="d-flex flex-column flex-md-row gap-2 w-100">
                    <!-- Barra de búsqueda -->
                    <div class="flex-fill">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Buscar usuario..." id="buscar" oninput="aplicarFiltros()">
                            <button class="btn btn-outline-secondary" type="button" onclick="aplicarFiltros()">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Filtros -->
                    <div class="d-flex gap-2">
                        <!-- Rol -->
                        <select class="form-select filtro-categoria" style="min-width: 150px;" id="filtro-rol" onchange="aplicarFiltros()">
                            <option value="">Rol</option>
                            <option value="secretario">Secretario</option>
                            <option value="medico">Médico</option>
                        </select>

                        <!-- Estatus -->
                        <select class="form-select filtro-categoria" style="min-width: 150px;" id="filtro-categoria" onchange="aplicarFiltros()">
                            <option value="">Estatus</option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                        
                        <!-- Ordenamiento -->
                        <select class="form-select filtro-categoria" style="min-width: 160px;" id="ordenar" onchange="aplicarFiltros()">
                            <option value="">Ordenar</option>
                            <option value="nombre-asc">Nombre A-Z</option>
                            <option value="nombre-desc">Nombre Z-A</option>
                            <option value="nombre-desc">Acceso Recientes</option>
                            <option value="nombre-desc">Acceso Antiguo</option>
                        </select>
                    </div>
                </div>
                
                <!-- Botón agregar paciente -->
                <div class="flex-shrink-0">
                    <button class="btn btn-primary btn-lg" onclick="mostrarRegistroUsuario()">
                        <i class="bi bi-person-plus me-2"></i>
                        Agregar
                    </button>
                </div>
            </div>

            <!-- Contenedor de pacientes -->
            <div class="card mt-4">
                <div class="card-body">
                    <h6 class="card-title">Usuario</h6>
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-hover">
                            <thead class="table-primary">
                                <tr>
                                    <th>Id</th>
                                    <th>Usuario</th>
                                    <th>Contraseña</th>
                                    <th>Rol</th>
                                    <th>IdMedico</th>
                                    <th>Estatus</th>
                                    <th>Ultimo Acceso</th>
                                    <th>Operaciones</th>
                                </tr>
                            </thead>
                            <tbody id="lista_Usuario">
                                <!-- Los pacientes se mostrarán aquí -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>

        <div id="registro_Usuario" class="modal fade" tabindex="-1" aria-labelledby="modal_titulo" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <!-- Cabecera del modal -->
                    <div class="modal-header modal-cabecera-registro">
                        <h5 class="modal-title" id="modal_titulo_usuario">Registro de Usuario</h5>
                        
                        <div id="detalles_edicion_usuario" class="hidden">
                            <h4 id="estatus_usuario"></h4>
                            <h4 id="fecha_Reg_usuario"></h4>
                        </div>
                    </div>

                    <div class="modal-body">
                        <!-- Formulario de Registro -->
                        <form id="form_Usuario" action="../php/usser.php" method="post">
                            <h2>Datos del Usuario</h2>
                            <div class="d-flex align-items-stretch w-100 gap-3 mb-2">
                                <div class="flex-fill">
                                    <div class="form-floating"> 
                                        <input type="text" class="form-control" id="usuario" placeholder="">
                                        <label for="usuario" class="form-label">Nombre de Usuario</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="d-flex align-items-stretch w-100 gap-3 mb-2">
                                <div class="flex-fill">
                                    <div class="form-floating"> 
                                        <input type="password" class="form-control" id="contrasena" placeholder="">
                                        <label for="contrasena" class="form-label">Contraseña</label>
                                    </div>
                                </div>
                                <div class="flex-fill">
                                    <div class="form-floating"> 
                                        <input type="password" class="form-control" id="confirmar_contrasena" placeholder="">
                                        <label for="confirmar_contrasena" class="form-label">Confirmar Contraseña</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row g-3 mb-2">
                                <!-- Rol -->
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <select class="form-select" id="rol">
                                            <option value="" selected disabled></option>
                                            <option value="secretario">Secretario</option>
                                            <option value="medico">Médico</option>
                                        </select>
                                        <label for="rol" class="form-label">Rol</label>
                                    </div>
                                </div>

                                <!-- Estatus -->
                                <div class="col-md-6">
                                    <div class="form-floating mb-3">
                                        <select class="form-select" id="estatus_usuario_form">
                                            <option value="activo">Activo</option>
                                            <option value="inactivo">Inactivo</option>
                                        </select>
                                        <label for="estatus_usuario_form" class="form-label">Estatus</label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-cancel-primary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarUsuario()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="../js/usser.js"></script>

    <!-- Script para el slide Bar -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../js/slideBar.js"></script>
</body>
</html>