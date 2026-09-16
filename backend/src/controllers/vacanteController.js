const { getPool, isDatabaseConnected } = require('../config/db');
const mockData = require('../data/mockData');

// GET /vacantes - Listar todas las vacantes abiertas
async function getVacantes(req, res) {
  try {
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        `SELECT v.*, e.razon_social as empresa_nombre, e.ciudad as empresa_ciudad 
         FROM vacantes v 
         JOIN empresas e ON v.empresa_id = e.id 
         WHERE v.estado = 'ABIERTA' 
         ORDER BY v.id DESC`
      );
      return res.json({ status: 'success', data: rows });
    } else {
      const vacantesAbiertas = mockData.vacantes.filter(v => v.estado === 'ABIERTA');
      return res.json({ status: 'success', data: vacantesAbiertas });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

// POST /vacantes - Crear una nueva vacante (Empresa / Admin)
async function crearVacante(req, res) {
  const { titulo, descripcion, requisitos, modalidad, ubicacion, cupos_disponibles,
          auxilio_sostenimiento, fecha_limite } = req.body;

  if (!titulo || !descripcion) {
    return res.status(400).json({ status: 'error', message: 'El título del cargo y la descripción son obligatorios.' });
  }

  const empresaId = req.user.perfil_id || (mockData.empresas[0] ? mockData.empresas[0].id : 'emp-01');
  const vacanteId = `vac-${Date.now()}`;
  const auxilioVal = Number(auxilio_sostenimiento) || 1423500;
  const cuposVal = Number(cupos_disponibles) || 1;

  try {
    if (isDatabaseConnected()) {
      const pool = getPool();
      await pool.execute(
        `INSERT INTO vacantes (id, empresa_id, titulo, descripcion, requisitos, modalidad, 
          ubicacion, cupos_disponibles, auxilio_sostenimiento, fecha_limite, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ABIERTA')`,
        [vacanteId, empresaId, titulo, descripcion, requisitos || '', modalidad || 'PRESENCIAL',
         ubicacion || 'Bogotá D.C.', cuposVal, auxilioVal, fecha_limite || '2026-12-31']
      );
    } else {
      const empresa = mockData.empresas.find(e => e.id === empresaId) || mockData.empresas[0];
      mockData.vacantes.unshift({
        id: vacanteId,
        empresa_id: empresaId,
        empresa_nombre: empresa ? empresa.razon_social : 'Empresa Aliada',
        empresa_ciudad: empresa ? empresa.ciudad : 'Bogotá D.C.',
        titulo,
        descripcion,
        requisitos: requisitos || '',
        modalidad: modalidad || 'PRESENCIAL',
        ubicacion: ubicacion || 'Bogotá D.C.',
        cupos_disponibles: cuposVal,
        auxilio_sostenimiento: auxilioVal,
        fecha_limite: fecha_limite || '2026-12-31',
        estado: 'ABIERTA',
        competencias_requeridas: []
      });
    }

    return res.status(201).json({
      status: 'success',
      message: `Vacante "${titulo}" publicada con éxito para los estudiantes del Instituto Estudiantil.`,
      data: { id: vacanteId, titulo, auxilio_sostenimiento: auxilioVal }
    });
  } catch (error) {
    console.error('Error al crear vacante:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

// POST /vacantes/:id/postularme - Estudiante se postula a vacante
async function postularme(req, res) {
  try {
    const { id: vacanteId } = req.params;
    const estudianteId = req.user.perfil_id;

    if (!estudianteId) {
      return res.status(403).json({
        status: 'error',
        message: 'Solo los estudiantes matriculados pueden postularse a vacantes de práctica.'
      });
    }

    let estudiante = null;
    let competencias = [];
    let evaluaciones = [];
    let vacante = null;
    let postuladoPrevio = false;

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [vRows] = await pool.execute('SELECT * FROM vacantes WHERE id = ? AND estado = "ABIERTA"', [vacanteId]);
      if (vRows.length === 0) {
        return res.status(404).json({ status: 'error', message: 'La vacante no existe o ya está cerrada.' });
      }
      vacante = vRows[0];

      // Validar si ya postuló
      const [pRows] = await pool.execute('SELECT id FROM postulaciones WHERE vacante_id = ? AND estudiante_id = ?', [vacanteId, estudianteId]);
      if (pRows.length > 0) {
        return res.status(409).json({ status: 'error', message: 'Ya te has postulado a esta vacante.' });
      }

      const [compRows] = await pool.execute('SELECT * FROM competencias');
      competencias = compRows;

      const [evalRows] = await pool.execute(
        'SELECT * FROM estudiante_competencias WHERE estudiante_id = ? AND juicio_evaluativo = "APROBADO"',
        [estudianteId]
      );
      evaluaciones = evalRows;
    } else {
      vacante = mockData.vacantes.find(v => v.id === vacanteId && v.estado === 'ABIERTA');
      if (!vacante) {
        return res.status(404).json({ status: 'error', message: 'La vacante solicitada no existe o ya está cerrada.' });
      }

      postuladoPrevio = mockData.postulaciones.some(p => p.vacante_id === vacanteId && p.estudiante_id === estudianteId);
      if (postuladoPrevio) {
        return res.status(409).json({ status: 'error', message: 'Ya te has postulado a esta vacante.' });
      }

      estudiante = mockData.estudiantes.find(e => e.id === estudianteId || e.usuario_id === req.user.id);
      competencias = mockData.competencias;
      evaluaciones = mockData.estudiante_competencias.filter(
        ec => ec.estudiante_id === (estudiante ? estudiante.id : estudianteId) && ec.juicio_evaluativo === 'APROBADO'
      );
    }

    // Regla Institucional: Al menos 70% de competencias aprobadas
    const totalAprobadas = evaluaciones.length;
    const totalCompetencias = competencias.length || 5;
    const porcentajeAvance = Math.round((totalAprobadas / totalCompetencias) * 100);

    if (porcentajeAvance < 70) {
      return res.status(422).json({
        status: 'error',
        code: 'COMPETENCIES_REQUIREMENT_NOT_MET',
        message: `Regla institucional Instituto Estudiantil: Tu avance actual es del ${porcentajeAvance}%. Se requiere al menos un 70% de competencias técnicas aprobadas para postularse a etapa práctica.`,
        data: {
          avance_actual: porcentajeAvance,
          minimo_requerido: 70,
          aprobadas: totalAprobadas,
          totales: totalCompetencias
        }
      });
    }

    // Registrar postulación
    const nuevaPostulacionId = `post-${Date.now()}`;

    if (isDatabaseConnected()) {
      const pool = getPool();
      await pool.execute(
        'INSERT INTO postulaciones (id, vacante_id, estudiante_id, estado) VALUES (?, ?, ?, "POSTULADO")',
        [nuevaPostulacionId, vacanteId, estudianteId]
      );
    } else {
      mockData.postulaciones.push({
        id: nuevaPostulacionId,
        vacante_id: vacanteId,
        vacante_titulo: vacante.titulo,
        empresa_nombre: vacante.empresa_nombre || 'Empresa Aliada',
        estudiante_id: estudiante ? estudiante.id : estudianteId,
        estudiante_nombre: req.user.nombre,
        estudiante_email: req.user.email,
        estudiante_colegio: 'Instituto Estudiantil',
        fecha_postulacion: new Date().toISOString(),
        estado: 'POSTULADO',
        retroalimentacion: 'Postulación radicada exitosamente en espera de revisión por el equipo de talento.'
      });
    }

    return res.status(201).json({
      status: 'success',
      message: '¡Felicitaciones! Tu postulación ha sido radicada exitosamente ante la empresa.',
      data: {
        postulacion_id: nuevaPostulacionId,
        estado: 'POSTULADO',
        avance_verificado: `${porcentajeAvance}% de competencias aprobadas`
      }
    });
  } catch (error) {
    console.error('Error al postularse a vacante:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

// GET /empresas/postulaciones - Ver candidatos para la empresa con información detallada
async function getPostulacionesEmpresa(req, res) {
  try {
    const empresaId = req.user.perfil_id;
    let postulaciones = [];

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        `SELECT p.*, v.titulo as vacante_titulo, 
                e.id as estudiante_id, e.nombres as est_nombres, e.apellidos as est_apellidos, 
                e.grado as estudiante_grado, e.programa_formacion as estudiante_programa, 
                e.telefono as estudiante_telefono, e.resumen_perfil, e.hoja_vida_url, e.foto_url,
                u.email as estudiante_email,
                (SELECT COUNT(*) FROM estudiante_competencias ec WHERE ec.estudiante_id = e.id AND ec.juicio_evaluativo = 'APROBADO') as competencias_aprobadas
         FROM postulaciones p
         JOIN vacantes v ON p.vacante_id = v.id
         JOIN estudiantes e ON p.estudiante_id = e.id
         JOIN usuarios u ON e.usuario_id = u.id
         WHERE v.empresa_id = ?
         ORDER BY p.fecha_postulacion DESC`,
        [empresaId]
      );
      
      // Adjuntar evaluaciones/notas para cada candidato
      for (const r of rows) {
        const [evals] = await pool.execute(
          `SELECT ec.*, c.codigo_norma, c.denominacion, c.fase_proyecto 
           FROM estudiante_competencias ec
           JOIN competencias c ON ec.competencia_id = c.id
           WHERE ec.estudiante_id = ?`,
          [r.estudiante_id]
        );
        r.evaluaciones = evals;
      }

      postulaciones = rows.map(r => ({
        ...r,
        estudiante_nombre: `${r.est_nombres} ${r.est_apellidos}`,
        estudiante_colegio: 'Instituto Estudiantil'
      }));
    } else {
      postulaciones = mockData.postulaciones.map(p => {
        const est = mockData.estudiantes.find(e => e.id === p.estudiante_id) || {};
        const evals = mockData.estudiante_competencias
          .filter(ec => ec.estudiante_id === p.estudiante_id)
          .map(ec => {
            const comp = mockData.competencias.find(c => c.id === ec.competencia_id) || {};
            return {
              ...ec,
              codigo_norma: comp.codigo_norma,
              denominacion: comp.denominacion,
              fase_proyecto: comp.fase_proyecto
            };
          });

        return {
          ...p,
          estudiante_nombre: p.estudiante_nombre || `${est.nombres} ${est.apellidos}`,
          estudiante_email: est.email || 'estudiante@estudiantil.edu.co',
          estudiante_telefono: est.telefono || '3109876543',
          estudiante_grado: est.grado || 11,
          estudiante_programa: est.programa_formacion || 'Aprendiz Desarrollador Web Junior',
          estudiante_colegio: 'Instituto Estudiantil',
          resumen_perfil: est.resumen_perfil || '',
          hoja_vida_url: est.hoja_vida_url || '',
          habilidades: est.habilidades || [],
          documentos: est.documentos || [],
          evaluaciones: evals,
          competencias_aprobadas: evals.filter(e => e.juicio_evaluativo === 'APROBADO').length
        };
      });
    }

    return res.json({ status: 'success', data: postulaciones });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

// PATCH /postulaciones/:id/estado - Actualizar estado del candidato
async function actualizarEstadoPostulacion(req, res) {
  try {
    const { id } = req.params;
    const { estado, retroalimentacion } = req.body;

    if (!estado) {
      return res.status(400).json({ status: 'error', message: 'El estado es obligatorio.' });
    }

    if (isDatabaseConnected()) {
      const pool = getPool();
      await pool.execute(
        'UPDATE postulaciones SET estado = ?, retroalimentacion = ? WHERE id = ?',
        [estado, retroalimentacion || null, id]
      );
    } else {
      const post = mockData.postulaciones.find(p => p.id === id);
      if (post) {
        post.estado = estado;
        if (retroalimentacion) post.retroalimentacion = retroalimentacion;
      }
    }

    return res.json({
      status: 'success',
      message: `Candidato actualizado a estado "${estado}" exitosamente.`
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  getVacantes,
  crearVacante,
  postularme,
  getPostulacionesEmpresa,
  actualizarEstadoPostulacion
};
