const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const queries = [
  'SELECT count(*) as c FROM cursos',
  'SELECT count(*) as c FROM tareas',
  'SELECT count(*) as c FROM entregas_tareas',
  'SELECT count(*) as c FROM matriculas',
  'SELECT count(*) as c FROM estudiantes',
  'SELECT count(*) as c FROM instructores'
];

const tables = ['cursos', 'tareas', 'entregas_tareas', 'matriculas', 'estudiantes', 'instructores'];

let completed = 0;
tables.forEach((table, idx) => {
  db.get(`SELECT count(*) as total FROM ${table}`, (err, row) => {
    if (err) console.error(`Error en ${table}:`, err);
    else console.log(`${table}: ${row ? row.total : 0} registros`);
    completed++;
    if (completed === tables.length) {
      db.all(`SELECT id, titulo, curso_id FROM tareas`, (err, rows) => {
        console.log('\nTareas en BD:', rows);
        db.all(`SELECT id, nombre, instructor_id, ficha FROM cursos`, (err, cursos) => {
          console.log('\nCursos en BD:', cursos);
          db.close();
        });
      });
    }
  });
});
