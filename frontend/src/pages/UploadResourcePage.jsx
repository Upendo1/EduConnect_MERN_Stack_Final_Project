import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UploadResourcePage(){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select a file');
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('description', description);
    try {
      await axios.post('/api/resources', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="card" style={{maxWidth:720, margin:'24px auto'}}>
      <h2>Upload Resource</h2>
      <form onSubmit={handle} style={{display:'grid', gap:8}}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
