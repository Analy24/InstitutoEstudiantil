const { initDatabase, getPool } = require('./src/config/db');

async function testInsert() {
  await initDatabase();
  const pool = getPool();
  try {
    console.log("Inserting...");
    const res = await pool.execute(
      `INSERT INTO vacantes (id, empresa_id, titulo, descripcion, requisitos, modalidad, 
        ubicacion, cupos_disponibles, auxilio_sostenimiento, fecha_limite, estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ABIERTA')`,
      ['vac-test', 'emp-test', 'Titulo Test', 'Desc Test', 'Req', 'PRESENCIAL', 'Bogota', 1, 1000000, '2026-12-31']
    );
    console.log("Insert result:", res);
    
    console.log("Querying...");
    const [rows] = await pool.execute('SELECT * FROM vacantes WHERE id = ?', ['vac-test']);
    console.log("Rows found:", rows.length);
  } catch (err) {
    console.error("Error:", err);
  }
}

testInsert();
