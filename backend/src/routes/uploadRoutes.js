const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Ruta para subir archivo
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No se subió ningún archivo' });
    }
    
    // Devolver la URL del archivo
    const fileUrl = `/uploads/${req.file.filename}`;
    
    return res.json({
      status: 'success',
      message: 'Archivo subido correctamente',
      data: {
        url: fileUrl,
        filename: req.file.originalname
      }
    });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno al subir el archivo' });
  }
});

module.exports = router;
