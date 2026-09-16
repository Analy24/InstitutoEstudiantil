const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let db = null;
let isConnected = false;

// Wrapper de la API mysql2/promise para SQLite
const poolMock = {
  execute: (query, params = []) => {
    return new Promise((resolve, reject) => {
      // Reemplazar sintaxis específica de MySQL no compatible (ej. NOW())
      let sanitizedQuery = query.replace(/NOW\(\)/gi, "datetime('now')");

      if (sanitizedQuery.trim().toUpperCase().startsWith('SELECT')) {
        db.all(sanitizedQuery, params, (err, rows) => {
          if (err) {
            console.error('[DB ERROR]', err, sanitizedQuery, params);
            reject(err);
          } else {
            resolve([rows]);
          }
        });
      } else {
        db.run(sanitizedQuery, params, function (err) {
          if (err) {
            console.error('[DB ERROR]', err, sanitizedQuery, params);
            reject(err);
          } else {
            resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
          }
        });
      }
    });
  }
};

async function initDatabase() {
  return new Promise((resolve, reject) => {
    const dbPath = path.resolve(__dirname, '../../database.sqlite');
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        isConnected = false;
        console.error(`[DB ERROR] No fue posible conectar a SQLite en ${dbPath}`);
        console.error(`[DB ERROR] Detalle: ${err.message}`);
        reject(err);
      } else {
        isConnected = true;
        console.log(`[DB] Conectado exitosamente a SQLite en ${dbPath}`);
        resolve();
      }
    });
  });
}

function getPool() {
  return poolMock;
}

function isDatabaseConnected() {
  return isConnected;
}

function getDb() {
  return db;
}

module.exports = {
  initDatabase,
  getPool,
  isDatabaseConnected,
  getDb,
  execute: poolMock.execute
};
