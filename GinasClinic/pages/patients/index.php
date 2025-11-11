<?php
$page_title = 'Control de Pacientes';
$current_page = 'patient';
$base_path = '../../';
$extra_js = 'js/patient.js';

include '../../includes/header.php';
?>

<?php include '../../includes/navbar.php'; ?>

<?php include '../../includes/sidebar.php'; ?>

<!-- Contenido principal de control pacientes -->
<div class="row h-100 m-0">
    <main class="col mb-5 p-3 overflow-auto">
        <h1 class="text-center">
            Control de Pacientes
        </h1> 
        
        <!-- Búsqueda, filtros y registro -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div class="d-flex flex-column flex-md-row gap-2 w-100">
                <!-- Barra de búsqueda -->
                <div class="flex-fill">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Buscar paciente..." id="buscar" oninput="aplicarFiltros()">
                        <button class="btn btn-outline-secondary" type="button" onclick="aplicarFiltros()">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Filtros -->
                <div class="d-flex gap-2">
                    <select class="form-select filtro-categoria" style="min-width: 150px;" id="filtro-categoria" onchange="aplicarFiltros()">
                        <option value="">Estatus</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                    
                    <select class="form-select filtro-categoria" style="min-width: 160px;" id="ordenar" onchange="aplicarFiltros()">
                        <option value="">Ordenar</option>
                        <option value="nombre-asc">Nombre A-Z</option>
                        <option value="nombre-desc">Nombre Z-A</option>
                    </select>
                </div>
            </div>
            
            <!-- Botón agregar paciente -->
            <div class="flex-shrink-0">
                <button class="btn btn-primary btn-lg" onclick="mostrarRegistroPaciente()">
                    <i class="bi bi-person-plus me-2"></i>
                    Agregar
                </button>
            </div>
        </div>

        <!-- Contenedor de pacientes -->
        <div class="card mt-4">
            <div class="card-body">
                <h6 class="card-title">Paciente</h6>
                <div class="table-responsive">
                    <table class="table table-striped table-bordered table-hover">
                        <thead class="table-primary">
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>CURP</th>
                                <th>Fec Nac</th>
                                <th>Sexo</th>
                                <th>Téléfono</th>
                                <th>Correo</th>
                                <th>Fec Reg</th>
                                <th>Estatus</th>
                                <th>Detalles</th>
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

    <!-- Modal de registro o edición de Paciente -->
    <div id="registro_Paciente" class="modal fade" tabindex="-1" aria-labelledby="modal_titulo" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <!-- Cabecera del modal -->
                    <div class="modal-header modal-cabecera-registro">
                        <h5 class="modal-title" id="modal_titulo"></h5>
                        
                        <div id="detalles de edicion" class="hidden">
                            <small id="fecha_Reg"></small>
                            <small id="estatus"></small>
                        </div>
                    </div>

                    <div class="modal-body">
                        <!--Formulario de Registro -->
                        <form id="form_Paciente">
                            <h2>Datos del Paciente</h2>
                            <div class="d-flex align-items-stretch w-100 gap-3 mb-2">
                                <div class="flex-fill">
                                    <div class="form-floating"> 
                                        <input type="text" class="form-control" id="nombre" placeholder="">
                                        <label for="nombre" class="form-label">Nombre</label>
                                    </div>
                                </div>
                                <div class="flex-fill">
                                    <div class="form-floating"> 
                                        <input type="text" class="form-control" id="curp" placeholder="">
                                        <label for="curp" class="form-label">Curp</label>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-3 mb-2">
                                <!-- Fecha de Nacimiento -->
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input type="date" class="form-control" id="fecha_Nac" placeholder="">
                                        <label for="fecha_Nac" class="form-label">Fecha Nacimiento</label>
                                    </div>
                                </div>

                                <!-- Sexo -->
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <select class="form-select" id="sexo">
                                            <option value="" selected disabled></option>
                                            <option value="hombre">Hombre</option>
                                            <option value="mujer">Mujer</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                        <label for="sexo" class="form-label">Sexo</label>
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex align-items-stretch w-100 gap-3 mb-2">
                                <div class="flex-fill">
                                    <div class="form-floating"> 
                                        <input type="text" class="form-control" id="telefono" placeholder="">
                                        <label for="telefono" class="form-label">Telefono</label>
                                    </div>
                                </div>
                                <div class="flex-fill">
                                    <div class="form-floating"> 
                                        <input type="text" class="form-control" id="correo" placeholder="">
                                        <label for="correo" class="form-label">Correo</label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-floating mb-3"> 
                                <input type="text" class="form-control" id="direccion" placeholder="">
                                <label for="direccion" class="form-label">Direccion</label>
                            </div>

                            <h2>Datos del Contacto de Emergencia</h2>
                            <div class="d-flex align-items-stretch w-100 gap-3 mb-3">
                                <div class="flex-fill">
                                    <div class="form-floating"> 
                                        <input type="text" class="form-control" id="cont_emergencia" placeholder="">
                                        <label for="cont_emergencia" class="form-label">Contacto Emergencia</label>
                                    </div>
                                </div>
                                <div class="flex-fill">
                                    <div class="form-floating"> 
                                        <input type="text" class="form-control" id="tel_emergencia" placeholder="">
                                        <label for="tel_emergencia" class="form-label">Téléfono Emergencia</label>
                                    </div>
                                </div>
                            </div>

                            <h2>Datos Medicos importantes</h2>
                            <!-- Alergias select -->
                            <div class="form-floating mb-2">
                                <select class="form-select" id="alergias" onchange="validarAlergias()">
                                    <option value="" selected disabled></option>
                                    <option value="ninguna">Ninguna</option>
                                    <option value="alguna">Alguna</option>
                                </select>
                                <label for="alergias" class="form-label">Alergias con la que cuenta</label>
                            </div>

                            <!-- Alergias CheckBox -->
                            <div class="d-none">
                                <!-- Alergias generadas dinámicamente -->
                            </div>
                            <!-- Fin alergias CheckBox -->
                           
                            <div class="form-floating mb-3"> 
                                <input type="text" class="form-control" id="antecedente" placeholder="">
                                <label for="antecedente" class="form-label">Antecedentes Medicos</label>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-cancel-primary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary">Guardar</button>
                    </div>

                </div>
            </div>
    </div>

</div>

<?php include '../../includes/footer.php'; ?>