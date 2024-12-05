"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar/Navbar';

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
    <div className="bg-neutral-800 min-h-screen min-w-full overflow-hidden">
      <NavBar />
      <div className="container mx-auto">
      <h1 className="text-3xl text-white font-bold mb-6 pt-5 px-5">Admin Dashboard</h1>
      <div className="bg-neutral-700 shadow-md rounded-lg p-6">
        <p className="mb-4 text-gray-300 italic">You are logged in as an admin.</p>
        
        <button
          variant="destructive" 
          onClick={handleLogout}
          className="text-white text-center mt-4 p-2 border rounded-lg w-20 hover:bg-white transition ease-in duration-300 hover:text-black"
        >
          Logout
        </button>
      </div>
      </div>
    </div>
  );
}