<?php
$page_title = 'Dashboard - GinasClinic';
$current_page = 'dashboard';
$extra_css = 'assets/css/dashboard.css';
$extra_js = 'js/dashboard.js';

include 'includes/header.php';
?>

<?php include 'includes/navbar.php'; ?>

<?php include 'includes/sidebar.php'; ?>

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
                    <img class="d-block w-100" src="assets/carousel/imagen1.png" alt="First slide">
                </div>
                <div class="carousel-item">
                    <img class="d-block w-100" src="assets/carousel/imagen2.png" alt="Second slide">
                </div>
                <div class="carousel-item">
                    <img class="d-block w-100" src="assets/carousel/imagen3.png" alt="Third slide">
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

<?php include 'includes/footer.php'; ?>