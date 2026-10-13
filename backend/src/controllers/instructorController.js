const { getPool, isDatabaseConnected } = require('../config/db');
const mockData = require('../data/mockData');

/**
 * Obtener jerarquía completa del instructor:
 * Programa formativo -> Fichas asignadas -> Clases / Cursos
 * GET /api/v1/instructor/programas-jerarquia
 */
// Mapa curricular de temas y evidencias por competencia
const CURRICULO_TEMAS_MAP = {
  'comp-01': [
    {
      id: 'tema-web-01',
      titulo: 'Elicitación y Levantamiento de Requerimientos',
      descripcion: 'Técnicas de entrevistas con clientes, casos de uso, requerimientos funcionales y no funcionales.',
      semana: 1,
      horas: 24,
      resultado_aprendizaje: 'Identificar los requerimientos del cliente según metodologías ágiles y estándares IEEE 830.',
      evidencias: [
        { id: 'ev-web-01', titulo: 'Documento ERS (Especificación de Requisitos)', tipo: 'INFORME', archivo_guia_url: '/guias/ers_guia.pdf', puntos_maximos: 5.0 }
      ]
    },
    {
      id: 'tema-web-02',
      titulo: 'Historias de Usuario y Matriz de Trazabilidad',
      descripcion: 'Criterios de aceptación INVEST, backlog priorizado y diagramas de actividades UML.',
      semana: 2,
      horas: 24,
      resultado_aprendizaje: 'Elaborar artefactos de análisis de requerimientos según estándares técnicos.',
      evidencias: [
        { id: 'ev-web-02', titulo: 'User Stories y Criterios de Aceptación', tipo: 'TALLER', archivo_guia_url: '/guias/user_stories.pdf', puntos_maximos: 5.0 }
      ]
    }
  ],
  'comp-02': [
    {
      id: 'tema-web-03',
      titulo: 'Métricas y Atributos de Calidad de Software ISO/IEC 25010',
      descripcion: 'Evaluación de usabilidad, eficiencia de desempeño, seguridad y compatibilidad.',
      semana: 3,
      horas: 16,
      resultado_aprendizaje: 'Validar la coherencia de los artefactos de software según normas de calidad.',
      evidencias: [
        { id: 'ev-web-03', titulo: 'Rúbrica de Validación de Requisitos ISO 25010', tipo: 'EVALUACION', archivo_guia_url: '/guias/iso25010.pdf', puntos_maximos: 5.0 }
      ]
    },
    {
      id: 'tema-web-04',
      titulo: 'Pruebas de Aceptación y Validación con el Usuario',
      descripcion: 'Diseño de actas de conformidad, casos de prueba de aceptación y sesiones de feedback.',
      semana: 4,
      horas: 16,
      resultado_aprendizaje: 'Aplicar instrumentos de evaluación y verificación técnica.',
      evidencias: [
        { id: 'ev-web-04', titulo: 'Acta de Conformidad y Aceptación de Requisitos', tipo: 'INFORME', archivo_guia_url: '/guias/acta_aceptacion.pdf', puntos_maximos: 5.0 }
      ]
    }
  ],
  'comp-03': [
    {
      id: 'tema-web-05',
      titulo: 'Diseño UX/UI y Prototipado Interactivo en Figma',
      descripcion: 'Design Systems, jerarquía visual, tipografía, paletas de color HSL y prototipos navegables.',
      semana: 5,
      horas: 30,
      resultado_aprendizaje: 'Construir prototipos interactivos adaptables según estándares de diseño centrado en el usuario.',
      evidencias: [
        { id: 'ev-web-05', titulo: 'Prototipo Interactivo de Alta Fidelidad en Figma', tipo: 'PROYECTO', archivo_guia_url: '/guias/prototipo_figma.pdf', puntos_maximos: 5.0 }
      ]
    },
    {
      id: 'tema-web-06',
      titulo: 'Arquitectura de la Información y Responsive Design',
      descripcion: 'Wireframes, patrones de navegación mobile-first, grid responsivo y accesibilidad web WCAG.',
      semana: 6,
      horas: 30,
      resultado_aprendizaje: 'Estructurar la arquitectura visual y funcional de la interfaz web.',
      evidencias: [
        { id: 'ev-web-06', titulo: 'Guía de Estilos y Arquitectura Frontend', tipo: 'DOCUMENTO', archivo_guia_url: '/guias/guia_estilos.pdf', puntos_maximos: 5.0 }
      ]
    }
  ],
  'comp-04': [
    {
      id: 'tema-01',
      titulo: 'Arquitectura de Componentes en React y JSX',
      descripcion: 'Estructura modular, componentes funcionales, props, JSX y renderizado condicional.',
      semana: 7,
      horas: 32,
      resultado_aprendizaje: 'Codificar componentes de interfaz gráfica de usuario reutilizables.',
      evidencias: [
        { id: 'ev-01', titulo: 'Taller 1: Creación de Componentes Modulares en React', tipo: 'TALLER', archivo_guia_url: '/guias/taller_componentes_react.pdf', puntos_maximos: 5.0 }
      ]
    },
    {
      id: 'tema-02',
      titulo: 'Hooks Modernos y Gestión de Estado',
      descripcion: 'useState, useEffect, custom hooks y flujo de datos unidireccional.',
      semana: 8,
      horas: 32,
      resultado_aprendizaje: 'Implementar lógica de estado y reactividad en componentes web.',
      evidencias: [
        { id: 'ev-02', titulo: 'Laboratorio: Aplicación SPA con Manejo de Estado (Hooks)', tipo: 'PROYECTO', archivo_guia_url: '/guias/lab_hooks_spa.pdf', puntos_maximos: 5.0 }
      ]
    },
    {
      id: 'tema-03',
      titulo: 'Consumo de APIs RESTful y Rutas SPA',
      descripcion: 'Fetch API, axios, react-router-dom, autenticación JWT y persistencia con backend.',
      semana: 9,
      horas: 32,
      resultado_aprendizaje: 'Integrar la interfaz web con servicios web y APIs REST externas.',
      evidencias: [
        { id: 'ev-03', titulo: 'Proyecto Integrador: Conexión Frontend con API REST', tipo: 'PROYECTO', archivo_guia_url: '/guias/proyecto_consumo_api.pdf', puntos_maximos: 5.0 }
      ]
    }
  ],
  'comp-05': [
    {
      id: 'tema-09',
      titulo: 'Modelado Relacional y Normalización 3FN',
      descripcion: 'Entidades, claves primarias, foráneas, integridad referencial y formas normales.',
      semana: 2,
      horas: 20,
      resultado_aprendizaje: 'Diseñar el modelo de datos relacional conforme a las reglas del negocio.',
      evidencias: [
        { id: 'ev-bd-01', titulo: 'Diagrama Entidad-Relación y Diccionario de Datos', tipo: 'TALLER', archivo_guia_url: '/guias/mer_sql.pdf', puntos_maximos: 5.0 }
      ]
    },
    {
      id: 'tema-10',
      titulo: 'Consultas Avanzadas SQL: JOINs y Subconsultas',
      descripcion: 'INNER JOIN, LEFT JOIN, funciones de agregación (GROUP BY, HAVING) y subconsultas.',
      semana: 5,
      horas: 24,
      resultado_aprendizaje: 'Manipular y consultar bases de datos relacionales mediante sentencias DML complejas.',
      evidencias: [
        { id: 'ev-bd-02', titulo: 'Script SQL con Consultas Analíticas Avanzadas', tipo: 'LABORATORIO', archivo_guia_url: '/guias/consultas_sql.pdf', puntos_maximos: 5.0 }
      ]
    },
    {
      id: 'tema-11',
      titulo: 'Conceptos Básicos de Datos y Sentencias DDL',
      descripcion: 'CREATE TABLE, ALTER, tipos VARCHAR, INTEGER, DATE y restricciones NOT NULL.',
      semana: 4,
      horas: 20,
      resultado_aprendizaje: 'Crear y administrar estructuras de bases de datos.',
      evidencias: [
        { id: 'ev-bd-03', titulo: 'Taller DDL: Creación de Esquema de Base de Datos', tipo: 'TALLER', archivo_guia_url: '/guias/ddl_sql.pdf', puntos_maximos: 5.0 }
      ]
    }
  ],
  'comp-06': [
    {
      id: 'tema-12',
      titulo: 'Diagnóstico de Hardware y Ensamble de Equipos',
      descripcion: 'Placa madre, procesador, memoria RAM, discos duros y mantenimiento preventivo.',
      semana: 3,
      horas: 24,
      resultado_aprendizaje: 'Realizar mantenimiento preventivo y correctivo a la arquitectura de hardware.',
      evidencias: [
        { id: 'ev-hw-01', titulo: 'Informe Técnico de Diagnóstico y Mantenimiento de Hardware', tipo: 'INFORME', archivo_guia_url: '/guias/mantenimiento_hw.pdf', puntos_maximos: 5.0 }
      ]
    },
    {
      id: 'tema-hw-02',
      titulo: 'Instalación y Configuración de Sistemas Operativos',
      descripcion: 'Particionamiento GPT/MBR, instalación de drivers, herramientas de clonación y seguridad básica.',
      semana: 6,
      horas: 24,
      resultado_aprendizaje: 'Configurar sistemas operativos y software base para la operación informática.',
      evidencias: [
        { id: 'ev-hw-02', titulo: 'Checklist de Instalación y Optimización de SO', tipo: 'TALLER', archivo_guia_url: '/guias/instalacion_so.pdf', puntos_maximos: 5.0 }
      ]
    }
  ],
  'comp-07': [
    {
      id: 'tema-07',
      titulo: 'Libro Diario, Conciliación Bancaria y Balance de Prueba',
      descripcion: 'Asientos contables partida doble, conciliación extracto bancario y balance de comprobación.',
      semana: 6,
      horas: 40,
      resultado_aprendizaje: 'Registrar hechos económicos y generar estados financieros preliminares según NIIF.',
      evidencias: [
        { id: 'ev-cont-01', titulo: 'Taller de Asientos Contables y Balance de Comprobación', tipo: 'TALLER', archivo_guia_url: '/guias/balance_prueba.pdf', puntos_maximos: 5.0 }
      ]
    },
    {
      id: 'tema-08',
      titulo: 'Documentos Comerciales y Soporte Contable',
      descripcion: 'Factura electrónica, recibos de caja, cheques y comprobantes de egreso.',
      semana: 3,
      horas: 40,
      resultado_aprendizaje: 'Clasificar y archivar soportes contables conforme a la normativa tributaria.',
      evidencias: [
        { id: 'ev-cont-02', titulo: 'Paquete de Documentos Contables y Registro Comercial', tipo: 'INFORME', archivo_guia_url: '/guias/documentos_contables.pdf', puntos_maximos: 5.0 }
      ]
    }
  ],
  'comp-08': [
    {
      id: 'tema-06',
      titulo: 'Liquidación Integral de Nómina y Seguridad Social',
      descripcion: 'Devengados, deducciones, aportes a salud, pensión, ARL y parafiscales.',
      semana: 3,
      horas: 30,
      resultado_aprendizaje: 'Liquidar la nómina de trabajadores conforme a la legislación laboral colombiana.',
      evidencias: [
        { id: 'ev-nom-01', titulo: 'Simulador de Liquidación de Nómina Quincenal y Mensual', tipo: 'PROYECTO', archivo_guia_url: '/guias/nomina_liquidacion.pdf', puntos_maximos: 5.0 }
      ]
    },
    {
      id: 'tema-nom-02',
      titulo: 'Prestaciones Sociales y Liquidación Contractual',
      descripcion: 'Cálculo de cesantías, intereses a cesantías, prima de servicios y vacaciones proporcionales.',
      semana: 7,
      horas: 30,
      resultado_aprendizaje: 'Liquidar prestaciones sociales e indemnizaciones por terminación de contrato.',
      evidencias: [
        { id: 'ev-nom-02', titulo: 'Liquidación de Prestaciones Sociales y Finiquito Contractual', tipo: 'TALLER', archivo_guia_url: '/guias/prestaciones_sociales.pdf', puntos_maximos: 5.0 }
      ]
    }
  ],
  'comp-09': [
    {
      id: 'tema-13',
      titulo: 'Cableado Estructurado y Normas TIA/EIA 568A/B',
      descripcion: 'Categorías de cable UTP, ponchado de conectores RJ-45 y patch panels.',
      semana: 2,
      horas: 35,
      resultado_aprendizaje: 'Instalar subsistemas de cableado estructurado según normas internacionales.',
      evidencias: [
        { id: 'ev-red-01', titulo: 'Práctica de Ponchado y Certificación de Cableado UTP', tipo: 'LABORATORIO', archivo_guia_url: '/guias/cableado_estructurado.pdf', puntos_maximos: 5.0 }
      ]
    },
    {
      id: 'tema-red-02',
      titulo: 'Certificación y Pruebas de Continuidad de Red',
      descripcion: 'Uso de probadores de cable, certificación de atenuación, diafonía NEXT y rotulación ANSI/TIA-606.',
      semana: 5,
      horas: 35,
      resultado_aprendizaje: 'Verificar la conectividad física de la red mediante equipos de medición.',
      evidencias: [
        { id: 'ev-red-02', titulo: 'Reporte Técnico de Certificación de Puntos de Red', tipo: 'INFORME', archivo_guia_url: '/guias/certificacion_red.pdf', puntos_maximos: 5.0 }
      ]
    }
  ],
  'comp-10': [
    {
      id: 'tema-14',
      titulo: 'Direccionamiento IPv4 y Configuración de Routers',
      descripcion: 'Clases de IP, máscaras de subred, puertas de enlace y configuración básica en Packet Tracer.',
      semana: 5,
      horas: 40,
      resultado_aprendizaje: 'Configurar equipos de enrutamiento y direccionamiento IP en redes de área local.',
      evidencias: [
        { id: 'ev-red-03', titulo: 'Laboratorio Packet Tracer: Subnetting y Enrutamiento Estático', tipo: 'LABORATORIO', archivo_guia_url: '/guias/subnetting_packet_tracer.pdf', puntos_maximos: 5.0 }
      ]
    },
    {
      id: 'tema-red-04',
      titulo: 'Configuración de Switches y Redes Virtuales VLAN',
      descripcion: 'Segmentación de dominios de difusión, enlaces troncales 802.1Q y seguridad de puertos.',
      semana: 8,
      horas: 40,
      resultado_aprendizaje: 'Segmentar la red mediante switches administrables y redes de área local virtuales.',
      evidencias: [
        { id: 'ev-red-04', titulo: 'Topología de Red con VLANs y Enlace Troncal', tipo: 'PROYECTO', archivo_guia_url: '/guias/vlans_trunk.pdf', puntos_maximos: 5.0 }
      ]
    }
  ]
};

