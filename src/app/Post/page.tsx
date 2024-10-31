"use client"
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const MyEditor: React.FC = () => {
  const [value, setValue] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Handle file upload
      console.log(files);
    }
  };

  return (
    <div>
      <ReactQuill
        value={value}
        onChange={setValue}
        modules={{
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'], // Include image upload option
            ['emoji'], // You might need a custom emoji module
          ],
        }}
      />
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default MyEditor;
