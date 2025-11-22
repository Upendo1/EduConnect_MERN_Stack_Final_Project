import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ResourceListPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("https://educonnect-backend.onrender.com/api/resources");

        if (!res.ok) {
          throw new Error("Failed to fetch resources");
        }

        const data = await res.json();
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading resources...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Learning Resources</h1>

      {resources.length === 0 ? (
        <p>No resources available</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((r) => (
            <div
              key={r._id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold mb-2">
                {r.title}
              </h2>

              <p className="text-gray-600 text-sm mb-4">
                {r.description?.slice(0, 80)}...
              </p>

              <div className="mt-4 flex items-center gap-4">
                {/* ✅ FIXED LINE */}
                <Link
                  to={`/resources/${r._id}`}
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
