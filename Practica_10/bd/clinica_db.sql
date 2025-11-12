-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-11-2025 a las 06:53:57
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `clinica_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bitacora_acceso`
--

CREATE TABLE `bitacora_acceso` (
  `IdBitacora` int(11) NOT NULL,
  `IdUsuario` int(11) NOT NULL,
  `FechaAcceso` datetime DEFAULT current_timestamp(),
  `AccionRealizada` varchar(250) NOT NULL,
  `Modulo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `IdCita` int(11) NOT NULL,
  `IdPaciente` int(11) NOT NULL,
  `IdMedico` int(11) NOT NULL,
  `FechaCita` datetime NOT NULL,
  `MotivoConsulta` varchar(250) DEFAULT NULL,
  `EstadoCita` varchar(20) DEFAULT 'Programada',
  `Observaciones` varchar(250) DEFAULT NULL,
  `FechaRegistro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `IdEspecialidad` int(11) NOT NULL,
  `NombreEspecialidad` varchar(100) NOT NULL,
  `Descripcion` varchar(250) DEFAULT NULL,
  `Estatus` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`IdEspecialidad`, `NombreEspecialidad`, `Descripcion`, `Estatus`) VALUES
(1, 'Dentista', 'Atiende los dientes', 1),
(2, 'Psicologia', 'Cuida la mente', 1),
(3, 'Uno', 'wawaa', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `expedientes_clinicos`
--

CREATE TABLE `expedientes_clinicos` (
  `IdExpediente` int(11) NOT NULL,
  `IdPaciente` int(11) NOT NULL,
  `IdMedico` int(11) NOT NULL,
  `IdCita` int(11) DEFAULT NULL,
  `FechaConsulta` datetime NOT NULL,
  `Sintomas` text DEFAULT NULL,
  `Diagnostico` text DEFAULT NULL,
  `Tratamiento` text DEFAULT NULL,
  `RecetaMedica` text DEFAULT NULL,
  `NotasAdicionales` text DEFAULT NULL,
  `ProximaCita` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `IdMedico` int(11) NOT NULL,
  `NombreCompleto` varchar(150) NOT NULL,
  `CedulaProfesional` varchar(50) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `CorreoElectronico` varchar(100) DEFAULT NULL,
  `HorarioAtencion` varchar(100) DEFAULT NULL,
  `FechaIngreso` datetime DEFAULT current_timestamp(),
  `Estatus` bit(1) DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_especialidades`
--

CREATE TABLE `medico_especialidades` (
  `IdMedico` int(11) NOT NULL,
  `IdEspecialidad` int(11) NOT NULL,
  `EsPrincipal` bit(1) DEFAULT b'0',
  `FechaCertificacion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `IdPaciente` int(11) NOT NULL,
  `NombreCompleto` varchar(150) NOT NULL,
  `CURP` varchar(18) DEFAULT NULL,
  `FechaNacimiento` date DEFAULT NULL,
  `Sexo` char(1) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `CorreoElectronico` varchar(100) DEFAULT NULL,
  `Direccion` varchar(250) DEFAULT NULL,
  `ContactoEmergencia` varchar(150) DEFAULT NULL,
  `TelefonoEmergencia` varchar(20) DEFAULT NULL,
  `Alergias` varchar(250) DEFAULT NULL,
  `AntecedentesMedicos` text DEFAULT NULL,
  `FechaRegistro` datetime DEFAULT current_timestamp(),
  `Estatus` bit(1) DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`IdPaciente`, `NombreCompleto`, `CURP`, `FechaNacimiento`, `Sexo`, `Telefono`, `CorreoElectronico`, `Direccion`, `ContactoEmergencia`, `TelefonoEmergencia`, `Alergias`, `AntecedentesMedicos`, `FechaRegistro`, `Estatus`) VALUES
(4, 'Jared de Jesús Olazarán Lopez', 'JDJOL2430055004', '2006-10-10', 'h', '8341234545', 'jared@gmail.com', 'Su casita', 'Georgina Reta Limas', '8341585398', 'Una, dos, tres', 'ninguno', '2025-11-11 05:00:22', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `IdPago` int(11) NOT NULL,
  `IdCita` int(11) NOT NULL,
  `Monto` decimal(10,2) NOT NULL,
  `MetodoPago` varchar(50) DEFAULT NULL,
  `FechaPago` datetime DEFAULT current_timestamp(),
  `Referencia` varchar(100) DEFAULT NULL,
  `EstatusPago` varchar(20) DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes`
--

CREATE TABLE `reportes` (
  `IdReporte` int(11) NOT NULL,
  `TipoReporte` varchar(50) NOT NULL,
  `IdPaciente` int(11) DEFAULT NULL,
  `IdMedico` int(11) DEFAULT NULL,
  `FechaInicio` date DEFAULT NULL,
  `FechaFin` date DEFAULT NULL,
  `FechaGeneracion` datetime DEFAULT current_timestamp(),
  `RutaArchivo` varchar(250) DEFAULT NULL,
  `Descripcion` varchar(250) DEFAULT NULL,
  `GeneradoPor` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarifas`
--

CREATE TABLE `tarifas` (
  `IdTarifa` int(11) NOT NULL,
  `DescripcionServicio` varchar(150) NOT NULL,
  `CostoBase` decimal(10,2) NOT NULL,
  `IdEspecialidad` int(11) DEFAULT NULL,
  `Estatus` bit(1) DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `IdUsuario` int(11) NOT NULL,
  `Usuario` varchar(50) NOT NULL,
  `ContraseñaHash` varchar(200) NOT NULL,
  `Rol` varchar(50) NOT NULL DEFAULT 'Secretario',
  `IdMedico` int(11) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT 1,
  `UltimoAcceso` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`IdUsuario`, `Usuario`, `ContraseñaHash`, `Rol`, `IdMedico`, `Activo`, `UltimoAcceso`) VALUES
(1, 'Gina', '$2y$10$sge4pHAHw28.LU4bYQufKOJV5vPiepgOWWR4tzrgXjFavMCdKKGxa', 'secretario', NULL, 1, '2025-11-12 01:28:23'),
(3, 'Jazmin', '$2y$10$ma2GHMnnCS0QcFag.5Mz2O9NSkLFK9D7o3W8wn3T90J2Bkk1usDWu', 'Secretario', NULL, 1, '2025-11-10 22:36:53'),
(5, 'Admin', '$2y$10$kcoqaBddUEihWjUoyEjkWOgjm.iDsm303SG10M8yAzCSMYlbva31u', 'secretario', NULL, 1, '2025-11-10 22:58:21'),
(6, 'Lucas', '$2y$10$ZmcdmNDmH2mmXz.zvzOxkuuyfroeZDnLnzvUQOUYI1C67My37vOlO', 'medico', NULL, 1, '2025-11-11 04:26:57'),
(7, 'Prueba', '$2y$10$j7Yic4jH8waK5MYolQQwMuW7.g45eiBsbKHCa68fwMHQXG.qgR0IS', 'medico', NULL, 1, '2025-11-11 04:32:05'),
(8, 'Prueba2', '$2y$10$GXiTdnlD45tBRvDs/rakXuUAO10PLnbqwx9dP2.zWN5r/NUYDpSzi', 'medico', NULL, 1, '2025-11-11 04:37:19'),
(9, 'Prueba3', '$2y$10$e4.OajEzS7MuqE4FGDb4Tu15QIKmMrq9V7w6bQBSntOESpPd1yH2O', 'secretario', NULL, 1, '2025-11-11 04:40:54'),
(10, 'Prueba4', '$2y$10$lFdLOjxZf8zDS27sRmaW5eJm5tv9NSIBHZIobNIMAF4Ea3LrtaVT.', 'secretario', NULL, 1, '2025-11-11 04:45:59'),
(11, 'Prueba 5', '$2y$10$22Ve3rio4bFcb6G7ns2uuO5v2L4yQt/GRkE4/zBFSUpGULlDbNgjW', 'medico', NULL, 0, '2025-11-11 04:52:32'),
(13, 'Prueba 6', '$2y$10$xkSdSol9YCmK5IpU.VEGuOk045dd4QgnS165DsRsTZFOktmpNuzyi', 'secretario', NULL, 1, '2025-11-11 05:12:01');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bitacora_acceso`
--
ALTER TABLE `bitacora_acceso`
  ADD PRIMARY KEY (`IdBitacora`),
  ADD KEY `IdUsuario` (`IdUsuario`);

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`IdCita`),
  ADD KEY `idx_citas_fecha` (`FechaCita`),
  ADD KEY `idx_citas_paciente` (`IdPaciente`),
  ADD KEY `idx_citas_medico` (`IdMedico`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`IdEspecialidad`);

--
-- Indices de la tabla `expedientes_clinicos`
--
ALTER TABLE `expedientes_clinicos`
  ADD PRIMARY KEY (`IdExpediente`),
  ADD KEY `IdMedico` (`IdMedico`),
  ADD KEY `IdCita` (`IdCita`),
  ADD KEY `idx_expedientes_paciente` (`IdPaciente`),
  ADD KEY `idx_expedientes_fecha` (`FechaConsulta`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`IdMedico`);

--
-- Indices de la tabla `medico_especialidades`
--
ALTER TABLE `medico_especialidades`
  ADD PRIMARY KEY (`IdMedico`,`IdEspecialidad`),
  ADD KEY `IdEspecialidad` (`IdEspecialidad`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`IdPaciente`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`IdPago`),
  ADD KEY `idx_pagos_cita` (`IdCita`),
  ADD KEY `idx_pagos_fecha` (`FechaPago`);

--
-- Indices de la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`IdReporte`),
  ADD KEY `IdPaciente` (`IdPaciente`),
  ADD KEY `IdMedico` (`IdMedico`);

--
-- Indices de la tabla `tarifas`
--
ALTER TABLE `tarifas`
  ADD PRIMARY KEY (`IdTarifa`),
  ADD KEY `IdEspecialidad` (`IdEspecialidad`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`IdUsuario`),
  ADD UNIQUE KEY `Usuario` (`Usuario`),
  ADD KEY `IdMedico` (`IdMedico`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bitacora_acceso`
--
ALTER TABLE `bitacora_acceso`
  MODIFY `IdBitacora` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `IdCita` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `IdEspecialidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `expedientes_clinicos`
--
ALTER TABLE `expedientes_clinicos`
  MODIFY `IdExpediente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `IdMedico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `IdPaciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `IdPago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `IdReporte` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tarifas`
--
ALTER TABLE `tarifas`
  MODIFY `IdTarifa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `IdUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bitacora_acceso`
--
ALTER TABLE `bitacora_acceso`
  ADD CONSTRAINT `bitacora_acceso_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`IdUsuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`IdPaciente`) REFERENCES `pacientes` (`IdPaciente`) ON DELETE CASCADE,
  ADD CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`IdMedico`) REFERENCES `medicos` (`IdMedico`) ON DELETE CASCADE;

--
-- Filtros para la tabla `expedientes_clinicos`
--
ALTER TABLE `expedientes_clinicos`
  ADD CONSTRAINT `expedientes_clinicos_ibfk_1` FOREIGN KEY (`IdPaciente`) REFERENCES `pacientes` (`IdPaciente`) ON DELETE CASCADE,
  ADD CONSTRAINT `expedientes_clinicos_ibfk_2` FOREIGN KEY (`IdMedico`) REFERENCES `medicos` (`IdMedico`) ON DELETE CASCADE,
  ADD CONSTRAINT `expedientes_clinicos_ibfk_3` FOREIGN KEY (`IdCita`) REFERENCES `citas` (`IdCita`) ON DELETE SET NULL;

--
-- Filtros para la tabla `medico_especialidades`
--
ALTER TABLE `medico_especialidades`
  ADD CONSTRAINT `medico_especialidades_ibfk_1` FOREIGN KEY (`IdMedico`) REFERENCES `medicos` (`IdMedico`) ON DELETE CASCADE,
  ADD CONSTRAINT `medico_especialidades_ibfk_2` FOREIGN KEY (`IdEspecialidad`) REFERENCES `especialidades` (`IdEspecialidad`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`IdCita`) REFERENCES `citas` (`IdCita`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`IdPaciente`) REFERENCES `pacientes` (`IdPaciente`) ON DELETE SET NULL,
  ADD CONSTRAINT `reportes_ibfk_2` FOREIGN KEY (`IdMedico`) REFERENCES `medicos` (`IdMedico`) ON DELETE SET NULL;

--
-- Filtros para la tabla `tarifas`
--
ALTER TABLE `tarifas`
  ADD CONSTRAINT `tarifas_ibfk_1` FOREIGN KEY (`IdEspecialidad`) REFERENCES `especialidades` (`IdEspecialidad`) ON DELETE SET NULL;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`IdMedico`) REFERENCES `medicos` (`IdMedico`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
