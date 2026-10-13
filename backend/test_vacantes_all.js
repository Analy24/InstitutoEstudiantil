const { initDatabase, getPool } = require('./src/config/db');

async function checkVacantes() {
  await initDatabase();
  const pool = getPool();
  try {
    const [rows] = await pool.execute('SELECT * FROM vacantes');
    console.log("Vacantes in DB:", rows);
  } catch (err) {
    console.error("Error:", err);
  }
}

checkVacantes();
