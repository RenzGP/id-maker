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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <h1 className="text-3xl font-bold mb-8">WS ID Maker System</h1>

      <div className="flex gap-6 mb-8">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="employeeType"
            value="internal"
            checked={selection === "internal"}
            onChange={() => setSelection("internal")}
          />
          Internal Employee
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="employeeType"
            value="external"
            checked={selection === "external"}
            onChange={() => setSelection("external")}
          />
          External Employee
        </label>
      </div>

      <button
        onClick={handleNavigate}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
      >
        Proceed
      </button>
    </main>
  );
}
