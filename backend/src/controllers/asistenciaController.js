const { getPool, isDatabaseConnected } = require('../config/db');

async function getMisCursosInstructor(req, res) {
  try {
    const instructorId = req.user.perfil_id;
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute('SELECT * FROM cursos WHERE instructor_id = ? ORDER BY nombre ASC', [instructorId]);
      return res.json({ status: 'success', data: rows });
    }
    return res.json({ status: 'success', data: [] });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getListaAsistencia(req, res) {
  try {
    const { curso_id, fecha } = req.params; // formato YYYY-MM-DD
    if (isDatabaseConnected()) {
      const pool = getPool();
      
      // Obtener todos los matriculados con detalles
      const [matriculados] = await pool.execute(`
        SELECT e.id, e.nombres, e.apellidos, e.numero_documento, e.tipo_documento, e.foto_url, e.grado, e.ficha_sena
        FROM estudiantes e
        JOIN matriculas m ON e.id = m.estudiante_id
        WHERE m.curso_id = ?
        ORDER BY e.apellidos ASC
      `, [curso_id]);

      // Buscar si ya hay un registro de asistencia para ese curso y fecha
      const [asistencia] = await pool.execute('SELECT id FROM asistencias WHERE curso_id = ? AND fecha = ?', [curso_id, fecha]);
      
      // Por defecto todos presentes
      let listaConAsistencia = matriculados.map(m => ({ 
        ...m, 
        presente: true, 
        estado: 'PRESENTE', 
        observaciones: '' 
      }));

      if (asistencia.length > 0) {
        const asistenciaId = asistencia[0].id;
        const [asistenciasEst] = await pool.execute('SELECT estudiante_id, presente, estado, observaciones FROM estudiante_asistencias WHERE asistencia_id = ?', [asistenciaId]);
        
        listaConAsistencia = listaConAsistencia.map(est => {
          const match = asistenciasEst.find(a => a.estudiante_id === est.id);
          if (match) {
            let estado = match.estado;
            if (!estado) {
              estado = (match.presente === 1 || match.presente === true) ? 'PRESENTE' : 'INASISTENCIA';
            }
            return { 
              ...est, 
              presente: estado === 'PRESENTE' || estado === 'TARDE', 
              estado, 
              observaciones: match.observaciones || '' 
            };
          }
          return est;
        });
      }

      return res.json({ status: 'success', data: listaConAsistencia });
    }
    return res.json({ status: 'success', data: [] });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function guardarAsistencia(req, res) {
  try {
    const { curso_id, fecha } = req.params;
    const { estudiantes } = req.body; // Array de { id, presente, estado, observaciones }
    
    if (isDatabaseConnected()) {
      const pool = getPool();
      
      let asistenciaId;
      const [asistenciaExis] = await pool.execute('SELECT id FROM asistencias WHERE curso_id = ? AND fecha = ?', [curso_id, fecha]);
      
      if (asistenciaExis.length > 0) {
        asistenciaId = asistenciaExis[0].id;
        await pool.execute('DELETE FROM estudiante_asistencias WHERE asistencia_id = ?', [asistenciaId]);
      } else {
        asistenciaId = `asis-${Date.now()}`;
        await pool.execute('INSERT INTO asistencias (id, curso_id, fecha) VALUES (?, ?, ?)', [asistenciaId, curso_id, fecha]);
      }

      for (const est of estudiantes) {
        const eaId = `ea-${Date.now()}-${Math.floor(Math.random()*1000)}`;
        const estado = est.estado || (est.presente ? 'PRESENTE' : 'INASISTENCIA');
        const presenteVal = (estado === 'PRESENTE' || estado === 'TARDE') ? 1 : 0;
        const observaciones = est.observaciones || '';

        await pool.execute(
          'INSERT INTO estudiante_asistencias (id, asistencia_id, estudiante_id, presente, estado, observaciones) VALUES (?, ?, ?, ?, ?, ?)',
          [eaId, asistenciaId, est.id, presenteVal, estado, observaciones]
        );
      }

      return res.json({ status: 'success', message: 'Lista de asistencia guardada exitosamente' });
    }
    return res.status(500).json({ status: 'error', message: 'Base de datos no conectada' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getEstudiantesCurso(req, res) {
  try {
    const { curso_id } = req.params;
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute(`
        SELECT e.*, c.nombre as colegio_nombre,
               (SELECT COUNT(*) FROM estudiante_competencias ec WHERE ec.estudiante_id = e.id AND ec.juicio_evaluativo = 'APROBADO') as aprobadas_count,
               (SELECT COUNT(*) FROM competencias WHERE programa_formacion = e.programa_formacion) as total_comp
        FROM estudiantes e
        JOIN matriculas m ON e.id = m.estudiante_id
        JOIN colegios c ON e.colegio_id = c.id
        WHERE m.curso_id = ?
        ORDER BY e.apellidos ASC
      `, [curso_id]);
      return res.json({ status: 'success', data: rows });
    } else {
      const mockData = require('../data/mockData');
      const matriculados = (mockData.matriculas || []).filter(m => m.curso_id === curso_id).map(m => m.estudiante_id);
      const ests = (mockData.estudiantes || []).filter(e => matriculados.includes(e.id));
      return res.json({ status: 'success', data: ests });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  getMisCursosInstructor,
  getListaAsistencia,
  guardarAsistencia,
  getEstudiantesCurso
};
