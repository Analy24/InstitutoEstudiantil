-- =============================================================================
-- INSTITUTO ESTUDIANTIL - SCRIPT DDL PARA MYSQL 8.X / MARIADB
-- Proyecto Formativo de Articulación con la Educación Media Técnica (Grados 10 y 11)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS articulapp_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE articulapp_db;

-- Desactivar temporalmente revisión de llaves foráneas para recreación segura
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS reportes;
DROP TABLE IF EXISTS postulaciones;
DROP TABLE IF EXISTS vacantes;
DROP TABLE IF EXISTS empresas;
DROP TABLE IF EXISTS estudiante_competencias;
DROP TABLE IF EXISTS competencias;
DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS instructor_colegios;
DROP TABLE IF EXISTS instructores;
DROP TABLE IF EXISTS colegios;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. TABLA: usuarios
-- -----------------------------------------------------------------------------
CREATE TABLE usuarios (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'INSTRUCTOR', 'ESTUDIANTE', 'EMPRESA', 'COORDINADOR') NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_acceso DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuarios_rol (rol),
    INDEX idx_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. TABLA: colegios (Instituciones Educativas de Media Técnica)
-- -----------------------------------------------------------------------------
CREATE TABLE colegios (
    id VARCHAR(36) PRIMARY KEY,
    codigo_dane VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    direccion VARCHAR(255) NULL,
    municipio VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    telefono VARCHAR(50) NULL,
    rector_nombre VARCHAR(150) NULL,
    coordinador_media VARCHAR(150) NULL,
    email_institucional VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_colegios_municipio (municipio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. TABLA: instructores (Docentes e Instructores Técnicos)
-- -----------------------------------------------------------------------------
CREATE TABLE instructores (
    id VARCHAR(36) PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL UNIQUE,
    tipo_documento VARCHAR(10) NOT NULL DEFAULT 'CC',
    numero_documento VARCHAR(30) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(50) NULL,
    centro_formacion VARCHAR(150) NOT NULL,
    especialidad VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_instructores_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_instructores_documento (numero_documento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. TABLA: instructor_colegios (Asignación de Ficha e Instructor a Colegio)
-- -----------------------------------------------------------------------------
CREATE TABLE instructor_colegios (
    id VARCHAR(36) PRIMARY KEY,
    instructor_id VARCHAR(36) NOT NULL,
    colegio_id VARCHAR(36) NOT NULL,
    ficha_caracterizacion VARCHAR(30) NOT NULL,
    ano_lectivo INT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ic_instructor
        FOREIGN KEY (instructor_id) REFERENCES instructores(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ic_colegio
        FOREIGN KEY (colegio_id) REFERENCES colegios(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_ic_ficha (ficha_caracterizacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. TABLA: estudiantes (Aprendices de Media Técnica: Grados 10° y 11°)
-- -----------------------------------------------------------------------------
CREATE TABLE estudiantes (
    id VARCHAR(36) PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL UNIQUE,
    colegio_id VARCHAR(36) NOT NULL,
    tipo_documento VARCHAR(10) NOT NULL DEFAULT 'TI',
    numero_documento VARCHAR(30) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    grado INT NOT NULL,
    ficha_sena VARCHAR(30) NOT NULL,
    programa_formacion VARCHAR(150) NOT NULL,
    jornada VARCHAR(50) DEFAULT 'Mañana',
    telefono VARCHAR(50) NULL,
    resumen_perfil TEXT NULL,
    hoja_vida_url VARCHAR(255) NULL,
    foto_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_estudiantes_grado CHECK (grado IN (10, 11)),
    CONSTRAINT fk_estudiantes_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_estudiantes_colegio
        FOREIGN KEY (colegio_id) REFERENCES colegios(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_estudiantes_ficha (ficha_sena),
    INDEX idx_estudiantes_grado (grado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. TABLA: competencias (Catálogo Curricular)
-- -----------------------------------------------------------------------------
CREATE TABLE competencias (
    id VARCHAR(36) PRIMARY KEY,
    codigo_norma VARCHAR(50) NOT NULL UNIQUE,
    denominacion VARCHAR(255) NOT NULL,
    programa_formacion VARCHAR(150) NOT NULL,
    fase_proyecto ENUM('Analisis', 'Planeacion', 'Ejecucion', 'Evaluacion') NOT NULL,
    horas_duracion INT NOT NULL DEFAULT 40,
    descripcion TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_competencias_codigo (codigo_norma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. TABLA: estudiante_competencias (Juicios Evaluativos y Seguimiento de RAPs)
-- -----------------------------------------------------------------------------
CREATE TABLE estudiante_competencias (
    id VARCHAR(36) PRIMARY KEY,
    estudiante_id VARCHAR(36) NOT NULL,
    competencia_id VARCHAR(36) NOT NULL,
    instructor_id VARCHAR(36) NULL,
    juicio_evaluativo ENUM('POR_EVALUAR', 'EN_PROCESO', 'APROBADO', 'NO_APROBADO') NOT NULL DEFAULT 'POR_EVALUAR',
    fecha_evaluacion DATE NULL,
    observaciones TEXT NULL,
    evidencias_url VARCHAR(255) NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_estudiante_competencia (estudiante_id, competencia_id),
    CONSTRAINT fk_ec_estudiante
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ec_competencia
        FOREIGN KEY (competencia_id) REFERENCES competencias(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ec_instructor
        FOREIGN KEY (instructor_id) REFERENCES instructores(id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_ec_juicio (juicio_evaluativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. TABLA: empresas (Sector Productivo Aliado)
-- -----------------------------------------------------------------------------
CREATE TABLE empresas (
    id VARCHAR(36) PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL UNIQUE,
    nit VARCHAR(30) NOT NULL UNIQUE,
    razon_social VARCHAR(200) NOT NULL,
    sector_economico VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NULL,
    ciudad VARCHAR(100) NOT NULL,
    contacto_nombre VARCHAR(150) NOT NULL,
    contacto_cargo VARCHAR(100) NULL,
    contacto_telefono VARCHAR(50) NULL,
    sitio_web VARCHAR(255) NULL,
    verificada BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empresas_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_empresas_nit (nit)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. TABLA: vacantes (Ofertas de Práctica / Patrocinio)
-- -----------------------------------------------------------------------------
CREATE TABLE vacantes (
    id VARCHAR(36) PRIMARY KEY,
    empresa_id VARCHAR(36) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    requisitos TEXT NULL,
    modalidad ENUM('PRESENCIAL', 'REMOTO', 'HIBRIDO') NOT NULL DEFAULT 'PRESENCIAL',
    ubicacion VARCHAR(150) NOT NULL,
    cupos_disponibles INT NOT NULL DEFAULT 1,
    auxilio_sostenimiento DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    fecha_limite DATE NOT NULL,
    estado ENUM('ABIERTA', 'EN_SELECCION', 'CERRADA') NOT NULL DEFAULT 'ABIERTA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vacantes_empresa
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_vacantes_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. TABLA: postulaciones (Candidaturas de Aprendices a Vacantes)
-- -----------------------------------------------------------------------------
CREATE TABLE postulaciones (
    id VARCHAR(36) PRIMARY KEY,
    vacante_id VARCHAR(36) NOT NULL,
    estudiante_id VARCHAR(36) NOT NULL,
    fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('POSTULADO', 'PRESELECCIONADO', 'SELECCIONADO', 'RECHAZADO') NOT NULL DEFAULT 'POSTULADO',
    retroalimentacion TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_vacante_estudiante (vacante_id, estudiante_id),
    CONSTRAINT fk_postulaciones_vacante
        FOREIGN KEY (vacante_id) REFERENCES vacantes(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_postulaciones_estudiante
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_postulaciones_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. TABLA: reportes (Generación de Informes y Estadísticas)
-- -----------------------------------------------------------------------------
CREATE TABLE reportes (
    id VARCHAR(36) PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL,
    tipo_reporte VARCHAR(100) NOT NULL,
    parametros_filtro JSON NULL,
    archivo_url VARCHAR(255) NULL,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reportes_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
