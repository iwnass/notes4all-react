"use client";

import React, { useState, useEffect } from 'react';
import { 
  File, 
  Eye, 
  Trash2, 
  Upload,
  X,
  FileText, 
  Book,
  Code,
  Network,
  Omega,
  Database,
} from 'lucide-react';

export function FileUploadForm({ onFileUpload }) {
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Categories for file upload
  const categories = [
    { id: 'Άλγεβρα', name: 'Άλγεβρα' },
    { id: 'Προγραμματισμός', name: 'Προγραμματισμός' },
    { id: 'Δίκτυα', name: 'Δίκτυα' },
    { id: 'Νέα Ελληνικά', name: 'Νέα Ελληνικά' },
    { id: 'Πληροφοριακά Συστήματα', name: 'Πληροφοριακά Συστήματα' }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!filename || !description || !uploadedFile || !category) {
      alert('Please fill in all fields, select a category, and upload a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('filename', filename);
    formData.append('description', description);
    formData.append('category', category);

    try {
      setIsUploading(true);
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const responseData = await response.json();

      // Call parent component's upload handler
      onFileUpload(responseData);
      
      // Reset form
      setFilename('');
      setDescription('');
      setUploadedFile(null);
      setFilePreviewUrl(null);
      setCategory('');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('File upload failed');
    } finally {
      setIsUploading(false);
    }
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
    <div className="max-w-full p-6 bg-neutral-800">
      <h2 className="text-2xl text-gray-200 font-bold mb-6 flex">
        <FileText className="mr-2" /> File Upload Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="filename" className="block text-gray-300 mb-2">File Name</label>
          <input
            type="text"
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full p-2 bg-neutral-700 text-white rounded-md"
            placeholder="Enter file name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-300 mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-neutral-700 text-white rounded-md"
            placeholder="Enter file description"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-gray-300 mb-2">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 bg-neutral-700 text-white rounded-md"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="file" className="block text-gray-300 mb-2">Upload File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full p-2 bg-neutral-700 text-white rounded-md file:mr-4 file:rounded-md file:border-0 file:bg-orange-600 file:text-white file:px-4 file:py-2"
          />
        </div>

        {filePreviewUrl && (
          <div className="mt-4">
            {renderFilePreview()}
            <button
              type="button"
              onClick={removeFile}
              className="mt-2 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
            >
              <X className="mr-2 inline" /> Remove File
            </button>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition ease-in duration-150 flex items-center justify-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? 'Uploading...' : (<><Upload className="mr-2" /> Upload File</>)}
        </button>
      </form>
    </div>
  );
}

export function AdminDashboard() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/files');
        
        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }

        const data = await response.json();
        setFiles(data.map(file => ({
          ...file,
          uploadDate: new Date(file.uploadDate)
        })));
        setError(null);
      } catch (err) {
        console.error('Failed to fetch files:', err);
        setError('Failed to load files');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleFileDelete = async (id) => {
    try {
      const response = await fetch(`/api/files/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setFiles(files.filter(file => file.id !== id));
    } catch (err) {
      console.error('Failed to delete file:', err);
      alert('Failed to delete file');
    }
  };

  const handleFilePreview = (file) => {
    // Open file in new tab
    window.open(file.path, '_blank');
  };

  const handleFileUpload = (newFile) => {
    setFiles([...files, newFile]);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Άλγεβρα':
        return <Book className="h-6 w-6 text-blue-500" />;
      case 'Προγραμματισμός':
        return <Code className="h-6 w-6 text-green-500" />;
      case 'Δίκτυα':
        return <Network className="h-6 w-6 text-green-700" />;
      case 'Νέα Ελληνικά':
        return <Omega className="h-6 w-6 text-purple-500" />;
      case 'Πληροφοριακά Συστήματα':
        return <Database className="h-6 w-6 text-orange-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="flex">
      <div className="w-1/3">
        <FileUploadForm onFileUpload={handleFileUpload} />
      </div>
      <div className="w-2/3 max-w-full p-6 bg-neutral-800">
        <h2 className="text-2xl text-gray-200 font-bold mb-6 flex">
          <File className="mr-2" /> Uploaded Files
        </h2>

        {isLoading ? (
          <div className="text-center text-gray-400 py-6">
            Loading files...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-6">
            {error}
          </div>
        ) : files.length === 0 ? (
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
                      {fileItem.uploadDate.toLocaleString()}
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
    </div>
  );
}

export default AdminDashboard;