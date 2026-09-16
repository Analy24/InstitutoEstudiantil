const { getPool, isDatabaseConnected } = require('../config/db');
const mockData = require('../data/mockData');

async function getColegios(req, res) {
  try {
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute('SELECT * FROM colegios ORDER BY nombre ASC');
      return res.json({ status: 'success', data: rows });
    } else {
      return res.json({ status: 'success', data: mockData.colegios });
    }
  } catch (error) {
    console.error('Error al listar colegios:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getColegioDetalle(req, res) {
  try {
    const { id } = req.params;
    let colegio = null;
    let estudiantes = [];

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [colRows] = await pool.execute('SELECT * FROM colegios WHERE id = ?', [id]);
      colegio = colRows[0] || null;
      if (colegio) {
        const [estRows] = await pool.execute('SELECT * FROM estudiantes WHERE colegio_id = ? ORDER BY grado DESC, apellidos ASC', [id]);
        estudiantes = estRows;
      }
    } else {
      colegio = mockData.colegios.find(c => c.id === id);
      if (colegio) {
        estudiantes = mockData.estudiantes.filter(e => e.colegio_id === id);
      }
    }

    if (!colegio) {
      return res.status(404).json({ status: 'error', message: 'Colegio no encontrado' });
    }

    return res.json({
      status: 'success',
      data: {
        ...colegio,
        estudiantes
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  getColegios,
  getColegioDetalle
};
