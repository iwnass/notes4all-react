"use client";

import React, { useState } from 'react';
import { File, Eye, Trash2, FileText, Image, FileSpreadsheet, FilePresentation } from 'lucide-react';

export default function FileListPreview() {
  const [files, setFiles] = useState([
    // Sample initial files to demonstrate the component
    // {
    //   id: '1',
    //   filename: 'Sample Document',
    //   description: 'A sample document for preview',
    //   category: 'documents',
    //   file: null,
    //   uploadDate: new Date()
    // }
  ]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'documents':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'presentations':
        return <FilePresentation className="h-6 w-6 text-green-500" />;
      case 'spreadsheets':
        return <FileSpreadsheet className="h-6 w-6 text-green-700" />;
      case 'images':
        return <Image className="h-6 w-6 text-purple-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const handleFilePreview = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    }
  };

  const handleFileDelete = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  return (
    <div className="max-w-full p-6 bg-neutral-800">
      <h2 className="text-2xl text-gray-200 font-bold mb-6 flex">
        <File className="mr-2" /> Uploaded Files
      </h2>

      {files.length === 0 ? (
        <div className="text-center text-gray-400 py-6">
          No files uploaded yet
        </div>
      ) : (
        <div className="space-y-4">
          {files.map((fileItem) => (
            <div 
              key={fileItem.id} 
              className="bg-neutral-600 p-4 rounded-md flex items-center justify-between hover:bg-neutral-500 transition"
            >
              <div className="flex items-center space-x-4 flex-grow">
                <div className="flex-shrink-0">
                  {getCategoryIcon(fileItem.category)}
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="font-medium text-white truncate">
                    {fileItem.filename}
                  </div>
                  <div className="text-sm text-gray-300 truncate">
                    {fileItem.description}
                  </div>
                  <div className="text-xs text-gray-400">
                    {fileItem.uploadDate && fileItem.uploadDate.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 uppercase">
                    {fileItem.category}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleFilePreview(fileItem.file)}
                  className="text-white hover:text-blue-300 transition"
                  title="Preview File"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleFileDelete(fileItem.id)}
                  className="text-white hover:text-red-400 transition"
                  title="Delete File"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}