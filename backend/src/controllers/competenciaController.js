const { getPool, isDatabaseConnected } = require('../config/db');
const mockData = require('../data/mockData');

async function getCompetencias(req, res) {
  try {
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute('SELECT * FROM competencias ORDER BY fase_proyecto ASC, codigo_norma ASC');
      return res.json({ status: 'success', data: rows });
    } else {
      return res.json({ status: 'success', data: mockData.competencias });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getMatrizFicha(req, res) {
  try {
    const { ficha } = req.params;
    let estudiantes = [];
    let competencias = [];
    let juicios = [];

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [estRows] = await pool.execute(
        'SELECT e.*, c.nombre as colegio_nombre FROM estudiantes e JOIN colegios c ON e.colegio_id = c.id WHERE e.ficha_sena = ? ORDER BY e.apellidos ASC',
        [ficha]
      );
      estudiantes = estRows;

      const [compRows] = await pool.execute('SELECT * FROM competencias ORDER BY codigo_norma ASC');
      competencias = compRows;

      const [juicRows] = await pool.execute(
        `SELECT ec.*, c.codigo_norma, c.denominacion 
         FROM estudiante_competencias ec 
         JOIN competencias c ON ec.competencia_id = c.id 
         WHERE ec.estudiante_id IN (SELECT id FROM estudiantes WHERE ficha_sena = ?)`,
        [ficha]
      );
      juicios = juicRows;
    } else {
      estudiantes = mockData.estudiantes.filter(e => e.ficha_sena === ficha);
      competencias = mockData.competencias;
      juicios = mockData.estudiante_competencias;
    }

    // Estructurar matriz consolidada
    const matriz = estudiantes.map(est => {
      const juiciosEstudiante = competencias.map(comp => {
        const evaluacion = juicios.find(j => j.estudiante_id === est.id && j.competencia_id === comp.id);
        return {
          competencia_id: comp.id,
          codigo_norma: comp.codigo_norma,
          denominacion: comp.denominacion,
          juicio_evaluativo: evaluacion ? evaluacion.juicio_evaluativo : 'POR_EVALUAR',
          fecha_evaluacion: evaluacion ? evaluacion.fecha_evaluacion : null,
          observaciones: evaluacion ? evaluacion.observaciones : '',
          evidencias_url: evaluacion ? evaluacion.evidencias_url : null
        };
      });

      const totalAprobadas = juiciosEstudiante.filter(j => j.juicio_evaluativo === 'APROBADO').length;
      const porcentajeAvance = competencias.length > 0 
        ? Math.round((totalAprobadas / competencias.length) * 100) 
        : 0;

      return {
        ...est,
        colegio_nombre: 'Instituto Estudiantil',
        porcentaje_avance: porcentajeAvance,
        apto_practica: porcentajeAvance >= 70,
        evaluaciones: juiciosEstudiante
      };
    });

    return res.json({
      status: 'success',
      data: {
        ficha,
        total_estudiantes: estudiantes.length,
        total_competencias: competencias.length,
        competencias,
        matriz
      }
    });
  } catch (error) {
    console.error('Error al generar matriz de ficha:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function evaluarCompetencia(req, res) {
  try {
    const { estudiante_id, competencia_id, juicio_evaluativo, observaciones, evidencias_url } = req.body;
    const instructor_id = req.user.perfil_id || null;

    if (!estudiante_id || !competencia_id || !juicio_evaluativo) {
      return res.status(400).json({
        status: 'error',
        message: 'Faltan parámetros obligatorios: estudiante_id, competencia_id o juicio_evaluativo'
      });
    }

    const fecha_evaluacion = (juicio_evaluativo === 'APROBADO' || juicio_evaluativo === 'NO_APROBADO' || juicio_evaluativo === 'REPROBADO_CANCELADO')
      ? new Date().toISOString().split('T')[0]
      : null;

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [existing] = await pool.execute(
        'SELECT id FROM estudiante_competencias WHERE estudiante_id = ? AND competencia_id = ?',
        [estudiante_id, competencia_id]
      );
      if (existing.length > 0) {
        await pool.execute(
          `UPDATE estudiante_competencias SET
            juicio_evaluativo = ?, fecha_evaluacion = ?, observaciones = ?,
            evidencias_url = ?, instructor_id = ?
           WHERE estudiante_id = ? AND competencia_id = ?`,
          [juicio_evaluativo, fecha_evaluacion, observaciones || null, evidencias_url || null, instructor_id, estudiante_id, competencia_id]
        );
      } else {
        await pool.execute(
          `INSERT INTO estudiante_competencias (id, estudiante_id, competencia_id, instructor_id, juicio_evaluativo, fecha_evaluacion, observaciones, evidencias_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [`ec-${Date.now()}`, estudiante_id, competencia_id, instructor_id, juicio_evaluativo, fecha_evaluacion, observaciones || null, evidencias_url || null]
        );
      }
    } else {
      let registro = mockData.estudiante_competencias.find(
        ec => ec.estudiante_id === estudiante_id && ec.competencia_id === competencia_id
      );

      if (registro) {
        registro.juicio_evaluativo = juicio_evaluativo;
        registro.fecha_evaluacion = fecha_evaluacion;
        registro.observaciones = observaciones || null;
        if (evidencias_url) registro.evidencias_url = evidencias_url;
        registro.instructor_id = instructor_id;
        registro.instructor_nombre = req.user.nombre;
      } else {
        mockData.estudiante_competencias.push({
          id: `ec-${Date.now()}`,
          estudiante_id,
          competencia_id,
          instructor_id,
          instructor_nombre: req.user.nombre,
          juicio_evaluativo,
          fecha_evaluacion,
          observaciones: observaciones || null,
          evidencias_url: evidencias_url || null
        });
      }
    }

    return res.json({
      status: 'success',
      message: 'Juicio evaluativo asentado con éxito en el Instituto Estudiantil',
      data: {
        estudiante_id,
        competencia_id,
        juicio_evaluativo,
        fecha_evaluacion,
        observaciones
      }
    });
  } catch (error) {
    console.error('Error al evaluar competencia:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  getCompetencias,
  getMatrizFicha,
  evaluarCompetencia
};
