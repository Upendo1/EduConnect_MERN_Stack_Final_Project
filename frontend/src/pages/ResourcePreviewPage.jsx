import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Card from "../components/Card";
import toast from "react-hot-toast";

export default function ResourcePreviewPage() {
  const { id } = useParams();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResource = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ FIXED: use backticks for template string
        const res = await api.get(`/api/resources/${id}`);
        setResource(res.data);
      } catch (err) {
        console.error(err);
        setError(err);
        toast.error("Failed to load resource");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadResource();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <Card className="p-6 text-center text-gray-600">
          Loading resource...
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <Card className="p-6 text-center text-red-600">
          Failed to load resource.
        </Card>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <Card className="p-6 text-center text-gray-600">
          No resource found.
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 space-y-6">
      <Card className="p-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {resource.title}
        </h1>

        <p className="text-gray-600">
          {resource.description}
        </p>

        {resource.fileUrl && (
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 text-indigo-600 font-medium hover:underline"
          >
            Download resource
          </a>
        )}

        <div className="mt-6">
          <Link
            to="/resources"
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            ← Back to resources
          </Link>
        </div>
      </Card>
    </div>
  );
}
