// Cliente HTTP para comunicación con el backend de Instituto Estudiantil

// Usar la ruta relativa para aprovechar el proxy de Vite configurado en vite.config.js
const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('instituto_estudiantil_token') || localStorage.getItem('sena_conecta_token');
  const headers = {
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  let data;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (parseErr) {
    if (!response.ok) {
      throw new Error(`El servidor backend está respondiendo con error (${response.status}). Por favor reintenta en un momento.`);
    }
    throw new Error('Respuesta del servidor no válida');
  }

  if (!response.ok) {
    const error = new Error(data.message || `Error en la petición al servidor (${response.status})`);
    error.status = response.status;
    error.code = data.code;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Autenticación
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  getMe: () => request('/auth/me'),
  getDemoAccounts: () => request('/auth/demo-accounts'),

  // Solicitudes de Alianza Empresarial (Público y Admin)
  solicitarAlianzaEmpresa: (payload) => request('/empresas/solicitar-alianza', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getSolicitudesAlianza: () => request('/empresas/solicitudes'),
  aprobarAlianza: (id) => request(`/empresas/solicitudes/${id}/aprobar`, { method: 'POST' }),
  rechazarAlianza: (id) => request(`/empresas/solicitudes/${id}/rechazar`, { method: 'POST' }),

  // Empresas Aliadas
  getEmpresas: () => request('/empresas'),
  getEmpresaDetalle: (id) => request(`/empresas/${id}`),
  crearEmpresa: (payload) => request('/empresas', { method: 'POST', body: JSON.stringify(payload) }),
  eliminarEmpresa: (id) => request(`/empresas/${id}`, { method: 'DELETE' }),
  verificarEmpresa: (id) => request(`/empresas/${id}/verificar`, { method: 'PATCH' }),

  // Instructores (Admin)
  getInstructores: () => request('/admin/instructores'),
  crearInstructor: (payload) => request('/admin/instructores', { method: 'POST', body: JSON.stringify(payload) }),

  // Estudiantes (Admin)
  getAdminEstudiantes: () => request('/admin/estudiantes'),
  crearEstudiante: (payload) => request('/admin/estudiantes', { method: 'POST', body: JSON.stringify(payload) }),
  getEstudianteDetalleCompleto: (id) => request(`/estudiantes/${id}/detalle-completo`),
  buscarEstudiantePorDocumento: (documento) => request(`/estudiantes/buscar-documento/${documento}`),

  // Colegios
  getColegios: () => request('/colegios'),
  getColegioDetalle: (id) => request(`/colegios/${id}`),

  // Módulo Académico Instructor (Programas, Fichas, Clases, Temas y Evidencias)
  getProgramasJerarquia: () => request('/instructor/programas-jerarquia'),
  getClaseEstudiantes: (claseId) => request(`/instructor/clases/${claseId}/estudiantes`),
  getEvidenciasClase: (claseId) => request(`/instructor/evidencias/${claseId}`),
  evaluarEvidencia: (evidenciaId, payload) => request(`/instructor/evidencias/${evidenciaId}/evaluar`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  crearTemaInstructor: (payload) => request('/instructor/temas', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  evaluarEstudianteCompetencia: (payload) => request('/instructor/evaluacion/calificar', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getEstudiantesTablaInstructor: (params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/instructor/estudiantes-tabla${qs}`);
  },
  // [DEPRECADO] Antiguo módulo de competencias
  // getCompetencias: () => request('/competencias'),
  // getMatrizFicha: (ficha) => request(`/evaluacion/ficha/${ficha}`),
  // evaluarCompetencia: (payload) => request('/evaluacion/calificar', { method: 'POST', body: JSON.stringify(payload) }),

  // Estudiante
  getMiPerfil: () => request('/estudiantes/mi-perfil'),
  updateMiPerfil: (payload) => request('/estudiantes/mi-perfil', {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  uploadHojaVida: (formData) => request('/upload/hoja-vida', {
    method: 'POST',
    body: formData
  }),
  uploadFotoPerfil: (formData) => request('/upload', {
    method: 'POST',
    body: formData
  }),
  uploadArchivo: (formData) => request('/upload', {
    method: 'POST',
    body: formData
  }),

  // Vacantes y Postulaciones
  getVacantes: () => request('/vacantes'),
  getMisVacantes: () => request('/vacantes/mis-vacantes'),
  getPostulacionesPorVacante: (id) => request(`/vacantes/${id}/postulaciones`),
  crearVacante: (payload) => request('/vacantes', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  postularme: (vacanteId) => request(`/vacantes/${vacanteId}/postularme`, {
    method: 'POST'
  }),
  getPostulacionesEmpresa: () => request('/empresas/postulaciones'),
  actualizarEstadoPostulacion: (id, payload) => request(`/postulaciones/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),

  // Cursos y Tareas (Estudiante)
  getMisCursosEstudiante: () => request('/estudiantes/mis-cursos'),
  getMisTareas: () => request('/estudiantes/mis-tareas'),
  enviarTarea: (id, payload) => request(`/estudiantes/tareas/${id}/entregar`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Cursos, Tareas y Asistencia (Instructor)
  getMisCursosInstructor: () => request('/instructor/mis-cursos'),
  getEstudiantesCurso: (cursoId) => request(`/instructor/cursos/${cursoId}/estudiantes`),
  getTareasPorCurso: (cursoId) => request(`/instructor/cursos/${cursoId}/tareas`),
  crearTarea: (payload) => request('/instructor/tareas', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  calificarEntregas: (calificaciones) => request('/instructor/tareas/calificar', {
    method: 'POST',
    body: JSON.stringify({ calificaciones })
  }),
  getListaAsistencia: (cursoId, fecha) => request(`/instructor/cursos/${cursoId}/asistencia/${fecha}`),
  guardarAsistencia: (cursoId, fecha, estudiantes) => request(`/instructor/cursos/${cursoId}/asistencia/${fecha}`, {
    method: 'POST',
    body: JSON.stringify({ estudiantes })
  }),

  // Cursos (Administrador)
  getCursosAdmin: () => request('/admin/cursos'),
  crearCurso: (payload) => request('/admin/cursos', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getEstudiantesNoMatriculados: (cursoId) => request(`/admin/cursos/${cursoId}/estudiantes-disponibles`),
  matricularEstudiantes: (cursoId, estudiantes_ids) => request(`/admin/cursos/${cursoId}/matricular`, {
    method: 'POST',
    body: JSON.stringify({ estudiantes_ids })
  }),

  // Reportes
  getEstadisticas: () => request('/reportes/estadisticas')
};
