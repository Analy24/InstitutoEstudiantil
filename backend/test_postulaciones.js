const { initDatabase, getPool } = require('./src/config/db');

async function checkPostulaciones() {
  await initDatabase();
  const pool = getPool();
  try {
    const [rows] = await pool.execute('SELECT * FROM postulaciones');
    console.log("Postulaciones in DB:", rows);
  } catch (err) {
    console.error("Error:", err);
  }
}

checkPostulaciones();
