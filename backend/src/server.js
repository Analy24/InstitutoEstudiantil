const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { initDatabase, isDatabaseConnected, dbConfig } = require('./config/db');
const { initializeSqliteDb } = require('./config/init_sqlite');
const apiRoutes = require('./routes/api');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging básico de peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Endpoint de estado del sistema (Healthcheck)
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    servicio: 'Estudiantil API REST',
    version: '1.0.0',
    database: {
      motor: 'SQLite',
      conectado: isDatabaseConnected(),
      modo: 'PERSISTENCIA_SQLITE'
    },
    timestamp: new Date().toISOString()
  });
});

// Registro de rutas API versión 1
app.use('/api/v1', apiRoutes);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Inicialización del servidor
async function startServer() {
  await initDatabase();
  if (isDatabaseConnected()) {
      await initializeSqliteDb();
  }
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`🚀 Estudiantil Backend escuchando en: http://localhost:${PORT}`);
    console.log(`📊 Endpoint Healthcheck: http://localhost:${PORT}/health`);
    console.log(`📡 Rutas API REST: http://localhost:${PORT}/api/v1/...`);
    console.log(`💾 Base de datos: SQLite (Modo Persistencia)`);
    console.log('====================================================');
  });
}

startServer();
