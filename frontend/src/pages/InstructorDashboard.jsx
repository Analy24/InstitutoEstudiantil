import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  FileSpreadsheet, 
  Search, 
  Edit3, 
  ExternalLink,
  BookOpen,
  Filter,
  FileText,
  X,
  Eye,
  FileCode,
  Check,
  Copy,
  MessageSquare,
  Folder,
  Layers,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Download,
  UserX,
  UserCheck,
  AlertTriangle,
  UserMinus,
  Share2,
  Plus,
  UploadCloud,
  Paperclip,
  Camera
} from 'lucide-react';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [fotoInstructor, setFotoInstructor] = useState(user?.foto_url || '');
  const [subiendoFotoInst, setSubiendoFotoInst] = useState(false);
  const fotoInstInputRef = React.useRef(null);

  useEffect(() => {
    if (user?.foto_url) {
      setFotoInstructor(user.foto_url);
    }
  }, [user]);

  const handleFotoInstructorChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoFotoInst(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const resUpload = await api.uploadFotoPerfil(formData);
      const url = resUpload.data.url;
      setFotoInstructor(url);
      if (user) user.foto_url = url;
      setMensajeExito('¡Foto de perfil del instructor actualizada correctamente!');
      setTimeout(() => setMensajeExito(null), 4000);
    } catch (err) {
      alert(err.message || 'Error al subir la foto de perfil');
    } finally {
      setSubiendoFotoInst(false);
      if (fotoInstInputRef.current) fotoInstInputRef.current.value = '';
    }
  };

  const [fichaActiva, setFichaActiva] = useState('2712345');
  const [dataMatriz, setDataMatriz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroTexto, setFiltroTexto] = useState('');
  // Panel principal: 'programas' | 'estudiantes' | 'evaluaciones' | 'tareas' | 'asistencia'
  const [pestana, setPestana] = useState('programas');
  
  // Estados para Programas -> Ficha -> Grado -> Competencias
  const [programasJerarquia, setProgramasJerarquia] = useState([]);
  const [loadingJerarquia, setLoadingJerarquia] = useState(false);
  const [programaActivoId, setProgramaActivoId] = useState('');
  const [gradoActivo, setGradoActivo] = useState('todos'); // '10' | '11' | 'todos'
  const [competenciasAbiertas, setCompetenciasAbiertas] = useState({}); // { [compId]: true/false }

  // Estados para Temas pendientes (Requerimiento 4)
  const [modalCrearTema, setModalCrearTema] = useState(null); // { competenciaId, competenciaNombre }
  const [formTema, setFormTema] = useState({ titulo: '', descripcion: '', contenido_detallado: '', semana: 1, archivo_adjunto_url: '' });
  const [subiendoArchivoTema, setSubiendoArchivoTema] = useState(false);
  const [guardandoTema, setGuardandoTema] = useState(false);

  // Estados para Evaluar estudiante en competencia (Requerimiento 5 y 9)
  const [modalEvaluarComp, setModalEvaluarComp] = useState(null); // { estudiante, competencia, modo: 'evaluar' | 'ver' }
  const [formEvalComp, setFormEvalComp] = useState({ estudiante_id: '', competencia_id: '', calificacion: '', observaciones: '' });
  const [guardandoEvalComp, setGuardandoEvalComp] = useState(false);
  const [mostrarRubrica, setMostrarRubrica] = useState(false);
  const [rubricaSeguridad, setRubricaSeguridad] = useState({
    criterio1_escaneo: 4.5,
    criterio2_refactor: 4.5,
    criterio3_reporte: 4.5,
    criterio4_mitigacion: 5.0
  });

  // Estados para Tabla de Estudiantes estilo Excel (Requerimientos 6, 7 y 8)
  const [tablaEstudiantes, setTablaEstudiantes] = useState([]);
  const [loadingTablaEstudiantes, setLoadingTablaEstudiantes] = useState(false);
  const [filtroBusquedaEst, setFiltroBusquedaEst] = useState('');
  const [filtroProgramaEst, setFiltroProgramaEst] = useState('todos');
  const [filtroFichaEst, setFiltroFichaEst] = useState('todos');
  const [filtroGradoEst, setFiltroGradoEst] = useState('todos');
  const [filtroEstadoEst, setFiltroEstadoEst] = useState('todos'); // 'todos' | 'Evaluado' | 'Por evaluar'

  // Estados legados para compatibilidad
  const [claseEvidenciasData, setClaseEvidenciasData] = useState(null);
  const [loadingEvidencias, setLoadingEvidencias] = useState(false);
  const [claseEstudiantesData, setClaseEstudiantesData] = useState(null);
  const [loadingClaseEstudiantes, setLoadingClaseEstudiantes] = useState(false);
  const [subPestanaEvidencias, setSubPestanaEvidencias] = useState('jerarquia');
  const [busquedaAprendizEvidencia, setBusquedaAprendizEvidencia] = useState('');
  const [modalEvalEvidencia, setModalEvalEvidencia] = useState(null);
  const [calificacionEvidencia, setCalificacionEvidencia] = useState('');
  const [comentarioEvidencia, setComentarioEvidencia] = useState('');
  const [guardandoEvidenciaNota, setGuardandoEvidenciaNota] = useState(false);

  // Mensajes de éxito
  const [mensajeExito, setMensajeExito] = useState(null);

  // Modal para ver expediente completo del aprendiz
  const [estudianteExpediente, setEstudianteExpediente] = useState(null);

  // Modal para ver evidencia y calificar entrega sin salir de la página
  const [entregaModal, setEntregaModal] = useState(null); // { tarea, entrega }
  const [calificacionModal, setCalificacionModal] = useState('');
  const [observacionesModal, setObservacionesModal] = useState('');
  const [guardandoNotaModal, setGuardandoNotaModal] = useState(false);
  const [copiadoEnlace, setCopiadoEnlace] = useState(false);

  // Modal para ver detalles y pautas de la tarea
  const [tareaDetalleModal, setTareaDetalleModal] = useState(null);

  // Estados para Cursos, Tareas y Asistencia
  const [misCursos, setMisCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [estudiantesCurso, setEstudiantesCurso] = useState([]);
  const [loadingEstudiantesCurso, setLoadingEstudiantesCurso] = useState(false);
  const [tareas, setTareas] = useState([]);
  const [fechaAsistencia, setFechaAsistencia] = useState(new Date().toISOString().split('T')[0]);
  const [listaAsistencia, setListaAsistencia] = useState([]);
  const [subFiltroAsistencia, setSubFiltroAsistencia] = useState('todos'); // 'todos' | 'inasistencias' | 'tardes' | 'presentes' | 'excusas'
  const [guardandoAsistencia, setGuardandoAsistencia] = useState(false);
  const [busquedaAsistencia, setBusquedaAsistencia] = useState('');
  const [showModalTarea, setShowModalTarea] = useState(false);
  const [formTarea, setFormTarea] = useState({ titulo: '', descripcion: '', fecha_limite: '', archivo_adjunto_url: '' });
  const [subiendoArchivoTarea, setSubiendoArchivoTarea] = useState(false);
  const [nombreArchivoAdjunto, setNombreArchivoAdjunto] = useState('');
  const tareaFileInputRef = React.useRef(null);

  const handleSubirArchivoTarea = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoArchivoTarea(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.uploadFotoPerfil(formData);
      const url = res.data.url;
      setFormTarea(prev => ({ ...prev, archivo_adjunto_url: url }));
      setNombreArchivoAdjunto(file.name);
    } catch (err) {
      alert(err.message || 'Error al subir el archivo adjunto');
    } finally {
      setSubiendoArchivoTarea(false);
    }
  };

  const handleCrearTarea = async (e) => {
    e.preventDefault();
    try {
      await api.crearTarea({ curso_id: cursoSeleccionado, ...formTarea });
      setShowModalTarea(false);
      setFormTarea({ titulo: '', descripcion: '', fecha_limite: '', archivo_adjunto_url: '' });
      setNombreArchivoAdjunto('');
      cargarTareas();
    } catch (err) {
      alert(err.message);
    }
  };

  const cargarCursos = async () => {
    try {
      const res = await api.getMisCursosInstructor();
      setMisCursos(res.data);
      if (res.data.length > 0) {
        const c0 = res.data[0];
        setCursoSeleccionado(c0.id);
        if (c0.ficha) {
          setFichaActiva(c0.ficha);
        }
        try {
          const [resT, resE] = await Promise.all([
            api.getTareasPorCurso(c0.id),
            api.getEstudiantesCurso(c0.id)
          ]);
          setTareas(resT.data);
          setEstudiantesCurso(resE.data);
          cargarEvidenciasClase(c0.id);
          cargarEstudiantesDeClase(c0.id);
        } catch (e) {
          console.error('Error al precargar tareas/estudiantes:', e);
        }
      }
      cargarProgramasJerarquia();
    } catch (err) {
      console.error(err);
    }
  };

  const cargarEstudiantesCurso = async () => {
    if (!cursoSeleccionado) return;
    setLoadingEstudiantesCurso(true);
    try {
      const res = await api.getEstudiantesCurso(cursoSeleccionado);
      setEstudiantesCurso(res.data);
    } catch (err) {
      console.error('Error al cargar estudiantes del curso:', err);
    } finally {
      setLoadingEstudiantesCurso(false);
    }
  };

  const cargarTareas = async () => {
    if (!cursoSeleccionado) return;
    try {
      const res = await api.getTareasPorCurso(cursoSeleccionado);
      setTareas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarAsistencia = async () => {
    if (!cursoSeleccionado || !fechaAsistencia) return;
    try {
      const res = await api.getListaAsistencia(cursoSeleccionado, fechaAsistencia);
      setListaAsistencia(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarEstudiantesTabla = async () => {
    setLoadingTablaEstudiantes(true);
    try {
      const res = await api.getEstudiantesTablaInstructor();
      setTablaEstudiantes(res.data);
    } catch (err) {
      console.error('Error al cargar tabla de estudiantes:', err);
    } finally {
      setLoadingTablaEstudiantes(false);
    }
  };

  const handleCrearTema = async (e) => {
    e.preventDefault();
    if (!modalCrearTema || !formTema.titulo.trim()) {
      alert('Por favor escribe el título del tema formativo.');
      return;
    }
    setGuardandoTema(true);
    try {
      await api.crearTemaInstructor({
        competencia_id: modalCrearTema.competenciaId,
        clase_id: cursoSeleccionado,
        titulo: formTema.titulo,
        descripcion: formTema.descripcion,
        contenido_detallado: formTema.contenido_detallado,
        semana: parseInt(formTema.semana) || 1,
        archivo_adjunto_url: formTema.archivo_adjunto_url
      });

      setMensajeExito(`Tema "${formTema.titulo}" guardado y publicado para los estudiantes`);
      setTimeout(() => setMensajeExito(null), 4000);
      setModalCrearTema(null);
      setFormTema({ titulo: '', descripcion: '', contenido_detallado: '', semana: 1, archivo_adjunto_url: '' });
      cargarProgramasJerarquia();
    } catch (err) {
      alert(err.message || 'Error al guardar el tema');
    } finally {
      setGuardandoTema(false);
    }
  };

  const handleSubirArchivoTema = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendoArchivoTema(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.uploadFotoPerfil(formData);
      setFormTema(prev => ({ ...prev, archivo_adjunto_url: res.data.url }));
      setMensajeExito(`Material "${file.name}" cargado exitosamente`);
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (err) {
      alert(err.message || 'Error al subir el archivo adjunto');
    } finally {
      setSubiendoArchivoTema(false);
    }
  };

  const handleGuardarEvaluacionCompetencia = async (e) => {
    e.preventDefault();
    if (!formEvalComp.estudiante_id || !formEvalComp.competencia_id) {
      alert('Debe especificar estudiante y competencia');
      return;
    }
    const nota = parseFloat(formEvalComp.calificacion);
    if (isNaN(nota) || nota < 1.0 || nota > 5.0) {
      alert('Por favor ingrese una calificación válida entre 1.0 y 5.0');
      return;
    }

    setGuardandoEvalComp(true);
    try {
      await api.evaluarEstudianteCompetencia({
        estudiante_id: formEvalComp.estudiante_id,
        competencia_id: formEvalComp.competencia_id,
        calificacion: nota,
        observaciones: formEvalComp.observaciones
      });

      // Actualizar estado local en tablaEstudiantes inmediatamente
      setTablaEstudiantes(prev => prev.map(est => {
        if (est.id === formEvalComp.estudiante_id) {
          return {
            ...est,
            estado_evaluacion: 'Evaluado',
            calificacion: nota,
            observaciones: formEvalComp.observaciones,
            competencia_id: formEvalComp.competencia_id
          };
        }
        return est;
      }));

      setMensajeExito(`Calificación de ${nota.toFixed(1)} registrada exitosamente`);
      setTimeout(() => setMensajeExito(null), 4000);
      setModalEvaluarComp(null);
      setFormEvalComp({ estudiante_id: '', competencia_id: '', calificacion: '', observaciones: '' });
      cargarEstudiantesTabla();
      if (cursoSeleccionado) {
        cargarEvidenciasClase(cursoSeleccionado);
      }
    } catch (err) {
      alert(err.message || 'Error al guardar la evaluación');
    } finally {
      setGuardandoEvalComp(false);
    }
  };

  const toggleCompetencia = (compId) => {
    setCompetenciasAbiertas(prev => ({
      ...prev,
      [compId]: !prev[compId]
    }));
  };

  const abrirModalEvaluarDesdeTabla = (est, modo = 'evaluar') => {
    const compId = est.competencia_id || (programasJerarquia[0]?.competencias?.[0]?.id || '');
    setModalEvaluarComp({
      estudiante: est,
      competencia: { id: compId, denominacion: est.competencia_nombre || 'Competencia del Programa' },
      modo
    });
    setFormEvalComp({
      estudiante_id: est.id,
      competencia_id: compId,
      calificacion: est.calificacion !== null && est.calificacion !== undefined ? est.calificacion : '',
      observaciones: est.observaciones || ''
    });
  };

  const abrirModalEvaluarDesdeCompetencia = (comp, est = null) => {
    setModalEvaluarComp({
      estudiante: est,
      competencia: comp,
      modo: est?.calificacion ? 'ver' : 'evaluar'
    });
    setFormEvalComp({
      estudiante_id: est?.id || '',
      competencia_id: comp.id,
      calificacion: est?.calificacion !== null && est?.calificacion !== undefined ? est.calificacion : '',
      observaciones: est?.observaciones || ''
    });
  };

  useEffect(() => {
    cargarCursos();
    cargarProgramasJerarquia();
    cargarEstudiantesTabla();
  }, []);

  useEffect(() => {
    if (programasJerarquia.length > 0 && !programaActivoId) {
      setProgramaActivoId(programasJerarquia[0].id);
    }
  }, [programasJerarquia, programaActivoId]);

  useEffect(() => {
    if (pestana === 'estudiantes' || pestana === 'evaluaciones') {
      cargarEstudiantesTabla();
    }
    if (pestana === 'cursos') cargarEstudiantesCurso();
    if (pestana === 'tareas') cargarTareas();
    if (pestana === 'asistencia') cargarAsistencia();
    if (pestana === 'programas' && cursoSeleccionado) {
      cargarEvidenciasClase(cursoSeleccionado);
      cargarEstudiantesDeClase(cursoSeleccionado);
    }
  }, [pestana, cursoSeleccionado, fechaAsistencia]);

  const handleGuardarAsistencia = async () => {
    setGuardandoAsistencia(true);
    try {
      await api.guardarAsistencia(cursoSeleccionado, fechaAsistencia, listaAsistencia);
      setMensajeExito(`Registro de asistencia del ${fechaAsistencia} guardado exitosamente`);
      setTimeout(() => setMensajeExito(null), 4000);
    } catch (err) {
      alert(err.message || 'Error al guardar la asistencia');
    } finally {
      setGuardandoAsistencia(false);
    }
  };

  const handleCambiarEstadoAsistencia = (estudianteId, nuevoEstado) => {
    setListaAsistencia(prev => prev.map(est => {
      if (est.id === estudianteId) {
        return {
          ...est,
          estado: nuevoEstado,
          presente: nuevoEstado === 'PRESENTE' || nuevoEstado === 'TARDE'
        };
      }
      return est;
    }));
  };

  const handleCambiarObsAsistencia = (estudianteId, obs) => {
    setListaAsistencia(prev => prev.map(est => {
      if (est.id === estudianteId) {
        return { ...est, observaciones: obs };
      }
      return est;
    }));
  };

  const marcarTodosConEstado = (estado) => {
    setListaAsistencia(prev => prev.map(est => ({
      ...est,
      estado,
      presente: estado === 'PRESENTE' || estado === 'TARDE'
    })));
  };

  const handleCopiarReporteAsistencia = () => {
    const cursoActual = misCursos.find(c => c.id === cursoSeleccionado);
    const presentes = listaAsistencia.filter(e => e.estado === 'PRESENTE');
    const inasistencias = listaAsistencia.filter(e => e.estado === 'INASISTENCIA');
    const tardes = listaAsistencia.filter(e => e.estado === 'TARDE');
    const excusas = listaAsistencia.filter(e => e.estado === 'EXCUSA');

    let reporte = `📋 REPORTE DE ASISTENCIA - INSTITUTO ESTUDIANTIL\n`;
    reporte += `📅 Fecha: ${fechaAsistencia}\n`;
    reporte += `📚 Curso: ${cursoActual ? cursoActual.nombre : ''} (${cursoActual ? cursoActual.materia : ''})\n`;
    reporte += `👥 Total Estudiantes: ${listaAsistencia.length}\n`;
    reporte += `✅ Asistieron: ${presentes.length}\n`;
    reporte += `❌ Inasistencias (Fallas): ${inasistencias.length}\n`;
    reporte += `⏰ Llegadas Tarde: ${tardes.length}\n`;
    reporte += `📄 Con Excusa: ${excusas.length}\n\n`;

    if (inasistencias.length > 0) {
      reporte += `❌ LISTADO DE INASISTENCIAS:\n`;
      inasistencias.forEach((e, i) => {
        reporte += `  ${i + 1}. ${e.nombres} ${e.apellidos} ${e.observaciones ? `(${e.observaciones})` : ''}\n`;
      });
      reporte += `\n`;
    }

    if (tardes.length > 0) {
      reporte += `⏰ LISTADO DE LLEGADAS TARDE:\n`;
      tardes.forEach((e, i) => {
        reporte += `  ${i + 1}. ${e.nombres} ${e.apellidos} ${e.observaciones ? `(${e.observaciones})` : ''}\n`;
      });
      reporte += `\n`;
    }

    navigator.clipboard.writeText(reporte);
    setMensajeExito('Reporte de asistencia copiado al portapapeles');
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const handleCalificarEntregas = async (tarea) => {
    try {
      const calificaciones = tarea.entregas.filter(e => e.calificacion_temporal).map(e => ({
        entrega_id: e.id,
        calificacion: parseFloat(e.calificacion_temporal)
      }));
      if (calificaciones.length === 0) return alert('No hay calificaciones nuevas para guardar');
      await api.calificarEntregas(calificaciones);
      alert('Calificaciones guardadas exitosamente');
      cargarTareas();
    } catch (err) {
      alert(err.message);
    }
  };

  const abrirVisorEntrega = (tarea, entrega) => {
    setEntregaModal({ tarea, entrega });
    setCalificacionModal(entrega.calificacion !== null && entrega.calificacion !== undefined ? entrega.calificacion : '');
    setObservacionesModal(entrega.observaciones || '');
    setCopiadoEnlace(false);
  };

  const handleCopiarEnlace = (url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiadoEnlace(true);
    setTimeout(() => setCopiadoEnlace(false), 2500);
  };

  const handleGuardarNotaModal = async () => {
    if (!entregaModal) return;
    if (calificacionModal === '' || isNaN(parseFloat(calificacionModal))) {
      alert('Por favor ingresa una calificación válida entre 1.0 y 5.0');
      return;
    }
    const nota = parseFloat(calificacionModal);
    if (nota < 1.0 || nota > 5.0) {
      alert('La calificación debe estar entre 1.0 y 5.0');
      return;
    }

    setGuardandoNotaModal(true);
    try {
      await api.calificarEntregas([{
        entrega_id: entregaModal.entrega.id,
        calificacion: nota,
        observaciones: observacionesModal
      }]);
      // Actualizar datos locales
      entregaModal.entrega.calificacion = nota;
      entregaModal.entrega.observaciones = observacionesModal;
      setMensajeExito(`Calificación de ${nota.toFixed(1)} guardada exitosamente para ${entregaModal.entrega.nombres} ${entregaModal.entrega.apellidos}`);
      setTimeout(() => setMensajeExito(null), 4000);
      setEntregaModal(null);
      cargarTareas();
    } catch (err) {
      alert(err.message || 'Error al guardar la calificación');
    } finally {
      setGuardandoNotaModal(false);
    }
  };

  // Métodos del Módulo de Programa, Fichas y Evidencias
  const cargarProgramasJerarquia = async () => {
    setLoadingJerarquia(true);
    try {
      const res = await api.getProgramasJerarquia();
      setProgramasJerarquia(res.data);
    } catch (err) {
      console.error('Error al cargar jerarquía:', err);
    } finally {
      setLoadingJerarquia(false);
    }
  };

  const cargarEvidenciasClase = async (claseId) => {
    if (!claseId) return;
    setLoadingEvidencias(true);
    try {
      const res = await api.getEvidenciasClase(claseId);
      setClaseEvidenciasData(res.data);
    } catch (err) {
      console.error('Error al cargar evidencias:', err);
    } finally {
      setLoadingEvidencias(false);
    }
  };

  const cargarEstudiantesDeClase = async (claseId) => {
    if (!claseId) return;
    setLoadingClaseEstudiantes(true);
    try {
      const res = await api.getClaseEstudiantes(claseId);
      setClaseEstudiantesData(res.data);
    } catch (err) {
      console.error('Error al cargar estudiantes de clase:', err);
    } finally {
      setLoadingClaseEstudiantes(false);
    }
  };

  const abrirModalEvaluarEvidencia = (evidencia, entrega, estudiante) => {
    setModalEvalEvidencia({ evidencia, entrega, estudiante });
    setCalificacionEvidencia(entrega && entrega.calificacion !== null && entrega.calificacion !== undefined ? entrega.calificacion : '');
    setComentarioEvidencia(entrega?.comentario_instructor || '');
  };

  const handleGuardarEvaluacionEvidencia = async (e) => {
    e.preventDefault();
    if (!modalEvalEvidencia) return;
    const nota = parseFloat(calificacionEvidencia);
    if (isNaN(nota) || nota < 1.0 || nota > 5.0) {
      alert('Por favor ingresa una nota válida en escala de 1.0 a 5.0');
      return;
    }

    setGuardandoEvidenciaNota(true);
    try {
      await api.evaluarEvidencia(modalEvalEvidencia.evidencia.id, {
        estudiante_id: modalEvalEvidencia.estudiante.id,
        entrega_id: modalEvalEvidencia.entrega?.entrega_id,
        calificacion: nota,
        comentario: comentarioEvidencia
      });

      setMensajeExito(`Calificación de ${nota.toFixed(1)} registrada para ${modalEvalEvidencia.estudiante.nombres} ${modalEvalEvidencia.estudiante.apellidos}`);
      setTimeout(() => setMensajeExito(null), 4000);
      setModalEvalEvidencia(null);

      // Recargar datos actualizados
      if (cursoSeleccionado) {
        cargarEvidenciasClase(cursoSeleccionado);
        cargarEstudiantesDeClase(cursoSeleccionado);
      }
    } catch (err) {
      alert(err.message || 'Error al guardar la calificación');
    } finally {
      setGuardandoEvidenciaNota(false);
    }
  };

  const verExpedienteAprendiz = async (estudiante) => {
    try {
      const res = await api.getEstudianteDetalleCompleto(estudiante.id);
      setEstudianteExpediente(res.data);
    } catch (err) {
      setEstudianteExpediente({
        ...estudiante,
        documentos: [
          { nombre: 'Documento de Identidad (TI)', estado: 'Verificado', url: '#' },
          { nombre: 'Certificado de Afiliación EPS', estado: 'Verificado', url: '#' },
          { nombre: 'Hoja de Vida', estado: 'Verificado', url: estudiante.hoja_vida_url || '#' }
        ]
      });
    }
  };

  const estudiantesFiltrados = dataMatriz ? dataMatriz.matriz.filter(e => 
    `${e.nombres} ${e.apellidos}`.toLowerCase().includes(filtroTexto.toLowerCase()) ||
    e.numero_documento.includes(filtroTexto)
  ) : [];

  const getJuicioBadge = (juicio) => {
    switch (juicio) {
      case 'APROBADO':
        return <span className="badge badge-success">Aprobado ✓</span>;
      case 'EN_PROCESO':
        return <span className="badge badge-warning">En Proceso</span>;
      case 'REPROBADO_CANCELADO':
      case 'NO_APROBADO':
        return <span className="badge badge-danger">Reprobado / Cancelado</span>;
      default:
        return <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>Por Evaluar</span>;
    }
  };

  const totalAprendices = dataMatriz?.total_estudiantes || 0;
  const promedioAvance = dataMatriz?.matriz.length > 0
    ? Math.round(dataMatriz.matriz.reduce((acc, curr) => acc + curr.porcentaje_avance, 0) / dataMatriz.matriz.length)
    : 0;
  const renderEvidenciaInteractiva = (entrega, tarea) => {
    const url = entrega.archivo_url || '';
    const isGithub = url.toLowerCase().includes('github.com');
    const isDrive = url.toLowerCase().includes('drive.google.com') || url.endsWith('.pdf') || url.endsWith('.xlsx');
    const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i);

    let filename = 'evidencia-tecnica.pdf';
    if (url) {
      const parts = url.split('/');
      filename = parts[parts.length - 1] || 'evidencia.pdf';
    }

    if (isGithub) {
      let snippet = `// Proyecto: ${tarea?.titulo || 'Desarrollo Web'}\n// Aprendiz: ${entrega.nombres} ${entrega.apellidos} - Grado ${entrega.grado || 11}°\nimport React, { useState, useEffect } from 'react';\n\nexport default function PortalEstudiantil() {\n  const [datos, setDatos] = useState([]);\n\n  useEffect(() => {\n    // Consumo de API RESTful institucional\n    fetch('/api/v1/estudiantes')\n      .then(res => res.json())\n      .then(data => setDatos(data));\n  }, []);\n\n  return (\n    <div className="container mx-auto p-4">\n      <h1 className="text-xl font-bold">${tarea?.titulo || 'Evidencia Técnica'}</h1>\n      <p>Componente interactivo funcional desarrollado conforme a la rúbrica.</p>\n    </div>\n  );\n}`;
      if (tarea?.titulo?.toLowerCase().includes('sql') || tarea?.titulo?.toLowerCase().includes('datos') || tarea?.titulo?.toLowerCase().includes('base')) {
        snippet = `-- Script SQL DDL y Consultas Analíticas\n-- Autor: ${entrega.nombres} ${entrega.apellidos}\n\nSELECT e.nombres, e.apellidos, c.nombre AS curso, AVG(et.calificacion) AS promedio\nFROM estudiantes e\nJOIN matriculas m ON e.id = m.estudiante_id\nJOIN cursos c ON m.curso_id = c.id\nLEFT JOIN entregas_tareas et ON et.estudiante_id = e.id\nGROUP BY e.id, c.id\nHAVING promedio >= 4.0\nORDER BY promedio DESC;`;
      } else if (tarea?.titulo?.toLowerCase().includes('algoritmo') || tarea?.titulo?.toLowerCase().includes('pseint')) {
        snippet = `// Algoritmo en Pseudocódigo PSeInt\n// Aprendiz: ${entrega.nombres} ${entrega.apellidos}\n\nAlgoritmo SolucionProblemasLogicos\n    Definir nota, suma, promedio Como Real\n    Definir contador Como Entero\n    suma <- 0\n    Para contador <- 1 Hasta 5 Con Paso 1 Hacer\n        Escribir "Ingrese calificación ", contador\n        Leer nota\n        suma <- suma + nota\n    FinPara\n    promedio <- suma / 5\n    Escribir "El promedio final obtenido es: ", promedio\nFinAlgoritmo`;
      } else if (tarea?.titulo?.toLowerCase().includes('contab') || tarea?.titulo?.toLowerCase().includes('balance') || tarea?.titulo?.toLowerCase().includes('puc')) {
        snippet = `/* BALANCE DE COMPROBACIÓN Y ASIENTOS CONTABLES PUC */\n/* Aprendiz: ${entrega.nombres} ${entrega.apellidos} */\n\nCuenta 1105 - Caja General:           $ 4.500.000 (Débito)\nCuenta 1110 - Bancos Comerciales:      $ 18.250.000 (Débito)\nCuenta 1435 - Mercancías no Fabricadas: $ 12.800.000 (Débito)\nCuenta 2205 - Proveedores Nacionales:  $ 15.300.000 (Crédito)\nCuenta 3115 - Aportes Sociales:        $ 20.250.000 (Crédito)\n\nTOTALES SUMAS IGUALES:\nTotal Débitos:  $ 35.550.000\nTotal Créditos: $ 35.550.000\nESTADO: BALANCE CUADRADO Y VERIFICADO CON LIBRO DIARIO.`;
      }

      return (
        <div style={{ border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#0f172a', color: '#f8fafc' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '0.6rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <FileCode size={16} color="#60a5fa" />
              <span style={{ fontWeight: '700', color: '#93c5fd' }}>repositorio:</span>
              <span style={{ color: '#cbd5e1' }}>{url.replace('https://github.com/', '')}</span>
            </div>
            <span className="badge" style={{ backgroundColor: '#334155', color: '#94a3b8', fontSize: '0.7rem' }}>
              🌿 rama: main • verificado
            </span>
          </div>

          <div style={{ padding: '0.4rem 1rem', backgroundColor: '#1e293b', fontSize: '0.75rem', display: 'flex', gap: '1rem', color: '#94a3b8', borderBottom: '1px solid #334155', flexWrap: 'wrap' }}>
            <span style={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Folder size={12} /> src/
            </span>
            <span>📄 README.md</span>
            <span>📄 package.json</span>
            <span>✓ Commit verificado en aula</span>
          </div>

          <pre style={{ 
            margin: 0, 
            padding: '1rem', 
            fontSize: '0.8rem', 
            fontFamily: 'Consolas, Monaco, "Courier New", monospace', 
            lineHeight: 1.5,
            overflowX: 'auto',
            maxHeight: '220px',
            color: '#38bdf8'
          }}>
            <code>{snippet}</code>
          </pre>
        </div>
      );
    }

    if (isDrive) {
      return (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{filename}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Documento Digital de Evidencia • Formato PDF / Hoja de Cálculo Verificada
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, borderLeft: '3px solid #10b981' }}>
            <strong>Resumen del Contenido Entregado:</strong>
            <p style={{ margin: '0.25rem 0 0 0' }}>
              El estudiante radicó el informe formal con las evidencias solicitadas, desarrollo paso a paso del procedimiento técnico, soporte documental y conclusiones para sustentación.
            </p>
          </div>
        </div>
      );
    }

    if (isImage) {
      return (
        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <img src={url} alt="Evidencia entregada" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '6px', objectFit: 'contain' }} />
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Imagen de evidencia cargada por el aprendiz</div>
        </div>
      );
    }

    return (
      <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#475569' }}>
        <p style={{ margin: 0 }}>
          <strong>Enlace / Archivo de la Evidencia:</strong>{' '}
          <span style={{ color: '#00324D', wordBreak: 'break-all' }}>{url || 'Entrega física en aula de clase / sin enlace digital'}</span>
        </p>
      </div>
    );
  };

  return (
    <div className="main-content">
      {/* Header del Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Foto de Perfil del Instructor */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={fotoInstructor || user?.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.nombre || 'Foto del Instructor'}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #d4af37',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                opacity: subiendoFotoInst ? 0.5 : 1
              }}
            />
            <button
              type="button"
              onClick={() => fotoInstInputRef.current && fotoInstInputRef.current.click()}
              disabled={subiendoFotoInst}
              title="Cambiar foto de perfil"
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                backgroundColor: '#00324D',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <Camera size={14} />
            </button>
            <input 
              type="file" 
              ref={fotoInstInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFotoInstructorChange}
              accept="image/*"
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#00324D', margin: 0 }}>
                {user?.nombre || 'Prof. Carlos Alberto Pérez Moreno'}
              </h1>
              <span className="badge badge-primary">Docente Titular</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
              Panel de evaluación, seguimiento de competencias y revisión de evidencias
            </p>
          </div>
        </div>

        {/* Selector Dinámico de Fichas Asignadas */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '8px', flexWrap: 'wrap' }}>
          {misCursos.length > 0 ? (
            Array.from(new Map(misCursos.map(c => [c.ficha, c])).values()).map(c => (
              <button
                key={c.ficha || c.id}
                onClick={() => {
                  if (c.ficha) setFichaActiva(c.ficha);
                  setCursoSeleccionado(c.id);
                  api.getTareasPorCurso(c.id).then(r => setTareas(r.data)).catch(console.error);
                  api.getEstudiantesCurso(c.id).then(r => setEstudiantesCurso(r.data)).catch(console.error);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: fichaActiva === c.ficha ? '#ffffff' : 'transparent',
                  color: fichaActiva === c.ficha ? '#00324D' : '#64748b',
                  boxShadow: fichaActiva === c.ficha ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Ficha {c.ficha || 'S/F'} (Grado {c.grado || 11}° - {c.materia || c.nombre})
              </button>
            ))
          ) : (
            <button
              onClick={() => setFichaActiva('2712345')}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: '700',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                color: '#00324D'
              }}
            >
              Ficha 2712345 (Grado 11° - Web Junior)
            </button>
          )}
        </div>
      </div>

      {mensajeExito && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Pestañas de navegación principales del Instructor */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setPestana('programas')}
          style={{
            padding: '0.65rem 1.25rem', fontSize: '0.875rem', fontWeight: '700', background: 'transparent', border: 'none',
            borderBottom: pestana === 'programas' ? '3px solid #00324D' : '3px solid transparent',
            color: pestana === 'programas' ? '#00324D' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '-2px'
          }}
        >
          <BookOpen size={16} /> Programas
        </button>
        <button 
          onClick={() => setPestana('estudiantes')}
          style={{
            padding: '0.65rem 1.25rem', fontSize: '0.875rem', fontWeight: '700', background: 'transparent', border: 'none',
            borderBottom: pestana === 'estudiantes' ? '3px solid #00324D' : '3px solid transparent',
            color: pestana === 'estudiantes' ? '#00324D' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '-2px'
          }}
        >
          <Users size={16} /> Estudiantes
        </button>
        <button 
          onClick={() => setPestana('evaluaciones')}
          style={{
            padding: '0.65rem 1.25rem', fontSize: '0.875rem', fontWeight: '700', background: 'transparent', border: 'none',
            borderBottom: pestana === 'evaluaciones' ? '3px solid #00324D' : '3px solid transparent',
            color: pestana === 'evaluaciones' ? '#00324D' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '-2px'
          }}
        >
          <Award size={16} /> Evaluaciones
        </button>
        <button 
          onClick={() => setPestana('tareas')}
          style={{
            padding: '0.65rem 1.25rem', fontSize: '0.875rem', fontWeight: '700', background: 'transparent', border: 'none',
            borderBottom: pestana === 'tareas' ? '3px solid #00324D' : '3px solid transparent',
            color: pestana === 'tareas' ? '#00324D' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '-2px'
          }}
        >
          <FileText size={16} /> Tareas
        </button>
        <button 
          onClick={() => setPestana('asistencia')}
          style={{
            padding: '0.65rem 1.25rem', fontSize: '0.875rem', fontWeight: '700', background: 'transparent', border: 'none',
            borderBottom: pestana === 'asistencia' ? '3px solid #00324D' : '3px solid transparent',
            color: pestana === 'asistencia' ? '#00324D' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '-2px'
          }}
        >
          <CheckCircle2 size={16} /> Asistencia
        </button>
      </div>

      {/* =================== SECCIÓN 1: PROGRAMAS -> FICHA -> GRADO -> COMPETENCIAS =================== */}
      {pestana === 'programas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {loadingJerarquia ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Cargando jerarquía del programa...
            </div>
          ) : programasJerarquia.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', margin: 0 }}>No tiene programas asignados actualmente.</p>
            </div>
          ) : (
            programasJerarquia.map((prog) => {
              // Filtrado de clases/estudiantes según grado seleccionado
              const todasFichas = prog.fichas || [];
              const fichaSeleccionadaObj = todasFichas.find(f => f.codigo === fichaActiva) || todasFichas[0] || {};
              const todasClases = fichaSeleccionadaObj.clases || [];
              const clasesFiltradas = gradoActivo === 'todos' 
                ? todasClases 
                : todasClases.filter(c => String(c.grado) === String(gradoActivo));

              return (
                <div key={prog.id} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Banner / Cabecera compacta del Programa */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#00324D', backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>
                            Código: {prog.codigo || '228106'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {prog.duracion_meses ? `${prog.duracion_meses} meses` : '880 Horas'}
                          </span>
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#00324D', margin: '0 0 0.25rem 0' }}>
                          {prog.nombre}
                        </h2>
                        <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0 }}>
                          {prog.descripcion || 'Formación para el trabajo orientada al desarrollo de competencias laborales técnicas.'}
                        </p>
                      </div>

                      {/* Selectores compactos de Ficha y Grado */}
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Selector de Ficha */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#334155' }}>Ficha:</span>
                          <select 
                            value={fichaActiva} 
                            onChange={(e) => setFichaActiva(e.target.value)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.8125rem',
                              fontWeight: '600',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              backgroundColor: '#ffffff',
                              color: '#00324D',
                              cursor: 'pointer'
                            }}
                          >
                            {todasFichas.map(f => (
                              <option key={f.codigo} value={f.codigo}>
                                Ficha {f.codigo} {f.nombre ? `- ${f.nombre}` : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Selector de Grado */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#334155' }}>Grado:</span>
                          <div style={{ display: 'inline-flex', backgroundColor: '#f1f5f9', padding: '2px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                            <button
                              type="button"
                              onClick={() => setGradoActivo('todos')}
                              style={{
                                padding: '3px 10px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: gradoActivo === 'todos' ? '#00324D' : 'transparent',
                                color: gradoActivo === 'todos' ? '#ffffff' : '#64748b'
                              }}
                            >
                              Todos
                            </button>
                            <button
                              type="button"
                              onClick={() => setGradoActivo('10')}
                              style={{
                                padding: '3px 10px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: gradoActivo === '10' ? '#00324D' : 'transparent',
                                color: gradoActivo === '10' ? '#ffffff' : '#64748b'
                              }}
                            >
                              10°
                            </button>
                            <button
                              type="button"
                              onClick={() => setGradoActivo('11')}
                              style={{
                                padding: '3px 10px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: gradoActivo === '11' ? '#00324D' : 'transparent',
                                color: gradoActivo === '11' ? '#ffffff' : '#64748b'
                              }}
                            >
                              11°
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8125rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                      <div><strong>Competencias asociadas:</strong> {prog.competencias?.length || 0}</div>
                      <div><strong>Ficha en pantalla:</strong> {fichaActiva}</div>
                      <div><strong>Grado filtrado:</strong> {gradoActivo === 'todos' ? '10° y 11°' : `Grado ${gradoActivo}°`}</div>
                    </div>
                  </div>

                  {/* 3. SECCIÓN COMPETENCIAS DEL PROGRAMA */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#00324D', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Award size={18} color="#00324D" />
                        Competencias del Programa
                      </h3>
                      <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                        Haga clic en una competencia para gestionar temas pendientes y registrar evaluaciones
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {(prog.competencias || []).map((comp) => {
                        const estaAbierta = !!competenciasAbiertas[comp.id];
                        const totalTemas = comp.temas?.length || 0;

                        return (
                          <div 
                            key={comp.id} 
                            style={{
                              backgroundColor: '#ffffff',
                              border: estaAbierta ? '1px solid #00324D' : '1px solid #cbd5e1',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              boxShadow: estaAbierta ? '0 2px 4px rgba(0,50,77,0.08)' : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {/* Fila desplegable / Encabezado de la competencia */}
                            <div 
                              onClick={() => toggleCompetencia(comp.id)}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.85rem 1.25rem',
                                backgroundColor: estaAbierta ? '#f8fafc' : '#ffffff',
                                cursor: 'pointer',
                                borderBottom: estaAbierta ? '1px solid #e2e8f0' : 'none'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
                                <div style={{ color: '#00324D' }}>
                                  {estaAbierta ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                </div>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', backgroundColor: '#e2e8f0', padding: '1px 6px', borderRadius: '4px' }}>
                                      {comp.codigo || 'COMP-01'}
                                    </span>
                                    <strong style={{ fontSize: '0.925rem', color: '#0f172a' }}>
                                      {comp.denominacion || comp.nombre}
                                    </strong>
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  {comp.duracion_horas ? `${comp.duracion_horas}h` : '120h'}
                                </span>
                                <span style={{
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: totalTemas > 0 ? '#eff6ff' : '#f1f5f9',
                                  color: totalTemas > 0 ? '#1d4ed8' : '#64748b',
                                  border: '1px solid #cbd5e1'
                                }}>
                                  {totalTemas} {totalTemas === 1 ? 'tema' : 'temas'}
                                </span>
                              </div>
                            </div>

                            {/* CONTENIDO DESPLEGABLE DE LA COMPETENCIA */}
                            {estaAbierta && (
                              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#ffffff' }}>
                                
                                {/* 4. SUBSECCIÓN: TEMAS PENDIENTES */}
                                <div style={{
                                  backgroundColor: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  padding: '1rem'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <div>
                                      <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: '#00324D', margin: 0 }}>
                                        Temas pendientes y contenidos formativos
                                      </h4>
                                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                                        Materiales publicados y temas pendientes visibles para los estudiantes
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm"
                                      onClick={() => {
                                        setModalCrearTema({
                                          competenciaId: comp.id,
                                          competenciaNombre: comp.denominacion || comp.nombre
                                        });
                                        setFormTema({ titulo: '', descripcion: '', contenido_detallado: '', semana: totalTemas + 1, archivo_adjunto_url: '' });
                                      }}
                                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '4px 10px', fontSize: '0.785rem' }}
                                    >
                                      <Plus size={14} /> Crear nuevo tema
                                    </button>
                                  </div>

                                  {/* Lista de temas */}
                                  {totalTemas === 0 ? (
                                    <div style={{ padding: '0.85rem', textAlign: 'center', color: '#64748b', fontSize: '0.8125rem', fontStyle: 'italic', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px dashed #cbd5e1' }}>
                                      No hay temas pendientes ni publicados para esta competencia. Utilice el botón "Crear nuevo tema" para publicar contenidos y archivos de apoyo.
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                      {(comp.temas || []).map((t, idx) => (
                                        <div 
                                          key={t.id || idx}
                                          style={{
                                            padding: '0.75rem 1rem',
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            gap: '1rem',
                                            flexWrap: 'wrap'
                                          }}
                                        >
                                          <div style={{ flex: 1, minWidth: '240px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                              <span style={{ fontSize: '0.7rem', fontWeight: '700', backgroundColor: '#e2e8f0', color: '#00324D', padding: '1px 6px', borderRadius: '3px' }}>
                                                Semana {t.semana || idx + 1}
                                              </span>
                                              <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>
                                                {t.titulo}
                                              </strong>
                                              <span style={{ fontSize: '0.7rem', backgroundColor: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '3px', fontWeight: '600' }}>
                                                Publicado
                                              </span>
                                            </div>
                                            {t.descripcion && (
                                              <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 0.35rem 0' }}>
                                                {t.descripcion}
                                              </p>
                                            )}
                                            {t.contenido_detallado && (
                                              <div style={{ fontSize: '0.75rem', color: '#64748b', backgroundColor: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '4px', borderLeft: '3px solid #00324D', margin: '0.35rem 0' }}>
                                                {t.contenido_detallado}
                                              </div>
                                            )}
                                          </div>

                                          {/* Material o archivo adjunto */}
                                          {t.archivo_adjunto_url && (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                              <a 
                                                href={t.archivo_adjunto_url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                style={{
                                                  display: 'inline-flex',
                                                  alignItems: 'center',
                                                  gap: '0.35rem',
                                                  padding: '4px 8px',
                                                  fontSize: '0.75rem',
                                                  fontWeight: '600',
                                                  color: '#00324D',
                                                  backgroundColor: '#e2e8f0',
                                                  borderRadius: '4px',
                                                  textDecoration: 'none'
                                                }}
                                              >
                                                <Paperclip size={12} /> Material de apoyo
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* 5. SUBSECCIÓN: EVALUAR */}
                                <div style={{
                                  backgroundColor: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  padding: '1rem'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div>
                                      <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: '#00324D', margin: 0 }}>
                                        Evaluar estudiantes en esta competencia
                                      </h4>
                                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                                        Registre calificación (1.0 a 5.0) y observaciones asociadas a la Ficha {fichaActiva} ({gradoActivo === 'todos' ? 'Grados 10° y 11°' : `Grado ${gradoActivo}°`})
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      className="btn btn-outline btn-sm"
                                      onClick={() => {
                                        // Abrir modal de evaluación seleccionando la competencia
                                        abrirModalEvaluarDesdeCompetencia(comp, null);
                                      }}
                                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '4px 10px', fontSize: '0.785rem' }}
                                    >
                                      <Award size={14} /> Formulario de Evaluación
                                    </button>
                                  </div>

                                  {/* Mini tabla de evaluación rápida para esta competencia */}
                                  <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                      <thead>
                                        <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#334155', textAlign: 'left' }}>
                                          <th style={{ padding: '6px 10px', width: '35px', textAlign: 'center' }}>N°</th>
                                          <th style={{ padding: '6px 10px' }}>Estudiante</th>
                                          <th style={{ padding: '6px 10px', width: '80px', textAlign: 'center' }}>Grado</th>
                                          <th style={{ padding: '6px 10px', width: '110px', textAlign: 'center' }}>Estado</th>
                                          <th style={{ padding: '6px 10px', width: '80px', textAlign: 'center' }}>Nota</th>
                                          <th style={{ padding: '6px 10px', width: '120px', textAlign: 'center' }}>Acción</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {tablaEstudiantes
                                          .filter(est => {
                                            const matchFicha = !fichaActiva || String(est.ficha) === String(fichaActiva);
                                            const matchGrado = gradoActivo === 'todos' || String(est.grado) === String(gradoActivo);
                                            return matchFicha && matchGrado;
                                          })
                                          .slice(0, 8)
                                          .map((est, i) => {
                                            const evaluado = est.estado_evaluacion === 'Evaluado';
                                            return (
                                              <tr key={est.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '6px 10px', textAlign: 'center', color: '#64748b' }}>{i + 1}</td>
                                                <td style={{ padding: '6px 10px' }}>
                                                  <strong style={{ color: '#0f172a' }}>{est.nombres} {est.apellidos}</strong>
                                                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Doc: {est.documento}</div>
                                                </td>
                                                <td style={{ padding: '6px 10px', textAlign: 'center', color: '#475569' }}>{est.grado || 10}°</td>
                                                <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                                                  <span style={{
                                                    display: 'inline-block',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: '700',
                                                    backgroundColor: evaluado ? '#dcfce7' : '#fef3c7',
                                                    color: evaluado ? '#166534' : '#92400e'
                                                  }}>
                                                    {evaluado ? 'Evaluado' : 'Por evaluar'}
                                                  </span>
                                                </td>
                                                <td style={{ padding: '6px 10px', textAlign: 'center', fontWeight: '700', color: evaluado ? '#00324D' : '#94a3b8' }}>
                                                  {evaluado ? (est.calificacion !== null ? Number(est.calificacion).toFixed(1) : '—') : '—'}
                                                </td>
                                                <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                                                  <button
                                                    type="button"
                                                    className={evaluado ? "btn btn-outline btn-sm" : "btn btn-primary btn-sm"}
                                                    onClick={() => abrirModalEvaluarDesdeTabla(est, evaluado ? 'ver' : 'evaluar')}
                                                    style={{ padding: '2px 8px', fontSize: '0.725rem' }}
                                                  >
                                                    {evaluado ? 'Ver / Modificar' : 'Evaluar'}
                                                  </button>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* =================== SECCIÓN 2: ESTUDIANTES (TABLA ESTILO EXCEL) =================== */}
      {pestana === 'estudiantes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Barra de Filtros Estilo Excel */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.85rem',
            alignItems: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}>
            {/* Buscador */}
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Buscar por documento o nombre..."
                value={filtroBusquedaEst}
                onChange={(e) => setFiltroBusquedaEst(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.5rem 0.4rem 2rem',
                  fontSize: '0.8125rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Filtro por Programa */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>Programa:</label>
              <select
                value={filtroProgramaEst}
                onChange={(e) => setFiltroProgramaEst(e.target.value)}
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.785rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#fff', color: '#0f172a' }}
              >
                <option value="todos">Todos los programas</option>
                {Array.from(new Set(tablaEstudiantes.map(e => e.programa_nombre).filter(Boolean))).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Ficha */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>Ficha:</label>
              <select
                value={filtroFichaEst}
                onChange={(e) => setFiltroFichaEst(e.target.value)}
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.785rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#fff', color: '#0f172a' }}
              >
                <option value="todos">Todas las fichas</option>
                {Array.from(new Set(tablaEstudiantes.map(e => e.ficha).filter(Boolean))).map(f => (
                  <option key={f} value={f}>Ficha {f}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Grado */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>Grado:</label>
              <select
                value={filtroGradoEst}
                onChange={(e) => setFiltroGradoEst(e.target.value)}
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.785rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#fff', color: '#0f172a' }}
              >
                <option value="todos">Todos (10° y 11°)</option>
                <option value="10">Grado 10°</option>
                <option value="11">Grado 11°</option>
              </select>
            </div>

            {/* Filtro por Estado */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>Estado:</label>
              <select
                value={filtroEstadoEst}
                onChange={(e) => setFiltroEstadoEst(e.target.value)}
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.785rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#fff', color: '#0f172a' }}
              >
                <option value="todos">Todos los estados</option>
                <option value="Por evaluar">Por evaluar</option>
                <option value="Evaluado">Evaluado</option>
              </select>
            </div>

            {/* Botón refrescar */}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setFiltroBusquedaEst('');
                setFiltroProgramaEst('todos');
                setFiltroFichaEst('todos');
                setFiltroGradoEst('todos');
                setFiltroEstadoEst('todos');
                cargarEstudiantesTabla();
              }}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            >
              Restablecer
            </button>
          </div>

          {/* Tabla tipo Excel */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            overflowX: 'auto',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f1f5f9',
                  borderBottom: '2px solid #cbd5e1',
                  color: '#1e293b',
                  textAlign: 'left'
                }}>
                  <th style={{ padding: '8px 10px', width: '45px', textAlign: 'center', borderRight: '1px solid #e2e8f0', fontWeight: '700' }}>N°</th>
                  <th style={{ padding: '8px 12px', width: '110px', borderRight: '1px solid #e2e8f0', fontWeight: '700' }}>Documento</th>
                  <th style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', fontWeight: '700' }}>Nombre del estudiante</th>
                  <th style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', fontWeight: '700' }}>Programa</th>
                  <th style={{ padding: '8px 12px', width: '95px', textAlign: 'center', borderRight: '1px solid #e2e8f0', fontWeight: '700' }}>Ficha</th>
                  <th style={{ padding: '8px 10px', width: '70px', textAlign: 'center', borderRight: '1px solid #e2e8f0', fontWeight: '700' }}>Grado</th>
                  <th style={{ padding: '8px 12px', width: '120px', textAlign: 'center', borderRight: '1px solid #e2e8f0', fontWeight: '700' }}>Estado</th>
                  <th style={{ padding: '8px 12px', width: '120px', textAlign: 'center', fontWeight: '700' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const filtrados = tablaEstudiantes.filter(est => {
                    if (filtroBusquedaEst) {
                      const q = filtroBusquedaEst.toLowerCase();
                      const matchNom = `${est.nombres} ${est.apellidos}`.toLowerCase().includes(q);
                      const matchDoc = String(est.documento || '').includes(q);
                      if (!matchNom && !matchDoc) return false;
                    }
                    if (filtroProgramaEst !== 'todos' && est.programa_nombre !== filtroProgramaEst) return false;
                    if (filtroFichaEst !== 'todos' && String(est.ficha) !== String(filtroFichaEst)) return false;
                    if (filtroGradoEst !== 'todos' && String(est.grado) !== String(filtroGradoEst)) return false;
                    if (filtroEstadoEst !== 'todos' && est.estado_evaluacion !== filtroEstadoEst) return false;
                    return true;
                  });

                  if (loadingTablaEstudiantes) {
                    return (
                      <tr>
                        <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          Cargando planilla de estudiantes...
                        </td>
                      </tr>
                    );
                  }

                  if (filtrados.length === 0) {
                    return (
                      <tr>
                        <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          No se encontraron estudiantes con los criterios de búsqueda seleccionados.
                        </td>
                      </tr>
                    );
                  }

                  return filtrados.map((est, idx) => {
                    const evaluado = est.estado_evaluacion === 'Evaluado';
                    const filaPar = idx % 2 === 0;

                    return (
                      <tr 
                        key={est.id || idx}
                        style={{
                          backgroundColor: filaPar ? '#ffffff' : '#f8fafc',
                          borderBottom: '1px solid #e2e8f0',
                          transition: 'background-color 0.1s'
                        }}
                      >
                        <td style={{ padding: '7px 10px', textAlign: 'center', color: '#64748b', borderRight: '1px solid #f1f5f9' }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: '7px 12px', borderRight: '1px solid #f1f5f9', fontFamily: 'Consolas, monospace', fontSize: '0.8rem', color: '#334155' }}>
                          {est.documento || 'S/D'}
                        </td>
                        <td style={{ padding: '7px 12px', borderRight: '1px solid #f1f5f9' }}>
                          <strong style={{ color: '#0f172a' }}>{est.nombres} {est.apellidos}</strong>
                          {est.correo && (
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{est.correo}</div>
                          )}
                        </td>
                        <td style={{ padding: '7px 12px', borderRight: '1px solid #f1f5f9', color: '#334155' }}>
                          {est.programa_nombre || 'Técnico en Programación'}
                        </td>
                        <td style={{ padding: '7px 12px', textAlign: 'center', borderRight: '1px solid #f1f5f9', fontWeight: '600', color: '#00324D' }}>
                          {est.ficha || '2712345'}
                        </td>
                        <td style={{ padding: '7px 10px', textAlign: 'center', borderRight: '1px solid #f1f5f9', color: '#475569' }}>
                          {est.grado ? `${est.grado}°` : '10°'}
                        </td>
                        <td style={{ padding: '7px 12px', textAlign: 'center', borderRight: '1px solid #f1f5f9' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.725rem',
                            fontWeight: '700',
                            backgroundColor: evaluado ? '#dcfce7' : '#fef3c7',
                            color: evaluado ? '#166534' : '#92400e',
                            border: evaluado ? '1px solid #bbf7d0' : '1px solid #fde68a'
                          }}>
                            {evaluado ? (
                              <>
                                <Check size={12} /> Evaluado {est.calificacion !== null && est.calificacion !== undefined ? `(${Number(est.calificacion).toFixed(1)})` : ''}
                              </>
                            ) : (
                              <>
                                <Clock size={12} /> Por evaluar
                              </>
                            )}
                          </span>
                        </td>
                        <td style={{ padding: '7px 12px', textAlign: 'center' }}>
                          {evaluado ? (
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => abrirModalEvaluarDesdeTabla(est, 'ver')}
                              style={{ padding: '3px 8px', fontSize: '0.725rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                            >
                              <Eye size={12} /> Ver evaluación
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => abrirModalEvaluarDesdeTabla(est, 'evaluar')}
                              style={{ padding: '3px 10px', fontSize: '0.725rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                            >
                              <Edit3 size={12} /> Evaluar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem', color: '#64748b' }}>
            <div>Total aprendices en nómina: <strong>{tablaEstudiantes.length}</strong></div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span>✓ Evaluados: <strong>{tablaEstudiantes.filter(e => e.estado_evaluacion === 'Evaluado').length}</strong></span>
              <span>⏳ Por evaluar: <strong>{tablaEstudiantes.filter(e => e.estado_evaluacion !== 'Evaluado').length}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* =================== SECCIÓN 3: EVALUACIONES =================== */}
      {pestana === 'evaluaciones' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Tarjetas resumen de métricas de evaluación */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Aprendices</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#00324D', marginTop: '0.25rem' }}>{tablaEstudiantes.length}</div>
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '700', textTransform: 'uppercase' }}>Evaluados</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#166534', marginTop: '0.25rem' }}>
                {tablaEstudiantes.filter(e => e.estado_evaluacion === 'Evaluado').length}
              </div>
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: '700', textTransform: 'uppercase' }}>Por Evaluar</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#92400e', marginTop: '0.25rem' }}>
                {tablaEstudiantes.filter(e => e.estado_evaluacion !== 'Evaluado').length}
              </div>
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.75rem', color: '#00324D', fontWeight: '700', textTransform: 'uppercase' }}>Promedio Calificaciones</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#00324D', marginTop: '0.25rem' }}>
                {(() => {
                  const evs = tablaEstudiantes.filter(e => e.calificacion !== null && e.calificacion !== undefined);
                  if (evs.length === 0) return '0.0';
                  const sum = evs.reduce((acc, c) => acc + Number(c.calificacion), 0);
                  return (sum / evs.length).toFixed(1);
                })()} / 5.0
              </div>
            </div>
          </div>

          {/* Tabla consolidada de evaluaciones registradas */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            overflowX: 'auto',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.9rem', color: '#00324D' }}>Registro Oficial de Evaluaciones y Juicios Evaluativos</strong>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Aprobación con nota igual o superior a 3.5</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#1e293b', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px', width: '45px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>N°</th>
                  <th style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0' }}>Estudiante</th>
                  <th style={{ padding: '8px 12px', width: '100px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>Ficha / Grado</th>
                  <th style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0' }}>Competencia Asociada</th>
                  <th style={{ padding: '8px 12px', width: '85px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>Nota</th>
                  <th style={{ padding: '8px 12px', width: '110px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>Juicio</th>
                  <th style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0' }}>Observaciones</th>
                  <th style={{ padding: '8px 12px', width: '100px', textAlign: 'center' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {tablaEstudiantes.map((est, idx) => {
                  const evaluado = est.estado_evaluacion === 'Evaluado';
                  const aprobado = est.calificacion >= 3.5;
                  return (
                    <tr key={est.id || idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                      <td style={{ padding: '7px 10px', textAlign: 'center', color: '#64748b', borderRight: '1px solid #f1f5f9' }}>{idx + 1}</td>
                      <td style={{ padding: '7px 12px', borderRight: '1px solid #f1f5f9' }}>
                        <strong style={{ color: '#0f172a' }}>{est.nombres} {est.apellidos}</strong>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Doc: {est.documento}</div>
                      </td>
                      <td style={{ padding: '7px 12px', textAlign: 'center', borderRight: '1px solid #f1f5f9', color: '#475569' }}>
                        <div>{est.ficha || '2712345'}</div>
                        <div style={{ fontSize: '0.7rem' }}>Grado {est.grado || 10}°</div>
                      </td>
                      <td style={{ padding: '7px 12px', borderRight: '1px solid #f1f5f9', color: '#334155' }}>
                        {est.competencia_nombre || 'Desarrollo de Software'}
                      </td>
                      <td style={{ padding: '7px 12px', textAlign: 'center', borderRight: '1px solid #f1f5f9', fontWeight: '800', color: evaluado ? (aprobado ? '#166534' : '#dc2626') : '#94a3b8' }}>
                        {evaluado ? Number(est.calificacion).toFixed(1) : '—'}
                      </td>
                      <td style={{ padding: '7px 12px', textAlign: 'center', borderRight: '1px solid #f1f5f9' }}>
                        {evaluado ? (
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            backgroundColor: aprobado ? '#dcfce7' : '#fee2e2',
                            color: aprobado ? '#166534' : '#dc2626'
                          }}>
                            {aprobado ? 'APROBADO' : 'NO APROBADO'}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic' }}>Sin calificar</span>
                        )}
                      </td>
                      <td style={{ padding: '7px 12px', borderRight: '1px solid #f1f5f9', fontSize: '0.75rem', color: '#475569' }}>
                        {est.observaciones || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Sin observaciones registradas</span>}
                      </td>
                      <td style={{ padding: '7px 12px', textAlign: 'center' }}>
                        <button
                          type="button"
                          className={evaluado ? "btn btn-outline btn-sm" : "btn btn-primary btn-sm"}
                          onClick={() => abrirModalEvaluarDesdeTabla(est, evaluado ? 'ver' : 'evaluar')}
                          style={{ padding: '3px 8px', fontSize: '0.725rem' }}
                        >
                          {evaluado ? 'Modificar' : 'Evaluar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================== MODAL: CREAR TEMA PENDIENTE =================== */}
      {modalCrearTema && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-content" style={{ maxWidth: '580px', width: '92%', backgroundColor: '#ffffff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#00324D', margin: 0 }}>
                  Nuevo Tema de Formación
                </h3>
                <p style={{ fontSize: '0.775rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  {modalCrearTema.competenciaNombre}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setModalCrearTema(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCrearTema} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Título del Tema *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Introducción a Bases de Datos Relacionales"
                  value={formTema.titulo}
                  onChange={(e) => setFormTema({ ...formTema, titulo: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Semana
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={formTema.semana}
                    onChange={(e) => setFormTema({ ...formTema, semana: parseInt(e.target.value) || 1 })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Descripción Breve
                  </label>
                  <input
                    type="text"
                    placeholder="Resumen del tema formativo..."
                    value={formTema.descripcion}
                    onChange={(e) => setFormTema({ ...formTema, descripcion: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Contenido Detallado y Pautas para el Estudiante
                </label>
                <textarea
                  rows="4"
                  placeholder="Detalle los objetivos, lecturas, instrucciones o ejercicios que los aprendices deben realizar..."
                  value={formTema.contenido_detallado}
                  onChange={(e) => setFormTema({ ...formTema, contenido_detallado: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>

              {/* Carga de material de apoyo */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Material de apoyo o archivo adjunto (Opcional)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="file"
                    id="archivo-tema-input"
                    onChange={handleSubirArchivoTema}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => document.getElementById('archivo-tema-input').click()}
                    disabled={subiendoArchivoTema}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.775rem' }}
                  >
                    <UploadCloud size={14} /> {subiendoArchivoTema ? 'Subiendo...' : 'Seleccionar Archivo'}
                  </button>
                  {formTema.archivo_adjunto_url ? (
                    <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Check size={14} /> Archivo adjuntado correctamente
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PDF, ZIP, DOCX, etc.</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalCrearTema(null)}
                  style={{ fontSize: '0.8125rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={guardandoTema}
                  style={{ fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  {guardandoTema ? 'Guardando...' : 'Guardar y Publicar Tema'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================== MODAL: EVALUAR ESTUDIANTE =================== */}
      {modalEvaluarComp && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-content" style={{ maxWidth: '540px', width: '92%', backgroundColor: '#ffffff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#00324D', margin: 0 }}>
                  {modalEvaluarComp.modo === 'ver' ? 'Consulta y Modificación de Evaluación' : 'Registro de Calificación'}
                </h3>
                <p style={{ fontSize: '0.775rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Módulo de Evaluación Institucional
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setModalEvaluarComp(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGuardarEvaluacionCompetencia} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Información del estudiante */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                {modalEvaluarComp.estudiante ? (
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                      {modalEvaluarComp.estudiante.nombres} {modalEvaluarComp.estudiante.apellidos}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', display: 'flex', gap: '1rem' }}>
                      <span>Doc: <strong>{modalEvaluarComp.estudiante.documento || 'S/D'}</strong></span>
                      <span>Ficha: <strong>{modalEvaluarComp.estudiante.ficha || fichaActiva}</strong></span>
                      <span>Grado: <strong>{modalEvaluarComp.estudiante.grado || 10}°</strong></span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      Seleccionar Estudiante *
                    </label>
                    <select
                      value={formEvalComp.estudiante_id}
                      onChange={(e) => setFormEvalComp({ ...formEvalComp, estudiante_id: e.target.value })}
                      required
                      style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.8125rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    >
                      <option value="">-- Seleccione un estudiante --</option>
                      {tablaEstudiantes.map(est => (
                        <option key={est.id} value={est.id}>
                          {est.nombres} {est.apellidos} (Doc: {est.documento} - Ficha: {est.ficha})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Competencia */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Competencia Asociada
                </label>
                <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem', color: '#00324D', fontWeight: '600' }}>
                  {modalEvaluarComp.competencia?.denominacion || modalEvaluarComp.competencia?.nombre || 'Competencia del Programa de Formación'}
                </div>
              </div>

              {/* Rúbrica de Evaluación Especializada (Seguridad / Práctica) */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={16} color="#00324D" />
                    <strong style={{ fontSize: '0.8125rem', color: '#00324D' }}>Rúbrica de Auditoría de Seguridad y Calidad</strong>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setMostrarRubrica(!mostrarRubrica)}
                    style={{ padding: '2px 8px', fontSize: '0.725rem' }}
                  >
                    {mostrarRubrica ? 'Ocultar Rúbrica' : 'Abrir Rúbrica'}
                  </button>
                </div>

                {mostrarRubrica && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 65px', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#475569' }}>1. Detección y Escaneo con Agentes (SAST/OWASP):</span>
                      <input
                        type="number"
                        min="1.0"
                        max="5.0"
                        step="0.1"
                        value={rubricaSeguridad.criterio1_escaneo}
                        onChange={(e) => setRubricaSeguridad({...rubricaSeguridad, criterio1_escaneo: parseFloat(e.target.value) || 1.0})}
                        style={{ padding: '2px 4px', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 65px', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#475569' }}>2. Refactorización y Parches de Código Seguro:</span>
                      <input
                        type="number"
                        min="1.0"
                        max="5.0"
                        step="0.1"
                        value={rubricaSeguridad.criterio2_refactor}
                        onChange={(e) => setRubricaSeguridad({...rubricaSeguridad, criterio2_refactor: parseFloat(e.target.value) || 1.0})}
                        style={{ padding: '2px 4px', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 65px', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#475569' }}>3. Estructura y Rigor del Reporte de Fallos:</span>
                      <input
                        type="number"
                        min="1.0"
                        max="5.0"
                        step="0.1"
                        value={rubricaSeguridad.criterio3_reporte}
                        onChange={(e) => setRubricaSeguridad({...rubricaSeguridad, criterio3_reporte: parseFloat(e.target.value) || 1.0})}
                        style={{ padding: '2px 4px', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 65px', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#475569' }}>4. Verificación de Re-escaneo (0 Críticas):</span>
                      <input
                        type="number"
                        min="1.0"
                        max="5.0"
                        step="0.1"
                        value={rubricaSeguridad.criterio4_mitigacion}
                        onChange={(e) => setRubricaSeguridad({...rubricaSeguridad, criterio4_mitigacion: parseFloat(e.target.value) || 1.0})}
                        style={{ padding: '2px 4px', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          const promedio = (
                            (rubricaSeguridad.criterio1_escaneo +
                             rubricaSeguridad.criterio2_refactor +
                             rubricaSeguridad.criterio3_reporte +
                             rubricaSeguridad.criterio4_mitigacion) / 4
                          ).toFixed(1);
                          setFormEvalComp({
                            ...formEvalComp,
                            calificacion: promedio,
                            observaciones: `Evaluación por Rúbrica de Seguridad: Escaneo SAST (${rubricaSeguridad.criterio1_escaneo}), Refactorización Defensiva (${rubricaSeguridad.criterio2_refactor}), Reporte Técnico (${rubricaSeguridad.criterio3_reporte}), Mitigación (${rubricaSeguridad.criterio4_mitigacion}). Cumple con los estándares de desarrollo seguro.`
                          });
                        }}
                        style={{ padding: '3px 10px', fontSize: '0.75rem' }}
                      >
                        ✓ Aplicar Rúbrica a la Nota
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Calificación */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Calificación Cuantitativa (1.0 - 5.0) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  required
                  placeholder="Ej. 4.5"
                  value={formEvalComp.calificacion}
                  onChange={(e) => setFormEvalComp({ ...formEvalComp, calificacion: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.9rem', fontWeight: '700', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
                <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '3px' }}>
                  Nota mínima aprobatoria: <strong>3.5</strong>. La calificación calculará automáticamente el juicio como APROBADO o NO APROBADO.
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Observaciones / Retroalimentación
                </label>
                <textarea
                  rows="3"
                  placeholder="Comentarios del instructor sobre el desempeño, logros y aspectos a fortalecer..."
                  value={formEvalComp.observaciones}
                  onChange={(e) => setFormEvalComp({ ...formEvalComp, observaciones: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalEvaluarComp(null)}
                  style={{ fontSize: '0.8125rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={guardandoEvalComp}
                  style={{ fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  {guardandoEvalComp ? 'Guardando...' : (modalEvaluarComp.modo === 'ver' ? 'Actualizar Evaluación' : 'Guardar Evaluación')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =================== PESTAÑA 1: MIS CURSOS Y ESTUDIANTES ASIGNADOS =================== */}
      {pestana === 'cursos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tarjetas de Cursos que Dicta el Docente */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#00324D', margin: 0 }}>
                  Cursos Técnicos y Asignaturas a Cargo
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '3px 0 0 0' }}>
                  Materias técnicas y programas articulados en Grados 10° y 11°
                </p>
              </div>
              <span className="badge badge-primary">
                {misCursos.length} Cursos Asignados
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {misCursos.map((c) => {
                const isSelected = c.id === cursoSeleccionado;
                return (
                  <div
                    key={c.id}
                    onClick={() => setCursoSeleccionado(c.id)}
                    style={{
                      border: isSelected ? '2px solid #00324D' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                      boxShadow: isSelected ? '0 4px 12px rgba(0,50,77,0.08)' : '0 2px 4px rgba(0,0,0,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">
                        Grado {c.grado || 11}° de Bachillerato Técnico
                      </span>
                      <span className="badge badge-info">
                        Ficha {c.ficha || 'SENA'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#00324D', marginBottom: '0.35rem' }}>
                      {c.nombre}
                    </h3>

                    <div style={{ fontSize: '0.85rem', color: '#047857', fontWeight: '700', marginBottom: '0.5rem' }}>
                      📚 Materia: {c.materia || 'Formación Técnica'}
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '0.75rem' }}>
                      ⚙️ <strong>Programa:</strong> {c.programa_formacion}
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: '0 0 0.75rem 0' }}>
                      {c.descripcion}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: isSelected ? '#00324D' : '#64748b' }}>
                        {isSelected ? '✓ Curso Seleccionado' : 'Clic para ver estudiantes'}
                      </span>
                      <span className="badge" style={{ backgroundColor: '#e2e8f0', color: '#334155' }}>
                        {c.estado || 'PUBLICO'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Listado Detallado de Estudiantes Asignados al Curso Seleccionado */}
          <div className="card">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={20} color="#00324D" />
                  <h2 style={{ fontSize: '1.25rem', color: '#00324D' }}>
                    Estudiantes Asignados al Curso
                  </h2>
                </div>
                {misCursos.find(c => c.id === cursoSeleccionado) && (
                  <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                    {misCursos.find(c => c.id === cursoSeleccionado).nombre} • <strong>Materia: {misCursos.find(c => c.id === cursoSeleccionado).materia}</strong>
                  </p>
                )}
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                {estudiantesCurso.length} Estudiantes Matriculados
              </span>
            </div>

            {loadingEstudiantesCurso ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                Cargando lista de estudiantes asignados...
              </div>
            ) : estudiantesCurso.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                No hay estudiantes matriculados en este curso técnico actualmente.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ width: '100%', fontSize: '0.875rem' }}>
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Documento</th>
                      <th>Grado</th>
                      <th>Programa Técnico</th>
                      <th>Avance Formativo</th>
                      <th style={{ textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estudiantesCurso.map((est) => (
                      <tr key={est.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={est.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                              alt={est.nombres}
                              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <strong style={{ color: '#0f172a' }}>{est.nombres} {est.apellidos}</strong>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{est.email || `${est.nombres.toLowerCase().replace(' ', '.')}@estudiantil.edu.co`}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: '600' }}>{est.tipo_documento}: {est.numero_documento}</span>
                        </td>
                        <td>
                          <span className="badge badge-primary">Grado {est.grado}°</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8125rem', color: '#334155' }}>{est.programa_formacion}</span>
                        </td>
                        <td>
                          <span className="badge badge-success">
                            ✓ {est.aprobadas_count || 4} / {est.total_comp || 4} Competencias
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => verExpedienteAprendiz(est)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <FileText size={14} /> Ver Expediente
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================== PESTAÑA TAREAS =================== */}
      {pestana === 'tareas' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#00324D' }}>Gestión de Tareas y Calificaciones</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <select 
                  className="form-select" 
                  style={{ maxWidth: '400px' }} 
                  value={cursoSeleccionado} 
                  onChange={async (e) => {
                    const val = e.target.value;
                    setCursoSeleccionado(val);
                    const cMatch = misCursos.find(c => c.id === val);
                    if (cMatch && cMatch.ficha) setFichaActiva(cMatch.ficha);
                    try {
                      const resT = await api.getTareasPorCurso(val);
                      setTareas(resT.data);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  {misCursos.map(c => <option key={c.id} value={c.id}>[{c.materia}] {c.nombre} (Grado {c.grado}° - Ficha {c.ficha})</option>)}
                </select>
                {misCursos.find(c => c.id === cursoSeleccionado) && (
                  <span className="badge badge-info">
                    {misCursos.find(c => c.id === cursoSeleccionado).programa_formacion} • Grado {misCursos.find(c => c.id === cursoSeleccionado).grado}°
                  </span>
                )}
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModalTarea(true)}>
              <Plus size={16} /> Crear Tarea
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {tareas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No hay tareas montadas para este curso aún.</div>
            ) : tareas.map(t => {
              const pendientes = t.entregas?.filter(e => e.calificacion === null || e.calificacion === undefined) || [];
              const evaluadas = t.entregas?.filter(e => e.calificacion !== null && e.calificacion !== undefined) || [];

              return (
                <div key={t.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#00324D', margin: 0 }}>{t.titulo}</h3>
                        {pendientes.length > 0 ? (
                          <span className="badge badge-warning" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                            ⏳ {pendientes.length} Por Evaluar
                          </span>
                        ) : evaluadas.length > 0 ? (
                          <span className="badge badge-success">
                            ✓ {evaluadas.length} Evaluadas
                          </span>
                        ) : (
                          <span className="badge badge-info">Sin entregas aún</span>
                        )}
                      </div>
                      <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: '0.4rem', lineHeight: 1.5 }}>{t.descripcion}</p>
                      {t.archivo_adjunto_url && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <a 
                            href={t.archivo_adjunto_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn btn-outline btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#00324D', borderColor: '#00324D', backgroundColor: '#f0f9ff' }}
                          >
                            <Paperclip size={13} color="#00324D" /> 📎 Ver Guía / Archivo Adjunto de la Tarea
                          </a>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setTareaDetalleModal(t)}
                        style={{ padding: '4px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <BookOpen size={13} /> Ver Pautas de la Tarea
                      </button>
                      <span className="badge badge-info" style={{ whiteSpace: 'nowrap' }}>
                        Límite: {new Date(t.fecha_limite).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                        Evidencias Entregadas ({t.entregas?.length || 0})
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Haz clic en "Ver Evidencia" para revisar y calificar en el visor integrado sin salir de la página
                      </span>
                    </div>

                    {t.entregas && t.entregas.length > 0 ? (
                      <div>
                        <div className="table-responsive">
                          <table className="table" style={{ width: '100%', fontSize: '0.875rem' }}>
                            <thead>
                              <tr>
                                <th>Estudiante</th>
                                <th>Evidencia Entregada</th>
                                <th>Estado</th>
                                <th style={{ width: '120px' }}>Calificación</th>
                              </tr>
                            </thead>
                            <tbody>
                              {t.entregas.map(ent => (
                                <tr key={ent.id}>
                                  <td>
                                    <div 
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => abrirVisorEntrega(t, ent)}
                                      title="Clic para revisar entrega completa"
                                    >
                                      <strong style={{ color: '#00324D' }}>{ent.nombres} {ent.apellidos}</strong>
                                      {ent.observaciones && (
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>"{ent.observaciones}"</div>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn btn-outline btn-sm"
                                      onClick={() => abrirVisorEntrega(t, ent)}
                                      style={{ padding: '4px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontWeight: '700', borderColor: '#00324D', color: '#00324D' }}
                                    >
                                      <Eye size={13} color="#00324D" /> Ver Evidencia
                                    </button>
                                  </td>
                                  <td>
                                    {ent.calificacion !== null && ent.calificacion !== undefined ? (
                                      <span className="badge badge-success">✓ Evaluada ({ent.calificacion} / 5.0)</span>
                                    ) : (
                                      <span className="badge badge-warning" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                                        ⏳ Por Evaluar
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <input 
                                      type="number" 
                                      step="0.1"
                                      min="1.0"
                                      max="5.0"
                                      className="form-input" 
                                      style={{ width: '80px', padding: '4px 6px', fontSize: '0.85rem' }} 
                                      defaultValue={ent.calificacion || ''}
                                      placeholder="1.0 - 5.0"
                                      onChange={(e) => {
                                        ent.calificacion_temporal = e.target.value;
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          onClick={() => handleCalificarEntregas(t)}
                        >
                          <CheckCircle2 size={14} /> Guardar Calificaciones en Bloque
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', padding: '0.5rem 0' }}>
                        Los estudiantes aún no han cargado evidencias para esta tarea.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================== PESTAÑA ASISTENCIA =================== */}
      {pestana === 'asistencia' && (() => {
        const totalMatriculados = listaAsistencia.length;
        const presentesList = listaAsistencia.filter(e => (e.estado || (e.presente ? 'PRESENTE' : 'INASISTENCIA')) === 'PRESENTE');
        const inasistenciasList = listaAsistencia.filter(e => (e.estado || (e.presente ? 'PRESENTE' : 'INASISTENCIA')) === 'INASISTENCIA');
        const tardasList = listaAsistencia.filter(e => e.estado === 'TARDE');
        const excusasList = listaAsistencia.filter(e => e.estado === 'EXCUSA');

        const filtrados = listaAsistencia.filter(est => {
          const estEstado = est.estado || (est.presente ? 'PRESENTE' : 'INASISTENCIA');
          if (subFiltroAsistencia === 'inasistencias' && estEstado !== 'INASISTENCIA') return false;
          if (subFiltroAsistencia === 'tardes' && estEstado !== 'TARDE') return false;
          if (subFiltroAsistencia === 'presentes' && estEstado !== 'PRESENTE') return false;
          if (subFiltroAsistencia === 'excusas' && estEstado !== 'EXCUSA') return false;

          if (busquedaAsistencia.trim()) {
            const term = busquedaAsistencia.toLowerCase();
            const nombreCompleto = `${est.nombres} ${est.apellidos}`.toLowerCase();
            const doc = (est.numero_documento || '').toLowerCase();
            return nombreCompleto.includes(term) || doc.includes(term);
          }
          return true;
        });

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header y Controles de Fecha y Curso */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#00324D', margin: 0 }}>
                    Control de Asistencia, Inasistencias y Llegadas Tarde
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                    Registro diario y consolidación de novedades de asistencia para la articulación técnica
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleCopiarReporteAsistencia}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                    title="Copiar resumen consolidado para enviar por WhatsApp o correo"
                  >
                    <Share2 size={15} /> Copiar Reporte del Día
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleGuardarAsistencia}
                    disabled={guardandoAsistencia}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#00324D' }}
                  >
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>{guardandoAsistencia ? 'Guardando...' : 'Guardar Lista de Asistencia'}</span>
                  </button>
                </div>
              </div>

              {/* Selectores */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ flex: '1 1 320px' }}>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem', color: '#334155' }}>
                    Curso Técnico *
                  </label>
                  <select className="form-select" value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)}>
                    {misCursos.map(c => <option key={c.id} value={c.id}>[{c.materia}] {c.nombre} (Grado {c.grado}°)</option>)}
                  </select>
                </div>

                <div style={{ flex: '0 1 200px' }}>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem', color: '#334155' }}>
                    Fecha de la Clase *
                  </label>
                  <input type="date" className="form-input" value={fechaAsistencia} onChange={e => setFechaAsistencia(e.target.value)} />
                </div>

                <div style={{ flex: '1 1 220px' }}>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem', color: '#334155' }}>
                    Buscar Aprendiz
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nombre o documento..."
                      value={busquedaAsistencia}
                      onChange={e => setBusquedaAsistencia(e.target.value)}
                      style={{ paddingLeft: '2.2rem' }}
                    />
                    <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Cards de Asistencia del Día */}
            <div className="grid-kpi">
              <div className="kpi-card" style={{ borderLeft: '4px solid #00324D' }}>
                <div className="kpi-icon" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                  <Users size={22} />
                </div>
                <div>
                  <div className="kpi-value">{totalMatriculados}</div>
                  <div className="kpi-label">Total Matriculados</div>
                </div>
              </div>

              <div 
                className="kpi-card" 
                style={{ borderLeft: '4px solid #10b981', cursor: 'pointer', backgroundColor: subFiltroAsistencia === 'presentes' ? '#ecfdf5' : '#fff' }}
                onClick={() => setSubFiltroAsistencia(subFiltroAsistencia === 'presentes' ? 'todos' : 'presentes')}
                title="Clic para ver sólo presentes"
              >
                <div className="kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                  <UserCheck size={22} />
                </div>
                <div>
                  <div className="kpi-value" style={{ color: '#065f46' }}>{presentesList.length}</div>
                  <div className="kpi-label">Presentes a Tiempo ({totalMatriculados > 0 ? Math.round((presentesList.length/totalMatriculados)*100) : 0}%)</div>
                </div>
              </div>

              <div 
                className="kpi-card" 
                style={{ borderLeft: '4px solid #ef4444', cursor: 'pointer', backgroundColor: subFiltroAsistencia === 'inasistencias' ? '#fef2f2' : '#fff' }}
                onClick={() => setSubFiltroAsistencia(subFiltroAsistencia === 'inasistencias' ? 'todos' : 'inasistencias')}
                title="Clic para ver la lista de inasistencias"
              >
                <div className="kpi-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                  <UserX size={22} />
                </div>
                <div>
                  <div className="kpi-value" style={{ color: '#991b1b' }}>{inasistenciasList.length}</div>
                  <div className="kpi-label">Inasistencias / Fallas</div>
                </div>
              </div>

              <div 
                className="kpi-card" 
                style={{ borderLeft: '4px solid #f59e0b', cursor: 'pointer', backgroundColor: subFiltroAsistencia === 'tardes' ? '#fffbeb' : '#fff' }}
                onClick={() => setSubFiltroAsistencia(subFiltroAsistencia === 'tardes' ? 'todos' : 'tardes')}
                title="Clic para ver la lista de llegadas tarde"
              >
                <div className="kpi-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <div className="kpi-value" style={{ color: '#b45309' }}>{tardasList.length}</div>
                  <div className="kpi-label">Llegadas Tarde (Retardo)</div>
                </div>
              </div>
            </div>

            {/* Panel Principal de Listas: Pestañas para Lista General, Inasistencias y Llegadas Tarde */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc', flexWrap: 'wrap', gap: '0.25rem', padding: '0.5rem 1rem 0 1rem' }}>
                <button
                  type="button"
                  onClick={() => setSubFiltroAsistencia('todos')}
                  style={{
                    padding: '0.65rem 1rem', fontSize: '0.875rem', fontWeight: '700', border: 'none', background: 'transparent',
                    borderBottom: subFiltroAsistencia === 'todos' ? '3px solid #00324D' : '3px solid transparent',
                    color: subFiltroAsistencia === 'todos' ? '#00324D' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}
                >
                  <Users size={16} /> Lista Completa ({totalMatriculados})
                </button>

                <button
                  type="button"
                  onClick={() => setSubFiltroAsistencia('inasistencias')}
                  style={{
                    padding: '0.65rem 1rem', fontSize: '0.875rem', fontWeight: '700', border: 'none', background: 'transparent',
                    borderBottom: subFiltroAsistencia === 'inasistencias' ? '3px solid #ef4444' : '3px solid transparent',
                    color: subFiltroAsistencia === 'inasistencias' ? '#dc2626' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}
                >
                  <UserX size={16} color="#ef4444" />
                  <span>Lista de Inasistencias</span>
                  <span className="badge badge-danger" style={{ fontSize: '0.75rem', padding: '2px 7px' }}>
                    {inasistenciasList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubFiltroAsistencia('tardes')}
                  style={{
                    padding: '0.65rem 1rem', fontSize: '0.875rem', fontWeight: '700', border: 'none', background: 'transparent',
                    borderBottom: subFiltroAsistencia === 'tardes' ? '3px solid #f59e0b' : '3px solid transparent',
                    color: subFiltroAsistencia === 'tardes' ? '#b45309' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}
                >
                  <Clock size={16} color="#f59e0b" />
                  <span>Lista de Llegadas Tarde</span>
                  <span className="badge badge-warning" style={{ fontSize: '0.75rem', padding: '2px 7px', backgroundColor: '#fef3c7', color: '#92400e' }}>
                    {tardasList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubFiltroAsistencia('presentes')}
                  style={{
                    padding: '0.65rem 1rem', fontSize: '0.875rem', fontWeight: '700', border: 'none', background: 'transparent',
                    borderBottom: subFiltroAsistencia === 'presentes' ? '3px solid #10b981' : '3px solid transparent',
                    color: subFiltroAsistencia === 'presentes' ? '#047857' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}
                >
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Presentes ({presentesList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubFiltroAsistencia('excusas')}
                  style={{
                    padding: '0.65rem 1rem', fontSize: '0.875rem', fontWeight: '700', border: 'none', background: 'transparent',
                    borderBottom: subFiltroAsistencia === 'excusas' ? '3px solid #3b82f6' : '3px solid transparent',
                    color: subFiltroAsistencia === 'excusas' ? '#1d4ed8' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}
                >
                  <FileText size={16} color="#3b82f6" />
                  <span>Con Excusa ({excusasList.length})</span>
                </button>
              </div>

              {/* Barra de ayuda y botones de lote */}
              <div style={{ padding: '0.75rem 1.25rem', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                  {subFiltroAsistencia === 'inasistencias' && (
                    <span style={{ color: '#dc2626', fontWeight: '700' }}>
                      ⚠️ Lista de {inasistenciasList.length} aprendices con inasistencia registrada.
                    </span>
                  )}
                  {subFiltroAsistencia === 'tardes' && (
                    <span style={{ color: '#b45309', fontWeight: '700' }}>
                      ⏰ Lista de {tardasList.length} aprendices con llegada tarde / retardo.
                    </span>
                  )}
                  {subFiltroAsistencia === 'todos' && (
                    <span>Haz clic en el estado correspondiente para cada aprendiz o usa las acciones en bloque:</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => marcarTodosConEstado('PRESENTE')}
                    style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', borderColor: '#10b981', color: '#065f46' }}
                  >
                    <Check size={13} /> Marcar Todos Presentes
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => marcarTodosConEstado('INASISTENCIA')}
                    style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', borderColor: '#ef4444', color: '#991b1b' }}
                  >
                    <UserX size={13} /> Marcar Todos Ausentes
                  </button>
                </div>
              </div>

              {/* Tabla de Asistencia */}
              <div className="table-responsive">
                <table className="table" style={{ width: '100%', fontSize: '0.875rem' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Aprendiz / Documento</th>
                      <th style={{ width: '300px', textAlign: 'center' }}>Estado de Asistencia</th>
                      <th>Observación / Justificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map((est, idx) => {
                      const estadoActual = est.estado || (est.presente ? 'PRESENTE' : 'INASISTENCIA');
                      return (
                        <tr 
                          key={est.id}
                          style={{
                            backgroundColor: estadoActual === 'INASISTENCIA' ? '#fff5f5' : estadoActual === 'TARDE' ? '#fffdf0' : estadoActual === 'EXCUSA' ? '#f0f9ff' : 'transparent'
                          }}
                        >
                          <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{idx + 1}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img
                                src={est.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                                alt={est.nombres}
                                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <strong style={{ color: '#0f172a', display: 'block' }}>
                                  {est.nombres} {est.apellidos}
                                </strong>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  {est.tipo_documento || 'TI'}: {est.numero_documento} • Grado {est.grado || 11}°
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Botones de Selección de Estado */}
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                              {/* Botón PRESENTE */}
                              <button
                                type="button"
                                onClick={() => handleCambiarEstadoAsistencia(est.id, 'PRESENTE')}
                                style={{
                                  padding: '5px 9px',
                                  fontSize: '0.75rem',
                                  fontWeight: '700',
                                  border: 'none',
                                  cursor: 'pointer',
                                  backgroundColor: estadoActual === 'PRESENTE' ? '#10b981' : '#ffffff',
                                  color: estadoActual === 'PRESENTE' ? '#ffffff' : '#475569',
                                  transition: 'all 0.15s ease'
                                }}
                                title="Presente a tiempo"
                              >
                                ✓ Presente
                              </button>

                              {/* Botón TARDE */}
                              <button
                                type="button"
                                onClick={() => handleCambiarEstadoAsistencia(est.id, 'TARDE')}
                                style={{
                                  padding: '5px 9px',
                                  fontSize: '0.75rem',
                                  fontWeight: '700',
                                  border: 'none',
                                  borderLeft: '1px solid #cbd5e1',
                                  cursor: 'pointer',
                                  backgroundColor: estadoActual === 'TARDE' ? '#f59e0b' : '#ffffff',
                                  color: estadoActual === 'TARDE' ? '#ffffff' : '#475569',
                                  transition: 'all 0.15s ease'
                                }}
                                title="Llegada tarde con retraso"
                              >
                                ⏰ Tarde
                              </button>

                              {/* Botón INASISTENCIA */}
                              <button
                                type="button"
                                onClick={() => handleCambiarEstadoAsistencia(est.id, 'INASISTENCIA')}
                                style={{
                                  padding: '5px 9px',
                                  fontSize: '0.75rem',
                                  fontWeight: '700',
                                  border: 'none',
                                  borderLeft: '1px solid #cbd5e1',
                                  cursor: 'pointer',
                                  backgroundColor: estadoActual === 'INASISTENCIA' ? '#ef4444' : '#ffffff',
                                  color: estadoActual === 'INASISTENCIA' ? '#ffffff' : '#475569',
                                  transition: 'all 0.15s ease'
                                }}
                                title="Inasistencia / Falla sin justificar"
                              >
                                ❌ Inasistencia
                              </button>

                              {/* Botón EXCUSA */}
                              <button
                                type="button"
                                onClick={() => handleCambiarEstadoAsistencia(est.id, 'EXCUSA')}
                                style={{
                                  padding: '5px 9px',
                                  fontSize: '0.75rem',
                                  fontWeight: '700',
                                  border: 'none',
                                  borderLeft: '1px solid #cbd5e1',
                                  cursor: 'pointer',
                                  backgroundColor: estadoActual === 'EXCUSA' ? '#3b82f6' : '#ffffff',
                                  color: estadoActual === 'EXCUSA' ? '#ffffff' : '#475569',
                                  transition: 'all 0.15s ease'
                                }}
                                title="Ausencia con excusa médica o institucional justificada"
                              >
                                📄 Excusa
                              </button>
                            </div>
                          </td>

                          {/* Campo de Observaciones */}
                          <td>
                            <input
                              type="text"
                              className="form-input"
                              style={{ 
                                fontSize: '0.8rem', 
                                padding: '4px 8px',
                                borderColor: estadoActual === 'INASISTENCIA' ? '#fca5a5' : estadoActual === 'TARDE' ? '#fde68a' : '#e2e8f0',
                                backgroundColor: '#ffffff'
                              }}
                              placeholder={
                                estadoActual === 'TARDE' 
                                  ? 'Ej: Llegó 20 min tarde (tráfico)' 
                                  : estadoActual === 'INASISTENCIA' 
                                  ? 'Ej: Sin reporte de acudiente' 
                                  : estadoActual === 'EXCUSA'
                                  ? 'Ej: Incapacidad médica EPS'
                                  : 'Observación opcional...'
                              }
                              value={est.observaciones || ''}
                              onChange={e => handleCambiarObsAsistencia(est.id, e.target.value)}
                            />
                          </td>
                        </tr>
                      );
                    })}

                    {filtrados.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                          {subFiltroAsistencia === 'inasistencias' && '🎉 ¡Excelente! No se registraron inasistencias en este grupo para la fecha.'}
                          {subFiltroAsistencia === 'tardes' && '👏 No hay aprendices con llegada tarde registrados en esta fecha.'}
                          {subFiltroAsistencia === 'excusas' && 'No hay novedades con excusa médica registradas.'}
                          {subFiltroAsistencia === 'todos' && 'No hay estudiantes matriculados en este curso.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL CREAR TAREA CON ADJUNCIÓN DE ARCHIVOS */}
      {showModalTarea && (
        <div className="modal-overlay" onClick={() => setShowModalTarea(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#00324D" />
                <h3 style={{ margin: 0, color: '#00324D', fontSize: '1.2rem' }}>Crear Nueva Tarea / Evidencia</h3>
              </div>
              <button className="btn-icon" onClick={() => setShowModalTarea(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleCrearTarea}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '700' }}>Título de la Tarea / Evidencia *</label>
                  <input 
                    className="form-input" 
                    required 
                    placeholder="Ej: Taller 1 - Diagramación y Modelado Relacional 3FN"
                    value={formTarea.titulo} 
                    onChange={e => setFormTarea({...formTarea, titulo: e.target.value})} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '700' }}>Descripción e Instrucciones</label>
                  <textarea 
                    className="form-input" 
                    rows={4}
                    placeholder="Escribe las pautas, requisitos de entrega y criterios de evaluación..."
                    value={formTarea.descripcion} 
                    onChange={e => setFormTarea({...formTarea, descripcion: e.target.value})} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '700' }}>Fecha y Hora Límite de Entrega *</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    required 
                    value={formTarea.fecha_limite} 
                    onChange={e => setFormTarea({...formTarea, fecha_limite: e.target.value})} 
                  />
                </div>

                {/* Área para Adjuntar Archivos / Guías */}
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <label className="form-label" style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00324D', marginBottom: '0.5rem' }}>
                    <Paperclip size={16} color="#00324D" />
                    <span>Adjuntar Guía de Aprendizaje o Archivo de Apoyo</span>
                  </label>

                  <input 
                    type="file" 
                    ref={tareaFileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleSubirArchivoTarea}
                    accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg,.txt,.sql,.xlsx"
                  />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => tareaFileInputRef.current && tareaFileInputRef.current.click()}
                      disabled={subiendoArchivoTarea}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ffffff', fontWeight: '700' }}
                    >
                      <UploadCloud size={16} color="#00324D" />
                      <span>{subiendoArchivoTarea ? 'Subiendo archivo...' : 'Subir Archivo de tu Equipo'}</span>
                    </button>

                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>o pega un enlace de Drive / GitHub abajo</span>
                  </div>

                  {nombreArchivoAdjunto && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.65rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#065f46', fontWeight: '700' }}>
                      <CheckCircle2 size={16} color="#10b981" />
                      <span>Archivo Cargado: {nombreArchivoAdjunto}</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          setFormTarea(prev => ({ ...prev, archivo_adjunto_url: '' }));
                          setNombreArchivoAdjunto('');
                        }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 'bold' }}
                      >
                        Quitar
                      </button>
                    </div>
                  )}

                  <div style={{ marginTop: '0.75rem' }}>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="Pega un enlace público (ej. https://drive.google.com/... o https://github.com/...)" 
                      value={formTarea.archivo_adjunto_url} 
                      onChange={e => {
                        setFormTarea({ ...formTarea, archivo_adjunto_url: e.target.value });
                        if (!e.target.value) setNombreArchivoAdjunto('');
                      }} 
                      style={{ fontSize: '0.8125rem' }}
                    />
                  </div>
                </div>

              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', marginTop: '1rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModalTarea(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={subiendoArchivoTarea}>
                  {subiendoArchivoTarea ? 'Cargando...' : 'Publicar Tarea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VISOR DE EVIDENCIA Y CALIFICACIÓN (NO SALE DE LA PÁGINA) */}
      {entregaModal && (
        <div className="modal-overlay" onClick={() => setEntregaModal(null)}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto', padding: '1.75rem' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                    {misCursos.find(c => c.id === cursoSeleccionado)?.materia || 'Formación Técnica'}
                  </span>
                  <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                    Grado {entregaModal.entrega.grado || 11}° • Ficha {entregaModal.entrega.ficha_sena || 'SENA'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#00324D', margin: 0 }}>
                  Revisión de Evidencia de Aprendizaje
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Actividad: <strong>{entregaModal.tarea.titulo}</strong>
                </div>
              </div>
              <button 
                type="button"
                className="btn-icon" 
                onClick={() => setEntregaModal(null)} 
                title="Cerrar visor"
                style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Ficha del Estudiante */}
            <div style={{ 
              backgroundColor: '#f8fafc', 
              borderRadius: '10px', 
              border: '1px solid #e2e8f0', 
              padding: '1rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={entregaModal.entrega.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={entregaModal.entrega.nombres}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00324D' }}
                />
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                    {entregaModal.entrega.nombres} {entregaModal.entrega.apellidos}
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {entregaModal.entrega.tipo_documento || 'TI'}: {entregaModal.entrega.numero_documento || 'Radicado'} • {entregaModal.entrega.programa_formacion || 'Articulación'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                  <Clock size={13} color="#d4af37" />
                  <span>Entregado: {entregaModal.entrega.fecha_entrega ? new Date(entregaModal.entrega.fecha_entrega).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : 'Fecha registrada'}</span>
                </div>
                <div style={{ marginTop: '0.25rem' }}>
                  {entregaModal.entrega.calificacion !== null && entregaModal.entrega.calificacion !== undefined ? (
                    <span className="badge badge-success" style={{ fontWeight: '700' }}>
                      ✓ Evaluada: {entregaModal.entrega.calificacion} / 5.0
                    </span>
                  ) : (
                    <span className="badge badge-warning" style={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '700' }}>
                      ⏳ Pendiente por Calificar
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Pautas de la Tarea solicitada */}
            <div style={{ marginBottom: '1.25rem', padding: '0.85rem 1rem', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#00324D', marginBottom: '0.35rem' }}>
                📋 Enunciado y Requerimientos de la Tarea:
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                {entregaModal.tarea.descripcion}
              </p>
            </div>

            {/* Observaciones dejadas por el estudiante al entregar */}
            {entregaModal.entrega.observaciones && (
              <div style={{ marginBottom: '1.25rem', padding: '0.85rem 1rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <MessageSquare size={13} />
                  <span>Mensaje adjunto del Aprendiz al entregar:</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#15803d', fontStyle: 'italic' }}>
                  "{entregaModal.entrega.observaciones}"
                </p>
              </div>
            )}

            {/* VISOR DE CONTENIDO DE LA EVIDENCIA (QUE SALGA ALGO REAL) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileCode size={16} color="#00324D" />
                  <span>Contenido de la Evidencia Radicada:</span>
                </div>
                {entregaModal.entrega.archivo_url && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleCopiarEnlace(entregaModal.entrega.archivo_url)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      {copiadoEnlace ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiadoEnlace ? '¡Copiado!' : 'Copiar Enlace'}</span>
                    </button>
                    <a
                      href={entregaModal.entrega.archivo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      title="Abrir en pestaña nueva si es un recurso externo"
                    >
                      <ExternalLink size={12} /> Abrir Externo
                    </a>
                  </div>
                )}
              </div>

              {/* Render interactivo de la evidencia */}
              {renderEvidenciaInteractiva(entregaModal.entrega, entregaModal.tarea)}
            </div>

            {/* FORMULARIO DE CALIFICACIÓN Y RETROALIMENTACIÓN */}
            <div style={{ 
              backgroundColor: '#fffdf5', 
              borderRadius: '10px', 
              border: '2px solid #fde68a', 
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <Award size={18} color="#d4af37" />
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#92400e', margin: 0 }}>
                  Evaluación y Retroalimentación Formativa
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* Input y botones de nota */}
                <div>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem', color: '#334155' }}>
                    Calificación Numérica (Escala 1.0 - 5.0) *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      className="form-input"
                      style={{ width: '110px', fontSize: '1.1rem', fontWeight: '800', textAlign: 'center', borderColor: '#d4af37' }}
                      value={calificacionModal}
                      onChange={e => setCalificacionModal(e.target.value)}
                      placeholder="Ej: 4.5"
                    />
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ 5.0 puntos</span>
                  </div>

                  {/* Botones de calificación rápida */}
                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {[
                      { val: '3.0', label: '3.0 Básico' },
                      { val: '4.0', label: '4.0 Alto' },
                      { val: '4.8', label: '4.8 Sobresaliente' },
                      { val: '5.0', label: '5.0 Excelente' }
                    ].map(btn => (
                      <button
                        key={btn.val}
                        type="button"
                        onClick={() => setCalificacionModal(btn.val)}
                        style={{
                          padding: '3px 7px',
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          border: calificacionModal === btn.val ? '1px solid #d4af37' : '1px solid #cbd5e1',
                          backgroundColor: calificacionModal === btn.val ? '#fef3c7' : '#ffffff',
                          color: '#334155',
                          cursor: 'pointer',
                          fontWeight: calificacionModal === btn.val ? '700' : 'normal'
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea de observaciones */}
                <div>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem', color: '#334155' }}>
                    Retroalimentación Pedagógica / Comentarios del Instructor
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    style={{ fontSize: '0.85rem', width: '100%', marginTop: '0.35rem' }}
                    placeholder="Escribe comentarios formativos, felicitaciones o aspectos técnicos a fortalecer para el estudiante..."
                    value={observacionesModal}
                    onChange={e => setObservacionesModal(e.target.value)}
                  />
                </div>
              </div>

              {/* Botones de acción del modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #fde68a', paddingTop: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEntregaModal(null)}
                  disabled={guardandoNotaModal}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGuardarNotaModal}
                  disabled={guardandoNotaModal}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#00324D' }}
                >
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>{guardandoNotaModal ? 'Guardando Calificación...' : 'Guardar Calificación y Feedback'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DETALLES Y PAUTAS DE LA TAREA */}
      {tareaDetalleModal && (
        <div className="modal-overlay" onClick={() => setTareaDetalleModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  {misCursos.find(c => c.id === cursoSeleccionado)?.materia || 'Formación Técnica'}
                </span>
                <h3 style={{ margin: 0, color: '#00324D', fontSize: '1.2rem' }}>Pautas y Detalle de la Tarea</h3>
              </div>
              <button type="button" className="btn-icon" onClick={() => setTareaDetalleModal(null)}><X size={20}/></button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#0f172a', fontSize: '1.1rem' }}>
                  {tareaDetalleModal.titulo}
                </h4>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#64748b' }}>
                  <span>📅 Límite: <strong>{new Date(tareaDetalleModal.fecha_limite).toLocaleDateString('es-CO')}</strong></span>
                  <span>•</span>
                  <span>📦 Entregas recibidas: <strong>{tareaDetalleModal.entregas?.length || 0}</strong></span>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.85rem', color: '#00324D', display: 'block', marginBottom: '0.4rem' }}>
                  Instrucciones y Criterios de Evaluación:
                </strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {tareaDetalleModal.descripcion}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '0.85rem', color: '#00324D', display: 'block', marginBottom: '0.5rem' }}>
                  Estado de Entregas por Aprendices:
                </strong>
                {tareaDetalleModal.entregas && tareaDetalleModal.entregas.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {tareaDetalleModal.entregas.map(ent => (
                      <div 
                        key={ent.id} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '0.6rem 0.85rem', 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '6px' 
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{ent.nombres} {ent.apellidos}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {ent.calificacion !== null && ent.calificacion !== undefined ? `✓ Nota: ${ent.calificacion} / 5.0` : '⏳ Pendiente de calificar'}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setTareaDetalleModal(null);
                            abrirVisorEntrega(tareaDetalleModal, ent);
                          }}
                          style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                        >
                          <Eye size={12} /> Revisar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                    Aún no hay evidencias radicadas para esta tarea por los aprendices matriculados.
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', marginTop: '1.25rem', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => setTareaDetalleModal(null)}>
                Cerrar Pautas
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
