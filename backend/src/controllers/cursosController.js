const { getPool, isDatabaseConnected } = require('../config/db');

async function getCursosAdmin(req, res) {
  try {
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute(`
        SELECT c.*, i.nombres as instructor_nombres, i.apellidos as instructor_apellidos 
        FROM cursos c 
        JOIN instructores i ON c.instructor_id = i.id
        ORDER BY c.nombre ASC
      `);
      return res.json({ status: 'success', data: rows });
    } else {
      return res.json({ status: 'success', data: [] });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function crearCurso(req, res) {
  try {
    const { nombre, descripcion, instructor_id, programa_formacion, estado } = req.body;
    const cursoId = `cur-${Date.now()}`;
    
    if (isDatabaseConnected()) {
      const pool = getPool();
      await pool.execute(
        `INSERT INTO cursos (id, nombre, descripcion, instructor_id, programa_formacion, estado) VALUES (?, ?, ?, ?, ?, ?)`,
        [cursoId, nombre, descripcion, instructor_id, programa_formacion, estado || 'PUBLICO']
      );
      return res.json({ status: 'success', message: 'Curso creado exitosamente', data: { id: cursoId } });
    }
    return res.status(500).json({ status: 'error', message: 'Base de datos no conectada' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getEstudiantesNoMatriculados(req, res) {
  try {
    const { id } = req.params;
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute(`
        SELECT e.* 
        FROM estudiantes e 
        WHERE e.id NOT IN (SELECT estudiante_id FROM matriculas WHERE curso_id = ?)
      `, [id]);
      return res.json({ status: 'success', data: rows });
    }
    return res.json({ status: 'success', data: [] });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function matricularEstudiantes(req, res) {
  try {
    const { id } = req.params;
    const { estudiantes_ids } = req.body;
    
    if (isDatabaseConnected() && estudiantes_ids && estudiantes_ids.length > 0) {
      const pool = getPool();
      for (const estId of estudiantes_ids) {
        const matId = `mat-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await pool.execute(
          'INSERT INTO matriculas (id, curso_id, estudiante_id) VALUES (?, ?, ?)',
          [matId, id, estId]
        );
      }
      return res.json({ status: 'success', message: 'Estudiantes matriculados exitosamente' });
    }
    return res.status(400).json({ status: 'error', message: 'Datos insuficientes' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getMisCursosEstudiante(req, res) {
  try {
    const estudianteId = req.user.perfil_id;
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute(`
        SELECT c.*, 
               (i.nombres || ' ' || i.apellidos) as instructor_nombre,
               i.especialidad as instructor_especialidad,
               (SELECT COUNT(*) FROM tareas t WHERE t.curso_id = c.id) as total_tareas,
               (SELECT COUNT(*) FROM entregas_tareas et JOIN tareas t ON et.tarea_id = t.id WHERE t.curso_id = c.id AND et.estudiante_id = ?) as tareas_entregadas,
               (SELECT COUNT(*) FROM entregas_tareas et JOIN tareas t ON et.tarea_id = t.id WHERE t.curso_id = c.id AND et.estudiante_id = ? AND et.calificacion IS NOT NULL) as tareas_calificadas
        FROM matriculas m
        JOIN cursos c ON m.curso_id = c.id
        JOIN instructores i ON c.instructor_id = i.id
        WHERE m.estudiante_id = ?
        ORDER BY c.grado, c.nombre
      `, [estudianteId, estudianteId, estudianteId]);

      const data = rows.map(r => ({
        ...r,
        modulo: r.modulo || (r.grado === 10 ? 'Módulo I: Etapa Formativa Básica' : 'Módulo II: Etapa Formativa Avanzada'),
        materia: r.materia || r.nombre
      }));

      return res.json({ status: 'success', data });
    } else {
      const mockData = require('../data/mockData');
      const estudiante = mockData.estudiantes.find(e => e.id === estudianteId || e.usuario_id === req.user.id);
      const eId = estudiante ? estudiante.id : estudianteId;
      const misMats = (mockData.matriculas || []).filter(m => m.estudiante_id === eId);
      const misCursoIds = misMats.map(m => m.curso_id);

      const data = (mockData.cursos || [])
        .filter(c => misCursoIds.includes(c.id))
        .map(c => {
          const instructor = (mockData.instructores || []).find(i => i.id === c.instructor_id) || {};
          const tareasCurso = (mockData.tareas || []).filter(t => t.curso_id === c.id);
          const tareasEntregadas = (mockData.entregas_tareas || []).filter(et => tareasCurso.some(t => t.id === et.tarea_id) && et.estudiante_id === eId);
          const tareasCalificadas = tareasEntregadas.filter(et => et.calificacion !== null);

          return {
            ...c,
            instructor_nombre: `${instructor.nombres || ''} ${instructor.apellidos || ''}`.trim() || 'Docente Titular',
            instructor_especialidad: instructor.especialidad || 'Especialista Técnico',
            total_tareas: tareasCurso.length,
            tareas_entregadas: tareasEntregadas.length,
            tareas_calificadas: tareasCalificadas.length,
            modulo: c.modulo || (c.grado === 10 ? 'Módulo I: Etapa Formativa Básica' : 'Módulo II: Etapa Formativa Avanzada'),
            materia: c.materia || c.nombre
          };
        });

      return res.json({ status: 'success', data });
    }
  } catch (error) {
    console.error('Error en getMisCursosEstudiante:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  getCursosAdmin,
  crearCurso,
  getEstudiantesNoMatriculados,
  matricularEstudiantes,
  getMisCursosEstudiante
};
