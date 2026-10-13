const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
console.log('[MIGRATE] Conectando a SQLite en:', dbPath);
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('[MIGRATE] Creando tablas para Programa -> Ficha -> Clase -> Temas -> Evidencias -> Entregas...');

  // 1. Programas
  db.run(`
    CREATE TABLE IF NOT EXISTS programas (
      id VARCHAR(50) PRIMARY KEY,
      codigo VARCHAR(50) UNIQUE NOT NULL,
      nombre VARCHAR(150) NOT NULL,
      descripcion TEXT,
      horas_duracion INTEGER DEFAULT 880,
      estado VARCHAR(20) DEFAULT 'ACTIVO'
    )
  `);

  // 2. Fichas (Relación: Programa -> Ficha)
  db.run(`
    CREATE TABLE IF NOT EXISTS fichas (
      id VARCHAR(50) PRIMARY KEY,
      codigo VARCHAR(50) UNIQUE NOT NULL,
      programa_id VARCHAR(50) NOT NULL,
      grado INTEGER NOT NULL,
      jornada VARCHAR(50) DEFAULT 'Mañana',
      fecha_inicio DATE,
      fecha_fin DATE,
      estado VARCHAR(20) DEFAULT 'ACTIVA',
      FOREIGN KEY (programa_id) REFERENCES programas(id)
    )
  `);

  // 3. Clases (Relación: Ficha -> Clase)
  db.run(`
    CREATE TABLE IF NOT EXISTS clases (
      id VARCHAR(50) PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      materia VARCHAR(150),
      descripcion TEXT,
      instructor_id VARCHAR(50) NOT NULL,
      ficha_id VARCHAR(50) NOT NULL,
      programa_id VARCHAR(50),
      grado INTEGER,
      estado VARCHAR(20) DEFAULT 'ACTIVO',
      FOREIGN KEY (instructor_id) REFERENCES instructores(id),
      FOREIGN KEY (ficha_id) REFERENCES fichas(id),
      FOREIGN KEY (programa_id) REFERENCES programas(id)
    )
  `);

  // 4. Temas (Dentro de cada clase)
  db.run(`
    CREATE TABLE IF NOT EXISTS temas (
      id VARCHAR(50) PRIMARY KEY,
      clase_id VARCHAR(50) NOT NULL,
      titulo VARCHAR(150) NOT NULL,
      descripcion TEXT,
      semana INTEGER,
      orden INTEGER DEFAULT 1,
      FOREIGN KEY (clase_id) REFERENCES clases(id)
    )
  `);

  // 5. Evidencias (Dentro de temas/clase)
  db.run(`
    CREATE TABLE IF NOT EXISTS evidencias (
      id VARCHAR(50) PRIMARY KEY,
      clase_id VARCHAR(50) NOT NULL,
      tema_id VARCHAR(50),
      titulo VARCHAR(150) NOT NULL,
      descripcion TEXT,
      tipo VARCHAR(50) DEFAULT 'TALLER',
      fecha_limite DATETIME,
      puntos_maximos DECIMAL(5,2) DEFAULT 5.0,
      archivo_guia_url VARCHAR(255),
      FOREIGN KEY (clase_id) REFERENCES clases(id)
    )
  `);

  // 6. Evidencia Entregas y Evaluaciones
  db.run(`
    CREATE TABLE IF NOT EXISTS evidencia_entregas (
      id VARCHAR(50) PRIMARY KEY,
      evidencia_id VARCHAR(50) NOT NULL,
      estudiante_id VARCHAR(50) NOT NULL,
      archivo_url VARCHAR(255),
      enlace_externo VARCHAR(255),
      comentarios_estudiante TEXT,
      fecha_entrega DATETIME DEFAULT CURRENT_TIMESTAMP,
      calificacion DECIMAL(5,2),
      comentario_instructor TEXT,
      fecha_evaluacion DATETIME,
      estado VARCHAR(30) DEFAULT 'ENTREGADO',
      FOREIGN KEY (evidencia_id) REFERENCES evidencias(id),
      FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id)
    )
  `);

  console.log('[MIGRATE] Tablas creadas con éxito. Insertando datos de ejemplo (seed)...');

  // Limpiar datos existentes en estas tablas para evitar duplicados al migrar
  db.run('DELETE FROM evidencia_entregas');
  db.run('DELETE FROM evidencias');
  db.run('DELETE FROM temas');
  db.run('DELETE FROM clases');
  db.run('DELETE FROM fichas');
  db.run('DELETE FROM programas');

  // --- SEED PROGRAMAS ---
  const stmtProg = db.prepare('INSERT INTO programas (id, codigo, nombre, descripcion, horas_duracion) VALUES (?, ?, ?, ?, ?)');
  const programasSeed = [
    ['prog-01', 'PROG-WEB-01', 'Aprendiz Desarrollador Web Junior', 'Formación técnica articulada en desarrollo de interfaces web, componentes en React, JavaScript y APIs REST.', 880],
    ['prog-02', 'PROG-CONT-02', 'Auxiliar en Contaduría Pública', 'Manejo de registros contables, conciliación bancaria, liquidación de nómina y estados financieros básicos.', 880],
    ['prog-03', 'PROG-BD-03', 'Auxiliar de Bases de Datos y Soporte TI', 'Diseño relacional, consultas SQL complejas, normalización y mantenimiento preventivo de equipos.', 880],
    ['prog-04', 'PROG-RED-04', 'Técnico en Redes y Soporte de Infraestructura TI', 'Implementación de cableado estructurado, configuración de redes LAN/WAN y soporte de servidores.', 880]
  ];
  programasSeed.forEach(p => stmtProg.run(...p));
  stmtProg.finalize();

  // --- SEED FICHAS ---
  const stmtFicha = db.prepare('INSERT INTO fichas (id, codigo, programa_id, grado, jornada, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const fichasSeed = [
    // Carlos Pérez (inst-01) - Web Junior
    ['ficha-01', '2712345', 'prog-01', 11, 'Mañana', '2025-01-20', '2026-11-30'],
    ['ficha-02', '2712346', 'prog-01', 10, 'Tarde', '2026-01-20', '2027-11-30'],
    // Laura Restrepo (inst-02) - Contaduría
    ['ficha-03', '2912345', 'prog-02', 11, 'Mañana', '2025-01-20', '2026-11-30'],
    ['ficha-04', '2912346', 'prog-02', 10, 'Tarde', '2026-01-20', '2027-11-30'],
    // Ricardo Mendoza (inst-03) - Bases de Datos
    ['ficha-05', '2812345', 'prog-03', 11, 'Mañana', '2025-01-20', '2026-11-30'],
    ['ficha-06', '2812346', 'prog-03', 10, 'Tarde', '2026-01-20', '2027-11-30'],
    // Marcela Torres (inst-04) - Redes
    ['ficha-07', '3012345', 'prog-04', 10, 'Mañana', '2026-01-20', '2027-11-30'],
    ['ficha-08', '3012346', 'prog-04', 11, 'Tarde', '2025-01-20', '2026-11-30']
  ];
  fichasSeed.forEach(f => stmtFicha.run(...f));
  stmtFicha.finalize();

  // --- SEED CLASES ---
  const stmtClases = db.prepare('INSERT INTO clases (id, nombre, materia, descripcion, instructor_id, ficha_id, programa_id, grado, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const clasesSeed = [
    // inst-01
    ['cur-01', 'Desarrollo Frontend y Aplicaciones Web Modernas (React / JavaScript)', 'Programación Web y Frontend', 'Construcción de interfaces de usuario interactivas con React, componentes modulares, gestión de estado y consumo de APIs RESTful.', 'inst-01', 'ficha-01', 'prog-01', 11, 'ACTIVO'],
    ['cur-02', 'Fundamentos de Algoritmia y Lógica de Programación', 'Introducción al Desarrollo de Software', 'Bases computacionales, estructuras condicionales, ciclos, pseudocódigo y diagramación lógica estructurada.', 'inst-01', 'ficha-02', 'prog-01', 10, 'ACTIVO'],
    // inst-02
    ['cur-03', 'Contabilización de Operaciones Comerciales y Nómina', 'Contabilidad Financiera y Liquidación', 'Manejo de libros comerciales, conciliación bancaria, balance de prueba, aportes parafiscales y liquidación de nómina.', 'inst-02', 'ficha-03', 'prog-02', 11, 'ACTIVO'],
    ['cur-04', 'Principios Contables y Documentación Mercantil', 'Contabilidad Básica Escolar', 'Estructura de soportes contables, factura electrónica, comprobantes de egreso, ingresos y causación.', 'inst-02', 'ficha-04', 'prog-02', 10, 'ACTIVO'],
    // inst-03
    ['cur-05', 'Modelado y Gestión Avanzada de Bases de Datos Relacionales (SQL)', 'Bases de Datos Relacionales y SQL', 'Normalización de bases de datos relacionales en 3FN, sentencias DDL y DML complejas, índices y procedimientos.', 'inst-03', 'ficha-05', 'prog-03', 11, 'ACTIVO'],
    ['cur-06', 'Estructuración de Datos y Consultas Básicas', 'Introducción a Bases de Datos', 'Tablas, tipos de datos, relaciones de cardinalidad y consultas de extracción de datos con SELECT y WHERE.', 'inst-03', 'ficha-06', 'prog-03', 10, 'ACTIVO'],
    // inst-04
    ['cur-07', 'Mantenimiento Preventivo y Soporte a Hardware / Software', 'Soporte Técnico e Infraestructura', 'Diagnóstico de periféricos, mantenimiento preventivo de componentes de cómputo, instalación de sistemas operativos.', 'inst-04', 'ficha-07', 'prog-04', 10, 'ACTIVO'],
    ['cur-08', 'Configuración de Redes LAN y Servicios Telemáticos', 'Redes de Computadores', 'Cableado estructurado norma T568A/B, configuración de routers y switches, direccionamiento IPv4 y protocolos de red.', 'inst-04', 'ficha-08', 'prog-04', 11, 'ACTIVO']
  ];
  clasesSeed.forEach(c => stmtClases.run(...c));
  stmtClases.finalize();

  // --- SEED TEMAS ---
  const stmtTemas = db.prepare('INSERT INTO temas (id, clase_id, titulo, descripcion, semana, orden) VALUES (?, ?, ?, ?, ?, ?)');
  const temasSeed = [
    // cur-01 (Carlos Pérez)
    ['tema-01', 'cur-01', 'Arquitectura de Componentes en React y JSX', 'Estructura de carpetas, JSX, props, renderizado condicional y ciclo de vida.', 2, 1],
    ['tema-02', 'cur-01', 'Hooks Modernos y Gestión de Estado', 'useState, useEffect, custom hooks y flujo de datos unidireccional.', 4, 2],
    ['tema-03', 'cur-01', 'Consumo de APIs RESTful y Rutas SPA', 'Fetch API, axios, react-router-dom, autenticación JWT y manejo de errores.', 7, 3],

    // cur-02 (Carlos Pérez - Grado 10°)
    ['tema-04', 'cur-02', 'Lógica Computacional y Algoritmos en Pseudocódigo', 'Variables, tipos de datos, condicionales Si/Entonces y estructuras repetitivas.', 3, 1],
    ['tema-05', 'cur-02', 'Funciones y Modularización en PSeInt', 'Parámetros, retorno de valores y resolución de casos lógicos.', 6, 2],

    // cur-03 (Laura Restrepo - Contabilidad 11°)
    ['tema-06', 'cur-03', 'Liquidación Integral de Nómina y Seguridad Social', 'Devengados, deducciones, aportes a salud, pensión, ARL y parafiscales.', 3, 1],
    ['tema-07', 'cur-03', 'Libro Diario, Conciliación Bancaria y Balance de Prueba', 'Asientos contables partida doble, conciliación extracto bancario y balance.', 6, 2],

    // cur-04 (Laura Restrepo - Contabilidad 10°)
    ['tema-08', 'cur-04', 'Documentos Comerciales y Soporte Contable', 'Factura electrónica, recibos de caja, cheques y comprobantes de egreso.', 3, 1],

    // cur-05 (Ricardo Mendoza - SQL 11°)
    ['tema-09', 'cur-05', 'Modelado Relacional y Normalización 3FN', 'Entidades, claves primarias, foráneas, integridad referencial y formas normales.', 2, 1],
    ['tema-10', 'cur-05', 'Consultas Avanzadas SQL: JOINs y Subconsultas', 'INNER JOIN, LEFT JOIN, funciones de agregación (GROUP BY, HAVING) y subconsultas.', 5, 2],

    // cur-06 (Ricardo Mendoza - SQL 10°)
    ['tema-11', 'cur-06', 'Conceptos Básicos de Datos y Sentencias DDL', 'CREATE TABLE, ALTER, tipos VARCHAR, INTEGER, DATE y restricciones NOT NULL.', 4, 1],

    // cur-07 (Marcela Torres - Soporte 10°)
    ['tema-12', 'cur-07', 'Diagnóstico de Hardware y Ensamble de Equipos', 'Placa madre, procesador, memoria RAM, discos duros y mantenimiento preventivo.', 3, 1],

    // cur-08 (Marcela Torres - Redes 11°)
    ['tema-13', 'cur-08', 'Cableado Estructurado y Normas TIA/EIA 568A/B', 'Categorías de cable UTP, ponchado de conectores RJ-45 y patch panels.', 2, 1],
    ['tema-14', 'cur-08', 'Direccionamiento IPv4 y Configuración de Routers', 'Clases de IP, máscaras de subred, puertas de enlace y configuración básica en Packet Tracer.', 5, 2]
  ];
  temasSeed.forEach(t => stmtTemas.run(...t));
  stmtTemas.finalize();

  // --- SEED EVIDENCIAS ---
  const stmtEvidencias = db.prepare('INSERT INTO evidencias (id, clase_id, tema_id, titulo, descripcion, tipo, fecha_limite, puntos_maximos, archivo_guia_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const evidenciasSeed = [
    // cur-01 (Carlos Pérez)
    ['ev-01', 'cur-01', 'tema-01', 'Taller 1: Creación de Componentes Modulares en React', 'Desarrollar un catálogo interactivo con componentes reutilizables y tipado de propiedades.', 'TALLER', '2026-09-15 23:59:00', 5.0, '/guias/taller_componentes_react.pdf'],
    ['ev-02', 'cur-01', 'tema-02', 'Laboratorio: Aplicación SPA con Manejo de Estado (Hooks)', 'Implementar una interfaz con carrito de compras o gestión de tareas usando useState y useEffect.', 'PROYECTO', '2026-10-05 23:59:00', 5.0, '/guias/lab_hooks_spa.pdf'],
    ['ev-03', 'cur-01', 'tema-03', 'Proyecto Integrador: Conexión Frontend con API REST', 'Consumir los endpoints de usuarios y productos del backend, con control de carga y errores.', 'PROYECTO', '2026-10-25 23:59:00', 5.0, '/guias/proyecto_consumo_api.pdf'],

    // cur-02 (Carlos Pérez - Algoritmia)
    ['ev-04', 'cur-02', 'tema-04', 'Taller de Algoritmos Condicionales y Ciclos en PSeInt', 'Resolver la guía de 10 ejercicios lógicos con pseudocódigo y diagrama de flujo.', 'TALLER', '2026-09-20 23:59:00', 5.0, '/guias/guia_algoritmos_pseint.pdf'],

    // cur-03 (Laura Restrepo - Contabilidad 11°)
    ['ev-05', 'cur-03', 'tema-06', 'Taller Práctico: Liquidación de Nómina con Horas Extras', 'Elaborar la planilla de nómina quincenal para 5 empleados incluyendo recargos nocturnos y parafiscales.', 'TALLER', '2026-09-18 23:59:00', 5.0, '/guias/taller_nomina_2026.xlsx'],
    ['ev-06', 'cur-03', 'tema-07', 'Caso de Estudio: Conciliación Bancaria y Balance de Prueba', 'Cotejar el extracto bancario con el libro mayor y presentar el balance cuadrado en sumas iguales.', 'PROYECTO', '2026-10-10 23:59:00', 5.0, '/guias/caso_conciliacion_bancaria.pdf'],

    // cur-04 (Laura Restrepo - Contabilidad 10°)
    ['ev-07', 'cur-04', 'tema-08', 'Diligenciamiento de Soportes de Contabilidad Mercantil', 'Elaborar facturas de venta, recibos de caja menor y notas débito según normativa DIAN.', 'TALLER', '2026-09-22 23:59:00', 5.0, '/guias/soportes_contables_plantilla.pdf'],

    // cur-05 (Ricardo Mendoza - SQL 11°)
    ['ev-08', 'cur-05', 'tema-09', 'Modelo Entidad-Relación y Normalización 3FN', 'Diseñar el diagrama de BD para un sistema de inventario y justificar la tercera forma normal.', 'PROYECTO', '2026-09-16 23:59:00', 5.0, '/guias/guia_normalizacion_bd.pdf'],
    ['ev-09', 'cur-05', 'tema-10', 'Script SQL: Consultas Complejas con JOINs y Agrupamientos', 'Escribir script SQL ejecutable con consultas de reportes, filtros y ordenamientos analíticos.', 'TALLER', '2026-10-12 23:59:00', 5.0, '/guias/taller_consultas_sql.pdf'],

    // cur-06 (Ricardo Mendoza - SQL 10°)
    ['ev-10', 'cur-06', 'tema-11', 'Laboratorio DDL: Creación de Tablas y Llaves Foráneas', 'Crear script de base de datos escolar con restricciones de integridad y tipos consistentes.', 'TALLER', '2026-09-25 23:59:00', 5.0, '/guias/lab_ddl_tablas.sql'],

    // cur-07 (Marcela Torres - Soporte 10°)
    ['ev-11', 'cur-07', 'tema-12', 'Informe Técnico de Mantenimiento Preventivo de Hardware', 'Describir procedimiento de limpieza interna, cambio de pasta térmica y diagnóstico de memorias.', 'TALLER', '2026-09-19 23:59:00', 5.0, '/guias/formato_mantenimiento_preventivo.docx'],

    // cur-08 (Marcela Torres - Redes 11°)
    ['ev-12', 'cur-08', 'tema-13', 'Certificación de Ponchado de Cable UTP Cat 6 (T568B)', 'Entrega fotográfica y reporte de certificación de cables directo y cruzado con tester digital.', 'TALLER', '2026-09-14 23:59:00', 5.0, '/guias/manual_cableado_t568b.pdf'],
    ['ev-13', 'cur-08', 'tema-14', 'Simulación de Red LAN Interconectada en Cisco Packet Tracer', 'Archivo .pkt con 2 routers, 2 switches y direccionamiento VLSM funcional con ping comprobado.', 'PROYECTO', '2026-10-08 23:59:00', 5.0, '/guias/guia_packet_tracer_vlsm.pdf']
  ];
  evidenciasSeed.forEach(e => stmtEvidencias.run(...e));
  stmtEvidencias.finalize();

  // --- SEED ENTREGAS Y EVALUACIONES ---
  const stmtEntregas = db.prepare('INSERT INTO evidencia_entregas (id, evidencia_id, estudiante_id, archivo_url, enlace_externo, comentarios_estudiante, fecha_entrega, calificacion, comentario_instructor, fecha_evaluacion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const entregasSeed = [
    // Juan Camilo Rodríguez (est-01 - Ficha 2712345)
    ['ee-01', 'ev-01', 'est-01', '/uploads/evidencias/juan_taller_componentes.zip', 'https://github.com/juan/react-portal', 'Profesor, comparto el repositorio con los componentes implementados y estilos modulares.', '2026-09-12 14:30:00', 5.0, 'Excelente estructura de componentes, modularidad impecable y muy buena documentación en el README.', '2026-09-14 10:00:00', 'CALIFICADO'],
    ['ee-02', 'ev-02', 'est-01', '/uploads/evidencias/juan_lab_hooks.zip', 'https://github.com/juan/spa-react-hooks', 'Se implementó carrito de compras con persistencia local y validaciones.', '2026-09-28 16:15:00', 4.8, 'Gran trabajo en la optimización del renderizado y el manejo del hook useEffect.', '2026-09-29 08:30:00', 'CALIFICADO'],

    // Valentina Morales (est-04 - Ficha 2712345)
    ['ee-03', 'ev-01', 'est-04', '/uploads/evidencias/valentina_componentes.zip', 'https://github.com/valentina-dev/spa-colegio-tecnico', 'Adjunto taller con interfaz moderna y adaptable en dispositivos móviles.', '2026-09-13 11:00:00', 4.9, 'Diseño visual sobresaliente, paleta de colores armónica y componentes limpios.', '2026-09-15 09:15:00', 'CALIFICADO'],
    ['ee-04', 'ev-02', 'est-04', '/uploads/evidencias/valentina_hooks.zip', 'https://github.com/valentina/tienda-spa', 'Profesor, envío el laboratorio con useState y custom hook para conexión.', '2026-09-27 18:45:00', null, null, null, 'ENTREGADO'],

    // Santiago Castro (est-03 - Ficha 2912345 - Contaduría)
    ['ee-05', 'ev-05', 'est-03', '/uploads/evidencias/santiago_nomina_septiembre.xlsx', null, 'Profesora Laura, radico planilla de nómina con todas las fórmulas aplicadas.', '2026-09-16 10:20:00', 5.0, 'Conciliación matemática perfecta, liquidación rigurosa de horas extras y aportes de ley.', '2026-09-17 14:00:00', 'CALIFICADO'],
    ['ee-06', 'ev-06', 'est-03', '/uploads/evidencias/santiago_balance_prueba.pdf', null, 'Balance de prueba cuadrado al centavo con libro mayor adjunto.', '2026-09-26 15:30:00', null, null, null, 'ENTREGADO'],

    // Camila Andrea Rodríguez (est-06 - Ficha 2812345 - SQL)
    ['ee-07', 'ev-08', 'est-06', '/uploads/evidencias/camila_modelo_er_3fn.pdf', null, 'Profesor Ricardo, comparto diagrama entidad relación y diccionario de datos en 3FN.', '2026-09-14 09:40:00', 4.7, 'Normalización clara, relaciones bien tipadas y atributos descriptivos consistentes.', '2026-09-16 11:30:00', 'CALIFICADO'],
    ['ee-08', 'ev-09', 'est-06', '/uploads/evidencias/camila_consultas_complejas.sql', 'https://github.com/camila-sql/scripts-consultas-avanzadas', 'Script con 12 consultas analíticas usando JOINs, agrupamientos y subconsultas.', '2026-09-28 17:00:00', null, null, null, 'ENTREGADO'],

    // Andrés Felipe González (est-05 - Ficha 3012345 - Redes)
    ['ee-09', 'ev-11', 'est-05', '/uploads/evidencias/andres_informe_hardware.pdf', null, 'Profesora Marcela, radico informe de mantenimiento preventivo con fotos del procedimiento.', '2026-09-18 16:30:00', 5.0, 'Procedimiento técnico realizado con todas las normas de seguridad electrostática (ESD). Felicitaciones.', '2026-09-19 11:20:00', 'CALIFICADO'],

    // María Paula Gómez (est-02 - Ficha 2712346 / 2812346)
    ['ee-10', 'ev-04', 'est-02', '/uploads/evidencias/maria_algoritmos_pseint.psc', null, 'Profesor Carlos, solución de los 10 algoritmos de la guía con diagrama de flujo.', '2026-09-19 17:20:00', 4.8, 'Estructuras lógicas bien ordenadas y nombres de variables claros.', '2026-09-20 12:00:00', 'CALIFICADO']
  ];
  entregasSeed.forEach(ent => stmtEntregas.run(...ent));
  stmtEntregas.finalize();

  console.log('[MIGRATE] ✅ Migración y carga de semillas completada exitosamente.');
  db.close();
});
