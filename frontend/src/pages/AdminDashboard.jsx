import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Building2, Users, Briefcase, CheckCircle2, TrendingUp,
  MapPin, Mail, Phone, Plus, X, UserPlus, Globe, Award,
  AlertCircle, ShieldCheck, Clock, FileText, ChevronRight,
  Copy, Check, Send, Trash2, DollarSign, Calendar, Search,
  Loader2, ExternalLink, User
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [instructores, setInstructores] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [solicitudesAlianza, setSolicitudesAlianza] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pestana, setPestana] = useState('instructores'); // 'instructores' | 'empresas' | 'estudiantes'

  // Modales
  const [showModalInstructor, setShowModalInstructor] = useState(false);
  const [showModalEmpresa, setShowModalEmpresa] = useState(false);
  const [showModalEstudiante, setShowModalEstudiante] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [empresaAEliminar, setEmpresaAEliminar] = useState(null);
  const [notificacionModal, setNotificacionModal] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [busquedaDocumento, setBusquedaDocumento] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState(null);

  // Formularios
  const [formInstructor, setFormInstructor] = useState({
    email: '',
    password: '',
    nombres: '',
    apellidos: '',
    tipo_documento: 'CC',
    numero_documento: '',
    telefono: '',
    especialidad: 'Aprendiz Desarrollador Web Junior'
  });

  const [formEmpresa, setFormEmpresa] = useState({
    email: '',
    password: '',
    nit: '',
    razon_social: '',
    sector_economico: '',
    ciudad: 'Bogotá D.C.',
    contacto_nombre: '',
    contacto_telefono: ''
  });

  const [formEstudiante, setFormEstudiante] = useState({
    email: '',
    password: '',
    nombres: '',
    apellidos: '',
    tipo_documento: 'TI',
    numero_documento: '',
    grado: 11,
    programa_formacion: 'Aprendiz Desarrollador Web Junior',
    jornada: 'MAÑANA',
    telefono: ''
  });

  const [mensaje, setMensaje] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, instRes, empRes, solRes, estRes] = await Promise.all([
        api.getEstadisticas(),
        api.getInstructores(),
        api.getEmpresas(),
        api.getSolicitudesAlianza(),
        api.getAdminEstudiantes()
      ]);
      setStats(statsRes.data);
      setInstructores(instRes.data);
      setEmpresas(empRes.data);
      setSolicitudesAlianza(solRes.data || []);
      setEstudiantes(estRes.data);
    } catch (err) {
      console.error('Error al cargar datos de admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCrearInstructor = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      const res = await api.crearInstructor(formInstructor);
      setMensaje({ tipo: 'success', texto: res.message });
      setShowModalInstructor(false);
      setFormInstructor({ email: '', password: '', nombres: '', apellidos: '', tipo_documento: 'CC', numero_documento: '', telefono: '', especialidad: 'Aprendiz Desarrollador Web Junior' });
      loadData();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    } finally {
      setGuardando(false);
    }
  };

  const handleCrearEmpresa = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      const res = await api.crearEmpresa(formEmpresa);
      setMensaje({ tipo: 'success', texto: res.message });
      setShowModalEmpresa(false);
      setFormEmpresa({ email: '', password: '', nit: '', razon_social: '', sector_economico: '', ciudad: 'Bogotá D.C.', contacto_nombre: '', contacto_telefono: '' });
      loadData();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    } finally {
      setGuardando(false);
    }
  };

  const handleAprobarAlianza = async (id) => {
    try {
      const res = await api.aprobarAlianza(id);
      setMensaje({ tipo: 'success', texto: res.message });
      if (res.data && res.data.notificacion_correo) {
        setNotificacionModal(res.data);
      }
      loadData();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al aprobar: ' + err.message });
    }
  };

  const handleRechazarAlianza = async (id) => {
    if (!window.confirm('¿Seguro que deseas rechazar esta solicitud de alianza?')) return;
    try {
      const res = await api.rechazarAlianza(id);
      setMensaje({ tipo: 'info', texto: res.message });
      loadData();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al rechazar: ' + err.message });
    }
  };

  const handleVerDetalleEmpresa = async (empresaId) => {
    try {
      const res = await api.getEmpresaDetalle(empresaId);
      setEmpresaSeleccionada(res.data);
    } catch (err) {
      alert('Error al consultar datos de la empresa: ' + err.message);
    }
  };

  const handleConfirmarEliminarEmpresa = async () => {
    if (!empresaAEliminar) return;
    setEliminando(true);
    try {
      const res = await api.eliminarEmpresa(empresaAEliminar.id);
      setMensaje({ tipo: 'success', texto: res.message });
      setEmpresaAEliminar(null);
      setEmpresaSeleccionada(null);
      loadData();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar empresa: ' + err.message });
    } finally {
      setEliminando(false);
    }
  };

  const handleCopiarCredenciales = (email, pass) => {
    navigator.clipboard.writeText(`Usuario: ${email}\nContraseña: ${pass}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const handleCrearEstudiante = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      const res = await api.crearEstudiante(formEstudiante);
      setMensaje({ tipo: 'success', texto: res.message });
      setShowModalEstudiante(false);
      setFormEstudiante({ email: '', password: '', nombres: '', apellidos: '', tipo_documento: 'TI', numero_documento: '', grado: 11, programa_formacion: 'Aprendiz Desarrollador Web Junior', jornada: 'MAÑANA', telefono: '' });
      loadData();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    } finally {
      setGuardando(false);
    }
  };

  const handleVerDetalleEstudiante = async (estudianteId) => {
    try {
      const res = await api.getEstudianteDetalleCompleto(estudianteId);
      setEstudianteSeleccionado(res.data);
    } catch (err) {
      alert('Error al obtener detalle del estudiante: ' + err.message);
    }
  };

  const handleBuscarPorDocumento = async () => {
    const doc = busquedaDocumento.trim();
    if (!doc) {
      setEstudiantesFiltrados(null);
      return;
    }
    setBuscando(true);
    try {
      const res = await api.buscarEstudiantePorDocumento(doc);
      setEstudiantesFiltrados(res.data || []);
    } catch (err) {
      console.error('Error buscando:', err);
      // Fallback: filtrar localmente
      const resultados = estudiantes.filter(e =>
        e.numero_documento && e.numero_documento.includes(doc)
      );
      setEstudiantesFiltrados(resultados);
    } finally {
      setBuscando(false);
    }
  };

  const handleLimpiarBusqueda = () => {
    setBusquedaDocumento('');
    setEstudiantesFiltrados(null);
  };

  const getEstadoContratacionBadge = (estado) => {
    switch (estado) {
      case 'CONTRATADO':
        return { clase: 'badge-success', texto: '✅ Contratado', color: '#059669' };
      case 'EN_PROCESO_CONTRATACION':
        return { clase: 'badge-warning', texto: '⏳ En Proceso de Contratación', color: '#d97706' };
      case 'POSTULADO_EN_REVISION':
        return { clase: 'badge-info', texto: '📋 Postulado / En Revisión', color: '#2563eb' };
      case 'POSTULACIONES_CERRADAS':
        return { clase: 'badge-danger', texto: '🔒 Postulaciones Cerradas', color: '#dc2626' };
      default:
        return { clase: 'badge-secondary', texto: '— Sin Postulaciones', color: '#64748b' };
    }
  };

  const solicitudesPendientes = solicitudesAlianza.filter(s => s.estado === 'PENDIENTE');

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

  return (
    <div className="main-content">
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#00324D' }}>
            Panel de Administración General
          </h1>
          <span className="badge badge-primary">Instituto Estudiantil</span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Gestión integral de instructores, empresas aliadas, admisiones y seguimiento de aprendices
        </p>
      </div>

      {/* Mensaje de alerta */}
      {mensaje && (
        <div style={{
          backgroundColor: mensaje.tipo === 'success' ? '#ecfdf5' : mensaje.tipo === 'info' ? '#eff6ff' : '#fef2f2',
          border: `1px solid ${mensaje.tipo === 'success' ? '#a7f3d0' : mensaje.tipo === 'info' ? '#bfdbfe' : '#fecaca'}`,
          color: mensaje.tipo === 'success' ? '#065f46' : mensaje.tipo === 'info' ? '#1e40af' : '#991b1b',
          padding: '0.875rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>{mensaje.texto}</span>
          <button onClick={() => setMensaje(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>
      )}

      {/* KPI Cards Solicitadas */}
      <div className="grid-kpi">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#f9f6ea', color: '#d4af37' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="kpi-value">{stats?.total_instructores || instructores.length}</div>
            <div className="kpi-label">Instructores Activos</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="kpi-value">{stats?.total_estudiantes || estudiantes.length}</div>
            <div className="kpi-label">Estudiantes Registrados</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div className="kpi-value">{stats?.total_empresas || empresas.length}</div>
            <div className="kpi-label">Empresas Aliadas</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="kpi-value">{stats?.tasa_colocacion || '82%'}</div>
            <div className="kpi-label">Tasa de Colocación</div>
          </div>
        </div>
      </div>

      {/* Pestañas de navegación */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button style={tabStyle('instructores')} onClick={() => setPestana('instructores')}>
          <Users size={16} />Instructores ({instructores.length})
        </button>
        <button style={tabStyle('empresas')} onClick={() => setPestana('empresas')}>
          <Building2 size={16} />Empresas Aliadas ({empresas.length})
          {solicitudesPendientes.length > 0 && (
            <span style={{
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '0.6875rem',
              padding: '2px 6px',
              borderRadius: '9999px',
              fontWeight: 'bold'
            }}>
              {solicitudesPendientes.length} nuevas
            </span>
          )}
        </button>
        <button style={tabStyle('estudiantes')} onClick={() => setPestana('estudiantes')}>
          <Award size={16} />Estudiantes 10° y 11° ({estudiantes.length})
        </button>
      </div>

      {/* =================== PESTAÑA INSTRUCTORES =================== */}
      {pestana === 'instructores' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#00324D' }}>Cuerpo Docente e Instructores Técnicos</h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                Profesores que califican y hacen seguimiento a las fichas técnicas del Instituto Estudiantil
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModalInstructor(true)}>
              <Plus size={16} /> Registrar Nuevo Instructor
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Cargando instructores...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {instructores.map((inst) => (
                <div key={inst.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#00324D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', fontWeight: 'bold' }}>
                      👨‍🏫
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: '700' }}>
                        {inst.nombres} {inst.apellidos}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: '700' }}>
                        {inst.tipo_documento}: {inst.numero_documento}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div>
                      <strong>Especialidad:</strong> {inst.especialidad}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} color="#94a3b8" />
                      <span>{inst.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} color="#94a3b8" />
                      <span>{inst.telefono || 'Sin teléfono'}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                    <span className="badge badge-success">Instructor Habilitado</span>
                    <span>Sede Principal</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================== PESTAÑA EMPRESAS ALIADAS Y SOLICITUDES =================== */}
      {pestana === 'empresas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Solicitudes de Alianza Pendientes */}
          <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div className="card-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={20} color="#f59e0b" />
                  <h2 style={{ fontSize: '1.2rem', color: '#00324D' }}>
                    Solicitudes de Alianza Empresarial Pendientes ({solicitudesPendientes.length})
                  </h2>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Empresas que radicaron su solicitud desde la página web. Al dar <strong>Aceptar / Aprobar</strong>, la plataforma genera automáticamente el usuario, contraseña y envía la notificación al correo.
                </p>
              </div>
            </div>

            {solicitudesPendientes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                ✓ No hay solicitudes de alianza pendientes en este momento.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {solicitudesPendientes.map((sol) => (
                  <div key={sol.id} style={{
                    border: '1px solid #fed7aa', borderRadius: '10px', padding: '1.25rem',
                    backgroundColor: '#fffbeb', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{sol.razon_social}</strong>
                        <span className="badge badge-warning">Solicitud Pendiente</span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#475569' }}>
                        <strong>NIT:</strong> {sol.nit} &nbsp;|&nbsp; <strong>Sector:</strong> {sol.sector_economico} &nbsp;|&nbsp; <strong>Ciudad:</strong> {sol.ciudad}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.25rem' }}>
                        <strong>Contacto:</strong> {sol.contacto_nombre} ({sol.contacto_cargo}) &nbsp;|&nbsp; <strong>Tel:</strong> {sol.contacto_telefono} &nbsp;|&nbsp; <strong>Email:</strong> {sol.email}
                      </div>
                      {sol.mensaje_solicitud && (
                        <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.35rem', fontStyle: 'italic' }}>
                          "{sol.mensaje_solicitud}"
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleRechazarAlianza(sol.id)} style={{ color: '#ef4444', borderColor: '#fecaca' }}>
                        Rechazar
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleAprobarAlianza(sol.id)}>
                        <CheckCircle2 size={14} /> Aprobar y Enviar Credenciales
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Empresas Aliadas Activas */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#00324D' }}>Empresas Aliadas Oficiales</h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Haz clic en el nombre de la empresa para ver su ficha completa, vacantes y opción para finalizar/eliminar alianza
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowModalEmpresa(true)}>
                <Plus size={16} /> Vincular Empresa Directa
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Cargando empresas...</div>
            ) : empresas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No hay empresas aliadas activas.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {empresas.map((emp) => (
                  <div key={emp.id} style={{
                    border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: '1rem', backgroundColor: '#fff'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <Building2 size={20} color="#00324D" />
                        <button
                          onClick={() => handleVerDetalleEmpresa(emp.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            fontWeight: '800',
                            fontSize: '1.1rem',
                            color: '#00324D',
                            cursor: 'pointer',
                            textAlign: 'left',
                            textDecoration: 'underline',
                            textDecorationColor: '#d4af37'
                          }}
                          title="Clic para ver ficha completa de la empresa"
                        >
                          {emp.razon_social}
                        </button>
                        <span className="badge badge-success"><CheckCircle2 size={12} /> Alianza Activa</span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#475569' }}>
                        <strong>NIT:</strong> {emp.nit} &nbsp;|&nbsp; <strong>Sector:</strong> {emp.sector_economico || 'General'} &nbsp;|&nbsp; <strong>Ciudad:</strong> {emp.ciudad || 'Bogotá D.C.'}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                        <Mail size={12} style={{ display: 'inline' }} /> {emp.email} &nbsp;|&nbsp; <Phone size={12} style={{ display: 'inline' }} /> {emp.contacto_telefono || 'N/A'} &nbsp;|&nbsp; Contacto: {emp.contacto_nombre || 'Representante'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleVerDetalleEmpresa(emp.id)}
                      >
                        Ver Ficha Completa
                      </button>

                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setEmpresaAEliminar(emp)}
                        style={{ color: '#ef4444', borderColor: '#fecaca' }}
                        title="Eliminar empresa y revocar credenciales de la base de datos"
                      >
                        <Trash2 size={14} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================== PESTAÑA ESTUDIANTES =================== */}
      {pestana === 'estudiantes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Barra de búsqueda por documento */}
          <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Search size={18} color="#3b82f6" />
                <h3 style={{ fontSize: '1rem', color: '#00324D', fontWeight: '700' }}>Buscar Estudiante por Número de Documento</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Ej: 1023456789"
                    value={busquedaDocumento}
                    onChange={(e) => setBusquedaDocumento(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleBuscarPorDocumento()}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
                <button className="btn btn-primary" onClick={handleBuscarPorDocumento} disabled={buscando} style={{ minWidth: '120px' }}>
                  {buscando ? <><Loader2 size={14} className="spin" /> Buscando...</> : <><Search size={14} /> Buscar</>}
                </button>
                {estudiantesFiltrados !== null && (
                  <button className="btn btn-outline" onClick={handleLimpiarBusqueda} style={{ fontSize: '0.8125rem' }}>
                    ✕ Limpiar filtro
                  </button>
                )}
              </div>
              {estudiantesFiltrados !== null && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: '#64748b' }}>
                  {estudiantesFiltrados.length === 0
                    ? '❌ No se encontró ningún estudiante con ese número de documento.'
                    : `✅ ${estudiantesFiltrados.length} estudiante${estudiantesFiltrados.length > 1 ? 's' : ''} encontrado${estudiantesFiltrados.length > 1 ? 's' : ''}`}
                </div>
              )}
            </div>
          </div>

          {/* Listado de estudiantes */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#00324D' }}>Estudiantes del Instituto Estudiantil</h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Haz clic en el <strong>nombre del estudiante</strong> para ver su ficha completa, estado de contratación y postulaciones
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowModalEstudiante(true)}>
                <UserPlus size={16} /> Matricular Nuevo Estudiante
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Cargando estudiantes...</div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Documento</th>
                      <th>Grado</th>
                      <th>Programa de Formación</th>
                      <th>Correo Electrónico</th>
                      <th>Estado de Notas</th>
                      <th style={{ textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(estudiantesFiltrados || estudiantes).map((est) => (
                      <tr key={est.id}>
                        <td>
                          <button
                            onClick={() => handleVerDetalleEstudiante(est.id)}
                            style={{
                              background: 'none', border: 'none', padding: 0,
                              fontWeight: '700', fontSize: '0.9375rem', color: '#00324D',
                              cursor: 'pointer', textAlign: 'left', textDecoration: 'underline',
                              textDecorationColor: '#d4af37'
                            }}
                            title="Clic para ver ficha completa del estudiante"
                          >
                            {est.nombres} {est.apellidos}
                          </button>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{est.tipo_documento}: {est.numero_documento}</td>
                        <td>
                          <span className={`badge ${est.grado === 11 ? 'badge-primary' : 'badge-warning'}`}>
                            Grado {est.grado}°
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8125rem', color: '#334155' }}>
                          {est.programa_formacion}
                        </td>
                        <td style={{ fontSize: '0.8125rem' }}>{est.email}</td>
                        <td>
                          <span className={`badge ${est.estado_badge || 'badge-success'}`}>
                            {est.estado_academico || 'Al día'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleVerDetalleEstudiante(est.id)}
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            Ver Perfil
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

      {/* =================== MODAL: FICHA COMPLETA DE LA EMPRESA (CLICK EN NOMBRE) =================== */}
      {empresaSeleccionada && (
        <div className="modal-overlay" onClick={() => setEmpresaSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={24} color="#00324D" />
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#00324D', fontWeight: '800' }}>
                    Información Completa de la Empresa Aliada
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Ficha institucional y vacantes registradas en el Instituto Estudiantil
                  </p>
                </div>
              </div>
              <button onClick={() => setEmpresaSeleccionada(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            {/* Cabecera Empresa */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
                    {empresaSeleccionada.razon_social}
                  </h4>
                  <div style={{ fontSize: '0.875rem', color: '#d4af37', fontWeight: '700', marginBottom: '0.5rem' }}>
                    NIT: {empresaSeleccionada.nit} • Sector: {empresaSeleccionada.sector_economico || 'General'}
                  </div>
                </div>
                <span className="badge badge-success"><CheckCircle2 size={12} /> Alianza Activa</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8125rem', color: '#475569', marginTop: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                <div>
                  <strong>Correo de Acceso:</strong> {empresaSeleccionada.email}
                </div>
                <div>
                  <strong>Ciudad / Ubicación:</strong> {empresaSeleccionada.ciudad || 'Bogotá D.C.'}
                </div>
                <div>
                  <strong>Dirección:</strong> {empresaSeleccionada.direccion || 'Sede Principal'}
                </div>
                <div>
                  <strong>Sitio Web:</strong> {empresaSeleccionada.sitio_web || 'No especificado'}
                </div>
                <div>
                  <strong>Contacto / RRHH:</strong> {empresaSeleccionada.contacto_nombre || 'Representante'}
                </div>
                <div>
                  <strong>Teléfono:</strong> {empresaSeleccionada.contacto_telefono || 'No especificado'}
                </div>
              </div>
            </div>

            {/* Vacantes publicadas por la empresa */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#00324D' }}>
                  Vacantes Publicadas para Estudiantes ({empresaSeleccionada.vacantes?.length || 0}):
                </h4>
              </div>

              {empresaSeleccionada.vacantes && empresaSeleccionada.vacantes.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {empresaSeleccionada.vacantes.map((v) => (
                    <div key={v.id} style={{
                      border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.875rem',
                      backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem'
                    }}>
                      <div>
                        <strong style={{ fontSize: '0.9375rem', color: '#00324D' }}>{v.titulo}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                          Modalidad: {v.modalidad} • Cupos: {v.cupos_disponibles} • Auxilio: ${Number(v.auxilio_sostenimiento).toLocaleString('es-CO')} COP
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge badge-info">{v.postulaciones_count || 0} Candidatos</span>
                        <span className="badge badge-success">{v.estado}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.8125rem', color: '#64748b', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                  Esta empresa aún no ha publicado vacantes de práctica.
                </div>
              )}
            </div>

            {/* Acciones del Modal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '1rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ color: '#ef4444', borderColor: '#fecaca', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                onClick={() => setEmpresaAEliminar(empresaSeleccionada)}
              >
                <Trash2 size={16} />
                <span>Eliminar Empresa y Alianza</span>
              </button>

              <button className="btn btn-primary" onClick={() => setEmpresaSeleccionada(null)}>
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================== MODAL DE CONFIRMACIÓN PARA ELIMINAR EMPRESA =================== */}
      {empresaAEliminar && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={(e) => { e.stopPropagation(); setEmpresaAEliminar(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', zIndex: 1101 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#991b1b', fontWeight: '800' }}>
                  ¿Eliminar Empresa y Revocar Acceso?
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.875rem', color: '#334155' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                Estás a punto de eliminar a <strong>"{empresaAEliminar.razon_social}"</strong> (NIT: {empresaAEliminar.nit}).
              </p>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: '#7f1d1d' }}>
                <li>Se eliminará la empresa de la lista de aliados oficiales.</li>
                <li>Se cancelará su cuenta de usuario y credenciales de acceso.</li>
                <li>Se removerán todas las vacantes publicadas por esta empresa.</li>
                <li>Se eliminarán todas las postulaciones de candidatos a sus vacantes.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={(e) => { e.stopPropagation(); setEmpresaAEliminar(null); }}
                disabled={eliminando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn"
                style={{ backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold', border: 'none', cursor: eliminando ? 'not-allowed' : 'pointer' }}
                onClick={(e) => { e.stopPropagation(); handleConfirmarEliminarEmpresa(); }}
                disabled={eliminando}
              >
                {eliminando ? 'Eliminando...' : 'Sí, Eliminar Permanentemente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================== MODAL: NOTIFICACIÓN DE CREDENCIALES ENVIADA AL CORREO =================== */}
      {notificacionModal && (
        <div className="modal-overlay" onClick={() => setNotificacionModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#00324D', fontWeight: '800' }}>
                    Notificación de Credenciales Despachada
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>
                    ✓ Correo enviado automáticamente a la empresa
                  </p>
                </div>
              </div>
              <button onClick={() => setNotificacionModal(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.5rem' }}>
                <strong>Empresa Vinculada:</strong> {notificacionModal.razon_social}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.5rem' }}>
                <strong>Destinatario / Correo:</strong> {notificacionModal.email}
              </div>

              {/* Credenciales generadas */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px dashed #d4af37',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#d4af37', textTransform: 'uppercase' }}>
                    Credenciales de Acceso Asignadas (Rol: Empresa)
                  </span>
                  <button
                    onClick={() => handleCopiarCredenciales(notificacionModal.email, notificacionModal.password_generada)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                  >
                    {copiado ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copiado ? '¡Copiado!' : 'Copiar Credenciales'}</span>
                  </button>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#0f172a' }}>
                  <strong>Usuario:</strong> {notificacionModal.email}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#0f172a', marginTop: '0.25rem' }}>
                  <strong>Contraseña:</strong> <code style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#00324D', fontWeight: 'bold' }}>{notificacionModal.password_generada}</code>
                </div>
              </div>
            </div>

            {/* Vista previa del correo */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', backgroundColor: '#ffffff', fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5 }}>
              <div style={{ fontWeight: '700', color: '#00324D', marginBottom: '0.5rem' }}>
                Asunto: {notificacionModal.notificacion_correo?.asunto}
              </div>
              <p style={{ marginBottom: '0.5rem' }}>
                {notificacionModal.notificacion_correo?.contenido?.mensaje}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.75rem' }}>
                {notificacionModal.notificacion_correo?.contenido?.instrucciones}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button className="btn btn-primary" onClick={() => setNotificacionModal(null)}>
                Entendido / Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================== MODAL: FICHA COMPLETA DE ESTUDIANTE (Solo Admin) =================== */}
      {estudianteSeleccionado && (
        <div className="modal-overlay" onClick={() => setEstudianteSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={22} color="#00324D" />
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#00324D', fontWeight: '800' }}>
                    Ficha Completa del Estudiante
                  </h3>
                  <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Vista exclusiva del Administrador General</p>
                </div>
              </div>
              <button onClick={() => setEstudianteSeleccionado(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            {/* Datos personales */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
                    {estudianteSeleccionado.nombres} {estudianteSeleccionado.apellidos}
                  </h4>
                  <div style={{ fontSize: '0.8125rem', color: '#d4af37', fontWeight: '700', marginBottom: '0.5rem' }}>
                    {estudianteSeleccionado.tipo_documento}: {estudianteSeleccionado.numero_documento} • Grado {estudianteSeleccionado.grado}°
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.8125rem', color: '#475569' }}>
                    <div><strong>Programa:</strong> {estudianteSeleccionado.programa_formacion}</div>
                    <div><strong>Colegio:</strong> {estudianteSeleccionado.colegio_nombre || 'Instituto Estudiantil'}</div>
                    <div><strong>Correo:</strong> {estudianteSeleccionado.email}</div>
                    <div><strong>Teléfono:</strong> {estudianteSeleccionado.telefono || 'N/A'}</div>
                    <div style={{ gridColumn: '1 / -1' }}><strong>Jornada:</strong> {estudianteSeleccionado.jornada || 'Mañana'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: estudianteSeleccionado.porcentaje_avance >= 70 ? '#059669' : '#d97706' }}>
                    {estudianteSeleccionado.porcentaje_avance}%
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: '600' }}>Avance Curricular</div>
                  <span className={`badge ${estudianteSeleccionado.apto_practica ? 'badge-success' : 'badge-warning'}`} style={{ marginTop: '0.25rem', fontSize: '0.6875rem' }}>
                    {estudianteSeleccionado.apto_practica ? '✅ Apto Práctica' : '⏳ En Formación'}
                  </span>
                </div>
              </div>
              {estudianteSeleccionado.resumen_perfil && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', fontSize: '0.8125rem', color: '#475569', fontStyle: 'italic' }}>
                  "{estudianteSeleccionado.resumen_perfil}"
                </div>
              )}
            </div>

            {/* Estado de Contratación / Postulaciones */}
            <div style={{
              padding: '1.25rem', borderRadius: '12px', marginBottom: '1.25rem',
              border: `2px solid ${getEstadoContratacionBadge(estudianteSeleccionado.estado_contratacion).color}20`,
              backgroundColor: `${getEstadoContratacionBadge(estudianteSeleccionado.estado_contratacion).color}08`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Briefcase size={18} color={getEstadoContratacionBadge(estudianteSeleccionado.estado_contratacion).color} />
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#00324D' }}>Estado de Contratación</h4>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{
                  padding: '0.35rem 0.75rem', borderRadius: '6px', fontWeight: '700', fontSize: '0.8125rem',
                  color: 'white', backgroundColor: getEstadoContratacionBadge(estudianteSeleccionado.estado_contratacion).color
                }}>
                  {getEstadoContratacionBadge(estudianteSeleccionado.estado_contratacion).texto}
                </span>
                {estudianteSeleccionado.tiempo_contratado && (
                  <span style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} /> Tiempo contratado: {estudianteSeleccionado.tiempo_contratado}
                  </span>
                )}
              </div>

              {estudianteSeleccionado.empresa_contratante && (
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem' }}>
                    <Building2 size={14} style={{ display: 'inline', marginRight: '0.35rem' }} />
                    {estudianteSeleccionado.empresa_contratante.nombre}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', fontSize: '0.75rem', color: '#475569' }}>
                    <div><strong>Vacante:</strong> {estudianteSeleccionado.empresa_contratante.vacante}</div>
                    <div><strong>Modalidad:</strong> {estudianteSeleccionado.empresa_contratante.modalidad}</div>
                    <div><strong>Ciudad:</strong> {estudianteSeleccionado.empresa_contratante.ciudad}</div>
                    <div><strong>Sector:</strong> {estudianteSeleccionado.empresa_contratante.sector}</div>
                    {estudianteSeleccionado.empresa_contratante.auxilio > 0 && (
                      <div><strong>Auxilio:</strong> $ {Number(estudianteSeleccionado.empresa_contratante.auxilio).toLocaleString('es-CO')} COP</div>
                    )}
                    {estudianteSeleccionado.fecha_contratacion && (
                      <div><strong>Desde:</strong> {new Date(estudianteSeleccionado.fecha_contratacion).toLocaleDateString('es-CO')}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Lista de postulaciones */}
              {estudianteSeleccionado.postulaciones && estudianteSeleccionado.postulaciones.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#334155', marginBottom: '0.5rem' }}>
                    Historial de Postulaciones ({estudianteSeleccionado.postulaciones.length}):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {estudianteSeleccionado.postulaciones.map((p, idx) => (
                      <div key={idx} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.5rem 0.75rem', backgroundColor: '#fff', borderRadius: '6px',
                        border: '1px solid #e2e8f0', fontSize: '0.75rem'
                      }}>
                        <div>
                          <strong>{p.vacante_titulo}</strong>
                          <span style={{ color: '#64748b' }}> — {p.empresa_nombre}</span>
                        </div>
                        <span className={`badge ${p.estado === 'CONTRATADO' ? 'badge-success' : p.estado === 'PRESELECCIONADO' ? 'badge-warning' : p.estado === 'RECHAZADO' ? 'badge-danger' : 'badge-info'}`} style={{ fontSize: '0.6875rem' }}>
                          {p.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Documentos del estudiante */}
            {estudianteSeleccionado.documentos && estudianteSeleccionado.documentos.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <FileText size={16} color="#00324D" />
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#00324D' }}>Documentos Cargados</h4>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {estudianteSeleccionado.documentos.map((doc) => (
                    <div key={doc.id} style={{
                      padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0',
                      backgroundColor: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem'
                    }}>
                      <FileText size={12} color="#d4af37" />
                      <span>{doc.nombre}</span>
                      <span className={`badge ${doc.estado === 'VERIFICADO' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.625rem' }}>
                        {doc.estado}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competencias */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={16} color="#00324D" />
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#00324D' }}>Competencias Evaluadas</h4>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.6875rem' }}>
                  <span className="badge badge-success">✅ {estudianteSeleccionado.competencias_aprobadas_count || 0} Aprobadas</span>
                  <span className="badge badge-warning">⏳ {estudianteSeleccionado.competencias_en_proceso_count || 0} En Proceso</span>
                  <span className="badge badge-info">📋 {estudianteSeleccionado.competencias_por_evaluar_count || 0} Por Evaluar</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                {estudianteSeleccionado.competencias?.map((comp) => (
                  <div key={comp.id} style={{
                    border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: '#fff'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.6875rem', fontWeight: '700', color: '#d4af37' }}>
                        Norma {comp.codigo_norma}
                      </div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#0f172a' }}>
                        {comp.denominacion}
                      </div>
                      {comp.observaciones && (
                        <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '0.15rem', fontStyle: 'italic' }}>
                          "{comp.observaciones}"
                        </div>
                      )}
                      {comp.instructor_nombre && (
                        <div style={{ fontSize: '0.625rem', color: '#94a3b8', marginTop: '0.1rem' }}>
                          Evaluado por: {comp.instructor_nombre}
                        </div>
                      )}
                    </div>
                    <div style={{ marginLeft: '0.5rem' }}>
                      <span className={`badge ${comp.juicio_evaluativo === 'APROBADO' ? 'badge-success' : comp.juicio_evaluativo === 'EN_PROCESO' ? 'badge-warning' : 'badge-danger'}`}>
                        {comp.juicio_evaluativo === 'APROBADO' ? 'Aprobado ✓' : comp.juicio_evaluativo === 'EN_PROCESO' ? 'En Proceso' : 'Por Evaluar'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button className="btn btn-primary" onClick={() => setEstudianteSeleccionado(null)}>
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================== MODAL: CREAR INSTRUCTOR =================== */}
      {showModalInstructor && (
        <div className="modal-overlay" onClick={() => setShowModalInstructor(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} color="#00324D" />
                <h3 style={{ fontSize: '1.125rem', color: '#00324D', fontWeight: '800' }}>Registrar Nuevo Instructor</h3>
              </div>
              <button onClick={() => setShowModalInstructor(false)} style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>
            <form onSubmit={handleCrearInstructor}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nombres *</label>
                  <input className="form-input" required value={formInstructor.nombres} onChange={(e) => setFormInstructor({ ...formInstructor, nombres: e.target.value })} placeholder="Ej: Carlos Alberto" />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellidos *</label>
                  <input className="form-input" required value={formInstructor.apellidos} onChange={(e) => setFormInstructor({ ...formInstructor, apellidos: e.target.value })} placeholder="Ej: Pérez Moreno" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo Documento</label>
                  <select className="form-select" value={formInstructor.tipo_documento} onChange={(e) => setFormInstructor({ ...formInstructor, tipo_documento: e.target.value })}>
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Número de Documento *</label>
                  <input className="form-input" required value={formInstructor.numero_documento} onChange={(e) => setFormInstructor({ ...formInstructor, numero_documento: e.target.value })} placeholder="Ej: 80123456" />
                </div>
                <div className="form-group">
                  <label className="form-label">Correo Institucional *</label>
                  <input className="form-input" type="email" required value={formInstructor.email} onChange={(e) => setFormInstructor({ ...formInstructor, email: e.target.value })} placeholder="profesor@estudiantil.edu.co" />
                </div>
                <div className="form-group">
                  <label className="form-label">Contraseña de Acceso *</label>
                  <input className="form-input" type="password" required value={formInstructor.password} onChange={(e) => setFormInstructor({ ...formInstructor, password: e.target.value })} placeholder="••••••••" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Especialidad / Programa que Imparte *</label>
                  <select className="form-select" value={formInstructor.especialidad} onChange={(e) => setFormInstructor({ ...formInstructor, especialidad: e.target.value })}>
                    <option value="Aprendiz Desarrollador Web Junior">Aprendiz Desarrollador Web Junior</option>
                    <option value="Auxiliar de Bases de Datos y Soporte TI">Auxiliar de Bases de Datos y Soporte TI</option>
                    <option value="Auxiliar en Contaduría Pública">Auxiliar en Contaduría Pública</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Teléfono de Contacto</label>
                  <input className="form-input" value={formInstructor.telefono} onChange={(e) => setFormInstructor({ ...formInstructor, telefono: e.target.value })} placeholder="Ej: 3157894561" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModalInstructor(false)} disabled={guardando}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Registrar Instructor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================== MODAL: CREAR EMPRESA =================== */}
      {showModalEmpresa && (
        <div className="modal-overlay" onClick={() => setShowModalEmpresa(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} color="#00324D" />
                <h3 style={{ fontSize: '1.125rem', color: '#00324D', fontWeight: '800' }}>Vincular Nueva Empresa</h3>
              </div>
              <button onClick={() => setShowModalEmpresa(false)} style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>
            <form onSubmit={handleCrearEmpresa}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Razón Social *</label>
                  <input className="form-input" required value={formEmpresa.razon_social} onChange={(e) => setFormEmpresa({ ...formEmpresa, razon_social: e.target.value })} placeholder="Ej: Innovatech Soluciones S.A.S." />
                </div>
                <div className="form-group">
                  <label className="form-label">NIT *</label>
                  <input className="form-input" required value={formEmpresa.nit} onChange={(e) => setFormEmpresa({ ...formEmpresa, nit: e.target.value })} placeholder="Ej: 900123456-1" />
                </div>
                <div className="form-group">
                  <label className="form-label">Sector Económico</label>
                  <input className="form-input" value={formEmpresa.sector_economico} onChange={(e) => setFormEmpresa({ ...formEmpresa, sector_economico: e.target.value })} placeholder="Ej: Tecnología, Contabilidad..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Correo de Acceso *</label>
                  <input className="form-input" type="email" required value={formEmpresa.email} onChange={(e) => setFormEmpresa({ ...formEmpresa, email: e.target.value })} placeholder="talento@empresa.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Contraseña (Opcional - se genera automática si se omite)</label>
                  <input className="form-input" type="password" value={formEmpresa.password} onChange={(e) => setFormEmpresa({ ...formEmpresa, password: e.target.value })} placeholder="Automática" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre del Contacto</label>
                  <input className="form-input" value={formEmpresa.contacto_nombre} onChange={(e) => setFormEmpresa({ ...formEmpresa, contacto_nombre: e.target.value })} placeholder="Nombre de RRHH" />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono de Contacto</label>
                  <input className="form-input" value={formEmpresa.contacto_telefono} onChange={(e) => setFormEmpresa({ ...formEmpresa, contacto_telefono: e.target.value })} placeholder="Ej: 3001234567" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModalEmpresa(false)} disabled={guardando}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Registrar Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================== MODAL: CREAR ESTUDIANTE =================== */}
      {showModalEstudiante && (
        <div className="modal-overlay" onClick={() => setShowModalEstudiante(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={20} color="#00324D" />
                <h3 style={{ fontSize: '1.125rem', color: '#00324D', fontWeight: '800' }}>Matricular Nuevo Estudiante</h3>
              </div>
              <button onClick={() => setShowModalEstudiante(false)} style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>
            <form onSubmit={handleCrearEstudiante}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Colegio FIJO según instrucción del usuario */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Institución Educativa</label>
                  <select className="form-select" disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}>
                    <option>Instituto Estudiantil (Única Sede Oficial)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Nombres *</label>
                  <input className="form-input" required value={formEstudiante.nombres} onChange={(e) => setFormEstudiante({ ...formEstudiante, nombres: e.target.value })} placeholder="Nombres completos" />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellidos *</label>
                  <input className="form-input" required value={formEstudiante.apellidos} onChange={(e) => setFormEstudiante({ ...formEstudiante, apellidos: e.target.value })} placeholder="Apellidos completos" />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de Documento</label>
                  <select className="form-select" value={formEstudiante.tipo_documento} onChange={(e) => setFormEstudiante({ ...formEstudiante, tipo_documento: e.target.value })}>
                    <option value="TI">Tarjeta de Identidad (TI)</option>
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Número de Documento *</label>
                  <input className="form-input" required value={formEstudiante.numero_documento} onChange={(e) => setFormEstudiante({ ...formEstudiante, numero_documento: e.target.value })} placeholder="Ej: 1023456789" />
                </div>

                <div className="form-group">
                  <label className="form-label">Grado Académico *</label>
                  <select className="form-select" value={formEstudiante.grado} onChange={(e) => setFormEstudiante({ ...formEstudiante, grado: Number(e.target.value) })}>
                    <option value={10}>Grado 10° (Etapa Formativa)</option>
                    <option value={11}>Grado 11° (Etapa Práctica)</option>
                  </select>
                </div>

                {/* Los 3 programas oficiales solicitados */}
                <div className="form-group">
                  <label className="form-label">Programa de Formación *</label>
                  <select className="form-select" value={formEstudiante.programa_formacion} onChange={(e) => setFormEstudiante({ ...formEstudiante, programa_formacion: e.target.value })}>
                    <option value="Auxiliar de Bases de Datos y Soporte TI">Auxiliar de Bases de Datos y Soporte TI</option>
                    <option value="Aprendiz Desarrollador Web Junior">Aprendiz Desarrollador Web Junior</option>
                    <option value="Auxiliar en Contaduría Pública">Auxiliar en Contaduría Pública</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Correo Institucional *</label>
                  <input className="form-input" type="email" required value={formEstudiante.email} onChange={(e) => setFormEstudiante({ ...formEstudiante, email: e.target.value })} placeholder="estudiante@estudiantil.edu.co" />
                </div>

                <div className="form-group">
                  <label className="form-label">Contraseña Asignada *</label>
                  <input className="form-input" type="password" required value={formEstudiante.password} onChange={(e) => setFormEstudiante({ ...formEstudiante, password: e.target.value })} placeholder="••••••••" />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Teléfono de Contacto</label>
                  <input className="form-input" value={formEstudiante.telefono} onChange={(e) => setFormEstudiante({ ...formEstudiante, telefono: e.target.value })} placeholder="Ej: 3101234567" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModalEstudiante(false)} disabled={guardando}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={guardando}>
                  {guardando ? 'Matriculando...' : 'Matricular Estudiante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
