const { initDatabase, getPool } = require('./src/config/db');

async function checkRelations() {
  await initDatabase();
  const pool = getPool();
  try {
    const [usuarios] = await pool.execute('SELECT id, email, rol FROM usuarios');
    console.log("Usuarios in DB:", usuarios.map(u => u.id + " " + u.email));
    
    const [empresas] = await pool.execute('SELECT id, usuario_id, razon_social FROM empresas');
    console.log("\nEmpresas in DB:", empresas.map(e => e.id + " " + e.usuario_id + " " + e.razon_social));
  } catch (err) {
    console.error("Error:", err);
  }
}

checkRelations();
