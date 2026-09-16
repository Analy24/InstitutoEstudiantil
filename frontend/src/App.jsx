import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import InstructorDashboard from './pages/InstructorDashboard';
import StudentProfile from './pages/StudentProfile';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';

function MainRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        color: '#00324D',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '1.25rem',
        fontWeight: '700'
      }}>
        Cargando Instituto Estudiantil...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      <Navbar />

      <main style={{ flex: 1 }}>
        {user.rol === 'INSTRUCTOR' && <InstructorDashboard />}
        {user.rol === 'ESTUDIANTE' && <StudentProfile />}
        {user.rol === 'EMPRESA' && <CompanyDashboard />}
        {user.rol === 'ADMIN' && <AdminDashboard />}
      </main>

      <footer style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '1.25rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#64748b'
      }}>
        Instituto Estudiantil Colombiano • Educación y Excelencia • Fundado 2024
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}
