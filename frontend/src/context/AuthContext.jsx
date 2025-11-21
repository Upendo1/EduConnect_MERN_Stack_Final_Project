import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('edu_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('edu_token') || null);

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);

  const login = (data) => {
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
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = { user, token, login, logout, isTeacher: () => user?.role === 'teacher' || user?.role === 'admin' };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
