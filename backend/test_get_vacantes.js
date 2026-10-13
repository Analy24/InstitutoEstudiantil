const { initDatabase, getPool } = require('./src/config/db');

async function checkGetVacantes() {
  await initDatabase();
  const pool = getPool();
  try {
    const [rows] = await pool.execute(
      `SELECT v.*, e.razon_social as empresa_nombre, e.ciudad as empresa_ciudad 
       FROM vacantes v 
       JOIN empresas e ON v.empresa_id = e.id 
       WHERE v.estado = 'ABIERTA' 
       ORDER BY v.id DESC`
    );
    console.log("Get Vacantes:", rows);
  } catch (err) {
    console.error("Error:", err);
  }
}

checkGetVacantes();
