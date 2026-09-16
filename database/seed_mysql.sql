-- =============================================================================
-- INSTITUTO ESTUDIANTIL - DATOS DE PRUEBA (SEEDS) PARA MYSQL
-- Contraseña unificada para todos los usuarios de prueba: Password123!
-- Hash bcrypt (salt 10): $2b$10$wTf7JzM6k2fM5b9aJ3B.b.f8lTfVp9R9Iom0YQ7F3l3r8L5nB.uXq
-- =============================================================================

USE articulapp_db;

-- Desactivar llaves foráneas para inserción limpia
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM postulaciones;
DELETE FROM vacantes;
DELETE FROM empresas;
DELETE FROM estudiante_competencias;
DELETE FROM competencias;
DELETE FROM estudiantes;
DELETE FROM instructor_colegios;
DELETE FROM instructores;
DELETE FROM colegios;
DELETE FROM usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. USUARIOS DEL SISTEMA
-- -----------------------------------------------------------------------------
INSERT INTO usuarios (id, email, password_hash, rol, activo, ultimo_acceso) VALUES
('usr-admin-01', 'admin@institutoestudiantil.edu.co', '$2b$10$wTf7JzM6k2fM5b9aJ3B.b.f8lTfVp9R9Iom0YQ7F3l3r8L5nB.uXq', 'ADMIN', 1, NOW()),
('usr-inst-01', 'instructor.perez@instituto.edu.co', '$2b$10$wTf7JzM6k2fM5b9aJ3B.b.f8lTfVp9R9Iom0YQ7F3l3r8L5nB.uXq', 'INSTRUCTOR', 1, NOW()),
('usr-est-01', 'juan.rodriguez@colegio.edu.co', '$2b$10$wTf7JzM6k2fM5b9aJ3B.b.f8lTfVp9R9Iom0YQ7F3l3r8L5nB.uXq', 'ESTUDIANTE', 1, NOW()),
('usr-est-02', 'maria.gomez@colegio.edu.co', '$2b$10$wTf7JzM6k2fM5b9aJ3B.b.f8lTfVp9R9Iom0YQ7F3l3r8L5nB.uXq', 'ESTUDIANTE', 1, NOW()),
('usr-emp-01', 'talento@innovatech.com', '$2b$10$wTf7JzM6k2fM5b9aJ3B.b.f8lTfVp9R9Iom0YQ7F3l3r8L5nB.uXq', 'EMPRESA', 1, NOW());

-- -----------------------------------------------------------------------------
-- 2. COLEGIOS ARTICULADOS
-- -----------------------------------------------------------------------------
INSERT INTO colegios (id, codigo_dane, nombre, direccion, municipio, departamento, telefono, rector_nombre, coordinador_media, email_institucional) VALUES
('col-01', '111001012345', 'Institución Educativa Técnico San José', 'Calle 45 # 13-22', 'Bogotá D.C.', 'Cundinamarca', '(601) 3456789', 'Lic. Gerardo Mendoza', 'Prof. Martha Cubillos', 'contacto@sanjose.edu.co'),
('col-02', '111001089012', 'Colegio Industrial Piloto del Sur', 'Carrera 24 # 56-10 Sur', 'Soacha', 'Cundinamarca', '(601) 7891234', 'Dra. Elena Villamil', 'Lic. Óscar Téllez', 'rectoria@industrialpiloto.edu.co');

-- -----------------------------------------------------------------------------
-- 3. INSTRUCTORES
-- -----------------------------------------------------------------------------
INSERT INTO instructores (id, usuario_id, tipo_documento, numero_documento, nombres, apellidos, telefono, centro_formacion, especialidad) VALUES
('inst-01', 'usr-inst-01', 'CC', '80123456', 'Carlos Alberto', 'Pérez Moreno', '3157894561', 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)', 'Análisis y Desarrollo de Software / Redes');

-- -----------------------------------------------------------------------------
-- 4. ASIGNACIÓN INSTRUCTOR A COLEGIO Y FICHA
-- -----------------------------------------------------------------------------
INSERT INTO instructor_colegios (id, instructor_id, colegio_id, ficha_caracterizacion, ano_lectivo, activo) VALUES
('ic-01', 'inst-01', 'col-01', '2712345', 2026, 1),
('ic-02', 'inst-01', 'col-01', '2812345', 2026, 1);

