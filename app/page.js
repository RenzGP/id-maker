"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [selection, setSelection] = useState("internal");

  const handleNavigate = () => {
    router.push(`/${selection}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-center px-6">
      <h1 className="text-4xl font-bold mb-10 text-gray-900">
        WS ID Maker System
      </h1>

      <div className="flex gap-6 mb-10">
        <button
          onClick={() => setSelection("internal")}
          className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md ${
            selection === "internal"
              ? "bg-blue-600 text-white scale-105 shadow-blue-300"
              : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          Internal Employee
        </button>

        <button
          onClick={() => setSelection("external")}
          className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md ${
            selection === "external"
              ? "bg-green-600 text-white scale-105 shadow-green-300"
              : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          External Employee
        </button>
      </div>

      <button
        onClick={handleNavigate}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-all duration-300"
      >
        Proceed →
      </button>
    </main>
  );
}
