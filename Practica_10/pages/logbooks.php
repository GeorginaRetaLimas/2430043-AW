<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../assets/img/logo_icon_transparent.png" type="image/x-icon">
    <title>Bitacora de Usuarios</title>

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

                <a href="dashboard.html" class="text-white text-decoration-none mb-0">
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
    <!-- Fin de Slide Bar-->

    <!-- Contenido principal de control pacientes -->
    <div class="row h-100 m-0">
        <main class="col mb-5 p-3 overflow-auto">
            <h1 class="text-center">
                Bitacora de Usuarios
            </h1> 
            
            <!-- Búsqueda, filtros y registro -->
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div class="d-flex flex-column flex-md-row gap-2 w-100">
                    <!-- Barra de búsqueda -->
                    <div class="flex-fill">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Buscar en bitácora..." id="buscar_bitacora" oninput="aplicarFiltrosBitacoras()">
                            <button class="btn btn-outline-secondary" type="button" onclick="aplicarFiltrosBitacoras()">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Filtros -->
                    <div class="d-flex gap-2">
                        <select class="form-select filtro-categoria" style="min-width: 150px;" id="filtro-modulo-bitacora" onchange="aplicarFiltrosBitacoras()">
                            <option value="">Módulo</option>
                            <option value="usuarios">Usuarios</option>
                            <option value="pacientes">Pacientes</option>
                            <option value="citas">Citas</option>
                            <option value="medicos">Médicos</option>
                            <option value="pagos">Pagos</option>
                            <option value="reportes">Reportes</option>
                        </select>
                        
                        <select class="form-select filtro-categoria" style="min-width: 160px;" id="filtro-accion-bitacora" onchange="aplicarFiltrosBitacoras()">
                            <option value="">Acción</option>
                            <option value="login">Login</option>
                            <option value="logout">Logout</option>
                            <option value="crear">Crear</option>
                            <option value="editar">Editar</option>
                            <option value="eliminar">Eliminar</option>
                            <option value="consultar">Consultar</option>
                        </select>
                        
                        <select class="form-select filtro-categoria" style="min-width: 160px;" id="filtro-fecha-bitacora" onchange="aplicarFiltrosBitacoras()">
                            <option value="">Fecha</option>
                            <option value="hoy">Hoy</option>
                            <option value="ayer">Ayer</option>
                            <option value="semana">Esta semana</option>
                            <option value="mes">Este mes</option>
                        </select>
                        
                        <select class="form-select filtro-categoria" style="min-width: 160px;" id="ordenar-bitacoras" onchange="aplicarFiltrosBitacoras()">
                            <option value="">Ordenar</option>
                            <option value="fecha-asc">Fecha ↑</option>
                            <option value="fecha-desc">Fecha ↓</option>
                            <option value="usuario-asc">Usuario A-Z</option>
                            <option value="usuario-desc">Usuario Z-A</option>
                        </select>
                    </div>
                </div>
                
                <!-- Botón exportar bitácora -->
                <div class="flex-shrink-0">
                    <button class="btn btn-primary btn-lg" onclick="exportarBitacora()">
                        <i class="bi bi-download me-2"></i>
                        Exportar
                    </button>
                </div>
            </div>

            <!-- Contenedor de pacientes -->
            <div class="card mt-4">
                <div class="card-body">
                    <h6 class="card-title">Bitacora</h6>
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-hover">
                            <thead class="table-primary">
                                <tr>
                                    <th>Id</th>
                                    <th>Id Usuario</th>
                                    <th>Usuario</th>
                                    <th>Fecha Acceso</th>
                                    <th>Accion</th>
                                    <th>Status</th>
                                    <th>Modulo</th>
                                </tr>
                            </thead>
                            <tbody id="lista_Pacientes">
                                <!-- Los pacientes se mostrarán aquí -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>

    </div>

    <!-- Script para el slide Bar -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../js/slideBar.js"></script>
</body>
</html>