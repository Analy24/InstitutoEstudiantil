// Repositorio de datos iniciales en memoria para Instituto Estudiantil
const bcrypt = require('bcryptjs');

// Hash generado para "Password123!"
const defaultPasswordHash = bcrypt.hashSync('Password123!', 10);

const mockData = {
  usuarios: [
    {
      id: 'usr-admin-01',
      email: 'admi@estudiantil.edu.com',
      password_hash: defaultPasswordHash,
      rol: 'ADMIN',
      activo: true,
      nombre: 'Administrador General',
      created_at: '2026-01-15T08:00:00Z'
    },
    {
      id: 'usr-admin-02',
      email: 'admin@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'ADMIN',
      activo: true,
      nombre: 'Administrador General',
      created_at: '2026-01-15T08:00:00Z'
    },
    {
      id: 'usr-inst-01',
      email: 'carlos.perez@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'INSTRUCTOR',
      activo: true,
      nombre: 'Prof. Carlos Alberto Pérez',
      created_at: '2026-01-20T09:30:00Z'
    },
    {
      id: 'usr-inst-02',
      email: 'laura.restrepo@estudiantil.edu.co',
      password_hash: defaultPasswordHash,
      rol: 'INSTRUCTOR',
      activo: true,
      nombre: 'Prof. Laura Sofía Restrepo',
      created_at: '2026-01-22T09:30:00Z'
    },
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
    }
  ],

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
      especialidad: 'Aprendiz Desarrollador Web Junior & Bases de Datos',
      programas: ['Aprendiz Desarrollador Web Junior', 'Auxiliar de Bases de Datos y Soporte TI'],
      fichas_asignadas: ['2712345', '2812345'],
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
      especialidad: 'Auxiliar en Contaduría Pública & Finanzas',
      programas: ['Auxiliar en Contaduría Pública'],
      fichas_asignadas: ['2912345'],
      estado: 'ACTIVO'
    }
  ],

  programas_oficiales: [
    'Auxiliar de Bases de Datos y Soporte TI',
    'Aprendiz Desarrollador Web Junior',
    'Auxiliar en Contaduría Pública'
  ],

  estudiantes: [
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
      resumen_perfil: 'Estudiante de grado 11° con alta vocación por el desarrollo web Frontend y consumo de APIs REST. Manejo de React, JavaScript, HTML5/CSS3 y bases de datos relacionales.',
      hoja_vida_url: '/uploads/hv_juan_rodriguez.pdf',
      foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      github_url: 'https://github.com/juan-camilo-dev',
      habilidades: ['HTML5 / CSS3', 'JavaScript', 'React.js', 'SQL / MySQL', 'Git & GitHub', 'Trabajo en Equipo'],
      documentos: [
        { id: 'doc-1', nombre: 'Documento de Identidad (TI)', tipo: 'IDENTIDAD', url: '/uploads/ti_juan.pdf', estado: 'VERIFICADO', fecha: '2026-02-01' },
        { id: 'doc-2', nombre: 'Certificado de Afiliación EPS', tipo: 'EPS', url: '/uploads/eps_juan.pdf', estado: 'VERIFICADO', fecha: '2026-02-01' },
        { id: 'doc-3', nombre: 'Hoja de Vida en Formato Institucional', tipo: 'HOJA_VIDA', url: '/uploads/hv_juan_rodriguez.pdf', estado: 'VERIFICADO', fecha: '2026-02-15' },
        { id: 'doc-4', nombre: 'Certificado de Notas Grado 10°', tipo: 'CERTIFICADO', url: '/uploads/notas_grado10.pdf', estado: 'VERIFICADO', fecha: '2026-01-20' }
      ]
    },
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
      ficha_sena: '2812345',
      programa_formacion: 'Auxiliar de Bases de Datos y Soporte TI',
      jornada: 'Tarde',
      telefono: '3123456789',
      resumen_perfil: 'Estudiante de grado 10° cursando primer año de articulación técnica. Énfasis en algoritmia, diagramación lógica, soporte preventivo y bases de datos.',
      hoja_vida_url: '/uploads/hv_maria_gomez.pdf',
      foto_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      github_url: 'https://github.com/maria-paula-dev',
      habilidades: ['Algoritmia', 'Bases de Datos', 'Soporte Hardware/Software', 'SQL', 'Redes Básicas'],
      documentos: [
        { id: 'doc-5', nombre: 'Documento de Identidad (TI)', tipo: 'IDENTIDAD', url: '/uploads/ti_maria.pdf', estado: 'VERIFICADO', fecha: '2026-02-01' },
        { id: 'doc-6', nombre: 'Certificado de Afiliación EPS', tipo: 'EPS', url: '/uploads/eps_maria.pdf', estado: 'VERIFICADO', fecha: '2026-02-01' },
        { id: 'doc-7', nombre: 'Hoja de Vida', tipo: 'HOJA_VIDA', url: '/uploads/hv_maria_gomez.pdf', estado: 'VERIFICADO', fecha: '2026-02-10' }
      ]
    },
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
      resumen_perfil: 'Estudiante de grado 11° con habilidades en conciliación bancaria, registro de asientos contables, manejo de software contable y liquidación de nómina.',
      hoja_vida_url: '/uploads/hv_santiago_castro.pdf',
      foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      github_url: '',
      habilidades: ['Contabilidad Básica', 'Excel Financiero Avanzado', 'Liquidación de Nómina', 'Cuentas por Cobrar/Pagar'],
      documentos: [
        { id: 'doc-8', nombre: 'Documento de Identidad (TI)', tipo: 'IDENTIDAD', url: '/uploads/ti_santiago.pdf', estado: 'VERIFICADO', fecha: '2026-02-05' },
        { id: 'doc-9', nombre: 'Hoja de Vida', tipo: 'HOJA_VIDA', url: '/uploads/hv_santiago_castro.pdf', estado: 'VERIFICADO', fecha: '2026-02-05' }
      ]
    }
  ],

  competencias: [
    {
      id: 'comp-01',
      codigo_norma: '220501092',
      denominacion: 'Especificar los requisitos necesarios para la solución de software',
      programa_formacion: 'Aprendiz Desarrollador Web Junior',
      fase_proyecto: 'Análisis',
      horas_duracion: 48,
      descripcion: 'Levantamiento de historias de usuario, requerimientos funcionales y no funcionales.'
    },
    {
      id: 'comp-02',
      codigo_norma: '220501093',
      denominacion: 'Evaluar requisitos de la solución técnica con estándares de calidad',
      programa_formacion: 'Aprendiz Desarrollador Web Junior',
      fase_proyecto: 'Análisis',
      horas_duracion: 32,
      descripcion: 'Validación y verificación de artefactos con interesados y usuarios.'
    },
    {
      id: 'comp-03',
      codigo_norma: '220501094',
      denominacion: 'Diseñar la solución web y estructuración de base de datos',
      programa_formacion: 'Aprendiz Desarrollador Web Junior',
      fase_proyecto: 'Planeación',
      horas_duracion: 60,
      descripcion: 'Modelado relacional, arquitectura y prototipos UX/UI interactivos.'
    },
    {
      id: 'comp-04',
      codigo_norma: '220501095',
      denominacion: 'Desarrollar componentes Frontend y consumo de servicios web',
      programa_formacion: 'Aprendiz Desarrollador Web Junior',
      fase_proyecto: 'Ejecución',
      horas_duracion: 96,
      descripcion: 'Codificación en React, JavaScript moderno y estilos responsivos.'
    },
    {
      id: 'comp-05',
      codigo_norma: '220501096',
      denominacion: 'Construir el sistema de bases de datos relacional y soporte',
      programa_formacion: 'Auxiliar de Bases de Datos y Soporte TI',
      fase_proyecto: 'Ejecución',
      horas_duracion: 64,
      descripcion: 'Implementación de tablas, índices, consultas optimizadas y mantenimiento preventivo.'
    },
    {
      id: 'comp-06',
      codigo_norma: '210301019',
      denominacion: 'Elaborar estados financieros y contabilizar operaciones comerciales',
      programa_formacion: 'Auxiliar en Contaduría Pública',
      fase_proyecto: 'Ejecución',
      horas_duracion: 80,
      descripcion: 'Registro de libros contables, balances de prueba y liquidación de impuestos básicos.'
    }
  ],

  estudiante_competencias: [
    {
      id: 'ec-01',
      estudiante_id: 'est-01',
      competencia_id: 'comp-01',
      instructor_id: 'inst-01',
      instructor_nombre: 'Prof. Carlos Alberto Pérez',
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
      instructor_nombre: 'Prof. Carlos Alberto Pérez',
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
      instructor_nombre: 'Prof. Carlos Alberto Pérez',
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
      instructor_nombre: 'Prof. Carlos Alberto Pérez',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-08-30',
      observaciones: 'Desarrollo de componentes Frontend limpios, modulares y con buen manejo de estado.',
      evidencias_url: 'https://github.com/juan/react-portal'
    },
    {
      id: 'ec-05',
      estudiante_id: 'est-01',
      competencia_id: 'comp-05',
      instructor_id: 'inst-01',
      instructor_nombre: 'Prof. Carlos Alberto Pérez',
      juicio_evaluativo: 'EN_PROCESO',
      fecha_evaluacion: null,
      observaciones: 'En proceso de sustentación final de consultas SQL complejas.',
      evidencias_url: null
    },
    {
      id: 'ec-06',
      estudiante_id: 'est-02',
      competencia_id: 'comp-05',
      instructor_id: 'inst-01',
      instructor_nombre: 'Prof. Carlos Alberto Pérez',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-05-18',
      observaciones: 'Demuestra habilidades sólidas en diseño relacional y normalización de bases de datos.',
      evidencias_url: 'https://github.com/evidencias/maria-db'
    },
    {
      id: 'ec-07',
      estudiante_id: 'est-02',
      competencia_id: 'comp-01',
      instructor_id: 'inst-01',
      instructor_nombre: 'Prof. Carlos Alberto Pérez',
      juicio_evaluativo: 'EN_PROCESO',
      fecha_evaluacion: null,
      observaciones: 'Ajustando matriz de requerimientos según retroalimentación.',
      evidencias_url: null
    },
    {
      id: 'ec-08',
      estudiante_id: 'est-03',
      competencia_id: 'comp-06',
      instructor_id: 'inst-02',
      instructor_nombre: 'Prof. Laura Sofía Restrepo',
      juicio_evaluativo: 'APROBADO',
      fecha_evaluacion: '2026-07-25',
      observaciones: 'Libros contables presentados con total precisión y conciliación impecable.',
      evidencias_url: 'https://drive.google.com/santiago-contabilidad'
    }
  ],

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
    }
  ],

  solicitudes_alianza: [
    {
      id: 'sol-01',
      nit: '901556677-3',
      razon_social: 'DataCore Analytics S.A.S.',
      email: 'contacto@datacore.com.co',
      sector_economico: 'Inteligencia de Datos y Cloud',
      direccion: 'Calle 93B # 13-45',
      ciudad: 'Bogotá D.C.',
      contacto_nombre: 'Diana Marcela Morales',
      contacto_cargo: 'Líder de Selección y Vinculación',
      contacto_telefono: '3209871234',
      sitio_web: 'https://datacore.com.co',
      mensaje_solicitud: 'Deseamos vincular estudiantes en etapa práctica de Desarrollo Web y Bases de Datos con opción de vinculación laboral directa.',
      fecha_solicitud: '2026-09-14T15:30:00Z',
      estado: 'PENDIENTE'
    }
  ],

  vacantes: [
    {
      id: 'vac-01',
      empresa_id: 'emp-01',
      empresa_nombre: 'Innovatech Soluciones S.A.S.',
      empresa_ciudad: 'Bogotá D.C.',
      titulo: 'Aprendiz Desarrollador Web Junior (Etapa Práctica)',
      descripcion: 'Buscamos estudiante de grado 11° del Instituto Estudiantil en el programa de Desarrollador Web Junior para apoyar proyectos frontend en React y consumo de APIs.',
      requisitos: 'Competencias técnicas aprobadas en desarrollo web. Manejo básico de HTML, CSS, JavaScript y Git.',
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
      descripcion: 'Oportunidad de contrato de aprendizaje para dar soporte en administración de bases de datos relacionales, consultas SQL y mantenimiento de equipos.',
      requisitos: 'Competencias en SQL, modelo entidad-relación y soporte técnico general.',
      modalidad: 'PRESENCIAL',
      ubicacion: 'Bogotá D.C.',
      cupos_disponibles: 1,
      auxilio_sostenimiento: 1423500,
      fecha_limite: '2026-12-15',
      estado: 'ABIERTA',
      competencias_requeridas: ['220501096']
    },
    {
      id: 'vac-03',
      empresa_id: 'emp-02',
      empresa_nombre: 'Servicios Financieros & Contables S.A.',
      empresa_ciudad: 'Bogotá D.C.',
      titulo: 'Auxiliar Contable y Financiero de Práctica',
      descripcion: 'Buscamos aprendiz del Instituto Estudiantil de Contaduría Pública para apoyo en digitación de comprobantes, archivo fiscal y apoyo en conciliaciones.',
      requisitos: 'Competencias en contabilidad básica, Excel intermedio y atención al detalle.',
      modalidad: 'PRESENCIAL',
      ubicacion: 'Bogotá D.C.',
      cupos_disponibles: 2,
      auxilio_sostenimiento: 1500000,
      fecha_limite: '2026-12-20',
      estado: 'ABIERTA',
      competencias_requeridas: ['210301019']
    }
  ],

  postulaciones: [
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
      fecha_postulacion: '2026-09-10T11:20:00Z',
      estado: 'PRESELECCIONADO',
      retroalimentacion: 'Excelente portafolio y calificaciones en desarrollo frontend. Agendado para entrevista técnica.'
    }
  ]
};

module.exports = mockData;
