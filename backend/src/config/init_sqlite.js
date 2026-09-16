const fs = require('fs');
const path = require('path');
const { getDb } = require('./db');
const bcrypt = require('bcryptjs');

async function initializeSqliteDb() {
  const db = getDb();
  if (!db) {
    console.error('La base de datos SQLite no está inicializada.');
    return;
  }

  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        db.run('PRAGMA foreign_keys = OFF');
        console.log('[DB] Creando tablas SQLite si no existen...');

        // Usuarios
        db.run(`
          CREATE TABLE IF NOT EXISTS usuarios (
            id VARCHAR(50) PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            rol VARCHAR(20) NOT NULL,
            activo BOOLEAN DEFAULT 1,
            ultimo_acceso DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Colegios
        db.run(`
          CREATE TABLE IF NOT EXISTS colegios (
            id VARCHAR(50) PRIMARY KEY,
            codigo_dane VARCHAR(20) UNIQUE NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            direccion VARCHAR(200),
            municipio VARCHAR(100),
            departamento VARCHAR(100),
            telefono VARCHAR(20),
            rector_nombre VARCHAR(100),
            coordinador_media VARCHAR(100),
            email_institucional VARCHAR(100)
          )
        `);

        // Instructores
        db.run(`
          CREATE TABLE IF NOT EXISTS instructores (
            id VARCHAR(50) PRIMARY KEY,
            usuario_id VARCHAR(50) NOT NULL,
            tipo_documento VARCHAR(10) NOT NULL,
            numero_documento VARCHAR(20) UNIQUE NOT NULL,
            nombres VARCHAR(50) NOT NULL,
            apellidos VARCHAR(50) NOT NULL,
            telefono VARCHAR(20),
            centro_formacion VARCHAR(150),
            especialidad VARCHAR(150),
            estado VARCHAR(20) DEFAULT 'ACTIVO'
          )
        `);

        // Estudiantes
        db.run(`
          CREATE TABLE IF NOT EXISTS estudiantes (
            id VARCHAR(50) PRIMARY KEY,
            usuario_id VARCHAR(50) NOT NULL,
            colegio_id VARCHAR(50) NOT NULL,
            tipo_documento VARCHAR(10) NOT NULL,
            numero_documento VARCHAR(20) UNIQUE NOT NULL,
            nombres VARCHAR(50) NOT NULL,
            apellidos VARCHAR(50) NOT NULL,
            grado INTEGER,
            ficha_sena VARCHAR(20),
            programa_formacion VARCHAR(150),
            jornada VARCHAR(20),
            telefono VARCHAR(20),
            resumen_perfil TEXT,
            hoja_vida_url VARCHAR(255),
            foto_url VARCHAR(255)
          )
        `);

        // Instructor_Colegios
        db.run(`
          CREATE TABLE IF NOT EXISTS instructor_colegios (
            id VARCHAR(50) PRIMARY KEY,
            instructor_id VARCHAR(50) NOT NULL,
            colegio_id VARCHAR(50) NOT NULL,
            ficha_caracterizacion VARCHAR(20) NOT NULL,
            ano_lectivo INTEGER NOT NULL,
            activo BOOLEAN DEFAULT 1
          )
        `);

        // Competencias
        db.run(`
          CREATE TABLE IF NOT EXISTS competencias (
            id VARCHAR(50) PRIMARY KEY,
            codigo_norma VARCHAR(50) NOT NULL,
            denominacion VARCHAR(200) NOT NULL,
            programa_formacion VARCHAR(150) NOT NULL,
            fase_proyecto VARCHAR(50),
            horas_duracion INTEGER,
            descripcion TEXT
          )
        `);

        // Estudiante_Competencias
        db.run(`
          CREATE TABLE IF NOT EXISTS estudiante_competencias (
            id VARCHAR(50) PRIMARY KEY,
            estudiante_id VARCHAR(50) NOT NULL,
            competencia_id VARCHAR(50) NOT NULL,
            instructor_id VARCHAR(50),
            juicio_evaluativo VARCHAR(20) NOT NULL,
            fecha_evaluacion DATE,
            observaciones TEXT,
            evidencias_url VARCHAR(255)
          )
        `);

        // Empresas
        db.run(`
          CREATE TABLE IF NOT EXISTS empresas (
            id VARCHAR(50) PRIMARY KEY,
            usuario_id VARCHAR(50) NOT NULL,
            nit VARCHAR(20) UNIQUE NOT NULL,
            razon_social VARCHAR(150) NOT NULL,
            sector_economico VARCHAR(100),
            direccion VARCHAR(200),
            ciudad VARCHAR(100),
            contacto_nombre VARCHAR(100),
            contacto_cargo VARCHAR(100),
            contacto_telefono VARCHAR(20),
            sitio_web VARCHAR(100),
            verificada BOOLEAN DEFAULT 0,
            estado_alianza VARCHAR(20) DEFAULT 'APROBADA'
          )
        `);

        // Solicitudes Alianza Empresas
        db.run(`
          CREATE TABLE IF NOT EXISTS solicitudes_alianza (
            id VARCHAR(50) PRIMARY KEY,
            nit VARCHAR(20) NOT NULL,
            razon_social VARCHAR(150) NOT NULL,
            email VARCHAR(100) NOT NULL,
            sector_economico VARCHAR(100),
            direccion VARCHAR(200),
            ciudad VARCHAR(100),
            contacto_nombre VARCHAR(100),
            contacto_cargo VARCHAR(100),
            contacto_telefono VARCHAR(20),
            sitio_web VARCHAR(100),
            mensaje_solicitud TEXT,
            fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
            estado VARCHAR(20) DEFAULT 'PENDIENTE'
          )
        `);

        // Vacantes
        db.run(`
          CREATE TABLE IF NOT EXISTS vacantes (
            id VARCHAR(50) PRIMARY KEY,
            empresa_id VARCHAR(50) NOT NULL,
            titulo VARCHAR(150) NOT NULL,
            descripcion TEXT NOT NULL,
            requisitos TEXT,
            modalidad VARCHAR(50),
            ubicacion VARCHAR(100),
            cupos_disponibles INTEGER DEFAULT 1,
            auxilio_sostenimiento DECIMAL(10,2),
            fecha_limite DATE,
            estado VARCHAR(20) DEFAULT 'ABIERTA'
          )
        `);

        // Postulaciones
        db.run(`
          CREATE TABLE IF NOT EXISTS postulaciones (
            id VARCHAR(50) PRIMARY KEY,
            vacante_id VARCHAR(50) NOT NULL,
            estudiante_id VARCHAR(50) NOT NULL,
            fecha_postulacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            estado VARCHAR(50) DEFAULT 'POSTULADO',
            retroalimentacion TEXT
          )
        `);

        // Comprobar si hay usuarios, si no, insertar seeds
        db.get('SELECT COUNT(*) as count FROM usuarios', async (err, row) => {
          if (err) throw err;
          if (row.count === 0) {
            console.log('[DB] Base de datos vacía, insertando datos de prueba (seeds)...');
            const mockData = require('../data/mockData');
            
            // Insertar Usuarios
            const stmtUsuarios = db.prepare('INSERT INTO usuarios (id, email, password_hash, rol, activo) VALUES (?, ?, ?, ?, ?)');
            mockData.usuarios.forEach(u => {
              stmtUsuarios.run(u.id, u.email, u.password_hash, u.rol, u.activo);
            });
            stmtUsuarios.finalize();

            // Insertar Colegios
            const stmtColegios = db.prepare('INSERT INTO colegios (id, codigo_dane, nombre, direccion, municipio, departamento, telefono, rector_nombre, coordinador_media, email_institucional) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            mockData.colegios.forEach(c => {
              stmtColegios.run(c.id, c.codigo_dane, c.nombre, c.direccion, c.municipio, c.departamento, c.telefono, c.rector_nombre, c.coordinador_media, c.email_institucional);
            });
            stmtColegios.finalize();

            // Insertar Instructores
            const stmtInstructores = db.prepare('INSERT INTO instructores (id, usuario_id, tipo_documento, numero_documento, nombres, apellidos, telefono, centro_formacion, especialidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
            mockData.instructores.forEach(i => {
              stmtInstructores.run(i.id, i.usuario_id, i.tipo_documento, i.numero_documento, i.nombres, i.apellidos, i.telefono, i.centro_formacion, i.especialidad);
            });
            stmtInstructores.finalize();

            // Insertar Estudiantes
            const stmtEstudiantes = db.prepare('INSERT INTO estudiantes (id, usuario_id, colegio_id, tipo_documento, numero_documento, nombres, apellidos, grado, ficha_sena, programa_formacion, jornada, telefono, resumen_perfil, hoja_vida_url, foto_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            mockData.estudiantes.forEach(e => {
              stmtEstudiantes.run(e.id, e.usuario_id, e.colegio_id, e.tipo_documento, e.numero_documento, e.nombres, e.apellidos, e.grado, e.ficha_sena, e.programa_formacion, e.jornada, e.telefono, e.resumen_perfil, e.hoja_vida_url, e.foto_url);
            });
            stmtEstudiantes.finalize();
            
            // Insertar Instructor_Colegios
            const stmtInstCol = db.prepare('INSERT INTO instructor_colegios (id, instructor_id, colegio_id, ficha_caracterizacion, ano_lectivo, activo) VALUES (?, ?, ?, ?, ?, ?)');
            mockData.instructores.forEach(i => {
                i.fichas_asignadas.forEach((ficha, idx) => {
                    stmtInstCol.run(`ic-${i.id}-${idx}`, i.id, 'col-01', ficha, 2026, 1);
                });
            });
            stmtInstCol.finalize();

            // Insertar Competencias
            const stmtComp = db.prepare('INSERT INTO competencias (id, codigo_norma, denominacion, programa_formacion, fase_proyecto, horas_duracion, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)');
            mockData.competencias.forEach(c => {
                stmtComp.run(c.id, c.codigo_norma, c.denominacion, c.programa_formacion, c.fase_proyecto, c.horas_duracion, c.descripcion);
            });
            stmtComp.finalize();

            // Insertar Estudiante_Competencias
            const stmtEstComp = db.prepare('INSERT INTO estudiante_competencias (id, estudiante_id, competencia_id, instructor_id, juicio_evaluativo, fecha_evaluacion, observaciones, evidencias_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            mockData.estudiante_competencias.forEach(ec => {
                stmtEstComp.run(ec.id, ec.estudiante_id, ec.competencia_id, ec.instructor_id, ec.juicio_evaluativo, ec.fecha_evaluacion, ec.observaciones, ec.evidencias_url);
            });
            stmtEstComp.finalize();
            
            // Insertar Empresas
            const stmtEmpresas = db.prepare('INSERT INTO empresas (id, usuario_id, nit, razon_social, sector_economico, direccion, ciudad, contacto_nombre, contacto_cargo, contacto_telefono, sitio_web, verificada) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            mockData.empresas.forEach(e => {
              stmtEmpresas.run(e.id, e.usuario_id, e.nit, e.razon_social, e.sector_economico, e.direccion, e.ciudad, e.contacto_nombre, e.contacto_cargo, e.contacto_telefono, e.sitio_web, e.verificada ? 1 : 0);
            });
            stmtEmpresas.finalize();

            // Insertar Solicitudes Alianza
            const stmtSol = db.prepare('INSERT INTO solicitudes_alianza (id, nit, razon_social, email, sector_economico, direccion, ciudad, contacto_nombre, contacto_cargo, contacto_telefono, sitio_web, mensaje_solicitud, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            mockData.solicitudes_alianza.forEach(s => {
              stmtSol.run(s.id, s.nit, s.razon_social, s.email, s.sector_economico, s.direccion, s.ciudad, s.contacto_nombre, s.contacto_cargo, s.contacto_telefono, s.sitio_web, s.mensaje_solicitud, s.estado);
            });
            stmtSol.finalize();

            // Insertar Vacantes
            const stmtVacantes = db.prepare('INSERT INTO vacantes (id, empresa_id, titulo, descripcion, requisitos, modalidad, ubicacion, cupos_disponibles, auxilio_sostenimiento, fecha_limite, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            mockData.vacantes.forEach(v => {
                stmtVacantes.run(v.id, v.empresa_id, v.titulo, v.descripcion, v.requisitos, v.modalidad, v.ubicacion, v.cupos_disponibles, v.auxilio_sostenimiento, v.fecha_limite, v.estado);
            });
            stmtVacantes.finalize();

            // Insertar Postulaciones
            const stmtPostulaciones = db.prepare('INSERT INTO postulaciones (id, vacante_id, estudiante_id, estado, retroalimentacion) VALUES (?, ?, ?, ?, ?)');
            mockData.postulaciones.forEach(p => {
                stmtPostulaciones.run(p.id, p.vacante_id, p.estudiante_id, p.estado, p.retroalimentacion);
            });
            stmtPostulaciones.finalize();

            console.log('[DB] Semillas insertadas correctamente.');
          }
          resolve();
        });
      } catch (err) {
        console.error('[DB ERROR] Fallo al inicializar tablas: ', err);
        reject(err);
      }
    });
  });
}

module.exports = { initializeSqliteDb };
