"use client";

import React, { useState } from 'react';
// Make sure to import all the necessary icons at the top of your file
import { 
  File, 
  Eye, 
  Trash2, 
  ChevronDown,
  Upload,
  X,
  FileText, 
  Book,           // For algebra
  Code,           // For programming
  Network,        // For networks
  Omega,          // For Greek language
  Database,       // For information systems
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function FileUploadForm({ onFileUpload }) {
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [category, setCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!filename || !description || !uploadedFile || !category) {
      alert('Please fill in all fields, select a category, and upload a file');
      return;
    }

    // Create file object for dashboard
    const newFile = {
      id: uuidv4(),
      filename,
      description,
      category,
      file: uploadedFile,
      uploadDate: new Date()
    };

    // Call parent component's upload handler
    onFileUpload(newFile);
    
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
    <div className="max-w-full p-6 bg-neutral-800">
      <h2 className="text-2xl text-gray-200 font-bold mb-6 flex">
        <FileText className="mr-2" /> File Upload Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="filename" className="block mb-2 font-medium text-gray-200">
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
          <label htmlFor="description" className="block mb-2 font-medium text-gray-200">
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
          <label className="block mb-2 font-medium text-gray-200">
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
          <label htmlFor="file-upload" className="block mb-2 font-medium text-gray-200">
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

export function AdminDashboard() {
  const [files, setFiles] = useState([]);


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

  const handleFilePreview = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    }
  };

  const handleFileDelete = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleFileUpload = (newFile) => {
    setFiles([...files, newFile]);
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