const { getPool, isDatabaseConnected } = require('../config/db');
const mockData = require('../data/mockData');

async function getEstadisticasGenerales(req, res) {
  try {
    let stats = {};

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [[{ total_estudiantes }]] = await pool.execute('SELECT COUNT(*) as total_estudiantes FROM estudiantes');
      const [[{ total_colegios }]] = await pool.execute('SELECT COUNT(*) as total_colegios FROM colegios');
      const [[{ total_empresas }]] = await pool.execute('SELECT COUNT(*) as total_empresas FROM empresas');
      const [[{ total_vacantes }]] = await pool.execute('SELECT COUNT(*) as total_vacantes FROM vacantes WHERE estado = "ABIERTA"');
      const [[{ total_postulaciones }]] = await pool.execute('SELECT COUNT(*) as total_postulaciones FROM postulaciones');

      stats = {
        total_estudiantes,
        total_colegios,
        total_empresas,
        total_vacantes_activas: total_vacantes,
        total_postulaciones,
        tasa_colocacion: '78%'
      };
    } else {
      stats = {
        total_estudiantes: mockData.estudiantes.length,
        total_colegios: mockData.colegios.length,
        total_empresas: mockData.empresas.length,
        total_vacantes_activas: mockData.vacantes.filter(v => v.estado === 'ABIERTA').length,
        total_postulaciones: mockData.postulaciones.length,
        tasa_colocacion: '75%'
      };
    }

    return res.json({ status: 'success', data: stats });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  getEstadisticasGenerales
};