// Función auxiliar para obtener competencias y temas de un programa
async function obtenerCompetenciasConTemas(programaNombre, pool = null) {
  let comps = [];
  if (pool) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM competencias WHERE programa_formacion = ? ORDER BY fase_proyecto ASC, codigo_norma ASC',
        [programaNombre]
      );
      comps = rows;
    } catch (e) {
      console.error('Error al consultar competencias en BD:', e);
    }
  }

  if (comps.length === 0) {
    comps = (mockData.competencias || []).filter(c => c.programa_formacion === programaNombre);
  }

  // Enriquecer cada competencia con sus temas
  return comps.map(c => {
    const temas = CURRICULO_TEMAS_MAP[c.id] || [
      {
        id: `tema-${c.id}-1`,
        titulo: `Fundamentos y Conceptos Clave: ${c.denominacion}`,
        descripcion: c.descripcion || 'Desarrollo de habilidades y conocimientos técnicos conforme a la norma.',
        semana: 1,
        horas: Math.round((c.horas_duracion || 40) / 2),
        resultado_aprendizaje: `Alcanzar el resultado de aprendizaje de la fase ${c.fase_proyecto || 'Ejecución'}.`,
        evidencias: [
          { id: `ev-${c.id}-1`, titulo: `Evidencia de Desempeño: ${c.denominacion}`, tipo: 'TALLER', puntos_maximos: 5.0 }
        ]
      },
      {
        id: `tema-${c.id}-2`,
        titulo: `Aplicación Práctica y Proyecto Técnico`,
        descripcion: 'Implementación en entorno real de trabajo con rúbrica evaluativa.',
        semana: 2,
        horas: Math.round((c.horas_duracion || 40) / 2),
        resultado_aprendizaje: 'Demostrar destreza técnica en la solución de problemas prácticos.',
        evidencias: [
          { id: `ev-${c.id}-2`, titulo: `Evidencia de Producto Final`, tipo: 'PROYECTO', puntos_maximos: 5.0 }
        ]
      }
    ];

    return {
      ...c,
      total_temas: temas.length,
      temas
    };
  });
}

