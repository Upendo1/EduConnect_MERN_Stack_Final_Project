import React, { useState, useRef } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

export default function UploadResourcePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const fileInput = useRef();
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSelect = (e) => {
    const f = e.target.files[0];
    if (f) handleFile(f);
  };

  const handle = async (e) => {
    e && e.preventDefault();
    if (!title || !description || !file) {
      toast.error('Please fill all fields and select a file');
      return;
    }

    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('file', file);

    setLoading(true);

    try {
      await api.post('/api/resources', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setProgress(pct);
        }
      });

      toast.success('Resource uploaded successfully');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <Card className="p-8 rounded-xl shadow-sm border border-gray-200 bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Upload Resource</h2>

        <form onSubmit={handle} className="space-y-6">

          {/* TITLE */}
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* FILE UPLOAD AREA */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition"
          >
            <p className="text-sm text-gray-600">Drag & drop a file here</p>
            <p className="text-xs text-gray-500 mt-1">PDF, Image, Document, etc.</p>

            <div className="mt-3">
              <input
                ref={fileInput}
                onChange={handleSelect}
                type="file"
                className="hidden"
              />
              <Button type="button" onClick={() => fileInput.current.click()}>
                Choose File
              </Button>
            </div>

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="preview"
                  className="max-h-48 mx-auto rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>

          {/* PROGRESS BAR */}
          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                style={{ width: progress + '%' }}
                className="h-full bg-indigo-600 transition-all"
              ></div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Resource'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
