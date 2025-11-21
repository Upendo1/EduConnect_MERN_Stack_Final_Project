import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import toast from 'react-hot-toast';

export default function ResourceListPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/resources');
        setResources(res.data);
      } catch (err) {
        console.error(err);
        setError(err);
        toast.error('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">📚 Resources</h1>

      {/* Loading state */}
      {loading && (
        <Card className="p-6 text-center text-gray-600">
          Loading resources...
        </Card>
      )}

      {/* Error state */}
      {error && (
        <Card className="p-6 text-center text-red-600 font-medium">
          Failed to load resources.
        </Card>
      )}

      {/* Resources Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((r) => (
          <Card
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
                to={`/resources/${r._id}`}
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
          </Card>
        ))}
      </div>

      {/* No resources */}
      {!loading && resources.length === 0 && (
        <Card className="p-6 text-center text-gray-600">
          No resources available yet.
        </Card>
      )}
    </div>
  );
}
