const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const mockData = require('../data/mockData');

async function reseed() {
  const dbPath = path.resolve(__dirname, '../../database.sqlite');
  console.log('[RESEED] Conectando a SQLite en:', dbPath);

  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    console.log('[RESEED] Eliminando y recreando tablas...');

    db.run('PRAGMA foreign_keys = OFF');

    // Tablas a reiniciar
    const tables = [
      'estudiante_asistencias',
      'asistencias',
      'entregas_tareas',
      'tareas',
      'matriculas',
      'cursos',
      'postulaciones',
      'vacantes',
      'solicitudes_alianza',
      'empresas',
      'estudiante_competencias',
      'competencias',
      'instructor_colegios',
      'estudiantes',
      'instructores',
      'colegios',
      'usuarios'
    ];

    tables.forEach(t => {
      db.run(`DROP TABLE IF EXISTS ${t}`);
    });

    // 1. Usuarios
    db.run(`
      CREATE TABLE usuarios (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        rol VARCHAR(20) NOT NULL,
        activo BOOLEAN DEFAULT 1,
        ultimo_acceso DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Colegios
    db.run(`
      CREATE TABLE colegios (
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

    // 3. Instructores
    db.run(`
      CREATE TABLE instructores (
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

    // 4. Estudiantes
    db.run(`
      CREATE TABLE estudiantes (
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

    // 5. Instructor_Colegios
    db.run(`
      CREATE TABLE instructor_colegios (
        id VARCHAR(50) PRIMARY KEY,
        instructor_id VARCHAR(50) NOT NULL,
        colegio_id VARCHAR(50) NOT NULL,
        ficha_caracterizacion VARCHAR(20) NOT NULL,
        ano_lectivo INTEGER NOT NULL,
        activo BOOLEAN DEFAULT 1
      )
    `);

    // 6. Competencias
    db.run(`
      CREATE TABLE competencias (
        id VARCHAR(50) PRIMARY KEY,
        codigo_norma VARCHAR(50) NOT NULL,
        denominacion VARCHAR(200) NOT NULL,
        programa_formacion VARCHAR(150) NOT NULL,
        fase_proyecto VARCHAR(50),
        horas_duracion INTEGER,
        descripcion TEXT
      )
    `);

    // 7. Estudiante_Competencias
    db.run(`
      CREATE TABLE estudiante_competencias (
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

    // 8. Empresas
    db.run(`
      CREATE TABLE empresas (
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

    // 9. Solicitudes Alianza
    db.run(`
      CREATE TABLE solicitudes_alianza (
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

    // 10. Vacantes
    db.run(`
      CREATE TABLE vacantes (
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

    // 11. Postulaciones
    db.run(`
      CREATE TABLE postulaciones (
        id VARCHAR(50) PRIMARY KEY,
        vacante_id VARCHAR(50) NOT NULL,
        estudiante_id VARCHAR(50) NOT NULL,
        fecha_postulacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        estado VARCHAR(50) DEFAULT 'POSTULADO',
        retroalimentacion TEXT
      )
    `);

    // 12. Cursos
    db.run(`
      CREATE TABLE cursos (
        id VARCHAR(50) PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        materia VARCHAR(150),
        modulo VARCHAR(150),
        descripcion TEXT,
        instructor_id VARCHAR(50) NOT NULL,
        programa_formacion VARCHAR(150),
        grado INTEGER,
        ficha VARCHAR(20),
        estado VARCHAR(20) DEFAULT 'PUBLICO' 
      )
    `);

    // 13. Matriculas
    db.run(`
      CREATE TABLE matriculas (
        id VARCHAR(50) PRIMARY KEY,
        curso_id VARCHAR(50) NOT NULL,
        estudiante_id VARCHAR(50) NOT NULL,
        fecha_matricula DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 14. Tareas
    db.run(`
      CREATE TABLE tareas (
        id VARCHAR(50) PRIMARY KEY,
        curso_id VARCHAR(50) NOT NULL,
        titulo VARCHAR(150) NOT NULL,
        descripcion TEXT,
        fecha_limite DATETIME,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 15. Entregas Tareas
    db.run(`
      CREATE TABLE entregas_tareas (
        id VARCHAR(50) PRIMARY KEY,
        tarea_id VARCHAR(50) NOT NULL,
        estudiante_id VARCHAR(50) NOT NULL,
        archivo_url VARCHAR(255),
        fecha_entrega DATETIME DEFAULT CURRENT_TIMESTAMP,
        calificacion DECIMAL(5,2),
        observaciones TEXT
      )
    `);

    // 16. Asistencias
    db.run(`
      CREATE TABLE asistencias (
        id VARCHAR(50) PRIMARY KEY,
        curso_id VARCHAR(50) NOT NULL,
        fecha DATE NOT NULL
      )
    `);

    // 17. Estudiante Asistencias
    db.run(`
      CREATE TABLE estudiante_asistencias (
        id VARCHAR(50) PRIMARY KEY,
        asistencia_id VARCHAR(50) NOT NULL,
        estudiante_id VARCHAR(50) NOT NULL,
        presente BOOLEAN DEFAULT 0
      )
    `);

    console.log('[RESEED] Insertando datos desde mockData...');

    // Inserción de Usuarios
    const stmtU = db.prepare('INSERT INTO usuarios (id, email, password_hash, rol, activo) VALUES (?, ?, ?, ?, ?)');
    mockData.usuarios.forEach(u => stmtU.run(u.id, u.email, u.password_hash, u.rol, u.activo ? 1 : 0));
    stmtU.finalize();

    // Inserción de Colegios
    const stmtCol = db.prepare('INSERT INTO colegios (id, codigo_dane, nombre, direccion, municipio, departamento, telefono, rector_nombre, coordinador_media, email_institucional) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    mockData.colegios.forEach(c => stmtCol.run(c.id, c.codigo_dane, c.nombre, c.direccion, c.municipio, c.departamento, c.telefono, c.rector_nombre, c.coordinador_media, c.email_institucional));
    stmtCol.finalize();

    // Inserción de Instructores
    const stmtInst = db.prepare('INSERT INTO instructores (id, usuario_id, tipo_documento, numero_documento, nombres, apellidos, telefono, centro_formacion, especialidad, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    mockData.instructores.forEach(i => stmtInst.run(i.id, i.usuario_id, i.tipo_documento, i.numero_documento, i.nombres, i.apellidos, i.telefono, i.centro_formacion, i.especialidad, i.estado));
    stmtInst.finalize();

    // Inserción de Estudiantes
    const stmtEst = db.prepare('INSERT INTO estudiantes (id, usuario_id, colegio_id, tipo_documento, numero_documento, nombres, apellidos, grado, ficha_sena, programa_formacion, jornada, telefono, resumen_perfil, hoja_vida_url, foto_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    mockData.estudiantes.forEach(e => stmtEst.run(e.id, e.usuario_id, e.colegio_id, e.tipo_documento, e.numero_documento, e.nombres, e.apellidos, e.grado, e.ficha_sena, e.programa_formacion, e.jornada, e.telefono, e.resumen_perfil, e.hoja_vida_url, e.foto_url));
    stmtEst.finalize();

    // Inserción de Instructor_Colegios
    const stmtInstCol = db.prepare('INSERT INTO instructor_colegios (id, instructor_id, colegio_id, ficha_caracterizacion, ano_lectivo, activo) VALUES (?, ?, ?, ?, ?, ?)');
    mockData.instructores.forEach(i => {
      i.fichas_asignadas.forEach((ficha, idx) => {
        stmtInstCol.run(`ic-${i.id}-${idx}`, i.id, 'col-01', ficha, 2026, 1);
      });
    });
    stmtInstCol.finalize();

    // Inserción de Competencias
    const stmtComp = db.prepare('INSERT INTO competencias (id, codigo_norma, denominacion, programa_formacion, fase_proyecto, horas_duracion, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)');
    mockData.competencias.forEach(c => stmtComp.run(c.id, c.codigo_norma, c.denominacion, c.programa_formacion, c.fase_proyecto, c.horas_duracion, c.descripcion));
    stmtComp.finalize();

    // Inserción de Estudiante_Competencias
    const stmtEstComp = db.prepare('INSERT INTO estudiante_competencias (id, estudiante_id, competencia_id, instructor_id, juicio_evaluativo, fecha_evaluacion, observaciones, evidencias_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    mockData.estudiante_competencias.forEach(ec => stmtEstComp.run(ec.id, ec.estudiante_id, ec.competencia_id, ec.instructor_id, ec.juicio_evaluativo, ec.fecha_evaluacion, ec.observaciones, ec.evidencias_url));
    stmtEstComp.finalize();

    // Inserción de Empresas
    const stmtEmp = db.prepare('INSERT INTO empresas (id, usuario_id, nit, razon_social, sector_economico, direccion, ciudad, contacto_nombre, contacto_cargo, contacto_telefono, sitio_web, verificada, estado_alianza) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    mockData.empresas.forEach(e => stmtEmp.run(e.id, e.usuario_id, e.nit, e.razon_social, e.sector_economico, e.direccion, e.ciudad, e.contacto_nombre, e.contacto_cargo, e.contacto_telefono, e.sitio_web, e.verificada ? 1 : 0, e.estado_alianza));
    stmtEmp.finalize();

    // Inserción de Solicitudes de Alianza
    const stmtSol = db.prepare('INSERT INTO solicitudes_alianza (id, nit, razon_social, email, sector_economico, direccion, ciudad, contacto_nombre, contacto_cargo, contacto_telefono, sitio_web, mensaje_solicitud, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    mockData.solicitudes_alianza.forEach(s => stmtSol.run(s.id, s.nit, s.razon_social, s.email, s.sector_economico, s.direccion, s.ciudad, s.contacto_nombre, s.contacto_cargo, s.contacto_telefono, s.sitio_web, s.mensaje_solicitud, s.estado));
    stmtSol.finalize();

    // Inserción de Vacantes
    const stmtVac = db.prepare('INSERT INTO vacantes (id, empresa_id, titulo, descripcion, requisitos, modalidad, ubicacion, cupos_disponibles, auxilio_sostenimiento, fecha_limite, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    mockData.vacantes.forEach(v => stmtVac.run(v.id, v.empresa_id, v.titulo, v.descripcion, v.requisitos, v.modalidad, v.ubicacion, v.cupos_disponibles, v.auxilio_sostenimiento, v.fecha_limite, v.estado));
    stmtVac.finalize();

    // Inserción de Postulaciones
    const stmtPost = db.prepare('INSERT INTO postulaciones (id, vacante_id, estudiante_id, fecha_postulacion, estado, retroalimentacion) VALUES (?, ?, ?, ?, ?, ?)');
    mockData.postulaciones.forEach(p => stmtPost.run(p.id, p.vacante_id, p.estudiante_id, p.fecha_postulacion, p.estado, p.retroalimentacion));
    stmtPost.finalize();

    // Inserción de Cursos
    const stmtCur = db.prepare('INSERT INTO cursos (id, nombre, materia, modulo, descripcion, instructor_id, programa_formacion, grado, ficha, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    mockData.cursos.forEach(c => stmtCur.run(c.id, c.nombre, c.materia || '', c.modulo || '', c.descripcion || '', c.instructor_id, c.programa_formacion, c.grado || 11, c.ficha || '', c.estado || 'PUBLICO'));
    stmtCur.finalize();

    // Inserción de Matriculas
    const stmtMat = db.prepare('INSERT INTO matriculas (id, curso_id, estudiante_id) VALUES (?, ?, ?)');
    mockData.matriculas.forEach(m => stmtMat.run(m.id, m.curso_id, m.estudiante_id));
    stmtMat.finalize();

    // Inserción de Tareas
    const stmtTar = db.prepare('INSERT INTO tareas (id, curso_id, titulo, descripcion, fecha_limite, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?)');
    mockData.tareas.forEach(t => stmtTar.run(t.id, t.curso_id, t.titulo, t.descripcion, t.fecha_limite, t.fecha_creacion));
    stmtTar.finalize();

    // Inserción de Entregas de Tareas
    const stmtEnt = db.prepare('INSERT INTO entregas_tareas (id, tarea_id, estudiante_id, archivo_url, fecha_entrega, calificacion, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)');
    mockData.entregas_tareas.forEach(et => stmtEnt.run(et.id, et.tarea_id, et.estudiante_id, et.archivo_url, et.fecha_entrega, et.calificacion, et.observaciones));
    stmtEnt.finalize();

    console.log('[RESEED] ¡Base de datos reiniciada e inicializada exitosamente!');
    db.close();
  });
}

reseed().catch(err => {
  console.error('[RESEED ERROR]', err);
  process.exit(1);
});
