import React from 'react';

export default function Button({ children, className = '', ...props }) {
  return (
    <button className={"px-4 py-2 rounded-md shadow-sm bg-blue-600 text-white text-sm hover:bg-blue-700 " + className} {...props}>
      {children}
    </button>
  );
}
