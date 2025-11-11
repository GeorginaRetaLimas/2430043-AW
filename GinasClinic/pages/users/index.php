<?php
$page_title = 'Control de Usuarios';
$current_page = 'usser';
$base_path = '../../';
$extra_js = 'js/usser.js';

include '../../includes/header.php';
?>

<?php include '../../includes/navbar.php'; ?>

<?php include '../../includes/sidebar.php'; ?>

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
                    <select class="form-select filtro-categoria" style="min-width: 150px;" id="filtro-rol" onchange="aplicarFiltros()">
                        <option value="">Rol</option>
                        <option value="activo">Secretario</option>
                        <option value="inactivo">Medico</option>
                    </select>

                    <select class="form-select filtro-categoria" style="min-width: 150px;" id="filtro-categoria" onchange="aplicarFiltros()">
                        <option value="">Estatus</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                    
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
                                <th>Sexo</th>
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
                        <small id="fecha_Reg_usuario"></small>
                        <small id="estatus_usuario"></small>
                    </div>
                </div>

                <div class="modal-body">
                    <!-- Formulario de Registro -->
                    <form id="form_Usuario" action="../php/usser.php" method="post">
                        <h2>Datos del Usuario</h2>
                        <div class="d-flex align-items-stretch w-100 gap-3 mb-2">
                            <div class="flex-fill">
                                <div class="form-floating"> 
                                    <input type="text" class="form-control" id="nombre_usuario" placeholder="">
                                    <label for="nombre_usuario" class="form-label">Nombre Completo</label>
                                </div>
                            </div>
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

                            <!-- Sexo -->
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <select class="form-select" id="sexo_usuario">
                                        <option value="" selected disabled></option>
                                        <option value="hombre">Hombre</option>
                                        <option value="mujer">Mujer</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                    <label for="sexo_usuario" class="form-label">Sexo</label>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex align-items-stretch w-100 gap-3 mb-2">
                            <div class="flex-fill">
                                <div class="form-floating"> 
                                    <input type="text" class="form-control" id="telefono_usuario" placeholder="">
                                    <label for="telefono_usuario" class="form-label">Teléfono</label>
                                </div>
                            </div>
                            <div class="flex-fill">
                                <div class="form-floating"> 
                                    <input type="email" class="form-control" id="correo_usuario" placeholder="">
                                    <label for="correo_usuario" class="form-label">Correo</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-floating mb-3"> 
                            <input type="text" class="form-control" id="direccion_usuario" placeholder="">
                            <label for="direccion_usuario" class="form-label">Dirección</label>
                        </div>
                        
                        <!-- Campo para ID Médico -->
                        <div class="form-floating mb-3 d-none" id="id_medico_container">
                            <input type="text" class="form-control" id="id_medico" placeholder="">
                            <label for="id_medico" class="form-label">ID Médico</label>
                        </div>

                        <!-- Estatus -->
                        <div class="form-floating mb-3">
                            <select class="form-select" id="estatus_usuario_form">
                                <option value="activo" selected>Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                            <label for="estatus_usuario_form" class="form-label">Estatus</label>
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

<?php include '../../includes/footer.php'; ?>