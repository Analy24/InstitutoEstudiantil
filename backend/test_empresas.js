const { initDatabase, getPool } = require('./src/config/db');

async function testQuery() {
  await initDatabase();
  const pool = getPool();
  try {
    const [rows] = await pool.execute('SELECT id, razon_social FROM empresas');
    console.log("Empresas in DB:", rows);
  } catch (err) {
    console.error("Error:", err);
  }
}

testQuery();
