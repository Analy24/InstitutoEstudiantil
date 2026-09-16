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
  Camera
} from 'lucide-react';

export default function StudentProfile() {
  const [perfil, setPerfil] = useState(null);
  const [vacantes, setVacantes] = useState([]);
  const [pestanaActiva, setPestanaActiva] = useState('competencias'); // 'competencias' | 'vacantes' | 'documentos'
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [postulandoId, setPostulandoId] = useState(null);
  const [subiendoDoc, setSubiendoDoc] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [tipoDocSeleccionado, setTipoDocSeleccionado] = useState('HOJA_VIDA');
  const fileInputRef = React.useRef(null);
  const fotoInputRef = React.useRef(null);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [perfilRes, vacantesRes] = await Promise.all([
        api.getMiPerfil(),
        api.getVacantes()
      ]);
      setPerfil(perfilRes.data);
      setVacantes(vacantesRes.data);
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

                    <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {comp.denominacion}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1rem' }}>
                      {comp.descripcion}
                    </p>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                <strong>Requisito Institucional:</strong> Tu avance académico actual es del <strong>{perfil.porcentaje_avance}%</strong>. Para postularte formalmente debes contar con al menos el <strong>70% de competencias aprobadas</strong>.
              </div>
            </div>
          )}

          {vacantes.map((v) => (
            <div key={v.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ flex: '1', minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Building2 size={18} color="#00324D" />
                  <span style={{ fontSize: '0.9375rem', fontWeight: '800', color: '#00324D' }}>
                    {v.empresa_nombre || 'Empresa Aliada'}
                  </span>
                  <span className="badge badge-success">Empresa Aliada Oficial</span>
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
                <button
                  className="btn btn-primary"
                  onClick={() => handlePostularme(v.id, v.titulo)}
                  disabled={postulandoId === v.id}
                >
                  <Send size={15} />
                  <span>{postulandoId === v.id ? 'Validando...' : 'Postularme a Práctica'}</span>
                </button>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Cupos disponibles: {v.cupos_disponibles}
                </span>
              </div>
            </div>
          ))}
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
    </div>
  );
}
