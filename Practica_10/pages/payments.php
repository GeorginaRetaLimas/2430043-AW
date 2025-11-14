<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../assets/img/logo_icon_transparent.png" type="image/x-icon">
    <title>Control de Pagos</title>

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
                Control de Pago
            </h1>
            
            <!-- Búsqueda, filtros y registro -->
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div class="d-flex flex-column flex-md-row gap-2 w-100">
                    <!-- Barra de búsqueda -->
                    <div class="flex-fill">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Buscar pago..." id="buscar_pago" oninput="aplicarFiltrosPagos()">
                            <button class="btn btn-outline-secondary" type="button" onclick="aplicarFiltrosPagos()">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Filtros -->
                    <div class="d-flex gap-2">
                        <select class="form-select filtro-categoria" style="min-width: 150px;" id="filtro-estatus-pago" onchange="aplicarFiltrosPagos()">
                            <option value="">Estatus</option>
                            <option value="completado">Completado</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="fallido">Fallido</option>
                        </select>
                        
                        <select class="form-select filtro-categoria" style="min-width: 160px;" id="filtro-metodo-pago" onchange="aplicarFiltrosPagos()">
                            <option value="">Método</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="transferencia">Transferencia</option>
                        </select>
                        
                        <select class="form-select filtro-categoria" style="min-width: 160px;" id="filtro-fecha-pago" onchange="aplicarFiltrosPagos()">
                            <option value="">Fecha</option>
                            <option value="hoy">Hoy</option>
                            <option value="semana">Esta semana</option>
                            <option value="mes">Este mes</option>
                            <option value="rango">Rango personalizado</option>
                        </select>
                        
                        <select class="form-select filtro-categoria" style="min-width: 160px;" id="ordenar-pagos" onchange="aplicarFiltrosPagos()">
                            <option value="">Ordenar</option>
                            <option value="fecha-asc">Fecha ↑</option>
                            <option value="fecha-desc">Fecha ↓</option>
                            <option value="monto-asc">Monto ↑</option>
                            <option value="monto-desc">Monto ↓</option>
                        </select>
                    </div>
                </div>
                
                <!-- Botón agregar pago -->
                <div class="flex-shrink-0">
                    <button class="btn btn-primary btn-lg" onclick="mostrarRegistroPago()">
                        <i class="bi bi-currency-dollar me-2"></i>
                        Agregar Pago
                    </button>
                </div>
            </div>

            <!-- Contenedor de pacientes -->
            <div class="card mt-4">
                <div class="card-body">
                    <h6 class="card-title">Pagos</h6>
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-hover">
                            <thead class="table-primary">
                                <tr>
                                    <th>Id</th>
                                    <th>Id Cita</th>
                                    <th>Monto</th>
                                    <th>Método Pago</th>
                                    <th>Fecha Pago</th>
                                    <th>Referencia</th>
                                    <th>Estatus</th>
                                    <th>Operaciones</th>
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

        <!-- Modal de registro o edición de Pago -->
        <div id="registro_Pago" class="modal fade" tabindex="-1" aria-labelledby="modal_titulo_pago" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <!-- Cabecera del modal -->
                    <div class="modal-header modal-cabecera-registro">
                        <h5 class="modal-title" id="modal_titulo_pago">Registro de Pago</h5>
                        
                        <div id="detalles_edicion_pago" class="hidden">
                            <h4 id="fecha_Reg_pago"></h4>
                            <h4 id="estatus_pago"></h4>
                        </div>
                    </div>

                    <div class="modal-body">
                        <!-- Formulario de Registro -->
                        <form id="form_Pago">
                            <h2>Datos del Pago</h2>
                            <div class="d-flex align-items-stretch w-100 gap-3 mb-2">
                                <div class="flex-fill">
                                    <div class="form-floating"> 
                                        <input type="text" class="form-control" id="id_cita_pago" placeholder="">
                                        <label for="id_cita_pago" class="form-label">ID Cita</label>
                                    </div>
                                </div>
                                <div class="flex-fill">
                                    <div class="form-floating"> 
                                        <input type="number" class="form-control" id="monto_pago" placeholder="" step="0.01">
                                        <label for="monto_pago" class="form-label">Monto</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row g-3 mb-2">
                                <!-- Método de Pago -->
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <select class="form-select" id="metodo_pago">
                                            <option value="" selected disabled></option>
                                            <option value="efectivo">Efectivo</option>
                                            <option value="tarjeta">Tarjeta</option>
                                            <option value="transferencia">Transferencia</option>
                                        </select>
                                        <label for="metodo_pago" class="form-label">Método de Pago</label>
                                    </div>
                                </div>

                                <!-- Fecha de Pago -->
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input type="datetime-local" class="form-control" id="fecha_pago" placeholder="">
                                        <label for="fecha_pago" class="form-label">Fecha de Pago</label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-floating mb-3"> 
                                <input type="text" class="form-control" id="referencia_pago" placeholder="">
                                <label for="referencia_pago" class="form-label">Referencia/Número de Transacción</label>
                            </div>

                            <!-- Estatus -->
                            <div class="form-floating mb-3">
                                <select class="form-select" id="estatus_pago_form">
                                    <option value="completado" selected>Completado</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="fallido">Fallido</option>
                                </select>
                                <label for="estatus_pago_form" class="form-label">Estatus</label>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-cancel-primary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarPago()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script src="../js/payments.js"></script>

    <!-- Script para el slide Bar -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../js/slideBar.js"></script>
</body>
</html>