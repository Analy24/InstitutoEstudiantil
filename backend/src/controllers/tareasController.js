const { getPool, isDatabaseConnected } = require('../config/db');

async function getTareasPorCurso(req, res) {
  try {
    const { curso_id } = req.params;
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute('SELECT * FROM tareas WHERE curso_id = ? ORDER BY fecha_creacion DESC', [curso_id]);
      
      // Obtener entregas por tarea
      for (let i = 0; i < rows.length; i++) {
        const [entregas] = await pool.execute(`
          SELECT et.*, e.nombres, e.apellidos, e.numero_documento, e.tipo_documento, e.grado, e.programa_formacion, e.foto_url, e.ficha_sena
          FROM entregas_tareas et 
          JOIN estudiantes e ON et.estudiante_id = e.id 
          WHERE et.tarea_id = ?
        `, [rows[i].id]);
        rows[i].entregas = entregas;
      }
      return res.json({ status: 'success', data: rows });
    }
    return res.json({ status: 'success', data: [] });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function crearTarea(req, res) {
  try {
    const { curso_id, titulo, descripcion, fecha_limite, archivo_adjunto_url } = req.body;
    const tareaId = `tar-${Date.now()}`;
    if (isDatabaseConnected()) {
      const pool = getPool();
      await pool.execute(
        'INSERT INTO tareas (id, curso_id, titulo, descripcion, fecha_limite, archivo_adjunto_url) VALUES (?, ?, ?, ?, ?, ?)',
        [tareaId, curso_id, titulo, descripcion, fecha_limite, archivo_adjunto_url || '']
      );
      return res.json({ status: 'success', message: 'Tarea creada exitosamente' });
    }
    return res.status(500).json({ status: 'error', message: 'Base de datos no conectada' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getMisTareas(req, res) {
  try {
    const estudianteId = req.user.perfil_id;
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute(`
        SELECT t.*, 
               c.nombre as curso_nombre,
               c.materia as materia,
               c.materia as materia_nombre,
               c.modulo,
               c.programa_formacion,
               c.grado as curso_grado,
               c.ficha as curso_ficha,
               (i.nombres || ' ' || i.apellidos) as instructor_nombre,
               i.especialidad as instructor_especialidad,
               et.id as entrega_id, 
               et.calificacion, 
               et.archivo_url,
               et.observaciones as retroalimentacion_docente,
               et.fecha_entrega
        FROM tareas t
        JOIN cursos c ON t.curso_id = c.id
        JOIN instructores i ON c.instructor_id = i.id
        JOIN matriculas m ON c.id = m.curso_id
        LEFT JOIN entregas_tareas et ON t.id = et.tarea_id AND et.estudiante_id = ?
        WHERE m.estudiante_id = ?
        ORDER BY t.fecha_limite ASC
      `, [estudianteId, estudianteId]);

      const data = rows.map(r => ({
        ...r,
        modulo: r.modulo || (r.curso_grado === 10 ? 'Módulo I: Etapa Formativa Básica' : 'Módulo II: Etapa Formativa Avanzada'),
        materia: r.materia || r.curso_nombre,
        instructor_nombre: r.instructor_nombre || 'Docente Titular'
      }));

      return res.json({ status: 'success', data });
    } else {
      const mockData = require('../data/mockData');
      const estudiante = mockData.estudiantes.find(e => e.id === estudianteId || e.usuario_id === req.user.id);
      const eId = estudiante ? estudiante.id : estudianteId;
      const misMats = (mockData.matriculas || []).filter(m => m.estudiante_id === eId);
      const misCursoIds = misMats.map(m => m.curso_id);

      const tareasEncontradas = (mockData.tareas || [])
        .filter(t => misCursoIds.includes(t.curso_id))
        .map(t => {
          const curso = (mockData.cursos || []).find(c => c.id === t.curso_id) || {};
          const instructor = (mockData.instructores || []).find(i => i.id === curso.instructor_id) || {};
          const entrega = (mockData.entregas_tareas || []).find(et => et.tarea_id === t.id && et.estudiante_id === eId) || {};

          return {
            ...t,
            curso_nombre: curso.nombre,
            materia: curso.materia || curso.nombre,
            materia_nombre: curso.materia || curso.nombre,
            modulo: curso.modulo || (curso.grado === 10 ? 'Módulo I: Etapa Formativa Básica' : 'Módulo II: Etapa Formativa Avanzada'),
            programa_formacion: curso.programa_formacion,
            curso_grado: curso.grado,
            curso_ficha: curso.ficha,
            instructor_nombre: `${instructor.nombres || ''} ${instructor.apellidos || ''}`.trim() || 'Docente Titular',
            instructor_especialidad: instructor.especialidad || 'Especialista Técnico',
            entrega_id: entrega.id || null,
            calificacion: entrega.calificacion || null,
            archivo_url: entrega.archivo_url || null,
            retroalimentacion_docente: entrega.observaciones || null,
            fecha_entrega: entrega.fecha_entrega || null
          };
        });

      return res.json({ status: 'success', data: tareasEncontradas });
    }
  } catch (error) {
    console.error('Error en getMisTareas:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function enviarTarea(req, res) {
  try {
    const { id } = req.params; // tarea_id
    const estudianteId = req.user.perfil_id;
    const { archivo_url, observaciones } = req.body;
    const entregaId = `ent-${Date.now()}`;
    
    if (isDatabaseConnected()) {
      const pool = getPool();
      await pool.execute(
        'INSERT INTO entregas_tareas (id, tarea_id, estudiante_id, archivo_url, observaciones) VALUES (?, ?, ?, ?, ?)',
        [entregaId, id, estudianteId, archivo_url || '', observaciones || '']
      );
      return res.json({ status: 'success', message: 'Tarea enviada exitosamente' });
    }
    return res.status(500).json({ status: 'error', message: 'Base de datos no conectada' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function calificarEntregas(req, res) {
  try {
    const { calificaciones } = req.body; // Array de { entrega_id, calificacion, observaciones }
    if (isDatabaseConnected()) {
      const pool = getPool();
      for (const cal of calificaciones) {
        if (cal.observaciones !== undefined) {
          await pool.execute(
            'UPDATE entregas_tareas SET calificacion = ?, observaciones = ? WHERE id = ?',
            [cal.calificacion, cal.observaciones, cal.entrega_id]
          );
        } else {
          await pool.execute(
            'UPDATE entregas_tareas SET calificacion = ? WHERE id = ?',
            [cal.calificacion, cal.entrega_id]
          );
        }
      }
      return res.json({ status: 'success', message: 'Calificaciones guardadas exitosamente' });
    }
    return res.status(500).json({ status: 'error', message: 'Base de datos no conectada' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  getTareasPorCurso,
  crearTarea,
  getMisTareas,
  enviarTarea,
  calificarEntregas
};
