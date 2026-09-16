import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  const getRoleBadge = (rol) => {
    switch (rol) {
      case 'INSTRUCTOR':
        return <span className="badge badge-primary">Profesor / Instructor</span>;
      case 'ESTUDIANTE':
        return <span className="badge badge-info">Estudiante</span>;
      case 'EMPRESA':
        return <span className="badge badge-warning">Empresa Aliada</span>;
      case 'ADMIN':
        return <span className="badge badge-success">Administrador General</span>;
      default:
        return <span className="badge">{rol}</span>;
    }
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src="/logo.jpg" 
            alt="Logo Estudiantil" 
            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4af37' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{
            display: 'none',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#00324D',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d4af37'
          }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#00324D', letterSpacing: '-0.5px' }}>
                Instituto <span style={{ color: '#d4af37' }}>Estudiantil</span>
              </span>
              <span style={{
                fontSize: '0.6875rem',
                fontWeight: '700',
                backgroundColor: '#f9f6ea',
                color: '#b5952f',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid #d4af37'
              }}>
                Educación y Excelencia
              </span>
            </div>
            <p style={{ fontSize: '0.6875rem', color: '#64748b' }}>
              Plataforma de Gestión Académica y Vinculación Empresarial
            </p>
          </div>
        </div>

        {/* User profile & Logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a' }}>
                  {user.nombre}
                </span>
                {getRoleBadge(user.rol)}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</span>
            </div>

            <button
              onClick={logout}
              className="btn btn-outline btn-sm"
              title="Cerrar sesión para salir o ingresar con otro rol"
              style={{
                borderColor: '#fecaca',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem'
              }}
            >
              <LogOut size={15} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
