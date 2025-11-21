import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ResourceListPage(){
  const [resources, setResources] = useState([]);
  useEffect(()=> {
    const load = async () => {
      try {
        const res = await axios.get('/api/resources');
        setResources(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);
  return (
    <div>
      <h2>Resources</h2>
      <div style={{display:'grid', gap:12}}>
        {resources.map(r=>(
          <div key={r._id} className="card">
            <h3>{r.title}</h3>
            <p>{r.description}</p>
            <div className="flex">
              <Link to={`/resources/${r._id}`}>View</Link>
              <a href={r.fileUrl} target="_blank" rel="noreferrer">Download</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
