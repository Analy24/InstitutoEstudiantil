import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight,
  ArrowLeft,
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  X, 
  Phone,
  Send,
  BookOpen,
  Users,
  Briefcase,
  Settings
} from 'lucide-react';

const ROLES = [
  {
    id: 'ESTUDIANTE',
    label: 'Estudiante',
    descripcion: 'Consulta tus cursos, tareas, competencias y ofertas de práctica empresarial.',
    icon: GraduationCap,
    color: '#10b981',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    demoEmail: 'juan.rodriguez@estudiantil.edu.co'
  },
  {
    id: 'INSTRUCTOR',
    label: 'Instructor / Docente',
    descripcion: 'Gestiona tus cursos técnicos, registra asistencia y califica las evidencias de tus aprendices.',
    icon: BookOpen,
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
    demoEmail: 'carlos.perez@estudiantil.edu.co'
  },
  {
    id: 'EMPRESA',
    label: 'Empresa Aliada',
    descripcion: 'Publica vacantes de etapa práctica, revisa candidatos y formaliza contratos de aprendizaje.',
    icon: Building2,
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    demoEmail: 'talento@innovatech.com'
  },
  {
    id: 'ADMIN',
    label: 'Administrador',
    descripcion: 'Administra usuarios, colegios, empresas aliadas, cursos y convenios institucionales.',
    icon: Settings,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    demoEmail: 'admin@estudiantil.edu.co'
  }
];

