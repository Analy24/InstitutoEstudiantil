// Repositorio de datos en memoria y semillas para Instituto Estudiantil
const bcrypt = require('bcryptjs');

// Hash predeterminado para "Password123!"
const defaultPasswordHash = bcrypt.hashSync('Password123!', 10);

const mockData = {
  // ---------------------------------------------------------------------------
  // 1. USUARIOS (Mínimo 4 por rol: ADMIN, INSTRUCTOR, ESTUDIANTE, EMPRESA)
  // ---------------------------------------------------------------------------
  usuarios: [
    // --- ADMINISTRADORES (4) ---
    {
      id: 'usr-admin-01',
      email: 'admi@estudiantil.edu.com',
      password_hash: defaultPasswordHash,
      rol: 'ADMIN',
      activo: true,
      nombre: 'Dra. Patricia Salamanca (Rectora General)',
      created_at: '2026-01-15T08:00:00Z'
    },
    {
      id: 'usr-admin-02',
      email: 'admin@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'ADMIN',
      activo: true,
      nombre: 'Lic. Mauricio Garzón (Coordinador Media Técnica)',
      created_at: '2026-01-15T08:00:00Z'
    },
    {
      id: 'usr-admin-03',
      email: 'practicas@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'ADMIN',
      activo: true,
      nombre: 'Ing. Andrés Felipe Osorio (Coordinador de Prácticas)',
      created_at: '2026-01-18T08:30:00Z'
    },
    {
      id: 'usr-admin-04',
      email: 'admisiones@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'ADMIN',
      activo: true,
      nombre: 'Lic. Claudia Marcela Vega (Coordinadora de Admisiones y Bienestar)',
      created_at: '2026-01-20T08:30:00Z'
    },

    // --- INSTRUCTORES (4) ---
    {
      id: 'usr-inst-01',
      email: 'carlos.perez@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'INSTRUCTOR',
      activo: true,
      nombre: 'Prof. Carlos Alberto Pérez Moreno',
      created_at: '2026-01-20T09:30:00Z'
    },
    {
      id: 'usr-inst-02',
      email: 'laura.restrepo@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'INSTRUCTOR',
      activo: true,
      nombre: 'Prof. Laura Sofía Restrepo Castro',
      created_at: '2026-01-22T09:30:00Z'
    },
    {
      id: 'usr-inst-03',
      email: 'ricardo.mendoza@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'INSTRUCTOR',
      activo: true,
      nombre: 'Prof. Ricardo José Mendoza Vargas',
      created_at: '2026-01-25T10:00:00Z'
    },
    {
      id: 'usr-inst-04',
      email: 'marcela.torres@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'INSTRUCTOR',
      activo: true,
      nombre: 'Prof. Marcela Viviana Torres Benítez',
      created_at: '2026-01-28T10:30:00Z'
    },

    // --- ESTUDIANTES (6 para cubrir todos los estados específicos) ---
    {
      id: 'usr-est-01',
      email: 'juan.rodriguez@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'ESTUDIANTE',
      activo: true,
      nombre: 'Juan Camilo Rodríguez Pérez',
      created_at: '2026-02-01T10:00:00Z'
    },
    {
      id: 'usr-est-02',
      email: 'maria.gomez@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'ESTUDIANTE',
      activo: true,
      nombre: 'María Paula Gómez Herrera',
      created_at: '2026-02-01T10:15:00Z'
    },
    {
      id: 'usr-est-03',
      email: 'santiago.castro@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'ESTUDIANTE',
      activo: true,
      nombre: 'Santiago Castro Ruiz',
      created_at: '2026-02-05T11:00:00Z'
    },
    {
      id: 'usr-est-04',
      email: 'valentina.morales@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'ESTUDIANTE',
      activo: true,
      nombre: 'Valentina Morales Duque',
      created_at: '2026-02-08T11:30:00Z'
    },
    {
      id: 'usr-est-05',
      email: 'andres.gonzalez@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'ESTUDIANTE',
      activo: true,
      nombre: 'Andrés Felipe González Mora',
      created_at: '2026-02-10T12:00:00Z'
    },
    {
      id: 'usr-est-06',
      email: 'camila.rodriguez@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'ESTUDIANTE',
      activo: true,
      nombre: 'Camila Andrea Rodríguez Silva',
      created_at: '2026-02-12T14:00:00Z'
    },

    // --- EMPRESAS (4) ---
    {
      id: 'usr-emp-01',
      email: 'talento@innovatech.com',
      password_hash: defaultPasswordHash,
      rol: 'EMPRESA',
      activo: true,
      nombre: 'Innovatech Soluciones S.A.S.',
      created_at: '2026-02-10T14:00:00Z'
    },
    {
      id: 'usr-emp-02',
      email: 'rrhh@bancofinanciero.com',
      password_hash: defaultPasswordHash,
      rol: 'EMPRESA',
      activo: true,
      nombre: 'Servicios Financieros & Contables S.A.',
      created_at: '2026-02-15T14:00:00Z'
    },
    {
      id: 'usr-emp-03',
      email: 'contacto@datacore.com.co',
      password_hash: defaultPasswordHash,
      rol: 'EMPRESA',
      activo: true,
      nombre: 'DataCore Analytics & Cloud S.A.S.',
      created_at: '2026-02-18T15:00:00Z'
    },
    {
      id: 'usr-emp-04',
      email: 'talento@logisticaltda.com',
      password_hash: defaultPasswordHash,
      rol: 'EMPRESA',
      activo: true,
      nombre: 'Alianza Logística & Operaciones S.A.',
      created_at: '2026-02-20T16:00:00Z'
    }
  ],

  // ---------------------------------------------------------------------------
  // 2. COLEGIO / INSTITUCIÓN EDUCATIVA
  // ---------------------------------------------------------------------------
  colegios: [
    {
      id: 'col-01',
      codigo_dane: '111001099881',
      nombre: 'Instituto Estudiantil',
      direccion: 'Carrera 15 # 85-30',
      municipio: 'Bogotá D.C.',
      departamento: 'Cundinamarca',
      telefono: '(601) 7458900',
      rector_nombre: 'Dra. Patricia Salamanca',
      coordinador_media: 'Lic. Mauricio Garzón',
      email_institucional: 'contacto@estudiantil.edu.co'
    }
  ],

  // ---------------------------------------------------------------------------
  // 3. INSTRUCTORES TÉCNICOS
  // ---------------------------------------------------------------------------
  instructores: [
    {
      id: 'inst-01',
      usuario_id: 'usr-inst-01',
      tipo_documento: 'CC',
      numero_documento: '80123456',
      nombres: 'Carlos Alberto',
      apellidos: 'Pérez Moreno',
      email: 'carlos.perez@estudiantil.edu.co',
      telefono: '3157894561',
      centro_formacion: 'Instituto Estudiantil - Sede Principal',
      especialidad: 'Desarrollo de Software y Frontend Web Moderno',
      programas: ['Aprendiz Desarrollador Web Junior'],
      fichas_asignadas: ['2712345', '2712346'],
      estado: 'ACTIVO'
    },
    {
      id: 'inst-02',
      usuario_id: 'usr-inst-02',
      tipo_documento: 'CC',
      numero_documento: '52876543',
      nombres: 'Laura Sofía',
      apellidos: 'Restrepo Castro',
      email: 'laura.restrepo@estudiantil.edu.co',
      telefono: '3104567890',
      centro_formacion: 'Instituto Estudiantil - Sede Principal',
      especialidad: 'Contabilidad y Finanzas Comerciales',
      programas: ['Auxiliar en Contaduría Pública'],
      fichas_asignadas: ['2912345', '2912346'],
      estado: 'ACTIVO'
    },
    {
      id: 'inst-03',
      usuario_id: 'usr-inst-03',
      tipo_documento: 'CC',
      numero_documento: '79654123',
      nombres: 'Ricardo José',
      apellidos: 'Mendoza Vargas',
      email: 'ricardo.mendoza@estudiantil.edu.co',
      telefono: '3128901234',
      centro_formacion: 'Instituto Estudiantil - Sede Principal',
      especialidad: 'Bases de Datos Relacionales y SQL Avanzado',
      programas: ['Auxiliar de Bases de Datos y Soporte TI'],
      fichas_asignadas: ['2812345', '2812346'],
      estado: 'ACTIVO'
    },
    {
      id: 'inst-04',
      usuario_id: 'usr-inst-04',
      tipo_documento: 'CC',
      numero_documento: '53112233',
      nombres: 'Marcela Viviana',
      apellidos: 'Torres Benítez',
      email: 'marcela.torres@estudiantil.edu.co',
      telefono: '3187766554',
      centro_formacion: 'Instituto Estudiantil - Sede Principal',
      especialidad: 'Infraestructura de Redes, Mantenimiento y Soporte TI',
      programas: ['Técnico en Redes y Soporte de Infraestructura TI'],
      fichas_asignadas: ['3012345', '3012346'],
      estado: 'ACTIVO'
    }
  ],

  // ---------------------------------------------------------------------------
  // 4. PROGRAMAS TÉCNICOS OFICIALES
  // ---------------------------------------------------------------------------
  programas_oficiales: [
    'Aprendiz Desarrollador Web Junior',
    'Auxiliar de Bases de Datos y Soporte TI',
    'Auxiliar en Contaduría Pública',
    'Técnico en Redes y Soporte de Infraestructura TI'
  ],

  // ---------------------------------------------------------------------------
  // 5. ESTUDIANTES (Con grados 10° y 11° y los diversos estados solicitados)
  // ---------------------------------------------------------------------------
  estudiantes: [
    // 1. Juan Camilo: Grado 11° - CONTRATO ESTUDIANTIL FIRMADO CON EMPRESA (Innovatech)
    {
      id: 'est-01',
      usuario_id: 'usr-est-01',
      colegio_id: 'col-01',
      colegio_nombre: 'Instituto Estudiantil',
      tipo_documento: 'TI',
      numero_documento: '1023456789',
      nombres: 'Juan Camilo',
      apellidos: 'Rodríguez Pérez',
      email: 'juan.rodriguez@estudiantil.edu.co',
      grado: 11,
      ficha_sena: '2712345',
      programa_formacion: 'Aprendiz Desarrollador Web Junior',
      jornada: 'Mañana',
      telefono: '3109876543',
      resumen_perfil: 'Estudiante de Grado 11° con contrato de aprendizaje activo en Innovatech Soluciones. Culminó satisfactoriamente todas las fases lectivas y desarrolla componentes Frontend en React y APIs.',
      hoja_vida_url: '/uploads/hv_juan_rodriguez.pdf',
      foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      estado_estudiante: 'CONTRATADO_EMPRESA',
      empresa_contratante: 'Innovatech Soluciones S.A.S.',
      documentos: [
        { id: 'doc-1', nombre: 'Documento de Identidad (TI)', tipo: 'IDENTIDAD', url: '/uploads/ti_juan.pdf', estado: 'VERIFICADO', fecha: '2026-02-01' },
        { id: 'doc-2', nombre: 'Certificado de Afiliación EPS', tipo: 'EPS', url: '/uploads/eps_juan.pdf', estado: 'VERIFICADO', fecha: '2026-02-01' },
        { id: 'doc-3', nombre: 'Hoja de Vida en Formato PDF', tipo: 'HOJA_VIDA', url: '/uploads/hv_juan_rodriguez.pdf', estado: 'VERIFICADO', fecha: '2026-02-15' },
        { id: 'doc-4', nombre: 'Contrato de Aprendizaje Firmado', tipo: 'CONTRATO', url: '/uploads/contrato_innovatech.pdf', estado: 'VERIFICADO', fecha: '2026-03-01' }
      ]
    },

    // 2. Valentina Morales: Grado 11° - LISTA PARA SALIR A PRÁCTICA (≥ 70% Aprobado)
    {
      id: 'est-04',
      usuario_id: 'usr-est-04',
      colegio_id: 'col-01',
      colegio_nombre: 'Instituto Estudiantil',
      tipo_documento: 'TI',
      numero_documento: '1056789012',
      nombres: 'Valentina',
      apellidos: 'Morales Duque',
      email: 'valentina.morales@estudiantil.edu.co',
      grado: 11,
      ficha_sena: '2712345',
      programa_formacion: 'Aprendiz Desarrollador Web Junior',
      jornada: 'Mañana',
      telefono: '3165544332',
      resumen_perfil: 'Estudiante destacada de Grado 11° con 85% de avance formativo. Aprobó con honores las fases de Análisis, Diseño y Desarrollo Frontend. Lista y habilitada para vincularse a etapa práctica.',
      hoja_vida_url: '/uploads/hv_valentina_morales.pdf',
      foto_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      estado_estudiante: 'LISTO_PRACTICA',
      documentos: [
        { id: 'doc-10', nombre: 'Documento de Identidad (TI)', tipo: 'IDENTIDAD', url: '/uploads/ti_valentina.pdf', estado: 'VERIFICADO', fecha: '2026-02-08' },
        { id: 'doc-11', nombre: 'Certificado EPS', tipo: 'EPS', url: '/uploads/eps_valentina.pdf', estado: 'VERIFICADO', fecha: '2026-02-08' },
        { id: 'doc-12', nombre: 'Hoja de Vida Oficial PDF', tipo: 'HOJA_VIDA', url: '/uploads/hv_valentina_morales.pdf', estado: 'VERIFICADO', fecha: '2026-02-20' }
      ]
    },

    // 3. Santiago Castro: Grado 11° - YA POSTULADO A EMPRESA (Servicios Financieros)
    {
      id: 'est-03',
      usuario_id: 'usr-est-03',
      colegio_id: 'col-01',
      colegio_nombre: 'Instituto Estudiantil',
      tipo_documento: 'TI',
      numero_documento: '1045678901',
      nombres: 'Santiago',
      apellidos: 'Castro Ruiz',
      email: 'santiago.castro@estudiantil.edu.co',
      grado: 11,
      ficha_sena: '2912345',
      programa_formacion: 'Auxiliar en Contaduría Pública',
      jornada: 'Mañana',
      telefono: '3189012345',
      resumen_perfil: 'Estudiante de Grado 11° actualmente en proceso de selección en Servicios Financieros & Contables S.A. Con experiencia en conciliación bancaria, software contable y liquidación.',
      hoja_vida_url: '/uploads/hv_santiago_castro.pdf',
      foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      estado_estudiante: 'POSTULADO_EMPRESA',
      empresa_postulada: 'Servicios Financieros & Contables S.A.',
      documentos: [
        { id: 'doc-8', nombre: 'Documento de Identidad (TI)', tipo: 'IDENTIDAD', url: '/uploads/ti_santiago.pdf', estado: 'VERIFICADO', fecha: '2026-02-05' },
        { id: 'doc-9', nombre: 'Hoja de Vida en Formato PDF', tipo: 'HOJA_VIDA', url: '/uploads/hv_santiago_castro.pdf', estado: 'VERIFICADO', fecha: '2026-02-05' }
      ]
    },

    // 4. María Paula Gómez: Grado 10° - EN FORMACIÓN / POR EVALUAR
    {
      id: 'est-02',
      usuario_id: 'usr-est-02',
      colegio_id: 'col-01',
      colegio_nombre: 'Instituto Estudiantil',
      tipo_documento: 'TI',
      numero_documento: '1034567890',
      nombres: 'María Paula',
      apellidos: 'Gómez Herrera',
      email: 'maria.gomez@estudiantil.edu.co',
      grado: 10,
      ficha_sena: '2812346',
      programa_formacion: 'Auxiliar de Bases de Datos y Soporte TI',
      jornada: 'Tarde',
      telefono: '3123456789',
      resumen_perfil: 'Estudiante de Grado 10° en ciclo básico técnico. Cursando algoritmos y diseño de bases de datos. Ha subido sus tareas prácticas y tiene evaluaciones en curso.',
      hoja_vida_url: '/uploads/hv_maria_gomez.pdf',
      foto_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      estado_estudiante: 'POR_EVALUAR',
      documentos: [
        { id: 'doc-5', nombre: 'Documento de Identidad (TI)', tipo: 'IDENTIDAD', url: '/uploads/ti_maria.pdf', estado: 'VERIFICADO', fecha: '2026-02-01' },
        { id: 'doc-6', nombre: 'Certificado EPS', tipo: 'EPS', url: '/uploads/eps_maria.pdf', estado: 'VERIFICADO', fecha: '2026-02-01' },
        { id: 'doc-7', nombre: 'Hoja de Vida en Formato PDF', tipo: 'HOJA_VIDA', url: '/uploads/hv_maria_gomez.pdf', estado: 'VERIFICADO', fecha: '2026-02-10' }
      ]
    },

    // 5. Andrés Felipe González: Grado 10° - FASE TERMINADA POR PROGRAMA (Inducción y Diagnóstico al 100%)
    {
      id: 'est-05',
      usuario_id: 'usr-est-05',
      colegio_id: 'col-01',
      colegio_nombre: 'Instituto Estudiantil',
      tipo_documento: 'TI',
      numero_documento: '1067890123',
      nombres: 'Andrés Felipe',
      apellidos: 'González Mora',
      email: 'andres.gonzalez@estudiantil.edu.co',
      grado: 10,
      ficha_sena: '3012345',
      programa_formacion: 'Técnico en Redes y Soporte de Infraestructura TI',
      jornada: 'Mañana',
      telefono: '3112233998',
      resumen_perfil: 'Estudiante de Grado 10° con la Fase de Análisis y Diagnóstico aprobada al 100%. Especializado en ensamble, diagnóstico de hardware y cableado estructurado.',
      hoja_vida_url: '/uploads/hv_andres_gonzalez.pdf',
      foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      estado_estudiante: 'FASE_TERMINADA',
      fase_actual: 'Fase de Análisis Aprobada (Iniciando Planeación)',
      documentos: [
        { id: 'doc-13', nombre: 'Documento de Identidad (TI)', tipo: 'IDENTIDAD', url: '/uploads/ti_andres.pdf', estado: 'VERIFICADO', fecha: '2026-02-10' },
        { id: 'doc-14', nombre: 'Hoja de Vida', tipo: 'HOJA_VIDA', url: '/uploads/hv_andres_gonzalez.pdf', estado: 'VERIFICADO', fecha: '2026-02-15' }
      ]
    },

    // 6. Camila Andrea Rodríguez: Grado 11° - POR EVALUAR / TAREAS PENDIENTES DE REVISIÓN
    {
      id: 'est-06',
      usuario_id: 'usr-est-06',
      colegio_id: 'col-01',
      colegio_nombre: 'Instituto Estudiantil',
      tipo_documento: 'TI',
      numero_documento: '1078901234',
      nombres: 'Camila Andrea',
      apellidos: 'Rodríguez Silva',
      email: 'camila.rodriguez@estudiantil.edu.co',
      grado: 11,
      ficha_sena: '2812345',
      programa_formacion: 'Auxiliar de Bases de Datos y Soporte TI',
      jornada: 'Tarde',
      telefono: '3158877665',
      resumen_perfil: 'Estudiante de Grado 11° en proceso de sustentar su proyecto de gestión de bases de datos. Entregó las evidencias prácticas y está pendiente de retroalimentación final.',
      hoja_vida_url: '/uploads/hv_camila_rodriguez.pdf',
      foto_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      estado_estudiante: 'POR_EVALUAR',
      documentos: [
        { id: 'doc-15', nombre: 'Documento de Identidad (TI)', tipo: 'IDENTIDAD', url: '/uploads/ti_camila.pdf', estado: 'VERIFICADO', fecha: '2026-02-12' },
        { id: 'doc-16', nombre: 'Hoja de Vida en Formato PDF', tipo: 'HOJA_VIDA', url: '/uploads/hv_camila_rodriguez.pdf', estado: 'VERIFICADO', fecha: '2026-02-15' }
      ]
    }
  ],

  // ---------------------------------------------------------------------------
  // 6. CURSOS (Definidos por materia, programa técnico y grado para cada instructor)
  // ---------------------------------------------------------------------------
  cursos: [
    // Instructor 1: Carlos Pérez (Desarrollo Web)
    {
      id: 'cur-01',
      nombre: 'Desarrollo Frontend y Aplicaciones Web Modernas (React / JavaScript)',
      materia: 'Programación Web y Frontend',
      modulo: 'Módulo II: Desarrollo Frontend y Aplicaciones Web Modernas (Grado 11°)',
      descripcion: 'Construcción de interfaces de usuario interactivas con React, componentes modulares, gestión de estado y consumo de APIs RESTful.',
      instructor_id: 'inst-01',
      programa_formacion: 'Aprendiz Desarrollador Web Junior',
      grado: 11,
      ficha: '2712345',
      estado: 'PUBLICO'
    },
    {
      id: 'cur-02',
      nombre: 'Fundamentos de Algoritmia y Lógica de Programación',
      materia: 'Introducción al Desarrollo de Software',
      modulo: 'Módulo I: Algoritmos y Lógica de Programación (Grado 10°)',
      descripcion: 'Bases computacionales, estructuras condicionales, ciclos, pseudocódigo y diagramación lógica estructurada.',
      instructor_id: 'inst-01',
      programa_formacion: 'Aprendiz Desarrollador Web Junior',
      grado: 10,
      ficha: '2712346',
      estado: 'PUBLICO'
    },

    // Instructor 2: Laura Restrepo (Contaduría Pública)
    {
      id: 'cur-03',
      nombre: 'Contabilización de Operaciones Comerciales y Nómina',
      materia: 'Contabilidad Financiera y Liquidación',
      modulo: 'Módulo II: Contabilización, Nómina y Conciliaciones (Grado 11°)',
      descripcion: 'Manejo de libros comerciales, conciliación bancaria, balance de prueba, aportes parafiscales y liquidación de nómina.',
      instructor_id: 'inst-02',
      programa_formacion: 'Auxiliar en Contaduría Pública',
      grado: 11,
      ficha: '2912345',
      estado: 'PUBLICO'
    },
    {
      id: 'cur-04',
      nombre: 'Principios Contables y Documentación Mercantil',
      materia: 'Contabilidad Básica Escolar',
      modulo: 'Módulo I: Soportes Contables y Facturación Escolar (Grado 10°)',
      descripcion: 'Estructura de soportes contables, factura electrónica, comprobantes de egreso, ingresos y causación.',
      instructor_id: 'inst-02',
      programa_formacion: 'Auxiliar en Contaduría Pública',
      grado: 10,
      ficha: '2912346',
      estado: 'PUBLICO'
    },

    // Instructor 3: Ricardo Mendoza (Bases de Datos & SQL)
    {
      id: 'cur-05',
      nombre: 'Modelado y Gestión Avanzada de Bases de Datos Relacionales (SQL)',
      materia: 'Bases de Datos Relacionales y SQL',
      modulo: 'Módulo II: Modelado Relacional y Gestión Avanzada SQL (Grado 11°)',
      descripcion: 'Normalización de bases de datos relacionales en 3FN, sentencias DDL y DML complejas, índices y procedimientos.',
      instructor_id: 'inst-03',
      programa_formacion: 'Auxiliar de Bases de Datos y Soporte TI',
      grado: 11,
      ficha: '2812345',
      estado: 'PUBLICO'
    },
    {
      id: 'cur-06',
      nombre: 'Estructuración de Datos y Consultas Básicas',
      materia: 'Introducción a Bases de Datos',
      modulo: 'Módulo I: Estructuración y Consultas de Datos Básicas (Grado 10°)',
      descripcion: 'Tablas, tipos de datos, relaciones de cardinalidad y consultas de extracción de datos con SELECT y WHERE.',
      instructor_id: 'inst-03',
      programa_formacion: 'Auxiliar de Bases de Datos y Soporte TI',
      grado: 10,
      ficha: '2812346',
      estado: 'PUBLICO'
    },

    // Instructor 4: Marcela Torres (Redes & Soporte TI)
    {
      id: 'cur-07',
      nombre: 'Mantenimiento Preventivo y Soporte a Hardware / Software',
      materia: 'Soporte Técnico e Infraestructura',
      modulo: 'Módulo I: Mantenimiento Preventivo y Soporte a Hardware (Grado 10°)',
      descripcion: 'Diagnóstico de periféricos, mantenimiento preventivo de componentes de cómputo, instalación de sistemas operativos.',
      instructor_id: 'inst-04',
      programa_formacion: 'Técnico en Redes y Soporte de Infraestructura TI',
      grado: 10,
      ficha: '3012345',
      estado: 'PUBLICO'
    },
    {
      id: 'cur-08',
      nombre: 'Configuración de Redes LAN y Servicios Telemáticos',
      materia: 'Redes de Computadores',
      modulo: 'Módulo II: Configuración de Redes LAN y Servicios Telemáticos (Grado 11°)',
      descripcion: 'Cableado estructurado norma T568A/B, configuración de routers y switches, direccionamiento IPv4 y protocolos de red.',
      instructor_id: 'inst-04',
      programa_formacion: 'Técnico en Redes y Soporte de Infraestructura TI',
      grado: 11,
      ficha: '3012346',
      estado: 'PUBLICO'
    }
  ],

  // ---------------------------------------------------------------------------
  // 7. MATRÍCULAS (Asignación de estudiantes a cursos)
  // ---------------------------------------------------------------------------
  matriculas: [
    // Curso 1: Grado 11° - Desarrollo Frontend (Juan Camilo y Valentina Morales)
    { id: 'mat-01', curso_id: 'cur-01', estudiante_id: 'est-01' },
    { id: 'mat-02', curso_id: 'cur-01', estudiante_id: 'est-04' },

    // Curso 2: Grado 10° - Algoritmia (María Paula y Andrés Felipe)
    { id: 'mat-03', curso_id: 'cur-02', estudiante_id: 'est-02' },
    { id: 'mat-04', curso_id: 'cur-02', estudiante_id: 'est-05' },

    // Curso 3: Grado 11° - Contabilidad Avanzada (Santiago Castro)
    { id: 'mat-05', curso_id: 'cur-03', estudiante_id: 'est-03' },

    // Curso 4: Grado 10° - Contabilidad Básica (María Paula Gómez)
    { id: 'mat-10', curso_id: 'cur-04', estudiante_id: 'est-02' },

    // Curso 5: Grado 11° - Bases de Datos Avanzada (Camila Rodríguez y Juan Camilo)
    { id: 'mat-06', curso_id: 'cur-05', estudiante_id: 'est-06' },
    { id: 'mat-07', curso_id: 'cur-05', estudiante_id: 'est-01' },

    // Curso 6: Grado 10° - Bases de Datos Básica (María Paula Gómez)
    { id: 'mat-08', curso_id: 'cur-06', estudiante_id: 'est-02' },

    // Curso 7: Grado 10° - Soporte y Mantenimiento (Andrés Felipe González)
    { id: 'mat-09', curso_id: 'cur-07', estudiante_id: 'est-05' },

    // Curso 8: Grado 11° - Redes LAN (Camila Rodríguez y Valentina Morales)
    { id: 'mat-11', curso_id: 'cur-08', estudiante_id: 'est-06' },
    { id: 'mat-12', curso_id: 'cur-08', estudiante_id: 'est-04' }
  ],

  // ---------------------------------------------------------------------------
  // 8. TAREAS (Evaluadas y Por Evaluar)
  // ---------------------------------------------------------------------------
  tareas: [
    // Tarea 1 (Curso Frontend): Tiene entrega EVALUADA (Juan Camilo) y POR EVALUAR (Valentina)
    {
      id: 'tar-01',
      curso_id: 'cur-01',
      titulo: 'Construcción de Interfaz Responsiva y SPA con React.js',
      descripcion: 'Crear una aplicación web interactiva que consuma una API REST, aplicando componentes funcionales, hooks (useState, useEffect) y diseño adaptable.',
      fecha_limite: '2026-10-15T23:59:00Z',
      fecha_creacion: '2026-09-01T08:00:00Z'
    },
    // Tarea 2 (Curso Frontend): Tarea nueva asignada abierta
    {
      id: 'tar-02',
      curso_id: 'cur-01',
      titulo: 'Integración de Formularios y Validación con Expresiones Regulares',
      descripcion: 'Implementar validación en tiempo real en campos de registro y autenticación para el portal estudiantil.',
      fecha_limite: '2026-10-30T23:59:00Z',
      fecha_creacion: '2026-09-10T08:00:00Z'
    },

    // Tarea 3 (Curso Bases de Datos - SQL Grado 10°): Tiene entrega EVALUADA (María Paula)
    {
      id: 'tar-03',
      curso_id: 'cur-06',
      titulo: 'Diagrama Entidad-Relación y Normalización 3FN de Sistema Escolar',
      descripcion: 'Entregar modelo relacional con claves primarias y foráneas documentadas, incluyendo diccionario de datos y script SQL DDL.',
      fecha_limite: '2026-10-05T23:59:00Z',
      fecha_creacion: '2026-09-02T08:00:00Z'
    },

    // Tarea 4 (Curso Bases de Datos Avanzada Grado 11°): Tiene entrega POR EVALUAR (Camila Rodríguez)
    {
      id: 'tar-04',
      curso_id: 'cur-05',
      titulo: 'Consultas SQL Avanzadas con JOINs Múltiples y Vistas',
      descripcion: 'Escribir consultas analíticas para reportes de matrícula y asistencia técnica con agrupamientos GROUP BY y subconsultas.',
      fecha_limite: '2026-10-18T23:59:00Z',
      fecha_creacion: '2026-09-05T08:00:00Z'
    },

    // Tarea 5 (Curso Contabilidad Grado 11°): Tiene entrega EVALUADA (Santiago Castro)
    {
      id: 'tar-05',
      curso_id: 'cur-03',
      titulo: 'Elaboración de Comprobantes de Diario y Balance de Comprobación',
      descripcion: 'Registrar asientos de compras, ventas y conciliación bancaria mensual con liquidación de retenciones en la fuente.',
      fecha_limite: '2026-09-28T23:59:00Z',
      fecha_creacion: '2026-09-01T08:00:00Z'
    },

    // Tarea 6 (Curso Redes y Soporte Grado 10°): Tiene entrega POR EVALUAR (Andrés González)
    {
      id: 'tar-06',
      curso_id: 'cur-07',
      titulo: 'Informe Técnico de Mantenimiento y Diagnóstico Preventivo',
      descripcion: 'Presentar protocolo fotográfico de inspección de hardware, limpieza térmica y verificación de voltajes en fuente de poder.',
      fecha_limite: '2026-10-20T23:59:00Z',
      fecha_creacion: '2026-09-08T08:00:00Z'
    },

    // Tarea 7 (Curso Algoritmia Grado 10°): Tiene entrega EVALUADA (Andrés González)
    {
      id: 'tar-07',
      curso_id: 'cur-02',
      titulo: 'Diseño de Algoritmos con Diagramas de Flujo y Pseudocódigo en PSeInt',
      descripcion: 'Elaborar la solución a 5 problemas lógicos utilizando estructuras condicionales si-entonces y ciclos mientras/para con pruebas de escritorio.',
      fecha_limite: '2026-10-25T23:59:00Z',
      fecha_creacion: '2026-09-05T08:00:00Z'
    },

    // Tarea 8 (Curso Contabilidad Básica Grado 10°): Tiene entrega POR EVALUAR (María Paula)
    {
      id: 'tar-08',
      curso_id: 'cur-04',
      titulo: 'Clasificación de Cuentas PUC y Registro de Asientos Simples',
      descripcion: 'Identificar la naturaleza de cuentas de activo, pasivo, patrimonio e ingresos en transacciones comerciales comerciales básicas.',
      fecha_limite: '2026-11-05T23:59:00Z',
      fecha_creacion: '2026-09-09T08:00:00Z'
    },

    // Tarea 9 (Curso Redes LAN Grado 11°): Tiene entrega EVALUADA (Camila Rodríguez)
    {
      id: 'tar-09',
      curso_id: 'cur-08',
      titulo: 'Ponchado de Cable UTP Norma T568B y Configuración de Subred IPv4',
      descripcion: 'Presentar reporte técnico con evidencia fotográfica de cableado estructurado norma T568B y testeo de conectividad por terminal de comandos.',
      fecha_limite: '2026-10-12T23:59:00Z',
      fecha_creacion: '2026-09-04T08:00:00Z'
    }
  ],

  // ---------------------------------------------------------------------------
  // 9. ENTREGAS DE TAREAS (Algunas calificadas/evaluadas y otras por evaluar)
  // ---------------------------------------------------------------------------
  entregas_tareas: [
    // 1. EVALUADA: Juan Camilo en Tarea 1 (Nota 4.8)
    {
      id: 'ent-01',
      tarea_id: 'tar-01',
      estudiante_id: 'est-01',
      archivo_url: 'https://github.com/juan-rodriguez/react-portal-estudiantil',
      fecha_entrega: '2026-09-12T16:30:00Z',
      calificacion: 4.8,
      observaciones: 'Excelente estructuración de componentes en React, código limpio, responsive y consumo de API impecable.'
    },

    // 2. POR EVALUAR: Valentina Morales en Tarea 1 (Pendiente de calificar)
    {
      id: 'ent-02',
      tarea_id: 'tar-01',
      estudiante_id: 'est-04',
      archivo_url: 'https://github.com/valentina-dev/spa-colegio-tecnico',
      fecha_entrega: '2026-09-14T11:20:00Z',
      calificacion: null,
      observaciones: 'Entrega radicada en espera de sustentación oral y revisión técnica del docente.'
    },

    // 3. EVALUADA: María Paula Gómez en Tarea 3 (Nota 4.5)
    {
      id: 'ent-03',
      tarea_id: 'tar-03',
      estudiante_id: 'est-02',
      archivo_url: 'https://drive.google.com/evidencias/maria-db-normalizacion.pdf',
      fecha_entrega: '2026-09-10T14:15:00Z',
      calificacion: 4.5,
      observaciones: 'Buen modelo entidad-relación, tablas normalizadas en 3FN con claves foráneas consistentes.'
    },

    // 4. POR EVALUAR: Camila Rodríguez en Tarea 4 (Pendiente de calificar)
    {
      id: 'ent-04',
      tarea_id: 'tar-04',
      estudiante_id: 'est-06',
      archivo_url: 'https://github.com/camila-sql/scripts-consultas-avanzadas',
      fecha_entrega: '2026-09-15T09:45:00Z',
      calificacion: null,
      observaciones: 'Consultas SQL entregadas por la estudiante, pendientes de validación en motor de base de datos.'
    },

    // 5. EVALUADA: Santiago Castro en Tarea 5 (Nota 5.0)
    {
      id: 'ent-05',
      tarea_id: 'tar-05',
      estudiante_id: 'est-03',
      archivo_url: 'https://drive.google.com/santiago-contable/balance-comprobacion.xlsx',
      fecha_entrega: '2026-09-11T17:00:00Z',
      calificacion: 5.0,
      observaciones: 'Libros contables presentados con total precisión, balance cuadrado al centavo y causación correcta.'
    },

    // 6. POR EVALUAR: Andrés Felipe González en Tarea 6 (Pendiente de calificar)
    {
      id: 'ent-06',
      tarea_id: 'tar-06',
      estudiante_id: 'est-05',
      archivo_url: 'https://drive.google.com/andres-redes/diagnostico-preventivo.pdf',
      fecha_entrega: '2026-09-16T10:30:00Z',
      calificacion: null,
      observaciones: 'Informe de diagnóstico de hardware en revisión por la profesora Marcela Torres.'
    },

    // 7. EVALUADA: Andrés Felipe González en Tarea 7 (Nota 4.7)
    {
      id: 'ent-07',
      tarea_id: 'tar-07',
      estudiante_id: 'est-05',
      archivo_url: 'https://github.com/andres-redes/algoritmos-pseint',
      fecha_entrega: '2026-09-11T14:00:00Z',
      calificacion: 4.7,
      observaciones: 'Excelente estructuración de pseudocódigo en PSeInt y pruebas de escritorio exhaustivas.'
    },

    // 8. POR EVALUAR: María Paula Gómez en Tarea 8 (Pendiente de calificar)
    {
      id: 'ent-08',
      tarea_id: 'tar-08',
      estudiante_id: 'est-02',
      archivo_url: 'https://drive.google.com/evidencias/maria-puc-asientos.pdf',
      fecha_entrega: '2026-09-14T15:10:00Z',
      calificacion: null,
      observaciones: 'Radicada en espera de revisión de asientos contables por la docente Laura Restrepo.'
    },

    // 9. EVALUADA: Camila Rodríguez en Tarea 9 (Nota 4.9)
    {
      id: 'ent-09',
      tarea_id: 'tar-09',
      estudiante_id: 'est-06',
      archivo_url: 'https://drive.google.com/evidencias/camila-cableado-ipv4.pdf',
      fecha_entrega: '2026-09-13T09:20:00Z',
      calificacion: 4.9,
      observaciones: 'Ponchado según norma T568B impecable y máscara de subred configurada con precisión.'
    }
  ],

  // ---------------------------------------------------------------------------
  // 10. EMPRESAS (4 Empresas Aliadas con vacantes)
  // ---------------------------------------------------------------------------
  empresas: [
    {
      id: 'emp-01',
      usuario_id: 'usr-emp-01',
      nit: '901234567-8',
      razon_social: 'Innovatech Soluciones S.A.S.',
      email: 'talento@innovatech.com',
      sector_economico: 'Tecnología y Desarrollo de Software',
      direccion: 'Carrera 7 # 72-10 Oficina 504',
      ciudad: 'Bogotá D.C.',
      contacto_nombre: 'Ing. Carolina Duarte',
      contacto_cargo: 'Directora de Talento Humano',
      contacto_telefono: '3187654321',
      sitio_web: 'https://innovatech.com.co',
      verificada: true,
      estado_alianza: 'APROBADA'
    },
    {
      id: 'emp-02',
      usuario_id: 'usr-emp-02',
      nit: '900987654-2',
      razon_social: 'Servicios Financieros & Contables S.A.',
      email: 'rrhh@bancofinanciero.com',
      sector_economico: 'Servicios Financieros y Contabilidad',
      direccion: 'Calle 100 # 19-61 Piso 8',
      ciudad: 'Bogotá D.C.',
      contacto_nombre: 'Dr. Fernando Arango',
      contacto_cargo: 'Gerente de Recursos Humanos',
      contacto_telefono: '3112233445',
      sitio_web: 'https://serviciosfinancieros.com',
      verificada: true,
      estado_alianza: 'APROBADA'
    },
    {
      id: 'emp-03',
      usuario_id: 'usr-emp-03',
      nit: '901556677-3',
      razon_social: 'DataCore Analytics & Cloud S.A.S.',
      email: 'contacto@datacore.com.co',
      sector_economico: 'Inteligencia de Datos y Computación Cloud',
      direccion: 'Calle 93B # 13-45 Oficina 301',
      ciudad: 'Bogotá D.C.',
      contacto_nombre: 'Dra. Diana Marcela Morales',
      contacto_cargo: 'Líder de Selección y Alianzas',
      contacto_telefono: '3209871234',
      sitio_web: 'https://datacore.com.co',
      verificada: true,
      estado_alianza: 'APROBADA'
    },
    {
      id: 'emp-04',
      usuario_id: 'usr-emp-04',
      nit: '901889900-1',
      razon_social: 'Alianza Logística & Operaciones S.A.',
      email: 'talento@logisticaltda.com',
      sector_economico: 'Logística, Cadenas de Suministro y TI',
      direccion: 'Avenida El Dorado # 68C-61',
      ciudad: 'Bogotá D.C.',
      contacto_nombre: 'Lic. Javier Enrique Méndez',
      contacto_cargo: 'Director de Operaciones y Selección',
      contacto_telefono: '3149988776',
      sitio_web: 'https://alianzalogistica.com.co',
      verificada: true,
      estado_alianza: 'APROBADA'
    }
  ],

  // ---------------------------------------------------------------------------
  // 11. VACANTES PUBLICADAS POR CADA EMPRESA (Disponibles en el módulo empresa)
  // ---------------------------------------------------------------------------
  vacantes: [
    // Empresa 1: Innovatech
    {
      id: 'vac-01',
      empresa_id: 'emp-01',
      empresa_nombre: 'Innovatech Soluciones S.A.S.',
      empresa_ciudad: 'Bogotá D.C.',
      titulo: 'Aprendiz Desarrollador Web Junior (Etapa Práctica)',
      descripcion: 'Buscamos aprendiz del Instituto Estudiantil del programa Técnico en Desarrollo Web para integrarse al equipo Frontend en React, JavaScript y consumo de servicios REST.',
      requisitos: 'Competencias técnicas aprobadas en desarrollo web. Manejo de HTML5, CSS3, React y control de versiones con Git.',
      modalidad: 'HÍBRIDO',
      ubicacion: 'Bogotá D.C.',
      cupos_disponibles: 2,
      auxilio_sostenimiento: 1423500,
      fecha_limite: '2026-11-30',
      estado: 'ABIERTA',
      competencias_requeridas: ['220501092', '220501094', '220501095']
    },
    {
      id: 'vac-02',
      empresa_id: 'emp-01',
      empresa_nombre: 'Innovatech Soluciones S.A.S.',
      empresa_ciudad: 'Bogotá D.C.',
      titulo: 'Auxiliar de Bases de Datos y Soporte TI',
      descripcion: 'Oportunidad de contrato de aprendizaje para administración de bases de datos relacionales, ejecución de consultas SQL y mantenimiento de servidores de desarrollo.',
      requisitos: 'Competencias aprobadas en modelado relacional y SQL. Manejo de Linux y soporte básico.',
      modalidad: 'PRESENCIAL',
      ubicacion: 'Bogotá D.C.',
      cupos_disponibles: 1,
      auxilio_sostenimiento: 1423500,
      fecha_limite: '2026-12-15',
      estado: 'ABIERTA',
      competencias_requeridas: ['220501096']
    },

    // Empresa 2: Servicios Financieros & Contables
    {
      id: 'vac-03',
      empresa_id: 'emp-02',
      empresa_nombre: 'Servicios Financieros & Contables S.A.',
      empresa_ciudad: 'Bogotá D.C.',
      titulo: 'Auxiliar Contable y Financiero de Práctica',
      descripcion: 'Buscamos estudiante de Grado 11° de Contaduría Pública para apoyo en causación contable, conciliaciones bancarias, archivo fiscal y nómina.',
      requisitos: 'Competencias en contabilidad básica, software comercial, Excel intermedio y atención al detalle.',
      modalidad: 'PRESENCIAL',
      ubicacion: 'Bogotá D.C.',
      cupos_disponibles: 2,
      auxilio_sostenimiento: 1500000,
      fecha_limite: '2026-12-20',
      estado: 'ABIERTA',
      competencias_requeridas: ['210301019']
    },
    {
      id: 'vac-04',
      empresa_id: 'emp-02',
      empresa_nombre: 'Servicios Financieros & Contables S.A.',
      empresa_ciudad: 'Bogotá D.C.',
      titulo: 'Asistente de Conciliaciones y Facturación Electrónica',
      descripcion: 'Práctica técnica en validación de cuentas por cobrar/pagar, cruce de información tributaria y soporte en cierres contables.',
      requisitos: 'Conocimientos de normativa tributaria básica y facturación electrónica DIAN.',
      modalidad: 'HÍBRIDO',
      ubicacion: 'Bogotá D.C.',
      cupos_disponibles: 1,
      auxilio_sostenimiento: 1450000,
      fecha_limite: '2026-12-30',
      estado: 'ABIERTA',
      competencias_requeridas: ['210301019']
    },

    // Empresa 3: DataCore Analytics
    {
      id: 'vac-05',
      empresa_id: 'emp-03',
      empresa_nombre: 'DataCore Analytics & Cloud S.A.S.',
      empresa_ciudad: 'Bogotá D.C.',
      titulo: 'Aprendiz de Inteligencia de Datos y Consultas SQL',
      descripcion: 'Buscamos aprendiz técnico para análisis de datos, extracción mediante SQL, elaboración de dashboards en Power BI y automatización de reportes.',
      requisitos: 'Manejo sólido de SQL, modelado entidad-relación y gusto por la analítica de datos.',
      modalidad: 'HÍBRIDO',
      ubicacion: 'Bogotá D.C.',
      cupos_disponibles: 2,
      auxilio_sostenimiento: 1600000,
      fecha_limite: '2026-12-25',
      estado: 'ABIERTA',
      competencias_requeridas: ['220501096']
    },
    {
      id: 'vac-06',
      empresa_id: 'emp-03',
      empresa_nombre: 'DataCore Analytics & Cloud S.A.S.',
      empresa_ciudad: 'Bogotá D.C.',
      titulo: 'Técnico de Soporte en Servidores y Redes Cloud',
      descripcion: 'Vinculación de estudiante técnico de Redes para soporte a infraestructura, configuración de redes virtuales y monitoreo de servidores.',
      requisitos: 'Conocimientos de redes LAN/WAN, protocolos TCP/IP y cableado estructurado.',
      modalidad: 'PRESENCIAL',
      ubicacion: 'Bogotá D.C.',
      cupos_disponibles: 1,
      auxilio_sostenimiento: 1423500,
      fecha_limite: '2026-12-10',
      estado: 'ABIERTA',
      competencias_requeridas: ['220501097']
    },

    // Empresa 4: Alianza Logística & Operaciones
    {
      id: 'vac-07',
      empresa_id: 'emp-04',
      empresa_nombre: 'Alianza Logística & Operaciones S.A.',
      empresa_ciudad: 'Bogotá D.C.',
      titulo: 'Auxiliar de Operaciones de Software y Soporte Tecnológico',
      descripcion: 'Puesto de práctica para dar soporte a sistemas ERP de almacenamiento y control de inventarios computarizados.',
      requisitos: 'Manejo de sistemas operativos, soporte a usuarios y conceptos básicos de bases de datos.',
      modalidad: 'PRESENCIAL',
      ubicacion: 'Bogotá D.C.',
      cupos_disponibles: 2,
      auxilio_sostenimiento: 1450000,
      fecha_limite: '2026-12-28',
      estado: 'ABIERTA',
      competencias_requeridas: ['220501096', '220501097']
    },
    {
      id: 'vac-08',
      empresa_id: 'emp-04',
      empresa_nombre: 'Alianza Logística & Operaciones S.A.',
      empresa_ciudad: 'Bogotá D.C.',
      titulo: 'Practicante en Archivo Contable y Liquidación de Fletes',
      descripcion: 'Apoyo formativo en digitación de comprobantes de pago de transporte, control de facturas y notas crédito.',
      requisitos: 'Estudiante de Contaduría Pública con buen manejo de hojas de cálculo.',
      modalidad: 'PRESENCIAL',
      ubicacion: 'Bogotá D.C.',
      cupos_disponibles: 1,
      auxilio_sostenimiento: 1423500,
      fecha_limite: '2026-12-22',
      estado: 'ABIERTA',
      competencias_requeridas: ['210301019']
    }
  ],

  // ---------------------------------------------------------------------------
  // 12. POSTULACIONES Y CONTRATOS (Con estados: CONTRATADO, PRESELECCIONADO, POSTULADO)
  // ---------------------------------------------------------------------------
  postulaciones: [
    // ==========================================
    // EMPRESA 1: Innovatech Soluciones S.A.S. (emp-01)
    // ==========================================
    // 1. Juan Camilo: CONTRATADO en vac-01
    {
      id: 'post-01',
      vacante_id: 'vac-01',
      vacante_titulo: 'Aprendiz Desarrollador Web Junior (Etapa Práctica)',
      empresa_id: 'emp-01',
      empresa_nombre: 'Innovatech Soluciones S.A.S.',
      estudiante_id: 'est-01',
      estudiante_nombre: 'Juan Camilo Rodríguez Pérez',
      estudiante_email: 'juan.rodriguez@estudiantil.edu.co',
      estudiante_telefono: '3109876543',
      estudiante_documento: '1023456789',
      estudiante_grado: 11,
      estudiante_programa: 'Aprendiz Desarrollador Web Junior',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-08-20T10:00:00Z',
      estado: 'CONTRATADO',
      retroalimentacion: '¡Contrato estudiantil de aprendizaje legalizado! El aprendiz se vinculó oficialmente a la empresa desde el 1 de septiembre.'
    },
    // 2. Valentina Morales: PRESELECCIONADA en vac-01
    {
      id: 'post-02',
      vacante_id: 'vac-01',
      vacante_titulo: 'Aprendiz Desarrollador Web Junior (Etapa Práctica)',
      empresa_id: 'emp-01',
      empresa_nombre: 'Innovatech Soluciones S.A.S.',
      estudiante_id: 'est-04',
      estudiante_nombre: 'Valentina Morales Duque',
      estudiante_email: 'valentina.morales@estudiantil.edu.co',
      estudiante_telefono: '3165544332',
      estudiante_documento: '1056789012',
      estudiante_grado: 11,
      estudiante_programa: 'Aprendiz Desarrollador Web Junior',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-02T14:30:00Z',
      estado: 'PRESELECCIONADO',
      retroalimentacion: 'Excelente perfil Frontend en React y maquetación web. Preseleccionada para entrevista técnica de validación final.'
    },
    // 3. Camila Rodríguez: POSTULADA en vac-02
    {
      id: 'post-03',
      vacante_id: 'vac-02',
      vacante_titulo: 'Auxiliar de Bases de Datos y Soporte TI',
      empresa_id: 'emp-01',
      empresa_nombre: 'Innovatech Soluciones S.A.S.',
      estudiante_id: 'est-06',
      estudiante_nombre: 'Camila Andrea Rodríguez Silva',
      estudiante_email: 'camila.rodriguez@estudiantil.edu.co',
      estudiante_telefono: '3158877665',
      estudiante_documento: '1078901234',
      estudiante_grado: 11,
      estudiante_programa: 'Auxiliar de Bases de Datos y Soporte TI',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-10T09:15:00Z',
      estado: 'POSTULADO',
      retroalimentacion: 'Hoja de vida radicada con evidencias de bases de datos relacionales. En revisión técnica por el área de infraestructura.'
    },
    // 4. María Paula Gómez: POSTULADA en vac-02
    {
      id: 'post-04',
      vacante_id: 'vac-02',
      vacante_titulo: 'Auxiliar de Bases de Datos y Soporte TI',
      empresa_id: 'emp-01',
      empresa_nombre: 'Innovatech Soluciones S.A.S.',
      estudiante_id: 'est-02',
      estudiante_nombre: 'María Paula Gómez Herrera',
      estudiante_email: 'maria.gomez@estudiantil.edu.co',
      estudiante_telefono: '3123456789',
      estudiante_documento: '1034567890',
      estudiante_grado: 10,
      estudiante_programa: 'Auxiliar de Bases de Datos y Soporte TI',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-12T16:00:00Z',
      estado: 'POSTULADO',
      retroalimentacion: 'Estudiante de ciclo técnico en etapa electiva. Postulada a vacante de soporte para semillero formativo.'
    },

    // ==========================================
    // EMPRESA 2: Servicios Financieros & Contables S.A. (emp-02)
    // ==========================================
    // 5. Santiago Castro: PRESELECCIONADO en vac-03
    {
      id: 'post-05',
      vacante_id: 'vac-03',
      vacante_titulo: 'Auxiliar Contable y Financiero de Práctica',
      empresa_id: 'emp-02',
      empresa_nombre: 'Servicios Financieros & Contables S.A.',
      estudiante_id: 'est-03',
      estudiante_nombre: 'Santiago Castro Ruiz',
      estudiante_email: 'santiago.castro@estudiantil.edu.co',
      estudiante_telefono: '3189012345',
      estudiante_documento: '1045678901',
      estudiante_grado: 11,
      estudiante_programa: 'Auxiliar en Contaduría Pública',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-08T11:15:00Z',
      estado: 'PRESELECCIONADO',
      retroalimentacion: 'Destacadas competencias en conciliación bancaria y balance de prueba. Preseleccionado para entrevista con el Gerente Financiero.'
    },
    // 6. Andrés Felipe González: POSTULADO en vac-03
    {
      id: 'post-06',
      vacante_id: 'vac-03',
      vacante_titulo: 'Auxiliar Contable y Financiero de Práctica',
      empresa_id: 'emp-02',
      empresa_nombre: 'Servicios Financieros & Contables S.A.',
      estudiante_id: 'est-05',
      estudiante_nombre: 'Andrés Felipe González Mora',
      estudiante_email: 'andres.gonzalez@estudiantil.edu.co',
      estudiante_telefono: '3112233998',
      estudiante_documento: '1067890123',
      estudiante_grado: 10,
      estudiante_programa: 'Técnico en Redes y Soporte de Infraestructura TI',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-14T10:20:00Z',
      estado: 'POSTULADO',
      retroalimentacion: 'Postulación radicada con evidencias de soporte documental y hojas de cálculo.'
    },
    // 7. Camila Rodríguez: PRESELECCIONADA en vac-04
    {
      id: 'post-07',
      vacante_id: 'vac-04',
      vacante_titulo: 'Asistente de Conciliaciones y Facturación Electrónica',
      empresa_id: 'emp-02',
      empresa_nombre: 'Servicios Financieros & Contables S.A.',
      estudiante_id: 'est-06',
      estudiante_nombre: 'Camila Andrea Rodríguez Silva',
      estudiante_email: 'camila.rodriguez@estudiantil.edu.co',
      estudiante_telefono: '3158877665',
      estudiante_documento: '1078901234',
      estudiante_grado: 11,
      estudiante_programa: 'Auxiliar de Bases de Datos y Soporte TI',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-09T13:45:00Z',
      estado: 'PRESELECCIONADO',
      retroalimentacion: 'Preseleccionada por alto orden en estructuración de información contable y cruce de datos fiscales.'
    },
    // 8. María Paula Gómez: POSTULADA en vac-04
    {
      id: 'post-08',
      vacante_id: 'vac-04',
      vacante_titulo: 'Asistente de Conciliaciones y Facturación Electrónica',
      empresa_id: 'emp-02',
      empresa_nombre: 'Servicios Financieros & Contables S.A.',
      estudiante_id: 'est-02',
      estudiante_nombre: 'María Paula Gómez Herrera',
      estudiante_email: 'maria.gomez@estudiantil.edu.co',
      estudiante_telefono: '3123456789',
      estudiante_documento: '1034567890',
      estudiante_grado: 10,
      estudiante_programa: 'Auxiliar de Bases de Datos y Soporte TI',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-15T08:30:00Z',
      estado: 'POSTULADO',
      retroalimentacion: 'Postulación radicada para apoyo auxiliar en el área de facturación electrónica DIAN.'
    },

    // ==========================================
    // EMPRESA 3: DataCore Analytics & Cloud S.A.S. (emp-03)
    // ==========================================
    // 9. Camila Rodríguez: PRESELECCIONADA en vac-05
    {
      id: 'post-09',
      vacante_id: 'vac-05',
      vacante_titulo: 'Aprendiz de Inteligencia de Datos y Consultas SQL',
      empresa_id: 'emp-03',
      empresa_nombre: 'DataCore Analytics & Cloud S.A.S.',
      estudiante_id: 'est-06',
      estudiante_nombre: 'Camila Andrea Rodríguez Silva',
      estudiante_email: 'camila.rodriguez@estudiantil.edu.co',
      estudiante_telefono: '3158877665',
      estudiante_documento: '1078901234',
      estudiante_grado: 11,
      estudiante_programa: 'Auxiliar de Bases de Datos y Soporte TI',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-07T10:00:00Z',
      estado: 'PRESELECCIONADO',
      retroalimentacion: 'Preseleccionada para el laboratorio de analítica de datos. Excelente desempeño en consultas SQL y modelado relacional.'
    },
    // 10. Juan Camilo Rodríguez: POSTULADO en vac-05
    {
      id: 'post-10',
      vacante_id: 'vac-05',
      vacante_titulo: 'Aprendiz de Inteligencia de Datos y Consultas SQL',
      empresa_id: 'emp-03',
      empresa_nombre: 'DataCore Analytics & Cloud S.A.S.',
      estudiante_id: 'est-01',
      estudiante_nombre: 'Juan Camilo Rodríguez Pérez',
      estudiante_email: 'juan.rodriguez@estudiantil.edu.co',
      estudiante_telefono: '3109876543',
      estudiante_documento: '1023456789',
      estudiante_grado: 11,
      estudiante_programa: 'Aprendiz Desarrollador Web Junior',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-13T11:00:00Z',
      estado: 'POSTULADO',
      retroalimentacion: 'Postulación radicada para visualización y analítica web en dashboards.'
    },
    // 11. Valentina Morales: PRESELECCIONADA en vac-06
    {
      id: 'post-11',
      vacante_id: 'vac-06',
      vacante_titulo: 'Técnico de Soporte en Servidores y Redes Cloud',
      empresa_id: 'emp-03',
      empresa_nombre: 'DataCore Analytics & Cloud S.A.S.',
      estudiante_id: 'est-04',
      estudiante_nombre: 'Valentina Morales Duque',
      estudiante_email: 'valentina.morales@estudiantil.edu.co',
      estudiante_telefono: '3165544332',
      estudiante_documento: '1056789012',
      estudiante_grado: 11,
      estudiante_programa: 'Aprendiz Desarrollador Web Junior',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-06T15:20:00Z',
      estado: 'PRESELECCIONADO',
      retroalimentacion: 'Preseleccionada por sobresaliente perfil técnico y habilidades de soporte cloud.'
    },
    // 12. Andrés Felipe González: POSTULADO en vac-06
    {
      id: 'post-12',
      vacante_id: 'vac-06',
      vacante_titulo: 'Técnico de Soporte en Servidores y Redes Cloud',
      empresa_id: 'emp-03',
      empresa_nombre: 'DataCore Analytics & Cloud S.A.S.',
      estudiante_id: 'est-05',
      estudiante_nombre: 'Andrés Felipe González Mora',
      estudiante_email: 'andres.gonzalez@estudiantil.edu.co',
      estudiante_telefono: '3112233998',
      estudiante_documento: '1067890123',
      estudiante_grado: 10,
      estudiante_programa: 'Técnico en Redes y Soporte de Infraestructura TI',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-15T14:10:00Z',
      estado: 'POSTULADO',
      retroalimentacion: 'Postulación en trámite. Experiencia en diagnóstico de equipos y cableado de redes.'
    },

    // ==========================================
    // EMPRESA 4: Alianza Logística & Operaciones S.A. (emp-04)
    // ==========================================
    // 13. Andrés Felipe González: PRESELECCIONADO en vac-07
    {
      id: 'post-13',
      vacante_id: 'vac-07',
      vacante_titulo: 'Auxiliar de Operaciones de Software y Soporte Tecnológico',
      empresa_id: 'emp-04',
      empresa_nombre: 'Alianza Logística & Operaciones S.A.',
      estudiante_id: 'est-05',
      estudiante_nombre: 'Andrés Felipe González Mora',
      estudiante_email: 'andres.gonzalez@estudiantil.edu.co',
      estudiante_telefono: '3112233998',
      estudiante_documento: '1067890123',
      estudiante_grado: 10,
      estudiante_programa: 'Técnico en Redes y Soporte de Infraestructura TI',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-05T09:00:00Z',
      estado: 'PRESELECCIONADO',
      retroalimentacion: 'Preseleccionado para soporte técnico a plataformas de distribución y terminales logísticas.'
    },
    // 14. Valentina Morales: POSTULADA en vac-07
    {
      id: 'post-14',
      vacante_id: 'vac-07',
      vacante_titulo: 'Auxiliar de Operaciones de Software y Soporte Tecnológico',
      empresa_id: 'emp-04',
      empresa_nombre: 'Alianza Logística & Operaciones S.A.',
      estudiante_id: 'est-04',
      estudiante_nombre: 'Valentina Morales Duque',
      estudiante_email: 'valentina.morales@estudiantil.edu.co',
      estudiante_telefono: '3165544332',
      estudiante_documento: '1056789012',
      estudiante_grado: 11,
      estudiante_programa: 'Aprendiz Desarrollador Web Junior',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-14T17:30:00Z',
      estado: 'POSTULADO',
      retroalimentacion: 'Postulada para desarrollo y mantenimiento de interfaces de seguimiento logístico.'
    },
    // 15. María Paula Gómez: PRESELECCIONADA en vac-08
    {
      id: 'post-15',
      vacante_id: 'vac-08',
      vacante_titulo: 'Practicante en Archivo Contable y Liquidación de Fletes',
      empresa_id: 'emp-04',
      empresa_nombre: 'Alianza Logística & Operaciones S.A.',
      estudiante_id: 'est-02',
      estudiante_nombre: 'María Paula Gómez Herrera',
      estudiante_email: 'maria.gomez@estudiantil.edu.co',
      estudiante_telefono: '3123456789',
      estudiante_documento: '1034567890',
      estudiante_grado: 10,
      estudiante_programa: 'Auxiliar de Bases de Datos y Soporte TI',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-08T16:40:00Z',
      estado: 'PRESELECCIONADO',
      retroalimentacion: 'Preseleccionada para gestión y control documental de fletes y causaciones.'
    },
    // 16. Santiago Castro: POSTULADO en vac-08
    {
      id: 'post-16',
      vacante_id: 'vac-08',
      vacante_titulo: 'Practicante en Archivo Contable y Liquidación de Fletes',
      empresa_id: 'emp-04',
      empresa_nombre: 'Alianza Logística & Operaciones S.A.',
      estudiante_id: 'est-03',
      estudiante_nombre: 'Santiago Castro Ruiz',
      estudiante_email: 'santiago.castro@estudiantil.edu.co',
      estudiante_telefono: '3189012345',
      estudiante_documento: '1045678901',
      estudiante_grado: 11,
      estudiante_programa: 'Auxiliar en Contaduría Pública',
      estudiante_colegio: 'Instituto Estudiantil',
      fecha_postulacion: '2026-09-16T11:00:00Z',
      estado: 'POSTULADO',
      retroalimentacion: 'Postulación radicada para apoyo en liquidación contable de transportes.'
    }
  ],

  // ---------------------------------------------------------------------------
  // 13. COMPETENCIAS POR PROGRAMA TÉCNICO
  // ---------------------------------------------------------------------------
  competencias: [
    // Programa: Aprendiz Desarrollador Web Junior
    {
      id: 'comp-01',
      codigo_norma: '220501092',
      denominacion: 'Especificar los requisitos necesarios para la solución de software',
      programa_formacion: 'Aprendiz Desarrollador Web Junior',
      fase_proyecto: 'Análisis',
      horas_duracion: 48,
      descripcion: 'Levantamiento de requerimientos funcionales, historias de usuario y matriz de trazabilidad.'
    },
    {
      id: 'comp-02',
      codigo_norma: '220501093',
      denominacion: 'Evaluar requisitos de la solución técnica con estándares de calidad',
      programa_formacion: 'Aprendiz Desarrollador Web Junior',
      fase_proyecto: 'Análisis',
      horas_duracion: 32,
      descripcion: 'Validación y verificación de artefactos de software con usuarios finales.'
    },
    {
      id: 'comp-03',
      codigo_norma: '220501094',
      denominacion: 'Diseñar la solución web y estructuración de componentes interactivos',
      programa_formacion: 'Aprendiz Desarrollador Web Junior',
      fase_proyecto: 'Planeación',
      horas_duracion: 60,
      descripcion: 'Prototipado en Figma, arquitectura Frontend y diseño centrado en el usuario.'
    },
    {
      id: 'comp-04',
      codigo_norma: '220501095',
      denominacion: 'Desarrollar componentes Frontend y consumo de servicios web REST',
      programa_formacion: 'Aprendiz Desarrollador Web Junior',
      fase_proyecto: 'Ejecución',
      horas_duracion: 96,
      descripcion: 'Codificación modular en React.js, JavaScript moderno y estilos adaptables.'
    },

    // Programa: Auxiliar de Bases de Datos y Soporte TI
    {
      id: 'comp-05',
      codigo_norma: '220501096',
      denominacion: 'Construir el sistema de bases de datos relacional y soporte técnico',
      programa_formacion: 'Auxiliar de Bases de Datos y Soporte TI',
      fase_proyecto: 'Ejecución',
      horas_duracion: 64,
      descripcion: 'Diseño relacional, consultas SQL complejas, normalización y mantenimiento.'
    },
    {
      id: 'comp-06',
      codigo_norma: '220501097',
      denominacion: 'Realizar mantenimiento preventivo y correctivo a equipos de cómputo',
      programa_formacion: 'Auxiliar de Bases de Datos y Soporte TI',
      fase_proyecto: 'Análisis',
      horas_duracion: 48,
      descripcion: 'Diagnóstico de hardware, ensamble, desensamble y configuración de sistemas operativos.'
    },

    // Programa: Auxiliar en Contaduría Pública
    {
      id: 'comp-07',
      codigo_norma: '210301019',
      denominacion: 'Elaborar estados financieros y contabilizar operaciones comerciales',
      programa_formacion: 'Auxiliar en Contaduría Pública',
      fase_proyecto: 'Ejecución',
      horas_duracion: 80,
      descripcion: 'Registro de libros auxiliares contables, balance de comprobación y conciliaciones.'
    },
    {
      id: 'comp-08',
      codigo_norma: '210301020',
      denominacion: 'Liquidar nómina y prestaciones sociales conforme a la normatividad laboral',
      programa_formacion: 'Auxiliar en Contaduría Pública',
      fase_proyecto: 'Planeación',
      horas_duracion: 60,
      descripcion: 'Cálculo de aportes parafiscales, seguridad social y liquidación periódica.'
    },

    // Programa: Técnico en Redes y Soporte de Infraestructura TI
    {
      id: 'comp-09',
      codigo_norma: '220501098',
      denominacion: 'Implementar cableado estructurado según normas técnicas internacionales',
      programa_formacion: 'Técnico en Redes y Soporte de Infraestructura TI',
      fase_proyecto: 'Análisis',
      horas_duracion: 70,
      descripcion: 'Instalación de canaletas, ponchado de cables RJ-45 categoría 6 y certificación de puntos de red.'
    },
    {
      id: 'comp-10',
      codigo_norma: '220501099',
      denominacion: 'Configurar dispositivos activos de red y servicios telemáticos',
      programa_formacion: 'Técnico en Redes y Soporte de Infraestructura TI',
      fase_proyecto: 'Ejecución',
      horas_duracion: 80,
      descripcion: 'Configuración de switches administrables, VLANs, routers y seguridad en redes locales.'
    }
  ],

  // ---------------------------------------------------------------------------
  // 14. EVALUACIONES DE COMPETENCIAS (Reflejando los estados de los aprendices)
  // ---------------------------------------------------------------------------
  estudiante_competencias: [
    // Juan Camilo Rodríguez (11° - Contratado): 100% Aprobado en sus competencias
    {
      id: 'ec-01',
      estudiante_id: 'est-01',
      competencia_id: 'comp-01',
      instructor_id: 'inst-01',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-03-15',
      observaciones: 'Excelente dominio en la redacción de casos de uso e historias de usuario.',
      evidencias_url: 'https://github.com/evidencias/juan-requisitos'
    },
    {
      id: 'ec-02',
      estudiante_id: 'est-01',
      competencia_id: 'comp-02',
      instructor_id: 'inst-01',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-04-20',
      observaciones: 'Cumple a cabalidad con la matriz de trazabilidad y validación de software.',
      evidencias_url: 'https://github.com/evidencias/juan-matriz'
    },
    {
      id: 'ec-03',
      estudiante_id: 'est-01',
      competencia_id: 'comp-03',
      instructor_id: 'inst-01',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-06-10',
      observaciones: 'Diagramas de arquitectura claros y prototipo en Figma bien estructurado.',
      evidencias_url: 'https://figma.com/@juan/estudiantil'
    },
    {
      id: 'ec-04',
      estudiante_id: 'est-01',
      competencia_id: 'comp-04',
      instructor_id: 'inst-01',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-08-30',
      observaciones: 'Desarrollo de componentes Frontend limpios, modulares y con buen manejo de estado.',
      evidencias_url: 'https://github.com/juan/react-portal'
    },

    // Valentina Morales (11° - Lista para Práctica): 75%-85% Aprobada (Habilitada)
    {
      id: 'ec-05',
      estudiante_id: 'est-04',
      competencia_id: 'comp-01',
      instructor_id: 'inst-01',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-03-20',
      observaciones: 'Levantamiento de requisitos detallado y estructurado.',
      evidencias_url: 'https://github.com/valentina/requisitos'
    },
    {
      id: 'ec-06',
      estudiante_id: 'est-04',
      competencia_id: 'comp-02',
      instructor_id: 'inst-01',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-04-25',
      observaciones: 'Estándares de calidad y pruebas unitarias presentadas con éxito.',
      evidencias_url: 'https://github.com/valentina/calidad'
    },
    {
      id: 'ec-07',
      estudiante_id: 'est-04',
      competencia_id: 'comp-03',
      instructor_id: 'inst-01',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-06-15',
      observaciones: 'Diseño UX/UI responsive en Figma excelente.',
      evidencias_url: 'https://figma.com/@valentina/design'
    },
    {
      id: 'ec-08',
      estudiante_id: 'est-04',
      competencia_id: 'comp-04',
      instructor_id: 'inst-01',
      juicio_evaluativo: 'EN_PROCESO',
      fecha_evaluacion: null,
      observaciones: 'En proceso de sustentación final de componentes interactivos.',
      evidencias_url: 'https://github.com/valentina-dev/spa-colegio-tecnico'
    },

    // Santiago Castro (11° - Postulado a Empresa): Aprobado en Contaduría
    {
      id: 'ec-09',
      estudiante_id: 'est-03',
      competencia_id: 'comp-07',
      instructor_id: 'inst-02',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-07-25',
      observaciones: 'Libros contables presentados con total precisión y conciliación impecable.',
      evidencias_url: 'https://drive.google.com/santiago-contabilidad'
    },
    {
      id: 'ec-10',
      estudiante_id: 'est-03',
      competencia_id: 'comp-08',
      instructor_id: 'inst-02',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-08-15',
      observaciones: 'Liquidación de nómina conforme a la legislación laboral colombiana vigente.',
      evidencias_url: 'https://drive.google.com/santiago-nomina'
    },

    // María Paula Gómez (10° - En Formación / Por Evaluar)
    {
      id: 'ec-11',
      estudiante_id: 'est-02',
      competencia_id: 'comp-05',
      instructor_id: 'inst-03',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-05-18',
      observaciones: 'Habilidades sólidas en diseño relacional y normalización.',
      evidencias_url: 'https://github.com/evidencias/maria-db'
    },
    {
      id: 'ec-12',
      estudiante_id: 'est-02',
      competencia_id: 'comp-06',
      instructor_id: 'inst-03',
      juicio_evaluativo: 'EN_PROCESO',
      fecha_evaluacion: null,
      observaciones: 'Ajustando matriz de diagnóstico de equipos.',
      evidencias_url: null
    },

    // Andrés Felipe González (10° - Fase Terminada: comp-09 Aprobada)
    {
      id: 'ec-13',
      estudiante_id: 'est-05',
      competencia_id: 'comp-09',
      instructor_id: 'inst-04',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-06-30',
      observaciones: 'Fase de Análisis y Diagnóstico completada al 100%. Ponchado de cableado certificado.',
      evidencias_url: 'https://drive.google.com/andres-redes/certificacion-cableado.pdf'
    },
    {
      id: 'ec-14',
      estudiante_id: 'est-05',
      competencia_id: 'comp-10',
      instructor_id: 'inst-04',
      juicio_evaluativo: 'POR_EVALUAR',
      fecha_evaluacion: null,
      observaciones: 'Competencia programada para la siguiente fase de ejecución.',
      evidencias_url: null
    },

    // Camila Andrea Rodríguez (11° - Por Evaluar)
    {
      id: 'ec-15',
      estudiante_id: 'est-06',
      competencia_id: 'comp-05',
      instructor_id: 'inst-03',
      juicio_evaluativo: 'EN_PROCESO',
      fecha_evaluacion: null,
      observaciones: 'Entrega de scripts SQL en revisión por el profesor Ricardo Mendoza.',
      evidencias_url: 'https://github.com/camila-sql/scripts-consultas-avanzadas'
    }
  ],

  // ---------------------------------------------------------------------------
  // 15. SOLICITUDES DE ALIANZA
  // ---------------------------------------------------------------------------
  solicitudes_alianza: [
    {
      id: 'sol-01',
      nit: '901999888-4',
      razon_social: 'TeleComunicaciones & Fibra Óptica S.A.S.',
      email: 'rrhh@telecomfibra.com',
      sector_economico: 'Telecomunicaciones y Conectividad',
      direccion: 'Calle 26 # 69-76',
      ciudad: 'Bogotá D.C.',
      contacto_nombre: 'Ing. Rodrigo Santamaría',
      contacto_cargo: 'Jefe de Infraestructura y Talento',
      contacto_telefono: '3138887766',
      sitio_web: 'https://telecomfibra.com',
      mensaje_solicitud: 'Requerimos aprendices de Grado 11° de Redes y Soporte TI para pasantías con opción de contratación.',
      fecha_solicitud: '2026-09-18T10:00:00Z',
      estado: 'PENDIENTE'
    }
  ],

  // ---------------------------------------------------------------------------
  // 16. MODELO JERÁRQUICO: FICHAS, CLASES, TEMAS, EVIDENCIAS Y ENTREGAS
  // ---------------------------------------------------------------------------
  programas_tecnicos: [
    { id: 'prog-01', codigo: 'PROG-WEB-01', nombre: 'Aprendiz Desarrollador Web Junior', descripcion: 'Formación técnica articulada en software y desarrollo web frontend con React y APIs REST.', horas_duracion: 880 },
    { id: 'prog-02', codigo: 'PROG-CONT-02', nombre: 'Auxiliar en Contaduría Pública', descripcion: 'Manejo de registros contables, conciliación bancaria, liquidación de nómina y estados financieros.', horas_duracion: 880 },
    { id: 'prog-03', codigo: 'PROG-BD-03', nombre: 'Auxiliar de Bases de Datos y Soporte TI', descripcion: 'Diseño relacional, consultas SQL complejas, normalización y soporte técnico.', horas_duracion: 880 },
    { id: 'prog-04', codigo: 'PROG-RED-04', nombre: 'Técnico en Redes y Soporte de Infraestructura TI', descripcion: 'Implementación de cableado estructurado, configuración de redes LAN/WAN y servicios telemáticos.', horas_duracion: 880 }
  ],

  fichas: [
    { id: 'ficha-01', codigo: '2712345', programa_id: 'prog-01', grado: 11, jornada: 'Mañana', fecha_inicio: '2025-01-20', fecha_fin: '2026-11-30', estado: 'ACTIVA' },
    { id: 'ficha-02', codigo: '2712346', programa_id: 'prog-01', grado: 10, jornada: 'Tarde', fecha_inicio: '2026-01-20', fecha_fin: '2027-11-30', estado: 'ACTIVA' },
    { id: 'ficha-03', codigo: '2912345', programa_id: 'prog-02', grado: 11, jornada: 'Mañana', fecha_inicio: '2025-01-20', fecha_fin: '2026-11-30', estado: 'ACTIVA' },
    { id: 'ficha-04', codigo: '2912346', programa_id: 'prog-02', grado: 10, jornada: 'Tarde', fecha_inicio: '2026-01-20', fecha_fin: '2027-11-30', estado: 'ACTIVA' },
    { id: 'ficha-05', codigo: '2812345', programa_id: 'prog-03', grado: 11, jornada: 'Mañana', fecha_inicio: '2025-01-20', fecha_fin: '2026-11-30', estado: 'ACTIVA' },
    { id: 'ficha-06', codigo: '2812346', programa_id: 'prog-03', grado: 10, jornada: 'Tarde', fecha_inicio: '2026-01-20', fecha_fin: '2027-11-30', estado: 'ACTIVA' },
    { id: 'ficha-07', codigo: '3012345', programa_id: 'prog-04', grado: 10, jornada: 'Mañana', fecha_inicio: '2026-01-20', fecha_fin: '2027-11-30', estado: 'ACTIVA' },
    { id: 'ficha-08', codigo: '3012346', programa_id: 'prog-04', grado: 11, jornada: 'Tarde', fecha_inicio: '2025-01-20', fecha_fin: '2026-11-30', estado: 'ACTIVA' }
  ],

  clases: [
    { id: 'cur-01', nombre: 'Desarrollo Frontend y Aplicaciones Web Modernas (React / JavaScript)', materia: 'Programación Web y Frontend', instructor_id: 'inst-01', ficha_id: 'ficha-01', programa_id: 'prog-01', grado: 11, estado: 'ACTIVO' },
    { id: 'cur-02', nombre: 'Fundamentos de Algoritmia y Lógica de Programación', materia: 'Introducción al Desarrollo de Software', instructor_id: 'inst-01', ficha_id: 'ficha-02', programa_id: 'prog-01', grado: 10, estado: 'ACTIVO' },
    { id: 'cur-03', nombre: 'Contabilización de Operaciones Comerciales y Nómina', materia: 'Contabilidad Financiera y Liquidación', instructor_id: 'inst-02', ficha_id: 'ficha-03', programa_id: 'prog-02', grado: 11, estado: 'ACTIVO' },
    { id: 'cur-04', nombre: 'Principios Contables y Documentación Mercantil', materia: 'Contabilidad Básica Escolar', instructor_id: 'inst-02', ficha_id: 'ficha-04', programa_id: 'prog-02', grado: 10, estado: 'ACTIVO' },
    { id: 'cur-05', nombre: 'Modelado y Gestión Avanzada de Bases de Datos Relacionales (SQL)', materia: 'Bases de Datos Relacionales y SQL', instructor_id: 'inst-03', ficha_id: 'ficha-05', programa_id: 'prog-03', grado: 11, estado: 'ACTIVO' },
    { id: 'cur-06', nombre: 'Estructuración de Datos y Consultas Básicas', materia: 'Introducción a Bases de Datos', instructor_id: 'inst-03', ficha_id: 'ficha-06', programa_id: 'prog-03', grado: 10, estado: 'ACTIVO' },
    { id: 'cur-07', nombre: 'Mantenimiento Preventivo y Soporte a Hardware / Software', materia: 'Soporte Técnico e Infraestructura', instructor_id: 'inst-04', ficha_id: 'ficha-07', programa_id: 'prog-04', grado: 10, estado: 'ACTIVO' },
    { id: 'cur-08', nombre: 'Configuración de Redes LAN y Servicios Telemáticos', materia: 'Redes de Computadores', instructor_id: 'inst-04', ficha_id: 'ficha-08', programa_id: 'prog-04', grado: 11, estado: 'ACTIVO' }
  ],

  temas: [
    { id: 'tema-01', clase_id: 'cur-01', titulo: 'Arquitectura de Componentes en React y JSX', semana: 2, orden: 1 },
    { id: 'tema-02', clase_id: 'cur-01', titulo: 'Hooks Modernos y Gestión de Estado', semana: 4, orden: 2 },
    { id: 'tema-03', clase_id: 'cur-01', titulo: 'Consumo de APIs RESTful y Rutas SPA', semana: 7, orden: 3 }
  ],

  evidencias: [
    { id: 'ev-01', clase_id: 'cur-01', tema_id: 'tema-01', titulo: 'Taller 1: Creación de Componentes Modulares en React', tipo: 'TALLER', fecha_limite: '2026-09-15 23:59:00', puntos_maximos: 5.0, archivo_guia_url: '/guias/taller_componentes_react.pdf' },
    { id: 'ev-02', clase_id: 'cur-01', tema_id: 'tema-02', titulo: 'Laboratorio: Aplicación SPA con Manejo de Estado (Hooks)', tipo: 'PROYECTO', fecha_limite: '2026-10-05 23:59:00', puntos_maximos: 5.0, archivo_guia_url: '/guias/lab_hooks_spa.pdf' },
    { id: 'ev-03', clase_id: 'cur-01', tema_id: 'tema-03', titulo: 'Proyecto Integrador: Conexión Frontend con API REST', tipo: 'PROYECTO', fecha_limite: '2026-10-25 23:59:00', puntos_maximos: 5.0, archivo_guia_url: '/guias/proyecto_consumo_api.pdf' }
  ],

  evidencia_entregas: [
    { id: 'ee-01', evidencia_id: 'ev-01', estudiante_id: 'est-01', archivo_url: '/uploads/evidencias/juan_taller_componentes.zip', enlace_externo: 'https://github.com/juan/react-portal', calificacion: 5.0, comentario_instructor: 'Excelente estructura y modularidad.', fecha_evaluacion: '2026-09-14 10:00:00', estado: 'CALIFICADO' },
    { id: 'ee-02', evidencia_id: 'ev-02', estudiante_id: 'est-01', archivo_url: '/uploads/evidencias/juan_lab_hooks.zip', enlace_externo: 'https://github.com/juan/spa-react-hooks', calificacion: 4.8, comentario_instructor: 'Gran trabajo en hooks.', fecha_evaluacion: '2026-09-29 08:30:00', estado: 'CALIFICADO' },
    { id: 'ee-03', evidencia_id: 'ev-01', estudiante_id: 'est-04', archivo_url: '/uploads/evidencias/valentina_componentes.zip', enlace_externo: 'https://github.com/valentina-dev/spa-colegio-tecnico', calificacion: 4.9, comentario_instructor: 'Diseño visual sobresaliente.', fecha_evaluacion: '2026-09-15 09:15:00', estado: 'CALIFICADO' },
    { id: 'ee-04', evidencia_id: 'ev-02', estudiante_id: 'est-04', archivo_url: '/uploads/evidencias/valentina_hooks.zip', enlace_externo: 'https://github.com/valentina/tienda-spa', calificacion: null, comentario_instructor: null, fecha_evaluacion: null, estado: 'ENTREGADO' }
  ]
};

module.exports = mockData;
