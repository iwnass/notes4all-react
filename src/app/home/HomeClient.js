"use client";

import React from "react";
import NavBar from "@/components/NavBar/Navbar";
import Subjects from "@/components/Subjects/Subjects";
import { Analytics } from "@vercel/analytics/react"

export default function HomeClient() {
    return (
        <div className="bg-neutral-800 min-h-screen w-screen overflow-hidden">
            <NavBar />
            <h1 className="text-3xl text-white font-bold text-center p-10 italic">Notes4All</h1>
            <Subjects />
            <Analytics />
        </div>
    );
}; 