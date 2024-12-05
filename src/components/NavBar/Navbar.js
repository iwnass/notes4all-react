"use client";

import React, { useState } from "react";
import AdminLogin from "../LoginForm/AdminLogin";
import { UserCog, CalendarDays } from "lucide-react";

export default function NavBar() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-black">
        <div className="flex items-center space-x-6 ml-6">
          <button 
            onClick={() => setShowAdminLogin(true)}
            className="text-white border border-white p-2 rounded-lg hover:bg-white hover:text-neutral-800 transition ease-in duration-300"
          >
            <UserCog />
          </button>
          <a href="/" className="text-white border border-white p-2 rounded-lg hover:bg-white hover:text-neutral-800 transition ease-in duration-300"><CalendarDays /></a>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="p-2 rounded border border-gray-400"
          />
        </div>
      </nav>

      {showAdminLogin && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAdminLogin(false)}
        >
          <div 
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminLogin onClose={() => setShowAdminLogin(false)} />
          </div>
        </div>
      )}
    </>
  );
}