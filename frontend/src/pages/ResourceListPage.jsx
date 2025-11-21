import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import illustration from "./illustration.png";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ResourceListPage() {
  const { user, logout } = useAuth();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // LOAD RESOURCES
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/api/resources");
        setResources(res.data);
      } catch (err) {
        console.error("RESOURCE LOAD ERROR:", err);
        setError(err);
        toast.error("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* NAVBAR */}
      <nav className="w-full py-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            EduConnect
          </Link>

          <div className="space-x-6 hidden sm:flex">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">
              Resources
            </Link>

            {user ? (
              <>
                <span className="text-gray-700 font-medium">
                  {user.name} ({user.role})
                </span>

                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 py-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Discover, Share, and Learn with
              <span className="text-indigo-600"> EduConnect</span>
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              A simple platform where teachers upload learning resources and
              students can easily access them.
            </p>

            <div className="mt-6 flex gap-4">
              <Link
                to="/"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Browse Resources
              </Link>

              {!user && (
                <Link
                  to="/login"
                  className="px-6 py-3 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
                >
                  Teacher Login
                </Link>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <img src={illustration} alt="Learning" className="w-4/5 max-w-md" />
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="bg-white py-14 border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800">
            What You Can Do
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              icon="📤"
              title="Upload Learning Materials"
              description="Teachers can upload documents, videos, and files easily."
            />
            <FeatureCard
              icon="🌍"
              title="Access From Anywhere"
              description="Students can view and download resources instantly."
            />
            <FeatureCard
              icon="📊"
              title="Organized Dashboard"
              description="Manage uploads and view statistics neatly."
            />
          </div>
        </div>
      </section>

      {/* RESOURCE LIST */}
      <section className="max-w-6xl mx-auto px-6 mt-14 pb-16">
        <h3 className="text-3xl font-bold text-gray-900 text-center">
          Latest Resources
        </h3>

        {/* ERROR */}
        {error && (
          <div className="p-6 text-center text-red-600 font-medium bg-white border rounded-xl mt-6">
            Failed to load resources.
          </div>
        )}

        {/* Resources Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {resources.map((r) => (
            <div
              key={r._id}
              className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition rounded-xl bg-white"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {r.title}
              </h3>

              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {r.description}
              </p>

              <div className="mt-4 flex items-center gap-4">
                <Link
                  to={'/resources/${r._id}'}
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  View
                </Link>

                <a
                  href={r.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-6 text-center text-gray-600 border-t bg-gray-50">
        © {new Date().getFullYear()} EduConnect. All Rights Reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="p-6 bg-gray-50 border rounded-xl shadow-sm hover:shadow-md transition">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}