-- -----------------------------------------------------------------------------
-- 5. APRENDICES (ESTUDIANTES DE MEDIA TÉCNICA)
-- -----------------------------------------------------------------------------
INSERT INTO estudiantes (id, usuario_id, colegio_id, tipo_documento, numero_documento, nombres, apellidos, grado, ficha_sena, programa_formacion, jornada, telefono, resumen_perfil, hoja_vida_url, foto_url) VALUES
('est-01', 'usr-est-01', 'col-01', 'TI', '1023456789', 'Juan Camilo', 'Rodríguez Pérez', 11, '2712345', 'Técnico en Programación de Software', 'Mañana', '3109876543', 'Estudiante de grado 11° con alta vocación por el desarrollo web Frontend y bases de datos relacionales. Apasionado por React, Node.js y trabajo colaborativo.', 'https://institutoestudiantil.edu.co/uploads/hv_juan_rodriguez.pdf', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('est-02', 'usr-est-02', 'col-01', 'TI', '1034567890', 'María Paula', 'Gómez Herrera', 10, '2812345', 'Técnico en Programación de Software', 'Tarde', '3123456789', 'Estudiante de grado 10° cursando primer año de articulación técnica. Énfasis en algoritmia, diagramación lógica y maquetación web accesible.', 'https://institutoestudiantil.edu.co/uploads/hv_maria_gomez.pdf', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150');

-- -----------------------------------------------------------------------------
-- 6. COMPETENCIAS TÉCNICAS (CURRÍCULO)
-- -----------------------------------------------------------------------------
INSERT INTO competencias (id, codigo_norma, denominacion, programa_formacion, fase_proyecto, horas_duracion, descripcion) VALUES
('comp-01', '220501092', 'Especificar los requisitos necesarios para desarrollar la solución de software', 'Técnico en Programación de Software', 'Analisis', 48, 'Levantamiento de historias de usuario, requerimientos funcionales y no funcionales.'),
('comp-02', '220501093', 'Evaluar requisitos de la solución de software de acuerdo con estándares', 'Técnico en Programación de Software', 'Analisis', 32, 'Validación y verificación de artefactos con stakeholders y usuarios.'),
('comp-03', '220501094', 'Diseñar la solución de software de acuerdo con procedimientos y requisitos', 'Técnico en Programación de Software', 'Planeacion', 60, 'Modelado entidad-relación, diseño de arquitectura física/lógica y prototipos UX/UI.'),
('comp-04', '220501095', 'Desarrollar la estructura de datos y componentes software de la aplicación', 'Técnico en Programación de Software', 'Ejecucion', 96, 'Codificación en lenguajes de backend y frontend con conexión a gestor MySQL/PostgreSQL.'),
('comp-05', '220501096', 'Construir el sistema de bases de datos relacional conforme al diseño', 'Técnico en Programación de Software', 'Ejecucion', 64, 'Implementación de DDL, DML, llaves foráneas, índices y consultas optimizadas.');

-- -----------------------------------------------------------------------------
-- 7. EVALUACIÓN Y SEGUIMIENTO DE COMPETENCIAS
-- -----------------------------------------------------------------------------
-- Juan Camilo (Grado 11 - 80% de competencias aprobadas, habilitado para práctica)
INSERT INTO estudiante_competencias (id, estudiante_id, competencia_id, instructor_id, juicio_evaluativo, fecha_evaluacion, observaciones, evidencias_url) VALUES
('ec-01', 'est-01', 'comp-01', 'inst-01', 'APROBADO', '2026-03-15', 'Excelente dominio en la redacción de casos de uso e historias de usuario.', 'https://github.com/evidencias/juan-requisitos'),
('ec-02', 'est-01', 'comp-02', 'inst-01', 'APROBADO', '2026-04-20', 'Cumple a cabalidad con la matriz de trazabilidad y validación.', 'https://github.com/evidencias/juan-matriz'),
('ec-03', 'est-01', 'comp-03', 'inst-01', 'APROBADO', '2026-06-10', 'Diagramas de arquitectura limpios y prototipo funcional en Figma.', 'https://figma.com/@juan/articulapp'),
('ec-04', 'est-01', 'comp-04', 'inst-01', 'APROBADO', '2026-08-30', 'Desarrollo de API REST en Node.js con código modular y limpio.', 'https://github.com/juan/api-backend'),
('ec-05', 'est-01', 'comp-05', 'inst-01', 'EN_PROCESO', NULL, 'En proceso de sustentación de procedimientos almacenados e índices.', NULL);

-- María Paula (Grado 10 - En fase inicial de formación)
INSERT INTO estudiante_competencias (id, estudiante_id, competencia_id, instructor_id, juicio_evaluativo, fecha_evaluacion, observaciones, evidencias_url) VALUES
('ec-06', 'est-02', 'comp-01', 'inst-01', 'APROBADO', '2026-05-18', 'Participación activa y entrega de actas de requerimientos a tiempo.', 'https://github.com/evidencias/maria-req'),
('ec-07', 'est-02', 'comp-02', 'inst-01', 'EN_PROCESO', NULL, 'Ajustando matriz de verificación según observaciones del instructor.', NULL),
('ec-08', 'est-02', 'comp-03', 'inst-01', 'POR_EVALUAR', NULL, NULL, NULL),
('ec-09', 'est-02', 'comp-04', 'inst-01', 'POR_EVALUAR', NULL, NULL, NULL),
('ec-10', 'est-02', 'comp-05', 'inst-01', 'POR_EVALUAR', NULL, NULL, NULL);

-- -----------------------------------------------------------------------------
-- 8. EMPRESAS ALIADAS
-- -----------------------------------------------------------------------------
INSERT INTO empresas (id, usuario_id, nit, razon_social, sector_economico, direccion, ciudad, contacto_nombre, contacto_cargo, contacto_telefono, sitio_web, verificada) VALUES
('emp-01', 'usr-emp-01', '901234567-8', 'Innovatech Soluciones S.A.S.', 'Tecnología y Desarrollo de Software', 'Carrera 7 # 72-10 Oficina 504', 'Bogotá D.C.', 'Ing. Carolina Duarte', 'Directora de Gestión de Talento', '3187654321', 'https://innovatech.com.co', 1);

-- -----------------------------------------------------------------------------
-- 9. VACANTES PARA ETAPA PRÁCTICA
-- -----------------------------------------------------------------------------
INSERT INTO vacantes (id, empresa_id, titulo, descripcion, requisitos, modalidad, ubicacion, cupos_disponibles, auxilio_sostenimiento, fecha_limite, estado) VALUES
('vac-01', 'emp-01', 'Aprendiz Desarrollador Web Junior (Etapa Práctica)', 'Buscamos aprendiz de grado 11° de articulación en Técnico de Programación de Software para apoyar el desarrollo de módulos frontend y consumo de APIs en equipo ágil.', 'Competencias aprobadas en diseño de software y codificación. Conocimientos en HTML, CSS, JavaScript y Git.', 'HIBRIDO', 'Bogotá D.C.', 2, 1423500.00, '2026-11-30', 'ABIERTA'),
('vac-02', 'emp-01', 'Auxiliar de Bases de Datos y Soporte TI', 'Oportunidad de contrato de aprendizaje para dar soporte en administración básica de MySQL, consultas SQL y mantenimiento preventivo.', 'Competencias aprobadas en bases de datos relacionales y gestión de datos.', 'PRESENCIAL', 'Bogotá D.C.', 1, 1423500.00, '2026-12-15', 'ABIERTA');

-- -----------------------------------------------------------------------------
-- 10. POSTULACIÓN DE PRUEBA
-- -----------------------------------------------------------------------------
INSERT INTO postulaciones (id, vacante_id, estudiante_id, fecha_postulacion, estado, retroalimentacion) VALUES
('post-01', 'vac-01', 'est-01', NOW(), 'PRESELECCIONADO', 'El perfil de Juan Camilo cumple con el 80% de competencias aprobadas y su portafolio en GitHub fue evaluado positivamente por el líder técnico.');
