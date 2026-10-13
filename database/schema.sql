-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS instituto_estudiantil DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE instituto_estudiantil;

-- 1. USUARIO
CREATE TABLE USUARIO (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'INSTRUCTOR', 'ESTUDIANTE', 'EMPRESA', 'COORDINADOR') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. COLEGIO
CREATE TABLE COLEGIO (
    id CHAR(36) PRIMARY KEY,
    codigo_dane VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    municipio VARCHAR(100),
    departamento VARCHAR(100),
    telefono VARCHAR(50),
    rector_nombre VARCHAR(255),
    coordinador_media VARCHAR(255),
    email_institucional VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. COMPETENCIA
CREATE TABLE COMPETENCIA (
    id CHAR(36) PRIMARY KEY,
    codigo_norma VARCHAR(50) NOT NULL UNIQUE,
    denominacion VARCHAR(255) NOT NULL,
    programa_formacion VARCHAR(255) NOT NULL,
    fase_proyecto ENUM('Analisis', 'Planeacion', 'Ejecucion', 'Evaluacion') NOT NULL,
    horas_duracion INT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. INSTRUCTOR
CREATE TABLE INSTRUCTOR (
    id CHAR(36) PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL UNIQUE,
    tipo_documento VARCHAR(20) NOT NULL,
    numero_documento VARCHAR(50) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(50),
    centro_formacion VARCHAR(255) NOT NULL,
    especialidad VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(id) ON DELETE CASCADE
);

-- 5. EMPRESA
CREATE TABLE EMPRESA (
    id CHAR(36) PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL UNIQUE,
    nit VARCHAR(50) NOT NULL UNIQUE,
    razon_social VARCHAR(255) NOT NULL,
    sector_economico VARCHAR(100),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    contacto_nombre VARCHAR(255),
    contacto_cargo VARCHAR(100),
    contacto_telefono VARCHAR(50),
    sitio_web VARCHAR(255),
    verificada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(id) ON DELETE CASCADE
);

-- 6. ESTUDIANTE
CREATE TABLE ESTUDIANTE (
    id CHAR(36) PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL UNIQUE,
    colegio_id CHAR(36) NOT NULL,
    tipo_documento VARCHAR(20) NOT NULL,
    numero_documento VARCHAR(50) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    grado ENUM('10', '11') NOT NULL,
    ficha_sena VARCHAR(50),
    programa_formacion VARCHAR(255),
    jornada VARCHAR(50),
    resumen_perfil TEXT,
    hoja_vida_url VARCHAR(255),
    foto_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(id) ON DELETE CASCADE,
    FOREIGN KEY (colegio_id) REFERENCES COLEGIO(id) ON DELETE RESTRICT
);

-- 7. INSTRUCTOR_COLEGIO
CREATE TABLE INSTRUCTOR_COLEGIO (
    id CHAR(36) PRIMARY KEY,
    instructor_id CHAR(36) NOT NULL,
    colegio_id CHAR(36) NOT NULL,
    ficha_caracterizacion VARCHAR(50) NOT NULL,
    ano_lectivo VARCHAR(10) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (instructor_id) REFERENCES INSTRUCTOR(id) ON DELETE CASCADE,
    FOREIGN KEY (colegio_id) REFERENCES COLEGIO(id) ON DELETE CASCADE
);

-- 8. ESTUDIANTE_COMPETENCIA
CREATE TABLE ESTUDIANTE_COMPETENCIA (
    id CHAR(36) PRIMARY KEY,
    estudiante_id CHAR(36) NOT NULL,
    competencia_id CHAR(36) NOT NULL,
    instructor_id CHAR(36) NOT NULL,
    juicio_evaluativo ENUM('POR_EVALUAR', 'EN_PROCESO', 'APROBADO', 'NO_APROBADO') DEFAULT 'POR_EVALUAR',
    fecha_evaluacion DATE,
    observaciones TEXT,
    evidencias_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES ESTUDIANTE(id) ON DELETE CASCADE,
    FOREIGN KEY (competencia_id) REFERENCES COMPETENCIA(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES INSTRUCTOR(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_evaluacion (estudiante_id, competencia_id)
);

-- 9. VACANTE
CREATE TABLE VACANTE (
    id CHAR(36) PRIMARY KEY,
    empresa_id CHAR(36) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    requisitos TEXT,
    modalidad ENUM('PRESENCIAL', 'REMOTO', 'HIBRIDO') NOT NULL,
    ubicacion VARCHAR(255),
    cupos_disponibles INT NOT NULL DEFAULT 1,
    auxilio_sostenimiento DECIMAL(10,2),
    fecha_limite DATE,
    estado ENUM('ABIERTA', 'EN_SELECCION', 'CERRADA') DEFAULT 'ABIERTA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES EMPRESA(id) ON DELETE CASCADE
);

-- 10. POSTULACION
CREATE TABLE POSTULACION (
    id CHAR(36) PRIMARY KEY,
    vacante_id CHAR(36) NOT NULL,
    estudiante_id CHAR(36) NOT NULL,
    fecha_postulacion DATE NOT NULL,
    estado ENUM('POSTULADO', 'PRESELECCIONADO', 'SELECCIONADO', 'RECHAZADO') DEFAULT 'POSTULADO',
    retroalimentacion TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vacante_id) REFERENCES VACANTE(id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante_id) REFERENCES ESTUDIANTE(id) ON DELETE CASCADE,
    UNIQUE KEY unique_postulacion (vacante_id, estudiante_id)
);

-- 11. REPORTE
CREATE TABLE REPORTE (
    id CHAR(36) PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    tipo_reporte ENUM('COMPETENCIAS_COLEGIO', 'CONSOLIDADO_FICHA', 'ESTADISTICAS_EMPLEABILIDAD') NOT NULL,
    parametros_filtro JSON,
    archivo_url VARCHAR(255),
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(id) ON DELETE CASCADE
);
