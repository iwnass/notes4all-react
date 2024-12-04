"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminClient() {
  const router = useRouter();

  useEffect(() => {
    // Check for admin token on component mount
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      // Redirect to home page if no token exists
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    // Remove token and redirect to home
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-neutral-800 shadow-md rounded-lg p-6">
        <p className="mb-4">Welcome to the admin control panel.</p>
        <div 
          variant="destructive" 
          onClick={handleLogout}
          className="text-white text-center mt-4 p-2 border rounded-lg w-20 hover:bg-white transition ease-in duration-300 hover:text-black"
        >
          Logout
        </div>
      </div>
    </div>
  );
}