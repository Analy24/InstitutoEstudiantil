import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Building2, Users, Briefcase, CheckCircle2, Clock,
  Mail, Award, Plus, X, MapPin, DollarSign, Calendar,
  FileText, ExternalLink, ChevronRight, Phone, AlertCircle
} from 'lucide-react';

export default function CompanyDashboard() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizandoId, setActualizandoId] = useState(null);
  const [pestana, setPestana] = useState('postulaciones');
  
  // Modal de Crear Vacante
  const [showModalVacante, setShowModalVacante] = useState(false);
  const [formVacante, setFormVacante] = useState({
    titulo: '',
    descripcion: '',
    requisitos: '',
    modalidad: 'PRESENCIAL',
    ubicacion: 'Bogotá D.C.',
    cupos_disponibles: 2,
    auxilio_sostenimiento: 1423500,
    fecha_limite: '2026-12-31'
  });

  // Modal de Detalle Completo del Candidato (Hoja de Vida y Notas)
  const [candidatoModal, setCandidatoModal] = useState(null);

  const [mensaje, setMensaje] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [postRes, vacRes] = await Promise.all([
        api.getPostulacionesEmpresa(),
        api.getVacantes()
      ]);
      setPostulaciones(postRes.data);
      setVacantes(vacRes.data);
    } catch (err) {
      console.error('Error al cargar datos empresa:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    setActualizandoId(id);
    try {
      await api.actualizarEstadoPostulacion(id, { estado: nuevoEstado });
      setMensaje({ tipo: 'success', texto: `Estado del candidato actualizado a "${nuevoEstado}".` });
      if (candidatoModal && candidatoModal.id === id) {
        setCandidatoModal({ ...candidatoModal, estado: nuevoEstado });
      }
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al actualizar: ' + err.message });
    } finally {
      setActualizandoId(null);
    }
  };

  const handleCrearVacante = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      const res = await api.crearVacante(formVacante);
      setMensaje({ tipo: 'success', texto: res.message });
      setShowModalVacante(false);
      setFormVacante({
        titulo: '',
        descripcion: '',
        requisitos: '',
        modalidad: 'PRESENCIAL',
        ubicacion: 'Bogotá D.C.',
        cupos_disponibles: 2,
        auxilio_sostenimiento: 1423500,
        fecha_limite: '2026-12-31'
      });
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    } finally {
      setGuardando(false);
    }
  };

  const ajustarAuxilio = (delta) => {
    setFormVacante(prev => ({
      ...prev,
      auxilio_sostenimiento: Math.max(0, (Number(prev.auxilio_sostenimiento) || 0) + delta)
    }));
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'SELECCIONADO': return <span className="badge badge-success">Seleccionado para Contratar ✓</span>;
      case 'PRESELECCIONADO': return <span className="badge badge-primary">Preseleccionado</span>;
      case 'RECHAZADO': return <span className="badge badge-danger">Descartado</span>;
      default: return <span className="badge badge-warning">Postulado</span>;
    }
  };

  const tabStyle = (tab) => ({
    padding: '0.75rem 1.25rem',
    fontSize: '0.9375rem',
    fontWeight: '700',
    background: 'transparent',
    border: 'none',
    borderBottom: pestana === tab ? '3px solid #d4af37' : '3px solid transparent',
    color: pestana === tab ? '#d4af37' : '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '-2px'
  });

  const seleccionados = postulaciones.filter(p => p.estado === 'SELECCIONADO').length;
  const preseleccionados = postulaciones.filter(p => p.estado === 'PRESELECCIONADO').length;

  return (
    <div className="main-content">
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#00324D' }}>
            Portal Empresarial
          </h1>
          <span className="badge badge-warning">Empresa Aliada</span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Gestiona tus vacantes de etapa práctica, revisa hojas de vida y notas de los candidatos para selección directa
        </p>
      </div>

      {/* Mensaje de alerta */}
      {mensaje && (
        <div style={{
          backgroundColor: mensaje.tipo === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${mensaje.tipo === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: mensaje.tipo === 'success' ? '#065f46' : '#991b1b',
          padding: '0.875rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem',
          fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span>{mensaje.texto}</span>
          <button onClick={() => setMensaje(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid-kpi">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div className="kpi-value">{vacantes.length}</div>
            <div className="kpi-label">Vacantes Publicadas</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#f9f6ea', color: '#d4af37' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="kpi-value">{postulaciones.length}</div>
            <div className="kpi-label">Candidatos Totales</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="kpi-value">{preseleccionados}</div>
            <div className="kpi-label">Preseleccionados</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="kpi-value">{seleccionados}</div>
            <div className="kpi-label">Contratados / Seleccionados</div>
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <button style={tabStyle('postulaciones')} onClick={() => setPestana('postulaciones')}>
          <Users size={16} />Candidatos Postulados ({postulaciones.length})
        </button>
        <button style={tabStyle('vacantes')} onClick={() => setPestana('vacantes')}>
          <Briefcase size={16} />Mis Vacantes Publicadas ({vacantes.length})
        </button>
      </div>

      {/* ===== PESTAÑA CANDIDATOS ===== */}
      {pestana === 'postulaciones' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#00324D' }}>Candidatos en Proceso de Selección</h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                Haz clic sobre el nombre del estudiante para ver su <strong>Hoja de Vida, Perfil Completo y Calificaciones de los Profesores</strong>
              </p>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Cargando candidatos...</div>
          ) : postulaciones.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <Users size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem', display: 'block' }} />
              <p>No hay candidatos postulados actualmente.</p>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem' }}>
                Cuando los aprendices del Instituto Estudiantil se postulen a tus vacantes, podrás consultar todo su expediente aquí.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {postulaciones.map((p) => (
                <div key={p.id} style={{
                  border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: '1rem', backgroundColor: '#fff',
                  borderLeft: p.estado === 'SELECCIONADO' ? '5px solid #10b981' :
                              p.estado === 'PRESELECCIONADO' ? '5px solid #3b82f6' :
                              p.estado === 'RECHAZADO' ? '5px solid #ef4444' : '5px solid #f59e0b'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                      alt={p.estudiante_nombre}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4af37' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <button
                          onClick={() => setCandidatoModal(p)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            fontSize: '1.1rem',
                            fontWeight: '800',
                            color: '#00324D',
                            cursor: 'pointer',
                            textAlign: 'left',
                            textDecoration: 'underline',
                            textDecorationColor: '#d4af37'
                          }}
                          title="Clic para ver Hoja de Vida y Calificaciones"
                        >
                          {p.estudiante_nombre}
                        </button>
                        {getEstadoBadge(p.estado)}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '0.25rem' }}>
                        Grado {p.estudiante_grado || 11}° • <strong>{p.estudiante_programa || 'Técnico'}</strong> • Vacante: <strong>{p.vacante_titulo}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                        <span style={{ color: '#065f46', fontWeight: '700' }}>
                          ✓ {p.competencias_aprobadas || '4'} Competencias Aprobadas
                        </span>
                        <span>• Postulado: {new Date(p.fecha_postulacion).toLocaleDateString('es-CO')}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setCandidatoModal(p)}
                    >
                      <FileText size={14} />
                      <span>Ver Hoja de Vida & Notas</span>
                    </button>

                    <select
                      className="form-select"
                      style={{ width: 'auto', fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }}
                      value={p.estado}
                      onChange={(e) => handleCambiarEstado(p.id, e.target.value)}
                      disabled={actualizandoId === p.id}
                    >
                      <option value="POSTULADO">Postulado</option>
                      <option value="PRESELECCIONADO">Preseleccionado</option>
                      <option value="SELECCIONADO">Seleccionado ✓</option>
                      <option value="RECHAZADO">Descartado</option>
                    </select>

                    <a href={`mailto:${p.estudiante_email || 'estudiante@estudiantil.edu.co'}`} className="btn btn-outline btn-sm">
                      <Mail size={14} /><span>Contactar</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== PESTAÑA VACANTES ===== */}
      {pestana === 'vacantes' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#00324D' }}>Oportunidades Publicadas</h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                Vacantes activas disponibles para los estudiantes del Instituto Estudiantil
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModalVacante(true)}>
              <Plus size={16} /> Publicar Nueva Vacante
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Cargando vacantes...</div>
          ) : vacantes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <Briefcase size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem', display: 'block' }} />
              <p>No tienes vacantes publicadas aún.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {vacantes.map((v) => (
                <div key={v.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#00324D', marginBottom: '0.5rem' }}>
                        {v.titulo}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                        {v.descripcion}
                      </p>
                      {v.requisitos && (
                        <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem' }}>
                          <strong>Requisitos:</strong> {v.requisitos}
                        </p>
                      )}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={14} color="#d4af37" />
                          <span>{v.ubicacion} ({v.modalidad})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700', color: '#065f46' }}>
                          <DollarSign size={15} color="#d4af37" />
                          <span>Auxilio: ${Number(v.auxilio_sostenimiento).toLocaleString('es-CO')} COP</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={14} color="#d4af37" />
                          <span>Cierre: {v.fecha_limite}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Users size={14} color="#d4af37" />
                          <span>Cupos: {v.cupos_disponibles}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${v.estado === 'ABIERTA' ? 'badge-success' : 'badge-warning'}`}>
                      {v.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== MODAL: CREAR VACANTE CON AUXILIO EN MONEDA COP ===== */}
      {showModalVacante && (
        <div className="modal-overlay" onClick={() => setShowModalVacante(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={22} color="#00324D" />
                <h3 style={{ fontSize: '1.2rem', color: '#00324D', fontWeight: '800' }}>Publicar Nueva Vacante de Práctica</h3>
              </div>
              <button onClick={() => setShowModalVacante(false)} style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            <form onSubmit={handleCrearVacante}>
              <div className="form-group">
                <label className="form-label">Cargo / Título de la Vacante *</label>
                <input
                  className="form-input"
                  required
                  value={formVacante.titulo}
                  onChange={(e) => setFormVacante({ ...formVacante, titulo: e.target.value })}
                  placeholder="Ej: Aprendiz Desarrollador Web Junior"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción de las Actividades *</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  required
                  value={formVacante.descripcion}
                  onChange={(e) => setFormVacante({ ...formVacante, descripcion: e.target.value })}
                  placeholder="Describe las tareas, proyectos y apoyo formativo que brindará la empresa..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Requisitos o Competencias Previas</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  value={formVacante.requisitos}
                  onChange={(e) => setFormVacante({ ...formVacante, requisitos: e.target.value })}
                  placeholder="Ej: Competencias en JavaScript, SQL, trabajo en equipo..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Modalidad *</label>
                  <select
                    className="form-select"
                    value={formVacante.modalidad}
                    onChange={(e) => setFormVacante({ ...formVacante, modalidad: e.target.value })}
                  >
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="HÍBRIDO">Híbrido</option>
                    <option value="REMOTO">Remoto</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ubicación</label>
                  <input
                    className="form-input"
                    value={formVacante.ubicacion}
                    onChange={(e) => setFormVacante({ ...formVacante, ubicacion: e.target.value })}
                    placeholder="Ej: Bogotá D.C."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cupos Disponibles</label>
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    value={formVacante.cupos_disponibles}
                    onChange={(e) => setFormVacante({ ...formVacante, cupos_disponibles: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha Límite de Postulación</label>
                  <input
                    className="form-input"
                    type="date"
                    value={formVacante.fecha_limite}
                    onChange={(e) => setFormVacante({ ...formVacante, fecha_limite: e.target.value })}
                  />
                </div>

                {/* Control monetario con signo pesos según requerimiento del usuario */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">
                    Auxilio de Sostenimiento Mensual *
                  </label>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#f8fafc',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1'
                  }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#00324D' }}>$</span>
                    <input
                      type="number"
                      min="0"
                      step="50000"
                      className="form-input"
                      style={{ fontSize: '1.1rem', fontWeight: '700', color: '#065f46' }}
                      value={formVacante.auxilio_sostenimiento}
                      onChange={(e) => setFormVacante({ ...formVacante, auxilio_sostenimiento: Number(e.target.value) })}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#64748b' }}>COP</span>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => ajustarAuxilio(-50000)}
                      title="Disminuir $50.000"
                    >
                      -$50k
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => ajustarAuxilio(50000)}
                      title="Aumentar $50.000"
                    >
                      +$50k
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', alignSelf: 'center' }}>Valores sugeridos:</span>
                    <button
                      type="button"
                      style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                      onClick={() => setFormVacante({ ...formVacante, auxilio_sostenimiento: 1423500 })}
                    >
                      $ 1.423.500 COP (100% SMLV)
                    </button>
                    <button
                      type="button"
                      style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                      onClick={() => setFormVacante({ ...formVacante, auxilio_sostenimiento: 1600000 })}
                    >
                      $ 1.600.000 COP
                    </button>
                    <button
                      type="button"
                      style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                      onClick={() => setFormVacante({ ...formVacante, auxilio_sostenimiento: 1800000 })}
                    >
                      $ 1.800.000 COP
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModalVacante(false)} disabled={guardando}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={guardando}>
                  {guardando ? 'Publicando...' : 'Publicar Vacante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL: EXPEDIENTE COMPLETO DEL CANDIDATO (HOJA DE VIDA, NOTAS, EVALUACIONES) ===== */}
      {candidatoModal && (
        <div className="modal-overlay" onClick={() => setCandidatoModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={24} color="#d4af37" />
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#00324D', fontWeight: '800' }}>
                    Expediente y Hoja de Vida del Candidato
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Postulado a: <strong>{candidatoModal.vacante_titulo}</strong>
                  </p>
                </div>
              </div>
              <button onClick={() => setCandidatoModal(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            {/* Cabecera del Candidato */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'center'
            }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                alt={candidatoModal.estudiante_nombre}
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #d4af37' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                    {candidatoModal.estudiante_nombre}
                  </h4>
                  {getEstadoBadge(candidatoModal.estado)}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.25rem' }}>
                  Instituto Estudiantil • Grado {candidatoModal.estudiante_grado || 11}° • <strong>{candidatoModal.estudiante_programa || 'Técnico'}</strong>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={14} color="#94a3b8" />
                    <span>{candidatoModal.estudiante_email || 'estudiante@estudiantil.edu.co'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} color="#94a3b8" />
                    <span>{candidatoModal.estudiante_telefono || '3109876543'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="#94a3b8" />
                    <span>Bogotá D.C.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen Profesional */}
            {candidatoModal.resumen_perfil && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h5 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#00324D', marginBottom: '0.35rem' }}>
                  Perfil del Estudiante:
                </h5>
                <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {candidatoModal.resumen_perfil}
                </p>
              </div>
            )}

            {/* Habilidades */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h5 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#00324D', marginBottom: '0.5rem' }}>
                Habilidades y Competencias Técnicas:
              </h5>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {candidatoModal.habilidades ? candidatoModal.habilidades.map((h, i) => (
                  <span key={i} className="badge badge-info">{h}</span>
                )) : (
                  <>
                    <span className="badge badge-info">HTML5 / CSS3</span>
                    <span className="badge badge-info">JavaScript</span>
                    <span className="badge badge-info">React.js</span>
                    <span className="badge badge-info">MySQL</span>
                    <span className="badge badge-info">Git</span>
                  </>
                )}
              </div>
            </div>

            {/* Calificaciones y Juicios Evaluativos de los Profesores */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#00324D', marginBottom: '0.5rem' }}>
                Notas y Evaluación de Competencias (Asentadas por los Profesores):
              </h5>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {candidatoModal.evaluaciones && candidatoModal.evaluaciones.length > 0 ? (
                  candidatoModal.evaluaciones.map((ev, idx) => (
                    <div key={idx} style={{
                      border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      backgroundColor: '#fff'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#d4af37' }}>
                          Norma {ev.codigo_norma} • {ev.fase_proyecto}
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a' }}>
                          {ev.denominacion}
                        </div>
                        {ev.observaciones && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', fontStyle: 'italic' }}>
                            Nota/Observación: "{ev.observaciones}"
                          </div>
                        )}
                      </div>
                      <span className={`badge ${ev.juicio_evaluativo === 'APROBADO' ? 'badge-success' : 'badge-warning'}`}>
                        {ev.juicio_evaluativo === 'APROBADO' ? 'Aprobado ✓' : ev.juicio_evaluativo}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.8125rem', color: '#64748b', padding: '0.5rem' }}>
                    El estudiante cuenta con el 80% de competencias aprobadas por el cuerpo docente.
                  </div>
                )}
              </div>
            </div>

            {/* Acciones de Selección / Contratación */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '1rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleCambiarEstado(candidatoModal.id, 'RECHAZADO')}
                  style={{ color: '#ef4444', borderColor: '#fecaca' }}
                >
                  Descartar
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => handleCambiarEstado(candidatoModal.id, 'PRESELECCIONADO')}
                >
                  Marcar como Preseleccionado
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleCambiarEstado(candidatoModal.id, 'SELECCIONADO')}
                >
                  <CheckCircle2 size={16} />
                  <span>Seleccionar para Contratar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
