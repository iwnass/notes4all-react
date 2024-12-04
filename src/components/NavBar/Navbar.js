"use client";

import React from "react";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-neutral-800">
      <div className="flex items-center space-x-6 ml-6">
        <a href="/" className="text-white border border-white p-2 rounded-lg hover:bg-white hover:text-neutral-800 transition ease-in duration-300">Home</a>
        <a href="/admin" className="text-white border border-white p-2 rounded-lg hover:bg-white hover:text-neutral-800 transition ease-in duration-300">Admin</a>
        <a href="/" className="text-white border border-white p-2 rounded-lg hover:bg-white hover:text-neutral-800 transition ease-in duration-300">Schedule</a>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="p-2 rounded border border-gray-400"
        />
      </div>
    </nav>
  );
}
