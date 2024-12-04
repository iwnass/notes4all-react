"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, AlertCircle, X } from 'lucide-react';

export default function AdminLogin({ onClose }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Simple check against environment variables
      const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

      if (!adminUsername || !adminPassword) {
        setErrors({ 
          general: 'Admin credentials not configured' 
        });
        setIsLoading(false);
        return;
      }

      if (username !== adminUsername || password !== adminPassword) {
        setErrors({ 
          general: 'Invalid credentials' 
        });
        setIsLoading(false);
        return;
      }

      // Successful login logic
      const token = btoa(`${username}:${Date.now()}`);
      
      localStorage.setItem('adminToken', token);
      
      router.push('/admin');
      onClose();
    } catch (error) {
      setErrors({ 
        general: 'Login failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mr-[20rem] m-[10rem] p-8 bg-neutral-800 rounded-lg shadow-lg relative">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X className="h-6 w-6" />
      </button>
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Admin Login</h2>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="username" className="block mb-2 flex items-center text-white">
            <User className="h-5 w-5 mr-2 inline" /> Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Admin username"
            className="w-full px-4 py-3 text-gray-800 border rounded-md"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 flex items-center text-white">
            <Lock className="h-4 w-4 mr-2 inline" /> Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-3 py-2 text-gray-800 border rounded-md"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-800"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {errors.general && (
          <div className="text-red-500 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 mr-2" /> {errors.general}
          </div>
        )}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}