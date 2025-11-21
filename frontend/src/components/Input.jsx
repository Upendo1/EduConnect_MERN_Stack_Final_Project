import React from 'react';

export default function Input({ label, ...props }) {
  return (
    <label className="block text-sm">
      {label && <div className="mb-1 text-gray-700">{label}</div>}
      <input className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200" {...props} />
    </label>
  );
}