export default function LoginPage() {
  const { login } = useAuth();
  const [step, setStep] = useState('role'); // 'role' | 'credentials'
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal solicitud alianza
  const [showModalAlianza, setShowModalAlianza] = useState(false);
  const [formAlianza, setFormAlianza] = useState({
    razon_social: '',
    nit: '',
    email: '',
    sector_economico: '',
    ciudad: 'Barranquilla',
    direccion: '',
    contacto_nombre: '',
    contacto_cargo: '',
    contacto_telefono: '',
    sitio_web: '',
    mensaje_solicitud: ''
  });
  const [enviandoAlianza, setEnviandoAlianza] = useState(false);
  const [mensajeAlianza, setMensajeAlianza] = useState(null);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setEmail(role.demoEmail || '');
    setPassword('Password123!');
    setError(null);
    setStep('credentials');
  };

  const handleQuickLogin = async (roleObj) => {
    setSelectedRole(roleObj);
    setError(null);
    setLoading(true);
    try {
      await login(roleObj.demoEmail, 'Password123!');
    } catch (err) {
      setError(err.message || 'Error al realizar el acceso rápido.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      // Verify the user's role matches what they selected
      if (selectedRole && user.rol !== selectedRole.id) {
        const { logout } = useAuth;
        setError(`Esta cuenta no corresponde al rol "${selectedRole.label}". Por favor selecciona el rol correcto.`);
        // Log out the incorrectly logged in user
        localStorage.removeItem('instituto_estudiantil_token');
        window.location.reload();
      }
    } catch (err) {
      setError(err.message || 'Correo o contraseña incorrectos. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarSolicitudAlianza = async (e) => {
    e.preventDefault();
    setEnviandoAlianza(true);
    setMensajeAlianza(null);
    try {
      const res = await api.solicitarAlianzaEmpresa(formAlianza);
      setMensajeAlianza({
        tipo: 'success',
        texto: res.message || 'Solicitud radicada con éxito. El Administrador General la revisará en breve.'
      });
      setFormAlianza({
        razon_social: '', nit: '', email: '', sector_economico: '',
        ciudad: 'Barranquilla', direccion: '', contacto_nombre: '',
        contacto_cargo: '', contacto_telefono: '', sitio_web: '', mensaje_solicitud: ''
      });
    } catch (err) {
      setMensajeAlianza({
        tipo: 'error',
        texto: err.message || 'Error al enviar la solicitud de alianza'
      });
    } finally {
      setEnviandoAlianza(false);
    }
  };

  const roleData = selectedRole ? ROLES.find(r => r.id === selectedRole.id) : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc' }}>

      {/* Columna Izquierda: Identidad Institucional */}
      <div style={{
        flex: '1',
        background: 'linear-gradient(145deg, #00324D 0%, #082132 100%)',
        color: 'white',
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow decorativo */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', left: '-5%',
          width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%'
        }} />

        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2.5rem' }}>
            <img 
              src="/logo.jpg" 
              alt="Logo Estudiantil" 
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #d4af37' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              display: 'none', width: '54px', height: '54px', borderRadius: '50%',
              backgroundColor: 'rgba(212,175,55,0.2)', alignItems: 'center',
              justifyContent: 'center', color: '#d4af37'
            }}>
              <GraduationCap size={32} />
            </div>
            <div>
              <span style={{ fontSize: '1.625rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Instituto <span style={{ color: '#d4af37' }}>Estudiantil</span>
              </span>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Educación Media Técnica con Articulación
              </div>
            </div>
          </div>

          <div style={{
            display: 'inline-block', backgroundColor: 'rgba(212, 175, 55, 0.2)',
            color: '#f9f6ea', border: '1px solid rgba(212, 175, 55, 0.4)',
            padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem',
            fontWeight: '700', marginBottom: '1rem'
          }}>
            PLATAFORMA INSTITUCIONAL OFICIAL
          </div>

          <h1 style={{ fontSize: '2.25rem', color: 'white', fontWeight: '800', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Forjando el futuro técnico y profesional de nuestros estudiantes.
          </h1>

          <p style={{ fontSize: '0.9375rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '520px', marginBottom: '2rem' }}>
            Seguimiento académico de competencias, portafolio de evidencias y vinculación empresarial para los grados 10° y 11°.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
            {[
              'Técnico en Programación y Desarrollo de Software',
              'Técnico en Asistencia Administrativa y Contable',
              'Técnico en Sistemas y Bases de Datos',
              'Técnico en Redes y Soporte de Infraestructura TI'
            ].map((prog, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f8fafc', fontSize: '0.875rem' }}>
                <CheckCircle2 size={16} color="#d4af37" />
                <span><strong>{prog}</strong></span>
              </div>
            ))}
          </div>

          {/* Tarjeta solicitar alianza */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px', padding: '1.25rem', maxWidth: '480px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Building2 size={18} color="#d4af37" />
              <strong style={{ color: '#d4af37', fontSize: '0.9375rem' }}>¿Eres una empresa y deseas vincular aprendices?</strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
              Solicita unirte a nuestra red de aliados para publicar vacantes de etapa práctica.
            </p>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setShowModalAlianza(true)}
              style={{ backgroundColor: '#d4af37', color: '#00324D', fontWeight: '700', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Building2 size={14} />
              <span>Solicitar Alianza Empresarial</span>
            </button>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2rem' }}>
          Instituto Estudiantil Colombiano • Sistema de Articulación con SENA • © 2026
        </div>
      </div>

      {/* Columna Derecha: Selector de Rol + Formulario */}
      <div style={{
        flex: '1', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '2.5rem', overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* =============== PASO 1: SELECCIÓN DE ROL =============== */}
          {step === 'role' && (
            <div>
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '56px', height: '56px', borderRadius: '50%',
                  backgroundColor: '#00324D', marginBottom: '1rem'
                }}>
                  <ShieldCheck size={28} color="#d4af37" />
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                  Bienvenido al Instituto Estudiantil
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  Selecciona tu rol para ingresar o usa el Acceso Directo de Prueba
                </p>
              </div>

              {/* Panel de Acceso Directo Sin Escribir (1-Click) */}
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '2px dashed #0284c7',
                borderRadius: '14px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  <strong style={{ fontSize: '0.9rem', color: '#0369a1' }}>
                    Acceso Directo Rápido (Entrar sin escribir usuario)
                  </strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {ROLES.map((role) => (
                    <button
                      key={`quick-${role.id}`}
                      type="button"
                      disabled={loading}
                      onClick={() => handleQuickLogin(role)}
                      style={{
                        padding: '0.6rem 0.75rem',
                        backgroundColor: role.color,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <span>Entrar {role.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  return (
                    <div
                      key={role.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '1.25rem 1.25rem',
                        border: `2px solid ${role.border}`,
                        borderRadius: '14px',
                        backgroundColor: role.bg,
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                      }}
                      onClick={() => handleSelectRole(role)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 6px 16px rgba(0,0,0,0.10)`;
                        e.currentTarget.style.borderColor = role.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                        e.currentTarget.style.borderColor = role.border;
                      }}
                    >
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        backgroundColor: role.color, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <Icon size={24} color="#ffffff" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.2rem' }}>
                          {role.label}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.4 }}>
                          {role.descripcion}
                        </div>
                      </div>
                      <ArrowRight size={20} color={role.color} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =============== PASO 2: FORMULARIO DE CREDENCIALES =============== */}
          {step === 'credentials' && roleData && (
            <div>
              {/* Cabecera */}
              <div style={{ marginBottom: '2rem' }}>
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    color: '#64748b', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600',
                    marginBottom: '1.25rem', padding: '0'
                  }}
                >
                  <ArrowLeft size={16} />
                  Cambiar rol
                </button>

                {/* Badge del rol seleccionado */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.25rem',
                  border: `2px solid ${roleData.border}`,
                  borderRadius: '12px',
                  backgroundColor: roleData.bg,
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    backgroundColor: roleData.color, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <roleData.icon size={22} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: roleData.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Acceso como
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0f172a' }}>
                      {roleData.label}
                    </div>
                  </div>
                  <CheckCircle2 size={22} color={roleData.color} style={{ marginLeft: 'auto' }} />
                </div>

                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.35rem' }}>
                  Iniciar Sesión
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Ingresa el correo institucional y la contraseña asignada para acceder.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                  color: '#991b1b', padding: '0.875rem 1rem',
                  borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem',
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem'
                }}>
                  <X size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Correo Electrónico Institucional</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="form-input"
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="correo@institución.edu.co"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      autoComplete="email"
                    />
                    <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">Contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      className="form-input"
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.875rem', marginTop: '1.5rem', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span style={{
                        display: 'inline-block', width: '16px', height: '16px',
                        border: '2px solid rgba(255,255,255,0.4)',
                        borderTopColor: '#ffffff', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }} />
                      <span>Verificando credenciales...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>Ingresar al Sistema</span>
                    </>
                  )}
                </button>
              </form>

              {/* Aviso de seguridad */}
              <div style={{
                marginTop: '1.5rem', padding: '0.875rem 1rem',
                backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: '8px', fontSize: '0.8125rem', color: '#64748b',
                display: 'flex', alignItems: 'flex-start', gap: '0.5rem'
              }}>
                <ShieldCheck size={16} color="#94a3b8" style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>
                  Tus credenciales son personales e intransferibles. Si olvidaste tu contraseña, comunícate con el área de <strong>Coordinación Académica</strong>.
                </span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL: SOLICITAR ALIANZA EMPRESARIAL */}
      {showModalAlianza && (
        <div className="modal-overlay" onClick={() => setShowModalAlianza(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={22} color="#00324D" />
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#00324D', fontWeight: '800' }}>
                    Solicitud de Alianza Empresarial
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Vinculación de empresa con el Instituto Estudiantil
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModalAlianza(false)} style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={22} />
              </button>
            </div>

            {mensajeAlianza && (
              <div style={{
                backgroundColor: mensajeAlianza.tipo === 'success' ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${mensajeAlianza.tipo === 'success' ? '#a7f3d0' : '#fecaca'}`,
                color: mensajeAlianza.tipo === 'success' ? '#065f46' : '#991b1b',
                padding: '0.875rem 1rem', borderRadius: '8px', marginBottom: '1.25rem',
                fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                {mensajeAlianza.tipo === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
                <span>{mensajeAlianza.texto}</span>
              </div>
            )}

            <form onSubmit={handleEnviarSolicitudAlianza}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Razón Social de la Empresa *</label>
                  <input className="form-input" required value={formAlianza.razon_social}
                    onChange={(e) => setFormAlianza({ ...formAlianza, razon_social: e.target.value })}
                    placeholder="Ej: Innovaciones Tecnológicas S.A.S." />
                </div>
                <div className="form-group">
                  <label className="form-label">NIT *</label>
                  <input className="form-input" required value={formAlianza.nit}
                    onChange={(e) => setFormAlianza({ ...formAlianza, nit: e.target.value })}
                    placeholder="Ej: 901234567-8" />
                </div>
                <div className="form-group">
                  <label className="form-label">Correo Electrónico Corporativo *</label>
                  <input className="form-input" type="email" required value={formAlianza.email}
                    onChange={(e) => setFormAlianza({ ...formAlianza, email: e.target.value })}
                    placeholder="talento@empresa.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Sector Económico</label>
                  <input className="form-input" value={formAlianza.sector_economico}
                    onChange={(e) => setFormAlianza({ ...formAlianza, sector_economico: e.target.value })}
                    placeholder="Ej: Desarrollo de Software, Contabilidad..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Ciudad</label>
                  <input className="form-input" value={formAlianza.ciudad}
                    onChange={(e) => setFormAlianza({ ...formAlianza, ciudad: e.target.value })}
                    placeholder="Ej: Barranquilla" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre del Contacto / RRHH *</label>
                  <input className="form-input" required value={formAlianza.contacto_nombre}
                    onChange={(e) => setFormAlianza({ ...formAlianza, contacto_nombre: e.target.value })}
                    placeholder="Nombre completo" />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono de Contacto *</label>
                  <input className="form-input" required value={formAlianza.contacto_telefono}
                    onChange={(e) => setFormAlianza({ ...formAlianza, contacto_telefono: e.target.value })}
                    placeholder="Ej: 3101234567" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Mensaje / Perfiles de Interés</label>
                  <textarea className="form-textarea" rows="3" value={formAlianza.mensaje_solicitud}
                    onChange={(e) => setFormAlianza({ ...formAlianza, mensaje_solicitud: e.target.value })}
                    placeholder="Indique qué perfiles técnicos requiere y cupos estimados..." />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModalAlianza(false)} disabled={enviandoAlianza}>Cerrar</button>
                <button type="submit" className="btn btn-primary" disabled={enviandoAlianza}>
                  <Send size={15} />
                  <span>{enviandoAlianza ? 'Enviando...' : 'Enviar Solicitud de Alianza'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
