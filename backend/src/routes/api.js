const express = require('express');
const router = express.Router();

const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Controladores
const authController = require('../controllers/authController');
const colegioController = require('../controllers/colegioController');
// const competenciaController = require('../controllers/competenciaController'); // ELIMINADO SEGÚN ESPECIFICACIÓN
const instructorController = require('../controllers/instructorController');
const estudianteController = require('../controllers/estudianteController');
const vacanteController = require('../controllers/vacanteController');
const reporteController = require('../controllers/reporteController');
const empresaController = require('../controllers/empresaController');
const adminController = require('../controllers/adminController');
const cursosController = require('../controllers/cursosController');
const tareasController = require('../controllers/tareasController');
const asistenciaController = require('../controllers/asistenciaController');
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
router.get(
  '/empresas/postulaciones',
  authenticateToken,
  authorizeRoles('EMPRESA', 'ADMIN'),
  vacanteController.getPostulacionesEmpresa
);
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
// 6. RUTAS DE GESTIÓN ACADÉMICA DEL INSTRUCTOR (PROGRAMAS, FICHAS, CLASES Y EVIDENCIAS)
// -----------------------------------------------------------------------------
// [ELIMINADO] Antiguo módulo de Matriz de Competencias:
// router.get('/competencias', authenticateToken, competenciaController.getCompetencias);
// router.get('/evaluacion/ficha/:ficha', authenticateToken, competenciaController.getMatrizFicha);
// router.post('/evaluacion/calificar', authenticateToken, authorizeRoles('INSTRUCTOR', 'ADMIN'), competenciaController.evaluarCompetencia);

// [NUEVO] Jerarquía completa del instructor (Programa -> Fichas -> Clases)
router.get(
  '/instructor/programas-jerarquia',
  authenticateToken,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  instructorController.getProgramasJerarquia
);

// [REQUERIMIENTO 3] Listado de estudiantes por clase
router.get(
  '/instructor/clases/:claseId/estudiantes',
  authenticateToken,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  instructorController.getClaseEstudiantes
);

// [REQUERIMIENTO 4] Jerarquía de evidencias filtradas por clase y ficha del estudiante
router.get(
  '/instructor/evidencias/:claseId',
  authenticateToken,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  instructorController.getEvidenciasClase
);

// [REQUERIMIENTO 5] Endpoint para asentar evaluación (calificación y comentario) de una evidencia
router.post(
  '/instructor/evidencias/:evidenciaId/evaluar',
  authenticateToken,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  instructorController.evaluarEvidencia
);

// [REQUERIMIENTO 4] Crear y publicar un nuevo tema dentro de una competencia
router.post(
  '/instructor/temas',
  authenticateToken,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  instructorController.crearTema
);

// [REQUERIMIENTO 5 y 9] Calificar o modificar evaluación de estudiante por competencia
router.post(
  '/instructor/evaluacion/calificar',
  authenticateToken,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  instructorController.evaluarEstudianteCompetencia
);

// [REQUERIMIENTO 6, 7 y 8] Tabla estilo Excel de estudiantes con filtros y estado de evaluación
router.get(
  '/instructor/estudiantes-tabla',
  authenticateToken,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  instructorController.getEstudiantesTabla
);

// -----------------------------------------------------------------------------
// 7. RUTAS DEL PERFIL DIGITAL DE ESTUDIANTE Y NUEVOS MÓDULOS
// -----------------------------------------------------------------------------
// Cursos Administrativo
router.get('/admin/cursos', authenticateToken, authorizeRoles('ADMIN'), cursosController.getCursosAdmin);
router.post('/admin/cursos', authenticateToken, authorizeRoles('ADMIN'), cursosController.crearCurso);
router.get('/admin/cursos/:id/estudiantes-disponibles', authenticateToken, authorizeRoles('ADMIN'), cursosController.getEstudiantesNoMatriculados);
router.post('/admin/cursos/:id/matricular', authenticateToken, authorizeRoles('ADMIN'), cursosController.matricularEstudiantes);

// Instructor - Cursos y Asistencia
router.get('/instructor/mis-cursos', authenticateToken, authorizeRoles('INSTRUCTOR', 'ADMIN'), asistenciaController.getMisCursosInstructor);
router.get('/instructor/cursos/:curso_id/estudiantes', authenticateToken, authorizeRoles('INSTRUCTOR', 'ADMIN'), asistenciaController.getEstudiantesCurso);
router.get('/instructor/cursos/:curso_id/asistencia/:fecha', authenticateToken, authorizeRoles('INSTRUCTOR', 'ADMIN'), asistenciaController.getListaAsistencia);
router.post('/instructor/cursos/:curso_id/asistencia/:fecha', authenticateToken, authorizeRoles('INSTRUCTOR', 'ADMIN'), asistenciaController.guardarAsistencia);

// Tareas
router.post('/instructor/tareas', authenticateToken, authorizeRoles('INSTRUCTOR', 'ADMIN'), tareasController.crearTarea);
router.get('/instructor/cursos/:curso_id/tareas', authenticateToken, authorizeRoles('INSTRUCTOR', 'ADMIN'), tareasController.getTareasPorCurso);
router.post('/instructor/tareas/calificar', authenticateToken, authorizeRoles('INSTRUCTOR', 'ADMIN'), tareasController.calificarEntregas);

router.get('/estudiantes/mis-cursos', authenticateToken, authorizeRoles('ESTUDIANTE'), cursosController.getMisCursosEstudiante);
router.get('/estudiantes/mis-tareas', authenticateToken, authorizeRoles('ESTUDIANTE'), tareasController.getMisTareas);
router.post('/estudiantes/tareas/:id/entregar', authenticateToken, authorizeRoles('ESTUDIANTE'), tareasController.enviarTarea);

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
router.get(
  '/vacantes/mis-vacantes',
  authenticateToken,
  authorizeRoles('EMPRESA', 'ADMIN'),
  vacanteController.getMisVacantes
);
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
  '/vacantes/:id/postulaciones',
  authenticateToken,
  authorizeRoles('EMPRESA', 'ADMIN'),
  vacanteController.getPostulacionesPorVacante
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
