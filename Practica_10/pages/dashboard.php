<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../assets/img/logo_icon_transparent.png" type="image/x-icon">
    <title>Dashboard</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

    <!-- Estilos globales de la web -->
    <link rel="stylesheet" href="../assets/css/style.css" type="text/css">

    <!-- Estilos especificos -->
    <link rel="stylesheet" href="../assets/css/dashboard.css" type="text/css">
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
    <!-- Fin de Slide Bar -->

    <!-- Contenido principal -->
    <div class="row h-100 m-0">
        <main class="col mb-5 p-3 overflow-auto">
            <!-- Carrucel de imagenes -->
            <div id="carouselExampleIndicators" class="carousel slide mx-3 my-4 rounded-3" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img class="d-block w-100" src="../assets/carousel/image.png" alt="First slide">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../assets/carousel/imagen2.png" alt="Second slide">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../assets/carousel/imagen3.png" alt="Third slide">
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            <!-- Fin de Carrucel de imagen -->

            <!-- Primera fila -->
            <div class="d-flex align-items-stretch w-100 gap-3 mb-4">
                <div class="card flex-fill">
                    <div class="card-body">
                        <h3 class="mb-4">Registros </h3>
                        <div class="d-flex align-items-stretch w-100 gap-3 mb-4">
                            <div class="card flex-fill card-body">
                                <div>Doctores</div>
                                <a>Conocelos</a>
                            </div>
                            <div class="card flex-fill card-body">
                                <div>Pacientes</div>
                                <a>Conocelos</a>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="card">
                    <div class="card-body">
                        <h3 class="mb-4">Especialidades en</h3>
                        <ul>
                            <li>Dermatología</li>
                            <li>Pedrialogía</li>
                        </ul>
                    </div>
                </div>

                <div class="card flex-fill">
                    <div class="card-body">
                        <h3 class="mb-4">Control Citas</h3>
                        <div class="d-flex align-items-stretch w-100 gap-3 mb-4">
                            <div class="card flex-fill card-body">
                                Proxima cita
                                <div>Lunes 7:00</div>
                            </div>
                            <div class="card flex-fill card-body">
                                <p>Detalles de Cita</p>
                                <div class="d-flex align-items-stretch w-100 gap-3 mb-4">
                                    <div class="card flex-fill card-body">
                                        Servicio: Limpieza dental
                                    </div>
                                    <div class="card flex-fill card-body">
                                        Le dan miedo las agujas
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Fin Primera fila -->

            <!-- Segunda fila -->
            <div class="d-flex align-items-stretch w-100 gap-3">
                <div class="card flex-fill">
                    <div class="card-body">
                        <h3 class="mb-4">Dinero Generado</h3>
                        
                    </div>
                </div>


                <div class="card flex-fill">
                    <div class="card-body">
                        <h3 class="mb-4">Clientes atendidos</h3>
                        
                    </div>
                </div>
            </div>
            <!-- Fin Segunda fila -->
        </main>
    </div>

    <footer>
        <h4 class="text-center">Georgina Reta Limas</h4>
    </footer>

    <!-- Script para el slide Bar -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../js/slideBar.js"></script>
    <script src="../js/dashboard.js"></script>
</body>
</html>