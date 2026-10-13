import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  GraduationCap, 
  Award, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Building2, 
  Clock, 
  MapPin, 
  DollarSign, 
  Send,
  FileText,
  Github,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  Camera,
  BookOpen,
  UserCheck,
  Layers,
  Sparkles,
  Paperclip
} from 'lucide-react';

function FormEntregaTarea({ tarea, onEntregaExitosa }) {
  const [tipoEntrega, setTipoEntrega] = useState('archivo'); // 'archivo' | 'link'
  const [archivoUrl, setArchivoUrl] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleSeleccionarArchivo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendo(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.uploadArchivo(formData);
      if (res && res.data && res.data.url) {
        setArchivoUrl(res.data.url);
        setNombreArchivo(file.name);
      } else {
        alert('No se pudo obtener la ruta del archivo subido.');
      }
    } catch (err) {
      alert(err.message || 'Error al subir el archivo desde tu dispositivo.');
    } finally {
      setSubiendo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivoUrl) {
      alert(tipoEntrega === 'archivo' ? 'Por favor selecciona un archivo (PDF, Imagen o Documento) antes de enviar.' : 'Por favor ingresa o pega el enlace URL de tu evidencia.');
      return;
    }

    setEnviando(true);
    try {
      await api.enviarTarea(tarea.id, { archivo_url: archivoUrl, observaciones });
      alert(`¡Evidencia entregada exitosamente al profesor ${tarea.instructor_nombre || 'titular'}!`);
      if (onEntregaExitosa) onEntregaExitosa();
    } catch (err) {
      alert(err.message || 'Error al enviar la tarea.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setTipoEntrega('archivo')}
          style={{
            padding: '0.45rem 0.85rem',
            fontSize: '0.8125rem',
            fontWeight: '700',
            borderRadius: '6px',
            border: tipoEntrega === 'archivo' ? '2px solid #00324D' : '1px solid #cbd5e1',
            backgroundColor: tipoEntrega === 'archivo' ? '#e0f2fe' : '#ffffff',
            color: tipoEntrega === 'archivo' ? '#00324D' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <UploadCloud size={15} />
          <span>📁 Subir Documento PDF / Imagen (PC o Celular)</span>
        </button>

        <button
          type="button"
          onClick={() => setTipoEntrega('link')}
          style={{
            padding: '0.45rem 0.85rem',
            fontSize: '0.8125rem',
            fontWeight: '700',
            borderRadius: '6px',
            border: tipoEntrega === 'link' ? '2px solid #00324D' : '1px solid #cbd5e1',
            backgroundColor: tipoEntrega === 'link' ? '#e0f2fe' : '#ffffff',
            color: tipoEntrega === 'link' ? '#00324D' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <ExternalLink size={15} />
          <span>🔗 Copiar y Pegar Enlace (URL)</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleSeleccionarArchivo}
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      />

      {tipoEntrega === 'archivo' ? (
        <div style={{ marginBottom: '0.85rem' }}>
          <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: '700', marginBottom: '0.35rem', display: 'block' }}>
            Adjuntar Archivo de Evidencia (PDF, Imagen JPG/PNG o Word) *
          </label>
          <div 
            style={{
              border: archivoUrl ? '2px solid #10b981' : '2px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
              backgroundColor: archivoUrl ? '#ecfdf5' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {subiendo ? (
              <div style={{ color: '#00324D', fontWeight: '700', fontSize: '0.875rem' }}>
                ⏳ Cargando y trasladando archivo desde tu equipo/celular...
              </div>
            ) : archivoUrl ? (
              <div style={{ color: '#065f46', fontWeight: '700', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span>Archivo adjuntado correctamente: <strong>{nombreArchivo || archivoUrl}</strong></span>
              </div>
            ) : (
              <div>
                <UploadCloud size={28} color="#00324D" style={{ margin: '0 auto 0.35rem', display: 'block' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#00324D' }}>
                  Haz clic aquí para seleccionar archivo en tu PC o Celular
                </span>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                  Soporta imágenes (PNG, JPG) y documentos (PDF, Word)
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="form-group" style={{ marginBottom: '0.85rem' }}>
          <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: '700' }}>
            Enlace URL de tu evidencia (Drive, GitHub, Google Docs, Notion, YouTube, etc.) *
          </label>
          <input
            type="url"
            className="form-input"
            value={archivoUrl}
            onChange={(e) => setArchivoUrl(e.target.value)}
            placeholder="https://drive.google.com/... o https://github.com/..."
            style={{ fontSize: '0.875rem' }}
          />
        </div>
      )}

      <div className="form-group" style={{ marginBottom: '0.85rem' }}>
        <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: '700' }}>
          Comentarios u observaciones para el Profesor {tarea.instructor_nombre} (Opcional):
        </label>
        <input
          type="text"
          className="form-input"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Ej: Profesor, adjunto el informe final de la etapa práctica según lo requerido."
          style={{ fontSize: '0.8125rem' }}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={subiendo || enviando}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700' }}
      >
        <Send size={14} />
        <span>{enviando ? 'Enviando...' : `Presentar Tarea a ${tarea.instructor_nombre || 'Docente'}`}</span>
      </button>
    </form>
  );
}

function ModalDetalleCompetencia({ competencia, misTareas, perfil, onClose }) {
  if (!competencia) return null;

  const nombreComp = competencia.materia || competencia.denominacion || competencia.nombre || 'Competencia Técnica';
  const instructorNombre = competencia.instructor_nombre || 'Docente Titular';
  const especialidad = competencia.instructor_especialidad || competencia.descripcion || 'Especialidad Formativa';
  const programa = competencia.programa_formacion || perfil?.programa_formacion || 'Programa Técnico';
  const estadoEvaluacion = competencia.juicio_evaluativo || (competencia.tareas_calificadas > 0 ? 'EN_PROCESO' : 'POR_EVALUAR');

  // Filtrar tareas que corresponden a esta competencia / curso
  const tareasRelacionadas = misTareas.filter(t => 
    t.curso_id === competencia.id || 
    t.materia === competencia.materia || 
    t.curso_nombre === competencia.nombre ||
    t.materia === competencia.denominacion
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
        padding: '1.5rem'
      }}>
        {/* Encabezado del Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ fontWeight: '800' }}>
                🎓 {programa}
              </span>
              {estadoEvaluacion === 'APROBADO' ? (
                <span className="badge badge-success" style={{ fontWeight: '800' }}>
                  ✓ APROBADA / EVALUADA
                </span>
              ) : estadoEvaluacion === 'EN_PROCESO' ? (
                <span className="badge badge-warning" style={{ fontWeight: '800' }}>
                  ⏳ EN PROCESO DE EVALUACIÓN
                </span>
              ) : (
                <span className="badge" style={{ backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontWeight: '800' }}>
                  ⚠️ POR EVALUAR
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.35rem', color: '#00324D', fontWeight: '800', margin: 0 }}>
              {nombreComp}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#64748b'
            }}
          >
            ✕
          </button>
        </div>

        {/* Ficha técnica del Instructor y Competencia */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.85rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', display: 'block' }}>INSTRUCTOR TITULAR:</span>
            <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Prof. {instructorNombre}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', display: 'block' }}>ESPECIALIDAD / COMPETENCIA:</span>
            <strong style={{ color: '#00324D' }}>{especialidad}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', display: 'block' }}>FICHA Y GRADO:</span>
            <strong style={{ color: '#b45309' }}>Ficha {perfil?.ficha_sena || 'SENA'} • Grado {competencia.grado || perfil?.grado}°</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', display: 'block' }}>MÓDULO FORMATIVO:</span>
            <strong style={{ color: '#0369a1' }}>{competencia.modulo || 'Módulo I: Formación Básica'}</strong>
          </div>
        </div>

        {/* Resultados de Aprendizaje (RA / RAP) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#00324D', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={16} color="#d4af37" />
            Resultados de Aprendizaje (RA / RAP) Asociados:
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', color: '#334155' }}>
              <strong>RA01:</strong> Identificar y aplicar los conceptos técnicos fundamentales de la competencia {nombreComp}.
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', color: '#334155' }}>
              <strong>RA02:</strong> Desarrollar y presentar evidencias prácticas según especificaciones del profesor {instructorNombre}.
            </div>
          </div>
        </div>

        {/* Evidencias y Tareas (Evaluadas o Por Evaluar) */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#00324D', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileText size={16} color="#00324D" />
            Evidencias y Tareas de esta Competencia ({tareasRelacionadas.length}):
          </h3>

          {tareasRelacionadas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
              <Clock size={28} color="#cbd5e1" style={{ margin: '0 auto 0.35rem', display: 'block' }} />
              No hay tareas publicadas actualmente para esta competencia.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {tareasRelacionadas.map(t => {
                const esEvaluada = !!t.calificacion;
                const esEntregada = !!t.entrega_id && !esEvaluada;
                const esPendiente = !t.entrega_id;

                return (
                  <div key={t.id} style={{
                    border: '1px solid #e2e8f0',
                    borderLeft: `4px solid ${esEvaluada ? '#10b981' : esEntregada ? '#f59e0b' : '#ef4444'}`,
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#ffffff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.2rem 0' }}>
                          {t.titulo}
                        </h4>
                        <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0 }}>
                          {t.descripcion}
                        </p>
                      </div>

                      <div>
                        {esEvaluada && (
                          <span className="badge badge-success" style={{ fontWeight: '800', fontSize: '0.78rem' }}>
                            ✓ Evaluada: {t.calificacion} / 5.0
                          </span>
                        )}
                        {esEntregada && (
                          <span className="badge badge-warning" style={{ fontWeight: '800', fontSize: '0.78rem' }}>
                            ⏳ Entregada • En Revisión por Profesor
                          </span>
                        )}
                        {esPendiente && (
                          <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: '800', fontSize: '0.78rem' }}>
                            ⚠️ Por Evaluar (Pendiente de Entrega)
                          </span>
                        )}
                      </div>
                    </div>

                    {(t.retroalimentacion_docente || t.observaciones) && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', fontStyle: 'italic', color: '#334155', backgroundColor: '#f8fafc', padding: '0.35rem 0.65rem', borderRadius: '4px' }}>
                        <strong>Nota del Profesor {instructorNombre}:</strong> "{t.retroalimentacion_docente || t.observaciones}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Botón de Cierre */}
        <div style={{ marginTop: '1.5rem', textAlign: 'right', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            style={{ fontWeight: '700' }}
          >
            Cerrar Detalle de Competencia
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentProfile() {
  const [perfil, setPerfil] = useState(null);
  const [vacantes, setVacantes] = useState([]);
  const [misTareas, setMisTareas] = useState([]);
  const [misCursos, setMisCursos] = useState([]);
  const [competenciaDetalle, setCompetenciaDetalle] = useState(null);
  const [filtroTareas, setFiltroTareas] = useState('todas');
  const [pestanaActiva, setPestanaActiva] = useState('competencias'); // 'competencias' | 'vacantes' | 'documentos' | 'cursos'
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [postulandoId, setPostulandoId] = useState(null);
  const [subiendoDoc, setSubiendoDoc] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [tipoDocSeleccionado, setTipoDocSeleccionado] = useState('HOJA_VIDA');
  
  // Estados para Auditoría de Seguridad y Agentes Especializados
  const [formAuditoria, setFormAuditoria] = useState({
    titulo: 'Auditoría de Vulnerabilidades y Mitigación OWASP',
    modulo: 'Backend API y Módulo de Autenticación',
    agentes_usados: ['Semgrep (SAST)', 'ESLint Security', 'npm audit'],
    criticas_encontradas: 2,
    criticas_mitigadas: 2,
    altas_encontradas: 3,
    altas_mitigadas: 3,
    medias_encontradas: 5,
    medias_mitigadas: 5,
    bajas_encontradas: 2,
    bajas_mitigadas: 2,
    repo_url: '',
    archivo_url: '',
    conclusiones: 'Se ejecutaron escaneos estáticos automatizados con agentes SAST, identificando vulnerabilidades de inyección y secretos. Se aplicaron consultas preparadas, validaciones de esquema y actualización de dependencias, logrando mitigar el 100% de los fallos críticos y altos detectados.'
  });
  const [subiendoArchivoAuditoria, setSubiendoArchivoAuditoria] = useState(false);
  const [enviandoAuditoria, setEnviandoAuditoria] = useState(false);
  const [auditoriasEnviadas, setAuditoriasEnviadas] = useState([
    {
      id: 'aud-01',
      titulo: 'Auditoría de Seguridad y Mitigación OWASP en Módulo de Usuarios',
      fecha: '2026-09-28',
      agentes: ['Semgrep (SAST)', 'npm audit', 'ESLint Security'],
      fallos_totales: 12,
      fallos_mitigados: 12,
      estado: 'EVALUADO',
      calificacion: 4.8,
      retroalimentacion: 'Excelente aplicación de principios de programación defensiva y refactorización de consultas preparadas.'
    }
  ]);
  const fileInputRef = React.useRef(null);
  const fotoInputRef = React.useRef(null);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [perfilRes, vacantesRes, tareasRes, cursosRes] = await Promise.all([
        api.getMiPerfil(),
        api.getVacantes(),
        api.getMisTareas(),
        api.getMisCursosEstudiante ? api.getMisCursosEstudiante() : Promise.resolve({ data: [] })
      ]);
      setPerfil(perfilRes.data);
      setVacantes(vacantesRes.data);
      setMisTareas(tareasRes.data);
      setMisCursos(cursosRes.data || []);
    } catch (err) {
      console.error('Error al cargar datos del estudiante:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handlePostularme = async (vacanteId, vacanteTitulo) => {
    setPostulandoId(vacanteId);
    setMensaje(null);

    try {
      const res = await api.postularme(vacanteId);
      setMensaje({
        tipo: 'success',
        texto: res.message || `¡Postulación radicada con éxito a ${vacanteTitulo}!`
      });
      cargarDatos();
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err.message || 'No fue posible registrar la postulación.'
      });
    } finally {
      setPostulandoId(null);
    }
  };

  const handleTriggerUpload = (tipo) => {
    setTipoDocSeleccionado(tipo);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoDoc(true);
    setMensaje(null);
    
    const formData = new FormData();
    formData.append('documento', file);
    formData.append('tipo', tipoDocSeleccionado);

    try {
      const res = await api.uploadHojaVida(formData);
      setMensaje({
        tipo: 'success',
        texto: res.message || `Documento "${file.name}" cargado exitosamente.`
      });
      cargarDatos();
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err.message || 'Error al subir el documento.'
      });
    } finally {
      setSubiendoDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoFoto(true);
    setMensaje(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const resUpload = await api.uploadFotoPerfil(formData);
      const fotoUrl = resUpload.data.url;

      await api.updateMiPerfil({ foto_url: fotoUrl });

      setPerfil(prev => prev ? { ...prev, foto_url: fotoUrl } : prev);

      setMensaje({
        tipo: 'success',
        texto: '¡Foto de perfil actualizada correctamente!'
      });
      cargarDatos();
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err.message || 'Error al actualizar la foto de perfil.'
      });
    } finally {
      setSubiendoFoto(false);
      if (fotoInputRef.current) fotoInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
        Cargando perfil del estudiante...
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="main-content">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: '#00324D', marginBottom: '0.5rem' }}>Perfil no disponible</h2>
          <p style={{ color: '#64748b' }}>No se encontraron datos asociados a tu cuenta de estudiante.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Alertas de Notificación */}
      {mensaje && (
        <div style={{
          backgroundColor: mensaje.tipo === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${mensaje.tipo === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: mensaje.tipo === 'success' ? '#065f46' : '#991b1b',
          padding: '0.875rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {mensaje.tipo === 'success' ? <CheckCircle2 size={20} color="#10b981" /> : <AlertCircle size={20} color="#ef4444" />}
          <span>{mensaje.texto}</span>
        </div>
      )}

      {/* Inputs de archivos ocultos */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.jpg,.png"
      />
      <input 
        type="file" 
        ref={fotoInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFotoChange}
        accept="image/*"
      />

      {/* Hero: Tarjeta del Estudiante */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(to right, #ffffff, #f8fafc)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Foto de perfil con botón flotante para cambiar foto */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={perfil.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={perfil.nombres}
                style={{
                  width: '85px',
                  height: '85px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #d4af37',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  opacity: subiendoFoto ? 0.5 : 1
                }}
              />
              <button
                type="button"
                onClick={() => fotoInputRef.current && fotoInputRef.current.click()}
                disabled={subiendoFoto}
                title="Cambiar foto de perfil"
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  backgroundColor: '#00324D',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'transform 0.15s ease-in-out'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Camera size={15} />
              </button>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.5rem', color: '#00324D', fontWeight: '800' }}>
                  {perfil.nombres} {perfil.apellidos}
                </h1>
                <span className="badge badge-primary">Grado {perfil.grado}° Media Técnica</span>
              </div>
              <p style={{ color: '#00324D', fontSize: '0.9375rem', fontWeight: '700' }}>
                {perfil.programa_formacion}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.8125rem' }}>
                Instituto Estudiantil • Jornada {perfil.jornada} • {perfil.tipo_documento}: {perfil.numero_documento}
              </p>
            </div>
          </div>

          {/* Indicador de Aptitud a Práctica */}
          <div style={{
            backgroundColor: perfil.apto_practica ? '#ecfdf5' : '#fffbeb',
            border: `1px solid ${perfil.apto_practica ? '#a7f3d0' : '#fde68a'}`,
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            textAlign: 'center',
            minWidth: '220px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: perfil.apto_practica ? '#065f46' : '#92400e', textTransform: 'uppercase' }}>
              Estado Etapa Práctica
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: perfil.apto_practica ? '#10b981' : '#f59e0b' }}>
              {perfil.porcentaje_avance}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {perfil.apto_practica ? '✓ Habilitado (≥70%)' : '⏳ En formación (<70%)'}
            </div>
          </div>
        </div>

        {/* Resumen */}
        {perfil.resumen_perfil && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', color: '#334155', fontSize: '0.875rem', lineHeight: 1.6 }}>
            <strong>Perfil:</strong> {perfil.resumen_perfil}
          </div>
        )}

        {/* Habilidades */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {perfil.habilidades ? perfil.habilidades.map((h, i) => (
              <span key={i} className="badge badge-info">{h}</span>
            )) : (
              <>
                <span className="badge badge-info">Desarrollo Web</span>
                <span className="badge badge-info">Bases de Datos</span>
                <span className="badge badge-info">Trabajo en Equipo</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Determinar Estado Institucional del Estudiante */}
      {(() => {
        const postulacionContratada = perfil.postulaciones?.find(p => p.estado === 'CONTRATADO');
        const postulacionActiva = perfil.postulaciones?.find(p => p.estado === 'POSTULADO' || p.estado === 'PRESELECCIONADO');
        const esContratado = !!postulacionContratada || perfil.estado_estudiante === 'CONTRATADO';
        const esListoPractica = !esContratado && (perfil.apto_practica || perfil.porcentaje_avance >= 70);
        const fase1Terminada = !esContratado && !esListoPractica && (
          perfil.competencias && 
          perfil.competencias.filter(c => c.fase_proyecto && c.fase_proyecto.includes('1')).length > 0 &&
          perfil.competencias.filter(c => c.fase_proyecto && c.fase_proyecto.includes('1')).every(c => c.juicio_evaluativo === 'APROBADO')
        );

        if (esContratado) {
          return (
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '2px solid #10b981',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '46px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle2 size={26} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.8125rem', padding: '4px 10px', fontWeight: '800' }}>
                      ✓ CONTRATO DE APRENDIZAJE ACTIVO
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#065f46', fontWeight: '700' }}>
                      Empresa Vinculada: {postulacionContratada?.empresa_nombre || 'Innovatech Soluciones Integrales S.A.S.'}
                    </span>
                  </div>
                  <p style={{ margin: '0.35rem 0 0 0', color: '#064e3b', fontSize: '0.875rem', lineHeight: 1.4 }}>
                    ¡Felicitaciones! Has formalizado tu vinculación como estudiante en práctica en el cargo de <strong>{postulacionContratada?.vacante_titulo || 'Desarrollador Junior Practicante'}</strong>. Tu etapa productiva está en marcha.
                  </p>
                </div>
              </div>
              <span style={{
                backgroundColor: '#ffffff',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: '700'
              }}>
                Contratado Oficialmente
              </span>
            </div>
          );
        }

        if (postulacionActiva) {
          return (
            <div style={{
              backgroundColor: '#eff6ff',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '46px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Send size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-info" style={{ fontSize: '0.8125rem', padding: '4px 10px', fontWeight: '800' }}>
                      POSTULACIÓN ACTIVA EN EMPRESA
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: '700' }}>
                      {postulacionActiva.empresa_nombre} • {postulacionActiva.vacante_titulo}
                    </span>
                  </div>
                  <p style={{ margin: '0.35rem 0 0 0', color: '#1e3a8a', fontSize: '0.875rem', lineHeight: 1.4 }}>
                    Te has postulado formalmente a esta vacante. La empresa aliada está evaluando tu hoja de vida y tu récord de competencias registradas.
                  </p>
                </div>
              </div>
              <span className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
                Estado: {postulacionActiva.estado === 'PRESELECCIONADO' ? 'Preseleccionado' : 'Postulado'}
              </span>
            </div>
          );
        }

        if (esListoPractica) {
          return (
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '2px solid #22c55e',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  backgroundColor: '#22c55e',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '46px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={26} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.8125rem', fontWeight: '800' }}>
                      ✓ LISTO PARA SALIR A PRÁCTICA
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#15803d', fontWeight: '700' }}>
                      Avance: {perfil.porcentaje_avance}% (Requisito institucional ≥ 70% cumplido)
                    </span>
                  </div>
                  <p style={{ margin: '0.35rem 0 0 0', color: '#14532d', fontSize: '0.875rem' }}>
                    Cumples con los requisitos académicos. Puedes postularte a las vacantes empresariales disponibles adjuntando tu hoja de vida.
                  </p>
                </div>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => setPestanaActiva('vacantes')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Briefcase size={16} />
                <span>Ver Vacantes y Postularme</span>
              </button>
            </div>
          );
        }

        if (fase1Terminada) {
          return (
            <div style={{
              backgroundColor: '#faf5ff',
              border: '2px solid #a855f7',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  backgroundColor: '#a855f7',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '46px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle2 size={26} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge" style={{ backgroundColor: '#7e22ce', color: '#ffffff', fontSize: '0.8125rem', fontWeight: '800' }}>
                      FASE 1 TERMINADA AL 100%
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#6b21a8', fontWeight: '700' }}>
                      Análisis y Planificación Aprobada
                    </span>
                  </div>
                  <p style={{ margin: '0.35rem 0 0 0', color: '#581c87', fontSize: '0.875rem' }}>
                    Has culminado exitosamente la fase inicial de tu programa técnico ({perfil.programa_formacion}, Grado {perfil.grado}°). Continuando con el desarrollo formativo.
                  </p>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div style={{
            backgroundColor: '#fffbeb',
            border: '2px solid #f59e0b',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                borderRadius: '50%',
                width: '46px',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={26} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-warning" style={{ fontSize: '0.8125rem', fontWeight: '800' }}>
                    EN FORMACIÓN • POR EVALUAR
                  </span>
                  <span style={{ fontSize: '0.875rem', color: '#b45309', fontWeight: '700' }}>
                    Grado {perfil.grado}° Media Técnica
                  </span>
                </div>
                <p style={{ margin: '0.35rem 0 0 0', color: '#92400e', fontSize: '0.875rem' }}>
                  Tienes actividades académicas y evidencias en proceso de revisión por tus instructores para habilitar la etapa práctica.
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Input de archivo oculto */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.jpg,.png"
      />

      {/* Navegación por Pestañas */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setPestanaActiva('competencias')}
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.9375rem',
            fontWeight: '700',
            background: 'transparent',
            border: 'none',
            borderBottom: pestanaActiva === 'competencias' ? '3px solid #d4af37' : '3px solid transparent',
            color: pestanaActiva === 'competencias' ? '#d4af37' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '-2px'
          }}
        >
          <Award size={18} />
          <span>Competencias y Notas ({perfil.competencias_aprobadas_count}/{perfil.total_competencias_count})</span>
        </button>

        <button
          onClick={() => setPestanaActiva('vacantes')}
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.9375rem',
            fontWeight: '700',
            background: 'transparent',
            border: 'none',
            borderBottom: pestanaActiva === 'vacantes' ? '3px solid #d4af37' : '3px solid transparent',
            color: pestanaActiva === 'vacantes' ? '#d4af37' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '-2px'
          }}
        >
          <Briefcase size={18} />
          <span>Vacantes y Empresas Aliadas ({vacantes.length})</span>
        </button>

        <button
          onClick={() => setPestanaActiva('documentos')}
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.9375rem',
            fontWeight: '700',
            background: 'transparent',
            border: 'none',
            borderBottom: pestanaActiva === 'documentos' ? '3px solid #d4af37' : '3px solid transparent',
            color: pestanaActiva === 'documentos' ? '#d4af37' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '-2px'
          }}
        >
          <FileCheck size={18} />
          <span>Mis Documentos y Hoja de Vida</span>
        </button>

        <button
          onClick={() => setPestanaActiva('tareas')}
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.9375rem',
            fontWeight: '700',
            background: 'transparent',
            border: 'none',
            borderBottom: pestanaActiva === 'tareas' ? '3px solid #d4af37' : '3px solid transparent',
            color: pestanaActiva === 'tareas' ? '#d4af37' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '-2px'
          }}
        >
          <FileText size={18} />
          <span>Tareas y Calificaciones ({misTareas.length})</span>
        </button>

        <button
          onClick={() => setPestanaActiva('seguridad')}
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.9375rem',
            fontWeight: '700',
            background: 'transparent',
            border: 'none',
            borderBottom: pestanaActiva === 'seguridad' ? '3px solid #00324D' : '3px solid transparent',
            color: pestanaActiva === 'seguridad' ? '#00324D' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '-2px'
          }}
        >
          <ShieldCheck size={18} color="#00324D" />
          <span>Auditoría de Seguridad y Agentes ({auditoriasEnviadas.length})</span>
        </button>

        <button
          onClick={() => setPestanaActiva('cursos')}
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.9375rem',
            fontWeight: '700',
            background: 'transparent',
            border: 'none',
            borderBottom: pestanaActiva === 'cursos' ? '3px solid #d4af37' : '3px solid transparent',
            color: pestanaActiva === 'cursos' ? '#d4af37' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '-2px'
          }}
        >
          <GraduationCap size={18} />
          <span>Mis Cursos y Módulos</span>
        </button>
      </div>

      {/* PESTAÑA 1: COMPETENCIAS */}
      {pestanaActiva === 'competencias' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {perfil.competencias.map((comp) => {
              const esAprobada = comp.juicio_evaluativo === 'APROBADO';
              const esEnProceso = comp.juicio_evaluativo === 'EN_PROCESO';

              return (
                <div
                  key={comp.id}
                  className="card"
                  style={{
                    borderLeft: `4px solid ${esAprobada ? '#10b981' : esEnProceso ? '#f59e0b' : '#cbd5e1'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#00324D', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                        Norma {comp.codigo_norma}
                      </span>
                      {esAprobada && (
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> Aprobado
                        </span>
                      )}
                      {esEnProceso && (
                        <span className="badge badge-warning">
                          <Clock size={12} /> En Proceso
                        </span>
                      )}
                      {!esAprobada && !esEnProceso && (
                        <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
                          Por Evaluar
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => setCompetenciaDetalle(comp)}
                      style={{ 
                        fontSize: '1rem', 
                        color: '#00324D', 
                        marginBottom: '0.5rem', 
                        lineHeight: 1.3, 
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      title="Haz clic para ver las evidencias evaluadas o por evaluar de esta competencia"
                    >
                      <span>{comp.denominacion}</span>
                      <ExternalLink size={14} color="#d4af37" />
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1rem' }}>
                      {comp.descripcion}
                    </p>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Fase: <strong>{comp.fase_proyecto}</strong></span>
                      <span>Duración: <strong>{comp.horas_duracion} hrs</strong></span>
                    </div>
                    {comp.fecha_evaluacion && (
                      <div style={{ marginTop: '0.25rem', color: '#065f46' }}>
                        ✓ Calificado el {comp.fecha_evaluacion}
                      </div>
                    )}
                    {comp.observaciones && (
                      <div style={{ marginTop: '0.35rem', fontStyle: 'italic', color: '#475569' }}>
                        Nota: "{comp.observaciones}"
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%', marginTop: '0.65rem', fontSize: '0.78rem', fontWeight: '700', color: '#00324D', borderColor: '#cbd5e1' }}
                      onClick={() => setCompetenciaDetalle(comp)}
                    >
                      <BookOpen size={13} style={{ marginRight: '4px' }} />
                      <span>Ver Evidencias (Evaluadas / Por Evaluar)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PESTAÑA 2: VACANTES Y EMPRESAS */}
      {pestanaActiva === 'vacantes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card destacado para Montar / Actualizar Hoja de Vida */}
          <div style={{
            background: 'linear-gradient(135deg, #00324D 0%, #001f30 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            boxShadow: '0 4px 12px rgba(0,50,77,0.25)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <FileText size={22} color="#d4af37" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: '800' }}>
                  Mi Hoja de Vida para Ofertas Laborales
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#cbd5e1', maxWidth: '650px' }}>
                Las empresas aliadas consultan tu hoja de vida y tu récord de competencias al postularte a sus vacantes técnicas. Mantenla siempre actualizada en formato PDF.
              </p>
              <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', flexWrap: 'wrap' }}>
                <span style={{ color: '#94a3b8' }}>Documento adjunto:</span>
                <strong style={{ color: '#d4af37' }}>
                  {perfil.hoja_vida_url ? 'Hoja_de_Vida_Actualizada.pdf' : 'Hoja_de_Vida_Formato_Institucional.pdf'}
                </strong>
                <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                  ✓ Disponible para Empresas Aliadas
                </span>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => handleTriggerUpload('HOJA_VIDA')}
              disabled={subiendoDoc}
              style={{
                backgroundColor: '#d4af37',
                color: '#00324D',
                borderColor: '#d4af37',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              <UploadCloud size={18} />
              <span>{subiendoDoc ? 'Subiendo Documento...' : 'Montar / Actualizar Hoja de Vida (PDF)'}</span>
            </button>
          </div>

          {!perfil.apto_practica && (
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              color: '#92400e',
              padding: '1rem 1.25rem',
              borderRadius: '10px',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <AlertCircle size={24} color="#f59e0b" style={{ flexShrink: 0 }} />
              <div>
                <strong>Requisito Institucional:</strong> Tu avance académico actual es del <strong>{perfil.porcentaje_avance}%</strong>. Para postularte formalmente a una empresa debes contar con al menos el <strong>70% de competencias aprobadas</strong>.
              </div>
            </div>
          )}

          {vacantes.map((v) => {
            const yaPostulado = perfil.postulaciones?.find(p => p.vacante_id === v.id);
            const contratadoEnEsta = yaPostulado?.estado === 'CONTRATADO';
            const tieneContratoActivo = perfil.postulaciones?.some(p => p.estado === 'CONTRATADO') || perfil.estado_estudiante === 'CONTRATADO';

            return (
              <div key={v.id} className="card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1.5rem',
                border: contratadoEnEsta ? '2px solid #10b981' : yaPostulado ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                backgroundColor: contratadoEnEsta ? '#f0fdf4' : yaPostulado ? '#f8fafc' : '#ffffff'
              }}>
                <div style={{ flex: '1', minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <Building2 size={18} color="#00324D" />
                    <span style={{ fontSize: '0.9375rem', fontWeight: '800', color: '#00324D' }}>
                      {v.empresa_nombre || 'Empresa Aliada'}
                    </span>
                    <span className="badge badge-success">Empresa Aliada Oficial</span>
                    {contratadoEnEsta && (
                      <span className="badge badge-success" style={{ fontWeight: '800' }}>
                        ✓ ¡CONTRATADO EN ESTA EMPRESA!
                      </span>
                    )}
                    {yaPostulado && !contratadoEnEsta && (
                      <span className="badge badge-info" style={{ fontWeight: '800' }}>
                        ✓ POSTULACIÓN RADICADA ({yaPostulado.estado})
                      </span>
                    )}
                  </div>

                  <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>
                    {v.titulo}
                  </h2>

                  <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {v.descripcion}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.8125rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={15} color="#d4af37" />
                      <span>{v.ubicacion} ({v.modalidad})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#065f46', fontWeight: '700' }}>
                      <DollarSign size={15} color="#d4af37" />
                      <span>Auxilio: ${Number(v.auxilio_sostenimiento).toLocaleString('es-CO')} COP</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={15} color="#d4af37" />
                      <span>Cierra: {v.fecha_limite}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                  {contratadoEnEsta ? (
                    <span className="badge badge-success" style={{ padding: '8px 14px', fontSize: '0.875rem' }}>
                      ✓ Contrato Formalizado
                    </span>
                  ) : yaPostulado ? (
                    <button className="btn btn-outline" disabled style={{ opacity: 0.85, borderColor: '#3b82f6', color: '#1e40af' }}>
                      <CheckCircle2 size={15} color="#3b82f6" />
                      <span>Postulación en Revisión</span>
                    </button>
                  ) : tieneContratoActivo ? (
                    <button className="btn btn-outline" disabled style={{ opacity: 0.6 }} title="Ya cuentas con un contrato formalizado">
                      <span>Ya cuentas con contrato activo</span>
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePostularme(v.id, v.titulo)}
                      disabled={postulandoId === v.id || !perfil.apto_practica}
                      title={!perfil.apto_practica ? 'Requiere mínimo 70% de avance para postularse' : 'Postular mi hoja de vida'}
                    >
                      <Send size={15} />
                      <span>{postulandoId === v.id ? 'Validando...' : 'Postularme a Práctica'}</span>
                    </button>
                  )}
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Cupos disponibles: {v.cupos_disponibles}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PESTAÑA 3: MIS DOCUMENTOS Y HOJA DE VIDA */}
      {pestanaActiva === 'documentos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#00324D' }}>Carga y Gestión de Documentos</h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Sube tus documentos obligatorios para estar habilitado en la vinculación con empresas
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {/* Documento 1: Hoja de Vida */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <FileText size={20} color="#00324D" />
                  <strong style={{ fontSize: '0.9375rem', color: '#0f172a' }}>Hoja de Vida en PDF</strong>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                  Documento con tu resumen de habilidades y portafolio técnico.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => handleTriggerUpload('HOJA_VIDA')}
                  disabled={subiendoDoc}
                >
                  <UploadCloud size={14} />
                  <span>{subiendoDoc ? 'Cargando...' : 'Subir / Actualizar Hoja de Vida'}</span>
                </button>
              </div>

              {/* Documento 2: Documento de Identidad */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={20} color="#00324D" />
                  <strong style={{ fontSize: '0.9375rem', color: '#0f172a' }}>Documento de Identidad (TI/CC)</strong>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                  Copia legible al 150% de tu documento vigente.
                </p>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => handleTriggerUpload('IDENTIDAD')}
                  disabled={subiendoDoc}
                >
                  <UploadCloud size={14} />
                  <span>Subir Documento de Identidad</span>
                </button>
              </div>

              {/* Documento 3: Certificado EPS */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <FileCheck size={20} color="#00324D" />
                  <strong style={{ fontSize: '0.9375rem', color: '#0f172a' }}>Certificado EPS / Sisbén</strong>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                  Certificado de afiliación a salud vigente para la ARL de práctica.
                </p>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => handleTriggerUpload('EPS')}
                  disabled={subiendoDoc}
                >
                  <UploadCloud size={14} />
                  <span>Subir Certificado EPS</span>
                </button>
              </div>
            </div>

            {/* Listado de Documentos Radicados */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#00324D', marginBottom: '0.75rem' }}>
                Documentos Radicados en tu Expediente:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {perfil.documentos && perfil.documentos.length > 0 ? (
                  perfil.documentos.map((doc, idx) => (
                    <div key={idx} style={{
                      border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem 1rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      backgroundColor: '#f8fafc'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={18} color="#00324D" />
                        <div>
                          <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>{doc.nombre}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Radicado: {doc.fecha || '2026-02-15'}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="badge badge-success">✓ {doc.estado || 'Verificado'}</span>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                        >
                          Visualizar
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    Aún no has cargado documentos adicionales.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================== PESTAÑA CURSOS Y TAREAS =================== */}
      {(pestanaActiva === 'cursos' || pestanaActiva === 'tareas') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* SECCIÓN 1: RESUMEN DE MÓDULOS Y MATERIAS EN CURSO (solo en pestaña cursos) */}
          {pestanaActiva === 'cursos' && (
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Layers size={22} color="#00324D" />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#00324D', margin: 0 }}>
                    Módulos y Asignaturas en Curso
                  </h2>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Consulta las materias activas de tu programa técnico (<strong>{perfil.programa_formacion}</strong>), el módulo formativo por el que vas y el profesor asignado.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '6px 14px', fontWeight: '800' }}>
                  🎓 Grado {perfil.grado}° • Ficha {perfil.ficha_sena || 'SENA'}
                </span>
              </div>
            </div>

            {misCursos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                <Clock size={36} color="#cbd5e1" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <p>No se encontraron cursos activos registrados.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {misCursos.map(c => (
                  <div key={c.id} style={{
                    border: '1px solid #e2e8f0',
                    borderTop: '4px solid #00324D',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      {/* Badge del Módulo */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span style={{
                          backgroundColor: '#e0f2fe',
                          color: '#0369a1',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}>
                          <Layers size={12} />
                          <span>{c.modulo}</span>
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>
                          Grado {c.grado}°
                        </span>
                      </div>

                      {/* Nombre de la Materia / Competencia */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <BookOpen size={18} color="#d4af37" />
                        <h3 
                          onClick={() => setCompetenciaDetalle(c)}
                          style={{ 
                            fontSize: '1.05rem', 
                            fontWeight: '800', 
                            color: '#00324D', 
                            margin: 0, 
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                          title="Haz clic para ver las evidencias evaluadas o por evaluar de esta competencia"
                        >
                          <span>{c.materia}</span>
                          <ExternalLink size={14} color="#d4af37" />
                        </h3>
                      </div>

                      <p style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                        {c.nombre}
                      </p>

                      {/* Profesor Titular Asignado */}
                      <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <UserCheck size={16} color="#065f46" />
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>Profesor Titular Asignado:</span>
                        </div>
                        <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                          Prof. {c.instructor_nombre}
                        </div>
                        {c.instructor_especialidad && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {c.instructor_especialidad}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%', marginBottom: '0.75rem', fontSize: '0.78rem', fontWeight: '700', color: '#00324D', borderColor: '#cbd5e1' }}
                        onClick={() => setCompetenciaDetalle(c)}
                      >
                        <BookOpen size={13} style={{ marginRight: '4px' }} />
                        <span>Ver Evidencias (Evaluadas / Por Evaluar)</span>
                      </button>
                    </div>

                    {/* Resumen de tareas del módulo */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: '#475569',
                      borderTop: '1px solid #e2e8f0',
                      paddingTop: '0.65rem'
                    }}>
                      <span>Tareas Asignadas: <strong>{c.total_tareas || 0}</strong></span>
                      <span style={{ color: '#065f46', fontWeight: '700' }}>✓ {c.tareas_calificadas || 0} Calificadas</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {/* SECCIÓN 2: LISTADO DE TAREAS A PRESENTAR Y EVALUADAS */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#00324D', margin: 0 }}>
                  Tareas y Evidencias de Aprendizaje
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                  Revisa los módulos y materias asignados por cada profesor, presenta tus evidencias y consulta tus calificaciones.
                </p>
              </div>

              {/* Filtros de tareas */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setFiltroTareas('todas')}
                  className={filtroTareas === 'todas' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                >
                  Todas ({misTareas.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTareas('pendientes')}
                  className={filtroTareas === 'pendientes' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                >
                  Por Presentar ({misTareas.filter(t => !t.entrega_id).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTareas('evaluadas')}
                  className={filtroTareas === 'evaluadas' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                >
                  Evaluadas ({misTareas.filter(t => !!t.calificacion).length})
                </button>
              </div>
            </div>

            {/* Listado filtrado de tareas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {misTareas
                .filter(t => {
                  if (filtroTareas === 'pendientes') return !t.entrega_id;
                  if (filtroTareas === 'evaluadas') return !!t.calificacion;
                  return true;
                })
                .map(t => {
                  const esEvaluada = !!t.calificacion;
                  const esEntregada = !!t.entrega_id && !esEvaluada;
                  const esPendiente = !t.entrega_id;

                  return (
                    <div key={t.id} className="card" style={{
                      borderLeft: `5px solid ${esEvaluada ? '#10b981' : esEntregada ? '#f59e0b' : '#ef4444'}`,
                      padding: '1.25rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderLeftWidth: '5px'
                    }}>
                      {/* Encabezado con Módulo, Materia, Programa, Competencia e Instructor */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          {/* Tags informativos principales */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                            {/* Tag Módulo */}
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              backgroundColor: '#e0f2fe',
                              color: '#0369a1',
                              padding: '3px 9px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}>
                              <Layers size={13} />
                              <span>{t.modulo || 'Módulo Técnico'}</span>
                            </span>

                            {/* Tag Programa */}
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              backgroundColor: '#fef3c7',
                              color: '#92400e',
                              padding: '3px 9px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}>
                              <GraduationCap size={13} color="#b45309" />
                              <span>Programa: {t.programa_formacion || perfil.programa_formacion || 'Programa Técnico'}</span>
                            </span>

                            {/* Tag Competencia / Especialidad */}
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              backgroundColor: '#fef2f2',
                              color: '#b91c1c',
                              padding: '3px 9px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}>
                              <Award size={13} color="#dc2626" />
                              <span>Competencia: {t.instructor_especialidad || t.materia || t.curso_nombre}</span>
                            </span>

                            {/* Tag Profesor */}
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              backgroundColor: '#ecfdf5',
                              color: '#065f46',
                              padding: '3px 9px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}>
                              <UserCheck size={13} />
                              <span>Instructor: {t.instructor_nombre || 'Docente Titular'}</span>
                            </span>
                          </div>

                          {/* Título de la tarea */}
                          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '800', margin: 0 }}>
                            {t.titulo}
                          </h3>
                        </div>

                        {/* Estado y Fecha Límite */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                          {esEvaluada && (
                            <span className="badge badge-success" style={{ fontWeight: '800', padding: '5px 12px' }}>
                              ✓ Evaluada: {t.calificacion} / 5.0
                            </span>
                          )}
                          {esEntregada && (
                            <span className="badge badge-warning" style={{ fontWeight: '800', padding: '5px 12px' }}>
                              ⏳ Entregada • En Revisión por el Profesor
                            </span>
                          )}
                          {esPendiente && (
                            <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: '800', padding: '5px 12px' }}>
                              ⚠️ Pendiente por Presentar
                            </span>
                          )}

                          <div style={{ fontSize: '0.8125rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Clock size={14} color="#d4af37" />
                            <span>Fecha Límite: <strong>{new Date(t.fecha_limite).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Tarjeta de Información Docente y Programa */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.25rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.8125rem',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <UserCheck size={16} color="#065f46" />
                          <span style={{ color: '#64748b' }}>Instructor Subió Tarea:</span>
                          <strong style={{ color: '#0f172a' }}>{t.instructor_nombre || 'Docente Titular'}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <GraduationCap size={16} color="#00324D" />
                          <span style={{ color: '#64748b' }}>Programa que imparte:</span>
                          <strong style={{ color: '#00324D' }}>{t.programa_formacion || perfil.programa_formacion || 'Programa Técnico'}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Award size={16} color="#d4af37" />
                          <span style={{ color: '#64748b' }}>Competencia / Especialidad:</span>
                          <strong style={{ color: '#b45309' }}>{t.instructor_especialidad || t.materia || 'Competencia Técnica'}</strong>
                        </div>
                      </div>

                      {/* Descripción */}
                      <p style={{ color: '#475569', fontSize: '0.875rem', margin: '0.5rem 0 0.75rem 0', lineHeight: 1.5 }}>
                        {t.descripcion}
                      </p>

                      {/* Guía o Archivo Adjunto del Profesor */}
                      {t.archivo_adjunto_url && (
                        <div style={{ marginBottom: '1rem' }}>
                          <a 
                            href={t.archivo_adjunto_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn btn-outline btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#00324D', borderColor: '#00324D', fontWeight: '700', backgroundColor: '#f0f9ff' }}
                          >
                            <Paperclip size={14} color="#00324D" /> 📎 Descargar / Ver Guía Adjunta por el Profesor
                          </a>
                        </div>
                      )}

                      {/* Caja de Entrega o Formulario para Presentar */}
                      <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        {t.entrega_id ? (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <p style={{ margin: 0, color: '#065f46', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <CheckCircle2 size={16} color="#10b981" /> 
                                <span>Evidencia Presentada y Registrada</span>
                              </p>
                              {esEvaluada ? (
                                <span style={{ fontSize: '0.9375rem', fontWeight: '800', color: '#10b981' }}>
                                  Calificación Obtenida: {t.calificacion} / 5.0
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.8125rem', color: '#d97706', fontStyle: 'italic' }}>
                                  El profesor {t.instructor_nombre} está evaluando tu evidencia
                                </span>
                              )}
                            </div>

                            {(t.retroalimentacion_docente || t.observaciones) && (
                              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8125rem', color: '#334155', fontStyle: 'italic', backgroundColor: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                <strong>Retroalimentación de {t.instructor_nombre}:</strong> "{t.retroalimentacion_docente || t.observaciones}"
                              </p>
                            )}

                            <div style={{ marginTop: '0.65rem' }}>
                              <a
                                href={t.archivo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline btn-sm"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
                              >
                                <ExternalLink size={13} />
                                <span>Ver Evidencia Presentada</span>
                              </a>
                            </div>
                          </div>
                        ) : (
                          <FormEntregaTarea 
                            tarea={t} 
                            onEntregaExitosa={async () => {
                              const [resT, resC] = await Promise.all([
                                api.getMisTareas(),
                                api.getMisCursosEstudiante ? api.getMisCursosEstudiante() : Promise.resolve({ data: [] })
                              ]);
                              setMisTareas(resT.data);
                              setMisCursos(resC.data || []);
                            }} 
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

            {/* =================== PESTAÑA: AUDITORÍA DE SEGURIDAD Y AGENTES SAST =================== */}
      {pestanaActiva === 'seguridad' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Banner Institucional de la Actividad de Seguridad */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ backgroundColor: '#e2e8f0', color: '#00324D', fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>
                    Taller Técnico Especializado
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>OWASP Top 10 • Desarrollo Seguro</span>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#00324D', margin: '0 0 0.25rem 0' }}>
                  Auditoría de Código y Corrección de Vulnerabilidades con Agentes de Seguridad
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0 }}>
                  Ejecuta herramientas y agentes de análisis estático (SAST) sobre tu proyecto, identifica fallas de programación, aplica parches de código defensivo y radica tu reporte de mitigación.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', backgroundColor: '#dcfce7', color: '#166534', fontWeight: '700', border: '1px solid #bbf7d0' }}>
                  ✓ Estado: Habilitado para Entrega
                </span>
              </div>
            </div>

            {/* Pasos guiados para ejecutar agentes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.8rem', color: '#00324D', display: 'block' }}>1. Escaneo con Agentes</strong>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Corre <code>semgrep</code>, <code>eslint-plugin-security</code> o <code>npm audit</code> en tu repositorio.
                </p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.8rem', color: '#00324D', display: 'block' }}>2. Matriz de Hallazgos</strong>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Clasifica los fallos detectados por severidad (Crítica, Alta, Media, Baja).
                </p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.8rem', color: '#00324D', display: 'block' }}>3. Refactorización</strong>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Aplica parches: consultas preparadas, escape de inputs y validación de tipos.
                </p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.8rem', color: '#00324D', display: 'block' }}>4. Re-escaneo y Reporte</strong>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Genera el reporte final confirmando 0 vulnerabilidades críticas remanentes.
                </p>
              </div>
            </div>
          </div>

          {/* Formulario de Radicación del Reporte de Seguridad */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#00324D', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UploadCloud size={18} color="#00324D" />
              Radicar Reporte de Auditoría y Corrección de Vulnerabilidades
            </h3>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setEnviandoAuditoria(true);
                setTimeout(() => {
                  const nueva = {
                    id: `aud-${Date.now()}`,
                    titulo: formAuditoria.titulo,
                    fecha: new Date().toISOString().split('T')[0],
                    agentes: formAuditoria.agentes_usados,
                    fallos_totales: Number(formAuditoria.criticas_encontradas) + Number(formAuditoria.altas_encontradas) + Number(formAuditoria.medias_encontradas) + Number(formAuditoria.bajas_encontradas),
                    fallos_mitigados: Number(formAuditoria.criticas_mitigadas) + Number(formAuditoria.altas_mitigadas) + Number(formAuditoria.medias_mitigadas) + Number(formAuditoria.bajas_mitigadas),
                    estado: 'PENDIENTE',
                    calificacion: null,
                    retroalimentacion: 'El instructor revisará la matriz de mitigación y las evidencias adjuntas.'
                  };
                  setAuditoriasEnviadas([nueva, ...auditoriasEnviadas]);
                  setEnviandoAuditoria(false);
                  alert('¡Reporte de Auditoría de Seguridad radicado exitosamente ante el instructor!');
                }, 800);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Título de la Auditoría *
                  </label>
                  <input
                    type="text"
                    required
                    value={formAuditoria.titulo}
                    onChange={(e) => setFormAuditoria({ ...formAuditoria, titulo: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem 0.65rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Módulo o Servicio Auditado *
                  </label>
                  <input
                    type="text"
                    required
                    value={formAuditoria.modulo}
                    onChange={(e) => setFormAuditoria({ ...formAuditoria, modulo: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem 0.65rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                </div>
              </div>

              {/* Selección de Agentes Utilizados */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Agentes y Escáneres de Seguridad Utilizados:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Semgrep (SAST)', 'ESLint Security', 'SonarLint', 'npm audit', 'Bandit (Python)', 'OWASP Dependency-Check'].map(ag => {
                    const seleccionado = formAuditoria.agentes_usados.includes(ag);
                    return (
                      <button
                        key={ag}
                        type="button"
                        onClick={() => {
                          if (seleccionado) {
                            setFormAuditoria({ ...formAuditoria, agentes_usados: formAuditoria.agentes_usados.filter(x => x !== ag) });
                          } else {
                            setFormAuditoria({ ...formAuditoria, agentes_usados: [...formAuditoria.agentes_usados, ag] });
                          }
                        }}
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          borderRadius: '4px',
                          border: seleccionado ? '1px solid #00324D' : '1px solid #cbd5e1',
                          backgroundColor: seleccionado ? '#00324D' : '#ffffff',
                          color: seleccionado ? '#ffffff' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {seleccionado ? '✓ ' : '+ '}{ag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Matriz de Vulnerabilidades: Encontradas vs Corregidas */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.8125rem', color: '#00324D', display: 'block', marginBottom: '0.5rem' }}>
                  Balance de Vulnerabilidades (Encontradas vs. Corregidas):
                </strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fee2e2' }}>
                    <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: '800' }}>CRÍTICAS (P0)</div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', alignItems: 'center' }}>
                      <input type="number" min="0" value={formAuditoria.criticas_encontradas} onChange={e => setFormAuditoria({...formAuditoria, criticas_encontradas: e.target.value})} style={{ width: '45px', padding: '2px 4px', fontSize: '0.75rem', border: '1px solid #cbd5e1' }} />
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>/ Correg:</span>
                      <input type="number" min="0" value={formAuditoria.criticas_mitigadas} onChange={e => setFormAuditoria({...formAuditoria, criticas_mitigadas: e.target.value})} style={{ width: '45px', padding: '2px 4px', fontSize: '0.75rem', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ffedd5' }}>
                    <div style={{ fontSize: '0.7rem', color: '#ea580c', fontWeight: '800' }}>ALTAS (P1)</div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', alignItems: 'center' }}>
                      <input type="number" min="0" value={formAuditoria.altas_encontradas} onChange={e => setFormAuditoria({...formAuditoria, altas_encontradas: e.target.value})} style={{ width: '45px', padding: '2px 4px', fontSize: '0.75rem', border: '1px solid #cbd5e1' }} />
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>/ Correg:</span>
                      <input type="number" min="0" value={formAuditoria.altas_mitigadas} onChange={e => setFormAuditoria({...formAuditoria, altas_mitigadas: e.target.value})} style={{ width: '45px', padding: '2px 4px', fontSize: '0.75rem', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fef3c7' }}>
                    <div style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: '800' }}>MEDIAS (P2)</div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', alignItems: 'center' }}>
                      <input type="number" min="0" value={formAuditoria.medias_encontradas} onChange={e => setFormAuditoria({...formAuditoria, medias_encontradas: e.target.value})} style={{ width: '45px', padding: '2px 4px', fontSize: '0.75rem', border: '1px solid #cbd5e1' }} />
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>/ Correg:</span>
                      <input type="number" min="0" value={formAuditoria.medias_mitigadas} onChange={e => setFormAuditoria({...formAuditoria, medias_mitigadas: e.target.value})} style={{ width: '45px', padding: '2px 4px', fontSize: '0.75rem', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e0f2fe' }}>
                    <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: '800' }}>BAJAS (P3)</div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', alignItems: 'center' }}>
                      <input type="number" min="0" value={formAuditoria.bajas_encontradas} onChange={e => setFormAuditoria({...formAuditoria, bajas_encontradas: e.target.value})} style={{ width: '45px', padding: '2px 4px', fontSize: '0.75rem', border: '1px solid #cbd5e1' }} />
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>/ Correg:</span>
                      <input type="number" min="0" value={formAuditoria.bajas_mitigadas} onChange={e => setFormAuditoria({...formAuditoria, bajas_mitigadas: e.target.value})} style={{ width: '45px', padding: '2px 4px', fontSize: '0.75rem', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Conclusiones de Mitigación */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Resumen de Correcciones y Mitigación Aplicada *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formAuditoria.conclusiones}
                  onChange={(e) => setFormAuditoria({ ...formAuditoria, conclusiones: e.target.value })}
                  placeholder="Detalla las refactorizaciones aplicadas (e.g. prepared statements, sanitización, .env protegido)..."
                  style={{ width: '100%', padding: '0.45rem 0.65rem', fontSize: '0.8125rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
              </div>

              {/* Adjuntos: Repositorio y Reporte PDF/ZIP */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Enlace a Repositorio Git / Pull Request
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/usuario/proyecto-seguro"
                    value={formAuditoria.repo_url}
                    onChange={(e) => setFormAuditoria({ ...formAuditoria, repo_url: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem 0.65rem', fontSize: '0.8125rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Archivo del Reporte Técnico (PDF / ZIP con logs)
                  </label>
                  <input
                    type="file"
                    id="archivo-auditoria-input"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setSubiendoArchivoAuditoria(true);
                      const formData = new FormData();
                      formData.append('file', file);
                      try {
                        const res = await api.uploadArchivo(formData);
                        setFormAuditoria({ ...formAuditoria, archivo_url: res.data.url });
                        alert(`Archivo "${file.name}" adjuntado al reporte.`);
                      } catch (err) {
                        alert(err.message || 'Error al subir archivo de reporte');
                      } finally {
                        setSubiendoArchivoAuditoria(false);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => document.getElementById('archivo-auditoria-input').click()}
                    disabled={subiendoArchivoAuditoria}
                    style={{ width: '100%', padding: '0.45rem 0.75rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <Paperclip size={14} /> {subiendoArchivoAuditoria ? 'Cargando archivo...' : (formAuditoria.archivo_url ? '✓ Archivo Adjunto Cargado' : 'Subir Documento de Reporte')}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={enviandoAuditoria}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
                >
                  <Send size={15} /> {enviandoAuditoria ? 'Radicando...' : 'Radicar Reporte de Auditoría'}
                </button>
              </div>
            </form>
          </div>

          {/* Historial de Reportes Radicados */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            overflowX: 'auto',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.9rem', color: '#00324D' }}>Historial de Reportes de Seguridad Radicados</strong>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total radicados: {auditoriasEnviadas.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {auditoriasEnviadas.map((aud) => (
                <div 
                  key={aud.id}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{aud.titulo}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        Fecha de radicación: {aud.fecha} • Agentes: {aud.agentes.join(', ')}
                      </div>
                    </div>

                    <div>
                      {aud.estado === 'EVALUADO' ? (
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800', border: '1px solid #bbf7d0' }}>
                          ✓ Calificación: {aud.calificacion} / 5.0 (APROBADO)
                        </span>
                      ) : (
                        <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #fde68a' }}>
                          ⏳ En revisión por el Instructor
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.775rem', color: '#475569', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                    <span>Vulnerabilidades detectadas: <strong>{aud.fallos_totales}</strong></span>
                    <span>Vulnerabilidades mitigadas: <strong style={{ color: '#166534' }}>{aud.fallos_mitigados} (100%)</strong></span>
                  </div>

                  {aud.retroalimentacion && (
                    <div style={{ fontSize: '0.785rem', color: '#334155', fontStyle: 'italic', borderLeft: '3px solid #00324D', paddingLeft: '0.5rem', marginTop: '0.25rem' }}>
                      <strong>Observaciones del Instructor:</strong> "{aud.retroalimentacion}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

{/* Modal de Detalle de Competencia y Evidencias (Evaluadas / Por Evaluar) */}
      <ModalDetalleCompetencia 
        competencia={competenciaDetalle} 
        misTareas={misTareas} 
        perfil={perfil} 
        onClose={() => setCompetenciaDetalle(null)} 
      />
    </div>
  );
}