/**
 * Obtener jerarquía completa del instructor:
 * Programa formativo -> Fichas asignadas -> Clases / Cursos
 * y dentro del programa -> Competencias -> Temas
 * GET /api/v1/instructor/programas-jerarquia
 */
async function getProgramasJerarquia(req, res) {
  try {
    const instructorId = req.user.perfil_id;

    if (isDatabaseConnected()) {
      const pool = getPool();

      // Consultar clases/cursos del instructor junto a sus fichas y programas
      const [clases] = await pool.execute(`
        SELECT 
          c.id AS clase_id,
          c.nombre AS clase_nombre,
          c.materia AS clase_materia,
          c.descripcion AS clase_descripcion,
          c.grado AS clase_grado,
          c.estado AS clase_estado,
          f.id AS ficha_id,
          f.codigo AS ficha_codigo,
          f.grado AS ficha_grado,
          f.jornada AS ficha_jornada,
          p.id AS programa_id,
          p.codigo AS programa_codigo,
          p.nombre AS programa_nombre,
          p.descripcion AS programa_descripcion
        FROM clases c
        JOIN fichas f ON c.ficha_id = f.id
        JOIN programas p ON f.programa_id = p.id
        WHERE c.instructor_id = ?
        ORDER BY p.nombre ASC, f.codigo ASC, c.nombre ASC
      `, [instructorId]);

      // Si no hay en tabla clases pero hay en cursos, hacer fallback a cursos
      let clasesData = clases;
      if (clasesData.length === 0) {
        const [cursosRows] = await pool.execute(`
          SELECT 
            c.id AS clase_id,
            c.nombre AS clase_nombre,
            c.materia AS clase_materia,
            c.descripcion AS clase_descripcion,
            c.grado AS clase_grado,
            c.estado AS clase_estado,
            COALESCE(c.ficha, '2712345') AS ficha_codigo,
            COALESCE(c.programa_formacion, 'Aprendiz Desarrollador Web Junior') AS programa_nombre
          FROM cursos c
          WHERE c.instructor_id = ?
          ORDER BY c.nombre ASC
        `, [instructorId]);

        clasesData = cursosRows.map(cr => ({
          ...cr,
          ficha_id: `ficha-${cr.ficha_codigo}`,
          ficha_grado: cr.clase_grado || 11,
          ficha_jornada: 'Mañana',
          programa_id: 'prog-01',
          programa_codigo: 'PROG-WEB',
          programa_descripcion: 'Formación técnica articulada en software y aplicaciones web.'
        }));
      }

      // Estructurar jerarquía Programa -> Fichas -> Clases
      const programasMap = new Map();

      for (const row of clasesData) {
        if (!programasMap.has(row.programa_nombre)) {
          programasMap.set(row.programa_nombre, {
            id: row.programa_id || `prog-${row.programa_nombre}`,
            codigo: row.programa_codigo || 'PROG-TEC',
            nombre: row.programa_nombre,
            descripcion: row.programa_descripcion || '',
            fichas: new Map()
          });
        }

        const prog = programasMap.get(row.programa_nombre);

        if (!prog.fichas.has(row.ficha_codigo)) {
          prog.fichas.set(row.ficha_codigo, {
            id: row.ficha_id || `ficha-${row.ficha_codigo}`,
            codigo: row.ficha_codigo,
            grado: row.ficha_grado || row.clase_grado || 11,
            jornada: row.ficha_jornada || 'Mañana',
            clases: []
          });
        }

        const fch = prog.fichas.get(row.ficha_codigo);
        fch.clases.push({
          id: row.clase_id,
          nombre: row.clase_nombre,
          materia: row.clase_materia || row.clase_nombre,
          descripcion: row.clase_descripcion,
          grado: row.clase_grado,
          estado: row.clase_estado
        });
      }

      // Convertir Map a Array para el cliente JSON y adjuntar Competencias con Temas
      const programas = await Promise.all(Array.from(programasMap.values()).map(async (prog) => {
        const competencias = await obtenerCompetenciasConTemas(prog.nombre, pool);
        return {
          ...prog,
          fichas: Array.from(prog.fichas.values()),
          competencias
        };
      }));

      return res.json({ status: 'success', data: programas });
    } else {
      // Fallback a MockData
      const inst = mockData.instructores.find(i => i.id === instructorId);
      const fichasCodigos = inst ? inst.fichas_asignadas : ['2712345'];
      const fichas = (mockData.fichas || []).filter(f => fichasCodigos.includes(f.codigo));
      const clases = (mockData.clases || mockData.cursos || []).filter(c => c.instructor_id === instructorId);

      const progNombre = inst && inst.programas && inst.programas[0] ? inst.programas[0] : 'Aprendiz Desarrollador Web Junior';
      const competencias = await obtenerCompetenciasConTemas(progNombre, null);
      const programa = {
        id: 'prog-01',
        codigo: 'PROG-TEC',
        nombre: progNombre,
        descripcion: 'Programa articulado con educación media técnica.',
        fichas: fichasCodigos.map(codigo => {
          const fchObj = fichas.find(f => f.codigo === codigo) || { codigo, grado: 11, jornada: 'Mañana' };
          return {
            id: fchObj.id || `ficha-${codigo}`,
            codigo,
            grado: fchObj.grado || 11,
            jornada: fchObj.jornada || 'Mañana',
            clases: clases.filter(c => c.ficha === codigo || c.ficha_id === fchObj.id)
          };
        }),
        competencias
      };

      return res.json({ status: 'success', data: [programa] });
    }
  } catch (error) {
    console.error('Error en getProgramasJerarquia:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * Obtener los estudiantes pertenecientes a una clase / ficha
 * GET /api/v1/instructor/clases/:claseId/estudiantes
 */
async function getClaseEstudiantes(req, res) {
  try {
    const { claseId } = req.params;

    if (isDatabaseConnected()) {
      const pool = getPool();

      // 1. Obtener la clase para conocer su ficha
      let [claseRows] = await pool.execute(`
        SELECT c.*, f.codigo AS ficha_codigo, f.id AS ficha_id_rel, p.nombre AS programa_nombre
        FROM clases c
        LEFT JOIN fichas f ON c.ficha_id = f.id
        LEFT JOIN programas p ON f.programa_id = p.id
        WHERE c.id = ?
      `, [claseId]);

      if (claseRows.length === 0) {
        // Buscar en cursos
        const [cursoRows] = await pool.execute('SELECT * FROM cursos WHERE id = ?', [claseId]);
        if (cursoRows.length > 0) {
          claseRows = [{
            ...cursoRows[0],
            ficha_codigo: cursoRows[0].ficha,
            ficha_id_rel: `ficha-${cursoRows[0].ficha}`,
            programa_nombre: cursoRows[0].programa_formacion
          }];
        }
      }

      if (claseRows.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Clase o curso no encontrado' });
      }

      const clase = claseRows[0];
      const fichaCodigo = clase.ficha_codigo || clase.ficha;

      // 2. Obtener estudiantes que pertenecen a la ficha de la clase o matriculados
      const [estudiantes] = await pool.execute(`
        SELECT DISTINCT
          e.id,
          e.nombres,
          e.apellidos,
          e.numero_documento,
          e.tipo_documento,
          e.grado,
          e.jornada,
          e.telefono,
          e.foto_url,
          e.ficha_sena,
          u.email,
          COALESCE(
            (SELECT COUNT(*) FROM evidencia_entregas ee 
             JOIN evidencias ev ON ee.evidencia_id = ev.id 
             WHERE ev.clase_id = ? AND ee.estudiante_id = e.id AND ee.estado = 'CALIFICADO'), 0
          ) AS evidencias_calificadas,
          COALESCE(
            (SELECT COUNT(*) FROM evidencia_entregas ee 
             JOIN evidencias ev ON ee.evidencia_id = ev.id 
             WHERE ev.clase_id = ? AND ee.estudiante_id = e.id), 0
          ) AS evidencias_entregadas,
          COALESCE(
            (SELECT ROUND(AVG(ee.calificacion), 2) FROM evidencia_entregas ee 
             JOIN evidencias ev ON ee.evidencia_id = ev.id 
             WHERE ev.clase_id = ? AND ee.estudiante_id = e.id AND ee.calificacion IS NOT NULL), null
          ) AS promedio_calificacion
        FROM estudiantes e
        LEFT JOIN usuarios u ON e.usuario_id = u.id
        LEFT JOIN matriculas m ON e.id = m.estudiante_id AND (m.curso_id = ? OR m.curso_id = ?)
        WHERE e.ficha_sena = ? OR m.id IS NOT NULL
        ORDER BY e.apellidos ASC, e.nombres ASC
      `, [claseId, claseId, claseId, claseId, claseId, fichaCodigo]);

      // 3. Total de evidencias de la clase
      const [evidenciasCount] = await pool.execute(
        'SELECT COUNT(*) as total FROM evidencias WHERE clase_id = ?',
        [claseId]
      );
      const totalEvidenciasClase = evidenciasCount[0]?.total || 0;

      const estudiantesConProgreso = estudiantes.map(est => {
        const totalEntregadas = est.evidencias_entregadas || 0;
        const totalCalificadas = est.evidencias_calificadas || 0;
        const porcentajeCumplimiento = totalEvidenciasClase > 0 
          ? Math.round((totalEntregadas / totalEvidenciasClase) * 100) 
          : 0;

        return {
          ...est,
          ficha_codigo: fichaCodigo,
          programa_nombre: clase.programa_nombre,
          total_evidencias_clase: totalEvidenciasClase,
          porcentaje_cumplimiento: porcentajeCumplimiento
        };
      });

      return res.json({
        status: 'success',
        data: {
          clase: {
            id: clase.id,
            nombre: clase.nombre,
            materia: clase.materia || clase.nombre,
            ficha: fichaCodigo,
            programa: clase.programa_nombre
          },
          total_estudiantes: estudiantesConProgreso.length,
          estudiantes: estudiantesConProgreso
        }
      });
    } else {
      // Fallback a mockData
      const clase = (mockData.clases || mockData.cursos || []).find(c => c.id === claseId);
      const fichaCodigo = clase?.ficha || '2712345';
      const estudiantes = (mockData.estudiantes || []).filter(e => e.ficha_sena === fichaCodigo);

      return res.json({
        status: 'success',
        data: {
          clase,
          total_estudiantes: estudiantes.length,
          estudiantes
        }
      });
    }
  } catch (error) {
    console.error('Error en getClaseEstudiantes:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * Re-estructurar endpoint de evidencias:
 * Devuelve la jerarquía Temas -> Evidencias filtradas por la clase y la ficha del estudiante
 * GET /api/v1/instructor/evidencias/:claseId
 */
async function getEvidenciasClase(req, res) {
  try {
    const { claseId } = req.params;

    if (isDatabaseConnected()) {
      const pool = getPool();

      // 1. Obtener la clase, ficha y programa
      let [claseRows] = await pool.execute(`
        SELECT 
          c.id AS clase_id,
          c.nombre AS clase_nombre,
          c.materia AS clase_materia,
          c.descripcion AS clase_descripcion,
          c.grado AS clase_grado,
          f.id AS ficha_id,
          f.codigo AS ficha_codigo,
          f.grado AS ficha_grado,
          f.jornada AS ficha_jornada,
          p.id AS programa_id,
          p.nombre AS programa_nombre
        FROM clases c
        LEFT JOIN fichas f ON c.ficha_id = f.id
        LEFT JOIN programas p ON f.programa_id = p.id
        WHERE c.id = ?
      `, [claseId]);

      if (claseRows.length === 0) {
        // Intentar con cursos
        const [cRows] = await pool.execute('SELECT * FROM cursos WHERE id = ?', [claseId]);
        if (cRows.length > 0) {
          claseRows = [{
            clase_id: cRows[0].id,
            clase_nombre: cRows[0].nombre,
            clase_materia: cRows[0].materia || cRows[0].nombre,
            clase_descripcion: cRows[0].descripcion,
            clase_grado: cRows[0].grado || 11,
            ficha_id: `ficha-${cRows[0].ficha}`,
            ficha_codigo: cRows[0].ficha,
            ficha_grado: cRows[0].grado || 11,
            ficha_jornada: 'Mañana',
            programa_id: 'prog-01',
            programa_nombre: cRows[0].programa_formacion || 'Aprendiz Desarrollador Web Junior'
          }];
        }
      }

      if (claseRows.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Clase no encontrada' });
      }

      const infoClase = claseRows[0];
      const fichaCodigo = infoClase.ficha_codigo;

      // 2. Obtener estudiantes pertenecientes a la ficha
      const [estudiantesFicha] = await pool.execute(`
        SELECT id, nombres, apellidos, numero_documento, foto_url, grado, ficha_sena
        FROM estudiantes
        WHERE ficha_sena = ?
        ORDER BY apellidos ASC, nombres ASC
      `, [fichaCodigo]);

      // 3. Obtener temas de la clase
      const [temas] = await pool.execute(`
        SELECT * FROM temas WHERE clase_id = ? ORDER BY orden ASC, semana ASC
      `, [claseId]);

      // 4. Obtener evidencias de la clase
      const [evidencias] = await pool.execute(`
        SELECT * FROM evidencias WHERE clase_id = ? ORDER BY fecha_limite ASC, titulo ASC
      `, [claseId]);

      // 5. Obtener todas las entregas para las evidencias de esta clase
      const [entregas] = await pool.execute(`
        SELECT 
          ee.*,
          e.nombres AS estudiante_nombres,
          e.apellidos AS estudiante_apellidos,
          e.numero_documento AS estudiante_documento,
          e.foto_url AS estudiante_foto
        FROM evidencia_entregas ee
        JOIN evidencias ev ON ee.evidencia_id = ev.id
        JOIN estudiantes e ON ee.estudiante_id = e.id
        WHERE ev.clase_id = ?
      `, [claseId]);

      // 6. Armar la jerarquía Temas -> Evidencias -> Entregas filtradas por estudiantes de la ficha
      const evidenciasConDetalle = evidencias.map(ev => {
        const entregasDeEvidencia = entregas.filter(ent => ent.evidencia_id === ev.id);

        // Cruce con los estudiantes de la ficha para ver quién entregó y quién no
        const estudiantesStatus = estudiantesFicha.map(est => {
          const entrega = entregasDeEvidencia.find(ent => ent.estudiante_id === est.id);
          if (entrega) {
            return {
              entrega_id: entrega.id,
              estudiante_id: est.id,
              nombres: est.nombres,
              apellidos: est.apellidos,
              numero_documento: est.numero_documento,
              foto_url: est.foto_url,
              estado: entrega.estado || (entrega.calificacion !== null ? 'CALIFICADO' : 'ENTREGADO'),
              archivo_url: entrega.archivo_url,
              enlace_externo: entrega.enlace_externo,
              comentarios_estudiante: entrega.comentarios_estudiante,
              fecha_entrega: entrega.fecha_entrega,
              calificacion: entrega.calificacion,
              comentario_instructor: entrega.comentario_instructor,
              fecha_evaluacion: entrega.fecha_evaluacion
            };
          } else {
            return {
              entrega_id: null,
              estudiante_id: est.id,
              nombres: est.nombres,
              apellidos: est.apellidos,
              numero_documento: est.numero_documento,
              foto_url: est.foto_url,
              estado: 'PENDIENTE',
              archivo_url: null,
              enlace_externo: null,
              comentarios_estudiante: null,
              fecha_entrega: null,
              calificacion: null,
              comentario_instructor: null,
              fecha_evaluacion: null
            };
          }
        });

        const recibidas = estudiantesStatus.filter(s => s.estado !== 'PENDIENTE').length;
        const calificadas = estudiantesStatus.filter(s => s.estado === 'CALIFICADO').length;

        return {
          ...ev,
          total_estudiantes_ficha: estudiantesFicha.length,
          entregas_recibidas: recibidas,
          calificadas,
          pendientes_calificar: recibidas - calificadas,
          entregas: estudiantesStatus
        };
      });

      // Agrupar evidencias por temas
      let jerarquiaTemas = [];
      if (temas.length > 0) {
        jerarquiaTemas = temas.map(tema => ({
          ...tema,
          evidencias: evidenciasConDetalle.filter(ev => ev.tema_id === tema.id)
        }));

        // Evidencias generales sin tema asignado
        const evidenciasGenerales = evidenciasConDetalle.filter(ev => !ev.tema_id);
        if (evidenciasGenerales.length > 0) {
          jerarquiaTemas.push({
            id: 'tema-general',
            titulo: 'Evidencias y Talleres Generales de la Asignatura',
            descripcion: 'Actividades curriculares integrales de la clase.',
            semana: null,
            orden: 999,
            evidencias: evidenciasGenerales
          });
        }
      } else {
        // Si no se definieron temas separados, presentar grupo principal
        jerarquiaTemas = [{
          id: 'tema-unico',
          titulo: 'Módulo Principal de Aprendizaje',
          descripcion: 'Evidencias y actividades técnicas asignadas.',
          semana: 1,
          orden: 1,
          evidencias: evidenciasConDetalle
        }];
      }

      return res.json({
        status: 'success',
        data: {
          clase: infoClase,
          ficha: {
            id: infoClase.ficha_id,
            codigo: infoClase.ficha_codigo,
            grado: infoClase.ficha_grado,
            jornada: infoClase.ficha_jornada
          },
          programa: {
            id: infoClase.programa_id,
            nombre: infoClase.programa_nombre
          },
          total_estudiantes_ficha: estudiantesFicha.length,
          total_evidencias: evidencias.length,
          temas: jerarquiaTemas,
          todas_evidencias: evidenciasConDetalle
        }
      });
    } else {
      // Mock Fallback
      return res.json({
        status: 'success',
        data: {
          clase: { id: claseId, nombre: 'Clase General' },
          temas: [],
          todas_evidencias: []
        }
      });
    }
  } catch (error) {
    console.error('Error en getEvidenciasClase:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * Evaluar / Calificar una evidencia
 * POST /api/v1/instructor/evidencias/:evidenciaId/evaluar
 * Body: { estudiante_id, calificacion, comentario, entrega_id }
 */
async function evaluarEvidencia(req, res) {
  try {
    const { evidenciaId } = req.params;
    const { estudiante_id, calificacion, comentario, observaciones, entrega_id } = req.body;
    const instructor_id = req.user.perfil_id || null;

    if (calificacion === undefined || calificacion === null || isNaN(parseFloat(calificacion))) {
      return res.status(400).json({
        status: 'error',
        message: 'Debe ingresar una calificación válida (ej. 1.0 a 5.0)'
      });
    }

    const nota = parseFloat(calificacion);
    if (nota < 1.0 || nota > 5.0) {
      return res.status(400).json({
        status: 'error',
        message: 'La calificación debe ubicarse en la escala institucional entre 1.0 y 5.0'
      });
    }

    const retroalimentacion = comentario || observaciones || '';
    const fechaEvaluacion = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (isDatabaseConnected()) {
      const pool = getPool();

      // Buscar si existe la entrega
      let entregaTarget = null;
      if (entrega_id) {
        const [rows] = await pool.execute('SELECT * FROM evidencia_entregas WHERE id = ?', [entrega_id]);
        if (rows.length > 0) entregaTarget = rows[0];
      }

      if (!entregaTarget && estudiante_id) {
        const [rows] = await pool.execute(
          'SELECT * FROM evidencia_entregas WHERE evidencia_id = ? AND estudiante_id = ?',
          [evidenciaId, estudiante_id]
        );
        if (rows.length > 0) entregaTarget = rows[0];
      }

      if (entregaTarget) {
        // Actualizar entrega existente
        await pool.execute(`
          UPDATE evidencia_entregas SET
            calificacion = ?,
            comentario_instructor = ?,
            fecha_evaluacion = ?,
            estado = 'CALIFICADO'
          WHERE id = ?
        `, [nota, retroalimentacion, fechaEvaluacion, entregaTarget.id]);

        return res.json({
          status: 'success',
          message: 'Evidencia calificada y retroalimentada exitosamente',
          data: {
            id: entregaTarget.id,
            evidencia_id: evidenciaId,
            estudiante_id: entregaTarget.estudiante_id,
            calificacion: nota,
            comentario_instructor: retroalimentacion,
            fecha_evaluacion: fechaEvaluacion,
            estado: 'CALIFICADO'
          }
        });
      } else if (estudiante_id) {
        // Si el estudiante no había subido archivo pero el docente le asienta calificación presencial/en aula
        const nuevoId = `ee-${Date.now()}`;
        await pool.execute(`
          INSERT INTO evidencia_entregas (
            id, evidencia_id, estudiante_id, archivo_url, enlace_externo,
            comentarios_estudiante, calificacion, comentario_instructor, fecha_evaluacion, estado
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CALIFICADO')
        `, [
          nuevoId,
          evidenciaId,
          estudiante_id,
          null,
          null,
          'Sustentación presencial en aula',
          nota,
          retroalimentacion,
          fechaEvaluacion
        ]);

        return res.json({
          status: 'success',
          message: 'Calificación asentada con éxito para el estudiante',
          data: {
            id: nuevoId,
            evidencia_id: evidenciaId,
            estudiante_id,
            calificacion: nota,
            comentario_instructor: retroalimentacion,
            fecha_evaluacion: fechaEvaluacion,
            estado: 'CALIFICADO'
          }
        });
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'Debe especificar el estudiante_id o entrega_id para asentar la evaluación'
        });
      }
    } else {
      // Mock Fallback
      return res.json({
        status: 'success',
        message: 'Evidencia evaluada exitosamente (Mock)',
        data: {
          evidencia_id: evidenciaId,
          estudiante_id,
          calificacion: nota,
          comentario_instructor: retroalimentacion,
          estado: 'CALIFICADO'
        }
      });
    }
  } catch (error) {
    console.error('Error en evaluarEvidencia:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * Crear y publicar un nuevo tema dentro de una competencia
 * POST /api/v1/instructor/temas
 */
async function crearTema(req, res) {
  try {
    const { competencia_id, clase_id, titulo, descripcion, contenido_detallado, semana, archivo_adjunto_url } = req.body;
    if (!titulo || !competencia_id) {
      return res.status(400).json({ status: 'error', message: 'El título y la competencia son obligatorios' });
    }

    const temaId = `tema-${Date.now()}`;
    const semanaNum = parseInt(semana) || 1;

    if (isDatabaseConnected()) {
      const pool = getPool();
      await pool.execute(`
        INSERT INTO temas (id, clase_id, competencia_id, titulo, descripcion, contenido_detallado, semana, orden, archivo_adjunto_url, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLICADO')
      `, [
        temaId,
        clase_id || null,
        competencia_id,
        titulo,
        descripcion || '',
        contenido_detallado || '',
        semanaNum,
        semanaNum,
        archivo_adjunto_url || null
      ]);
    }

    // Guardar también en CURRICULO_TEMAS_MAP para disponibilidad en memoria inmediata
    if (!CURRICULO_TEMAS_MAP[competencia_id]) {
      CURRICULO_TEMAS_MAP[competencia_id] = [];
    }
    const nuevoTema = {
      id: temaId,
      clase_id: clase_id || null,
      competencia_id,
      titulo,
      descripcion: descripcion || '',
      contenido_detallado: contenido_detallado || '',
      semana: semanaNum,
      horas: 16,
      resultado_aprendizaje: 'Alcanzar el resultado de aprendizaje de la competencia.',
      archivo_adjunto_url: archivo_adjunto_url || null,
      estado: 'PUBLICADO',
      evidencias: []
    };
    CURRICULO_TEMAS_MAP[competencia_id].push(nuevoTema);

    return res.json({
      status: 'success',
      message: 'Tema creado y publicado exitosamente',
      data: nuevoTema
    });
  } catch (error) {
    console.error('Error en crearTema:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * Evaluar o modificar evaluación de un estudiante en una competencia
 * POST /api/v1/instructor/evaluacion/calificar
 */
async function evaluarEstudianteCompetencia(req, res) {
  try {
    const instructorId = req.user.perfil_id;
    const { estudiante_id, competencia_id, calificacion, observaciones } = req.body;

    if (!estudiante_id || !competencia_id || calificacion === undefined || calificacion === null) {
      return res.status(400).json({ status: 'error', message: 'Faltan datos obligatorios para la evaluación' });
    }

    const nota = parseFloat(calificacion);
    if (isNaN(nota) || nota < 1.0 || nota > 5.0) {
      return res.status(400).json({ status: 'error', message: 'La calificación debe estar entre 1.0 y 5.0' });
    }

    const juicio = nota >= 3.5 ? 'APROBADO' : 'NO_APROBADO';
    const fecha = new Date().toISOString().split('T')[0];

    if (isDatabaseConnected()) {
      const pool = getPool();

      // Verificar si ya existe evaluación para este estudiante y competencia
      const [existe] = await pool.execute(`
        SELECT id FROM estudiante_competencias WHERE estudiante_id = ? AND competencia_id = ?
      `, [estudiante_id, competencia_id]);

      if (existe.length > 0) {
        await pool.execute(`
          UPDATE estudiante_competencias 
          SET calificacion = ?, observaciones = ?, juicio_evaluativo = ?, instructor_id = ?, fecha_evaluacion = ?
          WHERE id = ?
        `, [nota, observaciones || '', juicio, instructorId, fecha, existe[0].id]);
      } else {
        const nuevoId = `ec-${Date.now()}`;
        await pool.execute(`
          INSERT INTO estudiante_competencias (id, estudiante_id, competencia_id, instructor_id, juicio_evaluativo, fecha_evaluacion, observaciones, calificacion)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [nuevoId, estudiante_id, competencia_id, instructorId, juicio, fecha, observaciones || '', nota]);
      }
    }

    // Actualizar mockData
    const mockExistente = (mockData.estudiante_competencias || []).find(ec => ec.estudiante_id === estudiante_id && ec.competencia_id === competencia_id);
    if (mockExistente) {
      mockExistente.calificacion = nota;
      mockExistente.observaciones = observaciones;
      mockExistente.juicio_evaluativo = juicio;
      mockExistente.fecha_evaluacion = fecha;
      mockExistente.instructor_id = instructorId;
    } else {
      mockData.estudiante_competencias = mockData.estudiante_competencias || [];
      mockData.estudiante_competencias.push({
        id: `ec-${Date.now()}`,
        estudiante_id,
        competencia_id,
        instructor_id: instructorId,
        juicio_evaluativo: juicio,
        fecha_evaluacion: fecha,
        observaciones: observaciones || '',
        calificacion: nota
      });
    }

    return res.json({
      status: 'success',
      message: 'Evaluación registrada exitosamente',
      data: {
        estudiante_id,
        competencia_id,
        calificacion: nota,
        juicio_evaluativo: juicio,
        observaciones,
        fecha_evaluacion: fecha
      }
    });
  } catch (error) {
    console.error('Error en evaluarEstudianteCompetencia:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * Obtener listado de estudiantes en formato tabla Excel
 * GET /api/v1/instructor/estudiantes-tabla
 */
async function getEstudiantesTabla(req, res) {
  try {
    const instructorId = req.user.perfil_id;
    const { programa, ficha, grado, competencia_id } = req.query;

    if (isDatabaseConnected()) {
      const pool = getPool();

      // Consultar estudiantes asociados a las fichas/clases del instructor
      const [estudiantes] = await pool.execute(`
        SELECT DISTINCT
          e.id,
          e.numero_documento,
          e.nombres,
          e.apellidos,
          e.grado,
          e.jornada,
          e.ficha_sena,
          e.programa_formacion,
          e.foto_url,
          u.email
        FROM estudiantes e
        LEFT JOIN usuarios u ON e.usuario_id = u.id
        ORDER BY e.apellidos ASC, e.nombres ASC
      `);

      // Obtener todas las evaluaciones registradas
      const [evaluaciones] = await pool.execute(`
        SELECT ec.*, c.denominacion AS competencia_nombre, c.codigo_norma
        FROM estudiante_competencias ec
        JOIN competencias c ON ec.competencia_id = c.id
      `);

      // Mapear cada estudiante con su estado de evaluación
      const resultado = estudiantes.map(est => {
        const evalsEst = evaluaciones.filter(ev => ev.estudiante_id === est.id);
        const evalActiva = competencia_id 
          ? evalsEst.find(ev => ev.competencia_id === competencia_id)
          : (evalsEst.length > 0 ? evalsEst[0] : null);

        const estaEvaluado = evalActiva && evalActiva.calificacion !== null && evalActiva.calificacion !== undefined;

        return {
          ...est,
          documento: est.numero_documento || est.documento || '1023456789',
          ficha: est.ficha_sena || est.ficha || '2712345',
          programa_nombre: est.programa_formacion || est.programa_nombre || 'Técnico en Programación de Software',
          estado_evaluacion: estaEvaluado ? 'Evaluado' : 'Por evaluar',
          calificacion: estaEvaluado ? parseFloat(evalActiva.calificacion) : null,
          observaciones: evalActiva?.observaciones || '',
          juicio_evaluativo: evalActiva?.juicio_evaluativo || (estaEvaluado ? 'APROBADO' : 'POR_EVALUAR'),
          competencia_id: evalActiva?.competencia_id || competencia_id || null,
          competencia_nombre: evalActiva?.competencia_nombre || '',
          codigo_norma: evalActiva?.codigo_norma || '',
          fecha_evaluacion: evalActiva?.fecha_evaluacion || null
        };
      });

      return res.json({ status: 'success', data: resultado });
    } else {
      // Mock Fallback
      const inst = mockData.instructores.find(i => i.id === instructorId);
      const fichasCodigos = inst ? inst.fichas_asignadas : ['2712345'];
      const estudiantes = (mockData.estudiantes || []).filter(e => fichasCodigos.includes(e.ficha_sena));
      const evaluaciones = mockData.estudiante_competencias || [];

      const resultado = estudiantes.map(est => {
        const evalsEst = evaluaciones.filter(ev => ev.estudiante_id === est.id);
        const evalActiva = competencia_id 
          ? evalsEst.find(ev => ev.competencia_id === competencia_id)
          : (evalsEst.length > 0 ? evalsEst[0] : null);

        const estaEvaluado = evalActiva && (evalActiva.calificacion !== null && evalActiva.calificacion !== undefined || evalActiva.juicio_evaluativo === 'APROBADO');

        return {
          ...est,
          documento: est.numero_documento || est.documento || '1023456789',
          ficha: est.ficha_sena || est.ficha || '2712345',
          programa_nombre: est.programa_formacion || est.programa_nombre || 'Técnico en Programación de Software',
          estado_evaluacion: estaEvaluado ? 'Evaluado' : 'Por evaluar',
          calificacion: evalActiva?.calificacion || (estaEvaluado ? 4.5 : null),
          observaciones: evalActiva?.observaciones || '',
          juicio_evaluativo: evalActiva?.juicio_evaluativo || (estaEvaluado ? 'APROBADO' : 'POR_EVALUAR'),
          competencia_id: evalActiva?.competencia_id || competencia_id || null,
          fecha_evaluacion: evalActiva?.fecha_evaluacion || null
        };
      });

      return res.json({ status: 'success', data: resultado });
    }
  } catch (error) {
    console.error('Error en getEstudiantesTabla:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  getProgramasJerarquia,
  getClaseEstudiantes,
  getEvidenciasClase,
  evaluarEvidencia,
  crearTema,
  evaluarEstudianteCompetencia,
  getEstudiantesTabla
};
