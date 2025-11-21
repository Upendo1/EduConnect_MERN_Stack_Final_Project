import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard(){
  const { user } = useAuth();
  return (
    <div className="card">
      <h2>Welcome, {user?.name}</h2>
      <p>Role: {user?.role}</p>
      <div style={{marginTop:12}}>
        <Link to="/">Browse Resources</Link>
        {' | '}
        {user?.role === 'teacher' && <Link to="/upload">Upload Resource</Link>}
      </div>
    </div>
  );
}
