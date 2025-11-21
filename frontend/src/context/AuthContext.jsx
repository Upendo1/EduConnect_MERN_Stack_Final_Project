import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('edu_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('edu_token') || null);

  useEffect(() => {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete api.defaults.headers.common['Authorization'];
  }, [token]);

  useEffect(() => {
    // global handler: when api interceptor emits unauthorized, logout locally
    const onUnauthorized = () => {
      logout();
    };
    window.addEventListener('api-unauthorized', onUnauthorized);
    const onRefreshed = (e) => { if (e?.detail?.token) { setToken(e.detail.token); localStorage.setItem('edu_token', e.detail.token); } };
    window.addEventListener('api-refreshed', onRefreshed);
    return () => { window.removeEventListener('api-unauthorized', onUnauthorized); window.removeEventListener('api-refreshed', onRefreshed); };
    return () => window.removeEventListener('api-unauthorized', onUnauthorized);
  }, []);

  const login = (data) => {
    // expects data: { user, token }
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('edu_user', JSON.stringify(data.user));
    localStorage.setItem('edu_token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('edu_user');
    localStorage.removeItem('edu_token');
    delete api.defaults.headers.common['Authorization'];
  };

  const value = { user, token, login, logout, isTeacher: () => user?.role === 'teacher' || user?.role === 'admin' };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
