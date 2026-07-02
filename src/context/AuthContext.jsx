import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [type, setType]   = useState(() => localStorage.getItem('auth_type') || null);
  const [loading, setLoading] = useState(false);

  const donorLogin = async (email, password) => {
    const { data } = await api.post('/donor/login', { email, password });
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.donor));
    localStorage.setItem('auth_type', 'donor');
    setUser(data.donor);
    setType('donor');
    return data;
  };

  const donorGoogleLogin = async (access_token) => {
    const { data } = await api.post('/donor/google', { access_token });
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.donor));
    localStorage.setItem('auth_type', 'donor');
    setUser(data.donor);
    setType('donor');
    return data;
  };

  const donorRegister = async (formData) => {
    const { data } = await api.post('/donor/register', formData);
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.donor));
    localStorage.setItem('auth_type', 'donor');
    setUser(data.donor);
    setType('donor');
    return data;
  };

  const adminLogin = async (email, password) => {
    const { data } = await api.post('/admin/login', { email, password });
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.admin));
    localStorage.setItem('auth_type', 'admin');
    setUser(data.admin);
    setType('admin');
    return data;
  };

  const resendVerification = async (email) => {
    const { data } = await api.post('/donor/email/resend', { email });
    return data;
  };

  const logout = async () => {
    try {
      const endpoint = type === 'admin' ? '/admin/logout' : '/donor/logout';
      await api.post(endpoint);
    } catch (_) {}
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_type');
    setUser(null);
    setType(null);
  };

  const refreshUser = async () => {
    if (!localStorage.getItem('auth_token')) return;
    try {
      const endpoint = type === 'admin' ? '/admin/me' : '/donor/me';
      const { data } = await api.get(endpoint);
      const updated = type === 'admin' ? data.admin : data.donor;
      localStorage.setItem('auth_user', JSON.stringify(updated));
      setUser(updated);
      return data;
    } catch (_) {}
  };

  return (
    <AuthContext.Provider value={{ user, type, loading, donorLogin, donorGoogleLogin, donorRegister, adminLogin, logout, refreshUser, resendVerification, isAdmin: type === 'admin', isDonor: type === 'donor', isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
