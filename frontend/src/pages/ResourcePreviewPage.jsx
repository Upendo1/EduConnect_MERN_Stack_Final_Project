import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ResourcePreviewPage(){
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  useEffect(()=> {
    const load = async () => {
      try {
        const res = await axios.get(`/api/resources/${id}`);
        setResource(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);
  if (!resource) return <div className="card">Loading...</div>;
  return (
    <div className="card">
      <h2>{resource.title}</h2>
      <p>{resource.description}</p>
      <div>
        <a href={resource.fileUrl} target="_blank" rel="noreferrer">Open / Download</a>
      </div>
    </div>
  );
}
