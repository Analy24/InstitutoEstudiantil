const db = require('../config/db');
const { getPool, isDatabaseConnected } = require('../config/db');
const mockData = require('../data/mockData');
const bcrypt = require('bcryptjs');

// GET /reportes/estadisticas - Estadísticas institucionales para Admin
exports.getEstadisticas = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [instCount] = await pool.execute('SELECT COUNT(*) as count FROM instructores');
      const [estCount] = await pool.execute('SELECT COUNT(*) as count FROM estudiantes');
      const [empCount] = await pool.execute('SELECT COUNT(*) as count FROM empresas WHERE verificada = 1');
      const [solCount] = await pool.execute("SELECT COUNT(*) as count FROM solicitudes_alianza WHERE estado = 'PENDIENTE'");
      
      return res.json({
        success: true,
        data: {
          total_instructores: instCount[0]?.count || 2,
          total_estudiantes: estCount[0]?.count || 3,
          total_empresas: empCount[0]?.count || 2,
          solicitudes_pendientes: solCount[0]?.count || 0,
          tasa_colocacion: '82%'
        }
      });
    } else {
      const solPendientes = mockData.solicitudes_alianza?.filter(s => s.estado === 'PENDIENTE')?.length || 0;
      return res.json({
        success: true,
        data: {
          total_instructores: mockData.instructores.length,
          total_estudiantes: mockData.estudiantes.length,
          total_empresas: mockData.empresas.filter(e => e.verificada).length,
          solicitudes_pendientes: solPendientes,
          tasa_colocacion: '82%'
        }
      });
    }
  } catch (err) {
    console.error('[adminController] getEstadisticas error:', err);
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
  }
};

// GET /admin/instructores - listar todos los instructores
exports.getInstructores = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        `SELECT i.*, u.email, u.activo 
         FROM instructores i 
         JOIN usuarios u ON i.usuario_id = u.id 
         ORDER BY i.apellidos, i.nombres ASC`
      );
      res.json({ success: true, data: rows });
    } else {
      res.json({ success: true, data: mockData.instructores });
    }
  } catch (err) {
    console.error('[adminController] getInstructores error:', err);
    res.status(500).json({ success: false, message: 'Error al obtener instructores' });
  }
};

