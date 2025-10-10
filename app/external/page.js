"use client";
import React, { useState } from "react";

export default function ExternalIDPage() {
  const [department, setDepartment] = useState("Engineering");
  const [fontSize, setFontSize] = useState(13);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">External Employee ID</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-72">
          <label className="block mb-3">
            Department:
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
            />
          </label>

          <label className="block mb-3">
            Font Size:
            <input
              type="number"
              value={fontSize}
              min="10"
              max="24"
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
            />
          </label>
        </div>

        {/* ID Preview */}
        <div
          className="relative w-60 h-88 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 border border-gray-300"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <div className="absolute top-4 text-center">
            <h2 className="text-xl font-bold text-blue-800">WORKSAVERS</h2>
            <p style={{ fontSize: fontSize }} className="text-gray-600">
              {department}
            </p>
          </div>

          <div className="mt-16 mb-4 w-20 h-20 bg-gray-300 rounded-md" />
          <p style={{ fontSize: fontSize + 2 }} className="font-semibold">
            Maria Santos
          </p>
          <p style={{ fontSize: fontSize }}>Consultant</p>
        </div>
      </div>
    </main>
  );
}
