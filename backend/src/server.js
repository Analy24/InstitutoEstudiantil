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

// Servir el frontend compilado (carpeta dist)
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Catch-all: cualquier ruta no-API devuelve index.html (SPA routing)
app.get('*', (req, res) => {
  const indexPath = path.join(frontendDistPath, 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Frontend no compilado. Ejecute "npm run build" en la carpeta frontend.'
    });
  }
});

const os = require('os');

// Inicialización del servidor
async function startServer() {
  await initDatabase();
  if (isDatabaseConnected()) {
      await initializeSqliteDb();
  }
  app.listen(PORT, '0.0.0.0', () => {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          addresses.push(net.address);
        }
      }
    }

    console.log('====================================================');
    console.log(`🚀 Estudiantil Backend escuchando en todas las interfaces (0.0.0.0:${PORT})`);
    console.log(`🏠 Local:            http://localhost:${PORT}`);
    addresses.forEach(ip => {
      console.log(`📶 Red WiFi/LAN IP:   http://${ip}:${PORT}`);
    });
    console.log(`📊 Healthcheck:      http://localhost:${PORT}/health`);
    console.log(`💾 Base de datos:    SQLite (Modo Persistencia)`);
    console.log('====================================================');
  });
}

startServer();
