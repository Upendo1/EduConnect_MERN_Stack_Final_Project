import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import toast from 'react-hot-toast';

export default function ResourcePreviewPage(){
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state

  useEffect(()=> {
    // Check if ID is present before trying to load
    if (!id) {
        setError("Missing resource ID.");
        return;
    }

    const load = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        const res = await api.get(/api/resources/${id});
        
        // Handle case where API returns a 200 but no data (e.g., API returns an empty object/null data)
        if (!res.data || Object.keys(res.data).length === 0) {
            setResource(null);
            toast.error('Resource not found.');
        } else {
            setResource(res.data);
        }
      } catch (err) {
        console.error("Fetch Resource Error:", err);
        toast.error('Failed to load resource data.');
        setError('Failed to load resource data. Please try again.');
        setResource(null); // Ensure resource is null on error
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, [id]);

  // --- Conditional Rendering ---

  if (loading) {
      return (
          <Card className="max-w-2xl mx-auto mt-8 p-6 text-center text-indigo-600 font-medium">
              Loading resource details...
          </Card>
      );
  }

  if (error) {
      return (
          <Card className="max-w-2xl mx-auto mt-8 p-6 text-center text-red-600 font-medium border-red-300 bg-red-50">
              {error}
          </Card>
      );
  }
  
  // This covers the case where the fetch succeeded but the resource wasn't found (status 404/no data)
  if (!resource) {
      return (
          <Card className="max-w-2xl mx-auto mt-8 p-6 text-center text-gray-700 font-medium">
              No resource found with ID: {id}.
          </Card>
      );
  }

  // --- Success Render ---
  return (
    <Card className="max-w-2xl mx-auto mt-8 p-6 shadow-lg bg-white">
      <h2 className="text-3xl font-bold text-gray-900">{resource.title}</h2>
      
      {resource.uploadedBy && (
          <p className="text-sm text-indigo-600 mt-1">
              Uploaded by: {resource.uploadedBy}
          </p>
      )}

      <p className="text-gray-700 mt-4 border-t pt-4">{resource.description}</p>
      
      <div className="mt-6 flex justify-end">
        <a 
          href={resource.fileUrl || "#"} // Safely link to fileUrl
          target="_blank" 
          rel="noreferrer" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition duration-150"
        >
          Open / Download Resource
        </a>
      </div>
    </Card>
  );
}