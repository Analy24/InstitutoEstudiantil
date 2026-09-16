import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('instituto_estudiantil_token') || localStorage.getItem('sena_conecta_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.data.user);
        } catch (err) {
          console.warn('Sesión expirada o token inválido:', err.message);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('instituto_estudiantil_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem('instituto_estudiantil_token');
    localStorage.removeItem('sena_conecta_token');
    setToken(null);
    setUser(null);
  };

  // Cambio rápido de rol para demostraciones académicas
  const quickSwitch = async (email) => {
    return login(email, 'Password123!');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, quickSwitch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
