const express = require('express');
const router = express.Router();

const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Controladores
const authController = require('../controllers/authController');
const colegioController = require('../controllers/colegioController');
const competenciaController = require('../controllers/competenciaController');
const estudianteController = require('../controllers/estudianteController');
const vacanteController = require('../controllers/vacanteController');
const reporteController = require('../controllers/reporteController');
const empresaController = require('../controllers/empresaController');
const adminController = require('../controllers/adminController');
const uploadRoutes = require('./uploadRoutes');

// -----------------------------------------------------------------------------
// 1. RUTAS DE AUTENTICACIÓN
// -----------------------------------------------------------------------------
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.getMe);
router.get('/auth/demo-accounts', authController.getDemoAccounts);

// -----------------------------------------------------------------------------
// 2. RUTAS PÚBLICAS Y DE EMPRESAS (SOLICITUD DE ALIANZA)
// -----------------------------------------------------------------------------
router.post('/empresas/solicitar-alianza', empresaController.solicitarAlianza);
router.get('/empresas/solicitudes', authenticateToken, authorizeRoles('ADMIN'), empresaController.getSolicitudesAlianza);
router.post('/empresas/solicitudes/:id/aprobar', authenticateToken, authorizeRoles('ADMIN'), empresaController.aprobarAlianza);
router.post('/empresas/solicitudes/:id/rechazar', authenticateToken, authorizeRoles('ADMIN'), empresaController.rechazarAlianza);

// -----------------------------------------------------------------------------
// 3. RUTAS DE EMPRESAS ALIADAS
// -----------------------------------------------------------------------------
router.get('/empresas', authenticateToken, empresaController.getEmpresas);
router.post('/empresas', authenticateToken, authorizeRoles('ADMIN'), empresaController.crearEmpresa);
router.get('/empresas/:id', authenticateToken, empresaController.getEmpresaDetalle);
router.delete('/empresas/:id', authenticateToken, authorizeRoles('ADMIN'), empresaController.eliminarEmpresa);
router.patch('/empresas/:id/verificar', authenticateToken, authorizeRoles('ADMIN'), empresaController.verificarEmpresa);

// -----------------------------------------------------------------------------
// 4. RUTAS DE INSTRUCTORES Y ADMINISTRACIÓN
// -----------------------------------------------------------------------------
router.get('/admin/instructores', authenticateToken, authorizeRoles('ADMIN'), adminController.getInstructores);
router.post('/admin/instructores', authenticateToken, authorizeRoles('ADMIN'), adminController.crearInstructor);
router.get('/admin/estudiantes', authenticateToken, authorizeRoles('ADMIN'), adminController.getEstudiantes);
router.post('/admin/estudiantes', authenticateToken, authorizeRoles('ADMIN'), adminController.crearEstudiante);

// -----------------------------------------------------------------------------
// 5. RUTAS DE COLEGIOS / INSTITUCIÓN
// -----------------------------------------------------------------------------
router.get('/colegios', authenticateToken, colegioController.getColegios);
router.get('/colegios/:id', authenticateToken, colegioController.getColegioDetalle);

// -----------------------------------------------------------------------------
// 6. RUTAS DE COMPETENCIAS Y EVALUACIÓN (INSTRUCTOR)
// -----------------------------------------------------------------------------
router.get('/competencias', authenticateToken, competenciaController.getCompetencias);
router.get('/evaluacion/ficha/:ficha', authenticateToken, competenciaController.getMatrizFicha);
router.post(
  '/evaluacion/calificar',
  authenticateToken,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  competenciaController.evaluarCompetencia
);

// -----------------------------------------------------------------------------
// 7. RUTAS DEL PERFIL DIGITAL DE ESTUDIANTE
// -----------------------------------------------------------------------------
router.get(
  '/estudiantes/mi-perfil',
  authenticateToken,
  authorizeRoles('ESTUDIANTE'),
  estudianteController.getMiPerfil
);
router.get(
  '/estudiantes/buscar-documento/:documento',
  authenticateToken,
  authorizeRoles('ADMIN'),
  estudianteController.buscarPorDocumento
);
router.get(
  '/estudiantes/:id/detalle-completo',
  authenticateToken,
  estudianteController.getEstudianteDetalleCompleto
);
router.put(
  '/estudiantes/mi-perfil',
  authenticateToken,
  authorizeRoles('ESTUDIANTE'),
  estudianteController.updateMiPerfil
);

// -----------------------------------------------------------------------------
// 8. RUTAS DE VACANTES Y POSTULACIONES
// -----------------------------------------------------------------------------
router.get('/vacantes', authenticateToken, vacanteController.getVacantes);
router.post(
  '/vacantes',
  authenticateToken,
  authorizeRoles('EMPRESA', 'ADMIN'),
  vacanteController.crearVacante
);
router.post(
  '/vacantes/:id/postularme',
  authenticateToken,
  authorizeRoles('ESTUDIANTE'),
  vacanteController.postularme
);
router.get(
  '/empresas/postulaciones',
  authenticateToken,
  authorizeRoles('EMPRESA', 'ADMIN'),
  vacanteController.getPostulacionesEmpresa
);
router.patch(
  '/postulaciones/:id/estado',
  authenticateToken,
  authorizeRoles('EMPRESA', 'ADMIN'),
  vacanteController.actualizarEstadoPostulacion
);

// -----------------------------------------------------------------------------
// 9. RUTAS DE REPORTES Y ESTADÍSTICAS
// -----------------------------------------------------------------------------
router.get('/reportes/estadisticas', authenticateToken, adminController.getEstadisticas);

// -----------------------------------------------------------------------------
// 10. RUTAS DE ARCHIVOS
// -----------------------------------------------------------------------------
router.use('/upload', authenticateToken, uploadRoutes);

module.exports = router;
