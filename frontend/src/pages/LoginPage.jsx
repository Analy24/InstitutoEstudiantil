import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  X, 
  Phone, 
  MapPin, 
  Globe, 
  Send 
} from 'lucide-react';

export default function LoginPage() {
  const { login, quickSwitch } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal Solicitud de Alianza Empresarial
  const [showModalAlianza, setShowModalAlianza] = useState(false);
  const [formAlianza, setFormAlianza] = useState({
    razon_social: '',
    nit: '',
    email: '',
    sector_economico: '',
    ciudad: 'Bogotá D.C.',
    direccion: '',
    contacto_nombre: '',
    contacto_cargo: '',
    contacto_telefono: '',
    sitio_web: '',
    mensaje_solicitud: ''
  });
  const [enviandoAlianza, setEnviandoAlianza] = useState(false);
  const [mensajeAlianza, setMensajeAlianza] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Error de autenticación. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (demoEmail) => {
    setError(null);
    setLoading(true);
    try {
      await quickSwitch(demoEmail);
    } catch (err) {
      setError(err.message || 'Error al autenticar usuario');
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
        razon_social: '',
        nit: '',
        email: '',
        sector_economico: '',
        ciudad: 'Bogotá D.C.',
        direccion: '',
        contacto_nombre: '',
        contacto_cargo: '',
        contacto_telefono: '',
        sitio_web: '',
        mensaje_solicitud: ''
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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#f8fafc'
    }}>
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
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%'
        }}></div>

        <div>
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
              display: 'none',
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#00324D',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d4af37'
            }}>
              <GraduationCap size={32} />
            </div>
            <div>
              <span style={{ fontSize: '1.625rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Instituto <span style={{ color: '#d4af37' }}>Estudiantil</span>
              </span>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Educación y Excelencia
              </div>
            </div>
          </div>

          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(212, 175, 55, 0.2)',
            color: '#f9f6ea',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            PLATAFORMA INSTITUCIONAL
          </div>

          <h1 style={{ fontSize: '2.4rem', color: 'white', fontWeight: '800', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Forjando el futuro técnico y profesional de nuestros estudiantes.
          </h1>

          <p style={{ fontSize: '0.9375rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '520px', marginBottom: '2rem' }}>
            Seguimiento académico de competencias, portafolio de evidencias y vinculación empresarial para los grados 10° y 11° en nuestros programas técnicos oficiales:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f8fafc', fontSize: '0.875rem' }}>
              <CheckCircle2 size={18} color="#d4af37" />
              <span><strong>Auxiliar de Bases de Datos y Soporte TI</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f8fafc', fontSize: '0.875rem' }}>
              <CheckCircle2 size={18} color="#d4af37" />
              <span><strong>Aprendiz Desarrollador Web Junior</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f8fafc', fontSize: '0.875rem' }}>
              <CheckCircle2 size={18} color="#d4af37" />
              <span><strong>Auxiliar en Contaduría Pública</strong></span>
            </div>
          </div>

          {/* Tarjeta de Invitación a Empresas */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem',
            maxWidth: '500px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Building2 size={18} color="#d4af37" />
              <strong style={{ color: '#d4af37', fontSize: '0.9375rem' }}>¿Eres una Empresa y deseas vincular aprendices?</strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
              Solicita unirte a nuestra red de aliados para publicar vacantes de etapa práctica y seleccionar los mejores perfiles de estudiantes.
            </p>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setShowModalAlianza(true)}
              style={{
                backgroundColor: '#d4af37',
                color: '#00324D',
                fontWeight: '700',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Building2 size={14} />
              <span>Solicitar Alianza Empresarial</span>
            </button>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Instituto Estudiantil Colombiano • Educación y Excelencia
        </div>
      </div>

      {/* Columna Derecha: Formulario de Acceso y Demo Buttons */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem'
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              Iniciar Sesión
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Ingresa tus credenciales asignadas por el Instituto Estudiantil
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1.25rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="ejemplo@estudiantil.edu.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Ingresar al Sistema'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Selección de Rol para Ingreso */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed #cbd5e1' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              fontWeight: '800',
              color: '#00324D',
              marginBottom: '1.25rem'
            }}>
              <span>Ingresar como...</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                style={{ 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  backgroundColor: 'white', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                onClick={() => handleDemoClick('admin@estudiantil.edu.co')}
                disabled={loading}
              >
                <div style={{ fontSize: '1.5rem' }}>⚙️</div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Administrador</span>
              </button>
              
              <button
                type="button"
                style={{ 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  backgroundColor: 'white', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                onClick={() => handleDemoClick('carlos.perez@estudiantil.edu.co')}
                disabled={loading}
              >
                <div style={{ fontSize: '1.5rem' }}>👨‍🏫</div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Instructor</span>
              </button>

              <button
                type="button"
                style={{ 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  backgroundColor: 'white', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                onClick={() => handleDemoClick('juan.rodriguez@estudiantil.edu.co')}
                disabled={loading}
              >
                <div style={{ fontSize: '1.5rem' }}>🎓</div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Estudiante</span>
              </button>

              <button
                type="button"
                style={{ 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  backgroundColor: 'white', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                onClick={() => handleDemoClick('talento@innovatech.com')}
                disabled={loading}
              >
                <div style={{ fontSize: '1.5rem' }}>🏢</div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Empresa</span>
              </button>
            </div>
          </div>
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
              <button onClick={() => setShowModalAlianza(false)} style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            {mensajeAlianza && (
              <div style={{
                backgroundColor: mensajeAlianza.tipo === 'success' ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${mensajeAlianza.tipo === 'success' ? '#a7f3d0' : '#fecaca'}`,
                color: mensajeAlianza.tipo === 'success' ? '#065f46' : '#991b1b',
                padding: '0.875rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {mensajeAlianza.tipo === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
                <span>{mensajeAlianza.texto}</span>
              </div>
            )}

            <form onSubmit={handleEnviarSolicitudAlianza}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Razón Social de la Empresa *</label>
                  <input
                    className="form-input"
                    required
                    value={formAlianza.razon_social}
                    onChange={(e) => setFormAlianza({ ...formAlianza, razon_social: e.target.value })}
                    placeholder="Ej: Innovaciones Tecnológicas S.A.S."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">NIT *</label>
                  <input
                    className="form-input"
                    required
                    value={formAlianza.nit}
                    onChange={(e) => setFormAlianza({ ...formAlianza, nit: e.target.value })}
                    placeholder="Ej: 901234567-8"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Correo Electrónico Corporativo *</label>
                  <input
                    className="form-input"
                    type="email"
                    required
                    value={formAlianza.email}
                    onChange={(e) => setFormAlianza({ ...formAlianza, email: e.target.value })}
                    placeholder="talento@empresa.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sector Económico</label>
                  <input
                    className="form-input"
                    value={formAlianza.sector_economico}
                    onChange={(e) => setFormAlianza({ ...formAlianza, sector_economico: e.target.value })}
                    placeholder="Ej: Desarrollo de Software, Contabilidad..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ciudad</label>
                  <input
                    className="form-input"
                    value={formAlianza.ciudad}
                    onChange={(e) => setFormAlianza({ ...formAlianza, ciudad: e.target.value })}
                    placeholder="Ej: Bogotá D.C."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nombre del Contacto / RRHH *</label>
                  <input
                    className="form-input"
                    required
                    value={formAlianza.contacto_nombre}
                    onChange={(e) => setFormAlianza({ ...formAlianza, contacto_nombre: e.target.value })}
                    placeholder="Nombre completo"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Teléfono de Contacto *</label>
                  <input
                    className="form-input"
                    required
                    value={formAlianza.contacto_telefono}
                    onChange={(e) => setFormAlianza({ ...formAlianza, contacto_telefono: e.target.value })}
                    placeholder="Ej: 3101234567"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Mensaje / Perfiles de Interés</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    value={formAlianza.mensaje_solicitud}
                    onChange={(e) => setFormAlianza({ ...formAlianza, mensaje_solicitud: e.target.value })}
                    placeholder="Indique qué perfiles técnicos requiere (Desarrollo Web, Bases de Datos, Contabilidad) y cupos estimados..."
                  ></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModalAlianza(false)} disabled={enviandoAlianza}>
                  Cerrar
                </button>
                <button type="submit" className="btn btn-primary" disabled={enviandoAlianza}>
                  <Send size={15} />
                  <span>{enviandoAlianza ? 'Enviando...' : 'Enviar Solicitud de Alianza'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
