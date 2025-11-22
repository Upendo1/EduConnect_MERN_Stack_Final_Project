[09:35, 22/11/2025] Allan PLP: import React, { useEffect, useState } from "react";
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

  // Load resources only if logged in
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/api/resources");
        setResources(res.data);
      } catch (err) …
[10:10, 22/11/2025] Allan PLP: preview page import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ResourcePreviewPage() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(/api/resources/${id});
        setResource(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load resource");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP BAR */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            EduConnect
          </Link>

          <Link
            to="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
          >
            Back to Resources
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-6 py-14">
        {loading ? (
          <div className="bg-white p-8 rounded-xl shadow text-center text-gray-600 text-lg">
            Loading resource…
          </div>
        ) : !resource ? (
          <div className="bg-white p-8 rounded-xl shadow text-center text-red-500 text-lg">
            Resource not found.
          </div>
        ) : (
          <div className="bg-white p-10 rounded-2xl shadow-md">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">{resource.title}</h1>

            {/* Description */}
            <p className="text-gray-700 text-lg mt-4 leading-relaxed">
              {resource.description}
            </p>

            {/* File Info Box */}
            <div className="mt-8 p-6 bg-gray-100 rounded-xl border border-gray-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Attached File</h3>

              <div className="flex items-center justify-between">
                <p className="text-gray-700">
                  {resource.fileUrl ? "A file is available for viewing or download." : "No file provided."}
                </p>

                {resource.fileUrl && (
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    Open / Download
                  </a>
                )}
              </div>
            </div>

            {/* Back Link */}
            <div className="mt-10 text-center">
              <Link
                to="/"
                className="text-indigo-600 hover:underline text-lg font-medium"
              >
                ← Back to all resources
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-500 border-t mt-10 bg-gray-50">
        © {new Date().getFullYear()} EduConnect. All Rights Reserved.
      </footer>
    </div>
  );
}