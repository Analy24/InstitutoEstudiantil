const { getPool, isDatabaseConnected } = require('../config/db');
const mockData = require('../data/mockData');

async function getMiPerfil(req, res) {
  try {
    const estudianteId = req.user.perfil_id;
    let estudiante = null;
    let competencias = [];
    let evaluaciones = [];
    let postulaciones = [];

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [estRows] = await pool.execute(
        'SELECT e.*, c.nombre as colegio_nombre FROM estudiantes e JOIN colegios c ON e.colegio_id = c.id WHERE e.id = ?',
        [estudianteId]
      );
      estudiante = estRows[0] || null;

      const [compRows] = await pool.execute('SELECT * FROM competencias ORDER BY fase_proyecto ASC');
      competencias = compRows;

      const [evalRows] = await pool.execute(
        `SELECT ec.*, c.codigo_norma, c.denominacion, c.fase_proyecto 
         FROM estudiante_competencias ec 
         JOIN competencias c ON ec.competencia_id = c.id 
         WHERE ec.estudiante_id = ?`,
        [estudianteId]
      );
      evaluaciones = evalRows;

      const [postRows] = await pool.execute(
        `SELECT p.*, v.titulo as vacante_titulo, v.modalidad, v.ubicacion, v.auxilio_sostenimiento,
                emp.razon_social as empresa_nombre, emp.ciudad as empresa_ciudad, emp.sector_economico
         FROM postulaciones p
         JOIN vacantes v ON p.vacante_id = v.id
         JOIN empresas emp ON v.empresa_id = emp.id
         WHERE p.estudiante_id = ?
         ORDER BY p.fecha_postulacion DESC`,
        [estudianteId]
      );
      postulaciones = postRows;
    } else {
      estudiante = mockData.estudiantes.find(e => e.id === estudianteId || e.usuario_id === req.user.id);
      competencias = mockData.competencias;
      if (estudiante) {
        evaluaciones = mockData.estudiante_competencias.filter(ec => ec.estudiante_id === estudiante.id);
        postulaciones = (mockData.postulaciones || [])
          .filter(p => p.estudiante_id === estudiante.id)
          .map(p => {
            const v = (mockData.vacantes || []).find(vac => vac.id === p.vacante_id) || {};
            const emp = (mockData.empresas || []).find(e => e.id === v.empresa_id) || {};
            return {
              ...p,
              vacante_titulo: v.titulo,
              empresa_nombre: emp.razon_social
            };
          });
      }
    }

    if (!estudiante) {
      return res.status(404).json({ status: 'error', message: 'Perfil de estudiante no encontrado' });
    }

    // Detallar competencias con estado
    const detalleCompetencias = competencias.map(c => {
      const evaluacion = evaluaciones.find(e => e.competencia_id === c.id);
      return {
        ...c,
        juicio_evaluativo: evaluacion ? evaluacion.juicio_evaluativo : 'POR_EVALUAR',
        fecha_evaluacion: evaluacion ? evaluacion.fecha_evaluacion : null,
        observaciones: evaluacion ? evaluacion.observaciones : '',
        evidencias_url: evaluacion ? evaluacion.evidencias_url : null
      };
    });

    const totalAprobadas = detalleCompetencias.filter(c => c.juicio_evaluativo === 'APROBADO').length;
    const porcentajeAvance = competencias.length > 0 
      ? Math.round((totalAprobadas / competencias.length) * 100) 
      : 0;

    return res.json({
      status: 'success',
      data: {
        ...estudiante,
        colegio_nombre: 'Instituto Estudiantil',
        porcentaje_avance: porcentajeAvance,
        apto_practica: porcentajeAvance >= 70,
        competencias_aprobadas_count: totalAprobadas,
        total_competencias_count: competencias.length,
        competencias: detalleCompetencias,
        postulaciones: postulaciones || [],
        documentos: estudiante.documentos || [
          { id: 'doc-1', nombre: 'Documento de Identidad', tipo: 'IDENTIDAD', url: '/uploads/identidad.pdf', estado: 'VERIFICADO', fecha: '2026-02-01' },
          { id: 'doc-2', nombre: 'Certificado EPS', tipo: 'EPS', url: '/uploads/eps.pdf', estado: 'VERIFICADO', fecha: '2026-02-01' },
          { id: 'doc-3', nombre: 'Hoja de Vida en Formato PDF', tipo: 'HOJA_VIDA', url: estudiante.hoja_vida_url || '/uploads/hv.pdf', estado: 'VERIFICADO', fecha: '2026-02-15' }
        ]
      }
    });
  } catch (error) {
    console.error('Error en getMiPerfil:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

// GET /estudiantes/:id/detalle-completo (Para instructores, empresas y admin)
// Ahora incluye estado de postulaciones, contratación, empresa, y tiempo contratado
async function getEstudianteDetalleCompleto(req, res) {
  try {
    const { id } = req.params;
    let estudiante = null;
    let competencias = [];
    let evaluaciones = [];
    let postulaciones = [];

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [estRows] = await pool.execute(
        `SELECT e.*, u.email 
         FROM estudiantes e 
         JOIN usuarios u ON e.usuario_id = u.id 
         WHERE e.id = ?`,
        [id]
      );
      estudiante = estRows[0] || null;

      const [compRows] = await pool.execute('SELECT * FROM competencias ORDER BY fase_proyecto ASC');
      competencias = compRows;

      const [evalRows] = await pool.execute(
        `SELECT ec.*, c.codigo_norma, c.denominacion, c.fase_proyecto 
         FROM estudiante_competencias ec 
         JOIN competencias c ON ec.competencia_id = c.id 
         WHERE ec.estudiante_id = ?`,
        [id]
      );
      evaluaciones = evalRows;

      // Obtener postulaciones del estudiante con info de empresa y vacante
      const [postRows] = await pool.execute(
        `SELECT p.*, v.titulo as vacante_titulo, v.modalidad, v.ubicacion, v.auxilio_sostenimiento,
                emp.razon_social as empresa_nombre, emp.ciudad as empresa_ciudad, emp.sector_economico
         FROM postulaciones p
         JOIN vacantes v ON p.vacante_id = v.id
         JOIN empresas emp ON v.empresa_id = emp.id
         WHERE p.estudiante_id = ?
         ORDER BY p.fecha_postulacion DESC`,
        [id]
      );
      postulaciones = postRows;
    } else {
      estudiante = mockData.estudiantes.find(e => e.id === id);
      competencias = mockData.competencias;
      if (estudiante) {
        evaluaciones = mockData.estudiante_competencias
          .filter(ec => ec.estudiante_id === id)
          .map(ec => {
            const comp = mockData.competencias.find(c => c.id === ec.competencia_id) || {};
            return {
              ...ec,
              codigo_norma: comp.codigo_norma,
              denominacion: comp.denominacion,
              fase_proyecto: comp.fase_proyecto
            };
          });

        // Obtener postulaciones del estudiante desde mockData
        postulaciones = mockData.postulaciones
          .filter(p => p.estudiante_id === id)
          .map(p => {
            const vacante = mockData.vacantes.find(v => v.id === p.vacante_id) || {};
            const empresa = mockData.empresas.find(e => e.id === vacante.empresa_id) || {};
            return {
              ...p,
              vacante_titulo: p.vacante_titulo || vacante.titulo || 'Vacante',
              modalidad: vacante.modalidad || 'PRESENCIAL',
              ubicacion: vacante.ubicacion || 'Bogotá D.C.',
              auxilio_sostenimiento: vacante.auxilio_sostenimiento || 0,
              empresa_nombre: p.empresa_nombre || empresa.razon_social || 'Empresa',
              empresa_ciudad: empresa.ciudad || 'Bogotá D.C.',
              sector_economico: empresa.sector_economico || 'General'
            };
          });
      }
    }

    if (!estudiante) {
      return res.status(404).json({ status: 'error', message: 'Estudiante no encontrado' });
    }

    const detalleCompetencias = competencias.map(c => {
      const evaluacion = evaluaciones.find(e => e.competencia_id === c.id);
      return {
        ...c,
        juicio_evaluativo: evaluacion ? evaluacion.juicio_evaluativo : 'POR_EVALUAR',
        fecha_evaluacion: evaluacion ? evaluacion.fecha_evaluacion : null,
        observaciones: evaluacion ? evaluacion.observaciones : '',
        evidencias_url: evaluacion ? evaluacion.evidencias_url : null,
        instructor_nombre: evaluacion ? evaluacion.instructor_nombre : null
      };
    });

    const totalAprobadas = detalleCompetencias.filter(c => c.juicio_evaluativo === 'APROBADO').length;
    const enProceso = detalleCompetencias.filter(c => c.juicio_evaluativo === 'EN_PROCESO').length;
    const porEvaluar = detalleCompetencias.filter(c => c.juicio_evaluativo === 'POR_EVALUAR').length;
    const porcentajeAvance = competencias.length > 0 
      ? Math.round((totalAprobadas / competencias.length) * 100) 
      : 0;

    // Determinar estado laboral / de contratación
    let estado_contratacion = 'SIN_POSTULACIONES';
    let empresa_contratante = null;
    let fecha_contratacion = null;
    let tiempo_contratado = null;

    if (postulaciones.length > 0) {
      const contratado = postulaciones.find(p => p.estado === 'CONTRATADO');
      const preseleccionado = postulaciones.find(p => p.estado === 'PRESELECCIONADO');
      const enRevision = postulaciones.find(p => p.estado === 'POSTULADO' || p.estado === 'EN_REVISION');

      if (contratado) {
        estado_contratacion = 'CONTRATADO';
        empresa_contratante = {
          nombre: contratado.empresa_nombre,
          ciudad: contratado.empresa_ciudad,
          sector: contratado.sector_economico,
          vacante: contratado.vacante_titulo,
          modalidad: contratado.modalidad,
          auxilio: contratado.auxilio_sostenimiento
        };
        // Calcular tiempo contratado
        const fechaContrato = contratado.fecha_contratacion || contratado.fecha_postulacion;
        if (fechaContrato) {
          fecha_contratacion = fechaContrato;
          const ahora = new Date();
          const inicio = new Date(fechaContrato);
          const diffMs = ahora - inicio;
          const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const meses = Math.floor(dias / 30);
          const diasRestantes = dias % 30;
          tiempo_contratado = meses > 0 
            ? `${meses} mes${meses > 1 ? 'es' : ''} y ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`
            : `${dias} día${dias !== 1 ? 's' : ''}`;
        }
      } else if (preseleccionado) {
        estado_contratacion = 'EN_PROCESO_CONTRATACION';
        empresa_contratante = {
          nombre: preseleccionado.empresa_nombre,
          ciudad: preseleccionado.empresa_ciudad,
          sector: preseleccionado.sector_economico,
          vacante: preseleccionado.vacante_titulo,
          modalidad: preseleccionado.modalidad,
          auxilio: preseleccionado.auxilio_sostenimiento
        };
      } else if (enRevision) {
        estado_contratacion = 'POSTULADO_EN_REVISION';
      } else {
        estado_contratacion = 'POSTULACIONES_CERRADAS';
      }
    }

    return res.json({
      status: 'success',
      data: {
        ...estudiante,
        colegio_nombre: 'Instituto Estudiantil',
        porcentaje_avance: porcentajeAvance,
        apto_practica: porcentajeAvance >= 70,
        competencias_aprobadas_count: totalAprobadas,
        competencias_en_proceso_count: enProceso,
        competencias_por_evaluar_count: porEvaluar,
        total_competencias_count: competencias.length,
        competencias: detalleCompetencias,
        postulaciones,
        estado_contratacion,
        empresa_contratante,
        fecha_contratacion,
        tiempo_contratado,
        documentos: estudiante.documentos || [
          { id: 'doc-1', nombre: 'Documento de Identidad (TI)', tipo: 'IDENTIDAD', url: '/uploads/ti.pdf', estado: 'VERIFICADO', fecha: '2026-02-01' },
          { id: 'doc-2', nombre: 'Certificado de Afiliación EPS', tipo: 'EPS', url: '/uploads/eps.pdf', estado: 'VERIFICADO', fecha: '2026-02-01' },
          { id: 'doc-3', nombre: 'Hoja de Vida en Formato PDF', tipo: 'HOJA_VIDA', url: estudiante.hoja_vida_url || '/uploads/hv.pdf', estado: 'VERIFICADO', fecha: '2026-02-15' }
        ]
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

// GET /estudiantes/buscar-documento/:documento - Buscar estudiante por número de documento (Admin)
async function buscarPorDocumento(req, res) {
  try {
    const { documento } = req.params;
    let resultados = [];

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        `SELECT e.*, u.email, u.activo FROM estudiantes e 
         JOIN usuarios u ON e.usuario_id = u.id 
         WHERE e.numero_documento LIKE ?
         ORDER BY e.apellidos ASC`,
        [`%${documento}%`]
      );
      resultados = rows;
    } else {
      resultados = mockData.estudiantes.filter(e =>
        e.numero_documento && e.numero_documento.includes(documento)
      );
    }

    return res.json({ status: 'success', data: resultados });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateMiPerfil(req, res) {
  try {
    const estudianteId = req.user.perfil_id;
    const { telefono, resumen_perfil, github_url, foto_url } = req.body;

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute('SELECT * FROM estudiantes WHERE id = ?', [estudianteId]);
      const actual = rows[0] || {};
      
      const newTelefono = telefono !== undefined ? telefono : actual.telefono;
      const newResumen = resumen_perfil !== undefined ? resumen_perfil : actual.resumen_perfil;
      const newFoto = foto_url !== undefined ? foto_url : actual.foto_url;

      await pool.execute(
        'UPDATE estudiantes SET telefono = ?, resumen_perfil = ?, foto_url = ? WHERE id = ?',
        [newTelefono, newResumen, newFoto, estudianteId]
      );
    } else {
      const est = mockData.estudiantes.find(e => e.id === estudianteId || e.usuario_id === req.user.id);
      if (est) {
        if (telefono !== undefined) est.telefono = telefono;
        if (resumen_perfil !== undefined) est.resumen_perfil = resumen_perfil;
        if (github_url !== undefined) est.github_url = github_url;
        if (foto_url !== undefined) est.foto_url = foto_url;
      }
    }

    return res.json({
      status: 'success',
      message: 'Perfil de estudiante actualizado correctamente'
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  getMiPerfil,
  getEstudianteDetalleCompleto,
  buscarPorDocumento,
  updateMiPerfil
};
