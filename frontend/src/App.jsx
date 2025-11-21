import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import UploadResourcePage from './pages/UploadResourcePage';
import ResourceListPage from './pages/ResourceListPage';
import ResourcePreviewPage from './pages/ResourcePreviewPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

export default function App(){
  const { user, logout } = useAuth();
  return (
    <>
      <nav className="container">
        <div style={{flex:1}}>
          <Link to="/">EduConnect</Link>
        </div>
        <div style={{display:'flex', gap:8}}>
          {user ? (
            <>
              <span>{user.name} ({user.role})</span>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<ResourceListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute roles={['teacher','admin']}><UploadResourcePage /></ProtectedRoute>} />
          <Route path="/resources/:id" element={<ProtectedRoute><ResourcePreviewPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}