// POST /admin/instructores - registrar un nuevo instructor + usuario
exports.crearInstructor = async (req, res) => {
  const { email, password, tipo_documento, numero_documento, nombres, apellidos,
          telefono, especialidad, centro_formacion } = req.body;

  if (!email || !password || !numero_documento || !nombres || !apellidos) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios para registrar instructor' });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const userId = `usr-inst-${Date.now()}`;
    const instructorId = `inst-${Date.now()}`;

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [existing] = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
      }

      await pool.execute(
        'INSERT INTO usuarios (id, email, password_hash, rol, activo) VALUES (?, ?, ?, ?, ?)',
        [userId, email, password_hash, 'INSTRUCTOR', 1]
      );

      await pool.execute(
        `INSERT INTO instructores (id, usuario_id, tipo_documento, numero_documento, 
          nombres, apellidos, telefono, centro_formacion, especialidad) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [instructorId, userId, tipo_documento || 'CC', numero_documento,
         nombres, apellidos, telefono || '', centro_formacion || 'Instituto Estudiantil', especialidad || 'Técnico Docente']
      );
    } else {
      const existing = mockData.usuarios.find(u => u.email === email);
      if (existing) {
        return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
      }

      mockData.usuarios.push({
        id: userId,
        email,
        password_hash,
        rol: 'INSTRUCTOR',
        activo: true,
        nombre: `${nombres} ${apellidos}`,
        created_at: new Date().toISOString()
      });

      mockData.instructores.push({
        id: instructorId,
        usuario_id: userId,
        tipo_documento: tipo_documento || 'CC',
        numero_documento,
        nombres,
        apellidos,
        email,
        telefono: telefono || '',
        centro_formacion: centro_formacion || 'Instituto Estudiantil',
        especialidad: especialidad || 'Docente de Media Técnica',
        programas: [especialidad || 'Área Técnica'],
        fichas_asignadas: ['2712345'],
        estado: 'ACTIVO'
      });
    }

    res.status(201).json({
      success: true,
      message: `Instructor "${nombres} ${apellidos}" creado correctamente. Credenciales asignadas: ${email}`,
      data: { id: instructorId, email, nombres, apellidos }
    });
  } catch (err) {
    console.error('[adminController] crearInstructor error:', err);
    res.status(500).json({ success: false, message: 'Error al registrar instructor: ' + err.message });
  }
};

// GET /admin/estudiantes - listar todos los estudiantes con su estado académico completo
exports.getEstudiantes = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        `SELECT e.*, u.email, u.activo,
                (SELECT COUNT(*) FROM estudiante_competencias ec WHERE ec.estudiante_id = e.id AND ec.juicio_evaluativo = 'APROBADO') as competencias_aprobadas,
                (SELECT COUNT(*) FROM estudiante_competencias ec WHERE ec.estudiante_id = e.id AND ec.juicio_evaluativo = 'EN_PROCESO') as competencias_en_proceso,
                (SELECT COUNT(*) FROM estudiante_competencias ec WHERE ec.estudiante_id = e.id) as competencias_totales
         FROM estudiantes e 
         JOIN usuarios u ON e.usuario_id = u.id 
         ORDER BY e.grado DESC, e.apellidos ASC`
      );

      const data = rows.map(est => {
        const total = est.competencias_totales || 5;
        const aprobadas = est.competencias_aprobadas || 0;
        const enProceso = est.competencias_en_proceso || 0;
        const porcentaje = Math.round((aprobadas / total) * 100);
        
        let estado_academico = 'Al día';
        let estado_badge = 'badge-success';

        if (porcentaje >= 80) {
          estado_academico = 'Apto Práctica (≥80%)';
          estado_badge = 'badge-success';
        } else if (porcentaje >= 50) {
          estado_academico = `En Proceso (${porcentaje}%)`;
          estado_badge = 'badge-warning';
        } else if (enProceso > 0) {
          estado_academico = 'Faltan Notas / En Calificación';
          estado_badge = 'badge-warning';
        } else {
          estado_academico = 'Por Evaluar';
          estado_badge = 'badge-info';
        }

        return {
          ...est,
          porcentaje_avance: porcentaje,
          estado_academico,
          estado_badge
        };
      });

      res.json({ success: true, data });
    } else {
      const data = mockData.estudiantes.map(est => {
        const evals = mockData.estudiante_competencias.filter(ec => ec.estudiante_id === est.id);
        const aprobadas = evals.filter(ec => ec.juicio_evaluativo === 'APROBADO').length;
        const enProceso = evals.filter(ec => ec.juicio_evaluativo === 'EN_PROCESO').length;
        const total = 5;
        const porcentaje = Math.round((aprobadas / total) * 100);

        let estado_academico = 'Al día';
        let estado_badge = 'badge-success';

        if (porcentaje >= 70) {
          estado_academico = 'Apto Práctica (≥70%)';
          estado_badge = 'badge-success';
        } else if (porcentaje >= 40) {
          estado_academico = `En Proceso (${porcentaje}%)`;
          estado_badge = 'badge-warning';
        } else if (enProceso > 0) {
          estado_academico = 'Faltan Notas';
          estado_badge = 'badge-warning';
        } else {
          estado_academico = 'Por Evaluar';
          estado_badge = 'badge-info';
        }

        return {
          ...est,
          competencias_aprobadas: aprobadas,
          competencias_totales: total,
          porcentaje_avance: porcentaje,
          estado_academico,
          estado_badge
        };
      });

      res.json({ success: true, data });
    }
  } catch (err) {
    console.error('[adminController] getEstudiantes error:', err);
    res.status(500).json({ success: false, message: 'Error al obtener estudiantes' });
  }
};

// POST /admin/estudiantes - registrar un nuevo estudiante + usuario
exports.crearEstudiante = async (req, res) => {
  const { email, password, tipo_documento, numero_documento, nombres, apellidos,
          grado, ficha_sena, programa_formacion, jornada, telefono } = req.body;

  if (!email || !password || !numero_documento || !nombres || !apellidos) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios para registrar estudiante' });
  }

  // Lista de los 3 programas oficiales
  const programasValidos = [
    'Auxiliar de Bases de Datos y Soporte TI',
    'Aprendiz Desarrollador Web Junior',
    'Auxiliar en Contaduría Pública'
  ];

  const programaFinal = programasValidos.includes(programa_formacion)
    ? programa_formacion
    : 'Aprendiz Desarrollador Web Junior';

  const colegioId = 'col-01'; // Única institución: Instituto Estudiantil

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const userId = `usr-est-${Date.now()}`;
    const estudianteId = `est-${Date.now()}`;

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [existing] = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
      }

      await pool.execute(
        'INSERT INTO usuarios (id, email, password_hash, rol, activo) VALUES (?, ?, ?, ?, ?)',
        [userId, email, password_hash, 'ESTUDIANTE', 1]
      );

      await pool.execute(
        `INSERT INTO estudiantes (id, usuario_id, colegio_id, tipo_documento, numero_documento, 
          nombres, apellidos, grado, ficha_sena, programa_formacion, jornada, telefono) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [estudianteId, userId, colegioId, tipo_documento || 'TI', numero_documento,
         nombres, apellidos, Number(grado) || 10, ficha_sena || '2712345', programaFinal, jornada || 'MAÑANA', telefono || '']
      );
    } else {
      const existing = mockData.usuarios.find(u => u.email === email);
      if (existing) {
        return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
      }

      mockData.usuarios.push({
        id: userId,
        email,
        password_hash,
        rol: 'ESTUDIANTE',
        activo: true,
        nombre: `${nombres} ${apellidos}`,
        created_at: new Date().toISOString()
      });

      mockData.estudiantes.push({
        id: estudianteId,
        usuario_id: userId,
        colegio_id: colegioId,
        colegio_nombre: 'Instituto Estudiantil',
        tipo_documento: tipo_documento || 'TI',
        numero_documento,
        nombres,
        apellidos,
        email,
        grado: Number(grado) || 10,
        ficha_sena: ficha_sena || (Number(grado) === 11 ? '2712345' : '2812345'),
        programa_formacion: programaFinal,
        jornada: jornada || 'Mañana',
        telefono: telefono || '',
        resumen_perfil: `Estudiante de grado ${grado}° en formación técnica.`,
        hoja_vida_url: '',
        foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        habilidades: ['Trabajo en equipo', 'Compromiso académico'],
        documentos: []
      });
    }

    res.status(201).json({
      success: true,
      message: `Estudiante "${nombres} ${apellidos}" registrado exitosamente. Entréguele al estudiante estas credenciales -> Usuario: ${email} | Contraseña: ${password}`,
      data: { id: estudianteId, email, nombres, apellidos, grado, programa_formacion: programaFinal }
    });
  } catch (err) {
    console.error('[adminController] crearEstudiante error:', err);
    res.status(500).json({ success: false, message: 'Error al registrar estudiante: ' + err.message });
  }
};
