import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import toast from 'react-hot-toast';

export default function ResourcePreviewPage() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const res = await api.get(`/api/resources/${id}`);   // ✅ FIXED
        setResource(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load resource');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading)
    return <Card className="max-w-2xl mx-auto mt-8">Loading...</Card>;

  if (!resource)
    return <Card className="max-w-2xl mx-auto mt-8">No resource found.</Card>;

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold">{resource.title}</h2>
      <p className="text-gray-700 mt-2">{resource.description}</p>
      <div className="mt-4">
        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Open / Download
        </a>
      </div>
    </Card>
  );
}
