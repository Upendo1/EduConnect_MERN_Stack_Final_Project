import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Card className="max-w-3xl mx-auto mt-10 p-8 shadow-lg rounded-2xl bg-white">
      <h2 className="text-3xl font-bold text-gray-800">
        Welcome, {user?.name}
      </h2>

      <p className="text-gray-500 text-sm mt-1">
        Role: <span className="font-medium text-gray-700">{user?.role}</span>
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          to="/"
          className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition"
        >
          Browse Resources
        </Link>

        {user?.role === 'teacher' && (
          <Link
            to="/upload"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Upload Resource
          </Link>
        )}
      </div>
    </Card>
  );
}
