"use client";

import React, { useState } from 'react';
import { FileText, Upload, X, File, ChevronDown } from 'lucide-react';

export default function FileUploadForm() {
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [category, setCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Categories for file upload
  const categories = [
    { id: 'documents', name: 'Documents' },
    { id: 'presentations', name: 'Presentations' },
    { id: 'spreadsheets', name: 'Spreadsheets' },
    { id: 'images', name: 'Images' },
    { id: 'other', name: 'Other Files' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      
      // Handle file preview based on type
      if (file.type.startsWith('image/')) {
        setFilePreviewUrl(URL.createObjectURL(file));
      } else if (file.type === 'application/pdf') {
        setFilePreviewUrl(URL.createObjectURL(file));
      } else {
        setFilePreviewUrl(null);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!filename || !description || !uploadedFile || !category) {
      alert('Please fill in all fields, select a category, and upload a file');
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('filename', filename);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('file', uploadedFile);

    console.log('Submitting:', { filename, description, category, uploadedFile });
    
    // Reset form
    setFilename('');
    setDescription('');
    setUploadedFile(null);
    setFilePreviewUrl(null);
    setCategory('');
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFilePreviewUrl(null);
  };

  const renderFilePreview = () => {
    if (!filePreviewUrl) return null;

    if (uploadedFile.type.startsWith('image/')) {
      return (
        <img 
          src={filePreviewUrl} 
          alt="File preview" 
          className="max-h-64 w-auto mx-auto object-contain rounded-md border"
        />
      );
    }

    if (uploadedFile.type === 'application/pdf') {
      return (
        <iframe 
          src={filePreviewUrl}
          className="w-full h-64 border rounded-md"
          title="PDF Preview"
        />
      );
    }

    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 rounded-md">
        <File className="h-12 w-12 text-gray-500" />
        <span className="ml-2 text-gray-700">{uploadedFile.name}</span>
      </div>
    );
  };

  return (
    <div className="max-w-full p-6 bg-neutral-700">
      <h2 className="text-2xl font-bold mb-6 flex">
        <FileText className="mr-2" /> File Upload Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="filename" className="block mb-2 font-medium">
            Filename
          </label>
          <input
            type="text"
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename"
            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block mb-2 font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the file contents"
            rows="3"
            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="relative">
          <label className="block mb-2 font-medium">
            Select Category
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-2 border rounded-md text-gray-800 bg-white flex items-center justify-between"
            >
              {category ? categories.find(cat => cat.id === category)?.name : 'Select Category'}
              <ChevronDown className="h-4 w-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border text-black rounded-md shadow-lg">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id);
                      setIsDropdownOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="file-upload" className="block mb-2 font-medium">
            Upload File
          </label>
          <div className="flex items-center">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label 
              htmlFor="file-upload" 
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition"
            >
              <Upload className="mr-2" /> Choose File
            </label>
            {uploadedFile && (
              <div className="ml-4 flex items-center">
                <span className="mr-2 text-sm truncate max-w-[150px]">{uploadedFile.name}</span>
                <button 
                  type="button"
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {uploadedFile && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">File Preview</h3>
            {renderFilePreview()}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition ease-in duration-150 flex items-center justify-center"
        >
          <Upload className="mr-2" /> Upload File
        </button>
      </form>
    </div>
  );
}