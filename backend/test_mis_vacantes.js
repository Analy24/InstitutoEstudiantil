const { initDatabase, getPool } = require('./src/config/db');

async function checkMisVacantes() {
  await initDatabase();
  const pool = getPool();
  try {
    const [empresas] = await pool.execute('SELECT * FROM empresas');
    console.log("All Empresas:");
    empresas.forEach(e => console.log(e.id, e.usuario_id, e.razon_social));
    
    const [vacantes] = await pool.execute('SELECT * FROM vacantes');
    console.log("\nAll Vacantes:");
    vacantes.forEach(v => console.log(v.id, v.empresa_id, v.titulo));

    console.log("\nSimulating getMisVacantes for emp-01");
    const [rows] = await pool.execute(
      `SELECT v.*, e.razon_social as empresa_nombre, e.ciudad as empresa_ciudad 
       FROM vacantes v 
       JOIN empresas e ON v.empresa_id = e.id 
       WHERE v.empresa_id = ? 
       ORDER BY v.id DESC`,
      ['emp-01']
    );
    console.log(rows.map(r => r.id + " " + r.titulo));
  } catch (err) {
    console.error("Error:", err);
  }
}

checkMisVacantes();
