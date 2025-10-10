"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleSelect = (type) => {
    if (type === "internal") {
      router.push("/internal");
    } else {
      router.push("/external");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-800">
      <div className="bg-white p-10 rounded-2xl shadow-md text-center max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">WS ID Maker</h1>
        <p className="text-gray-600 mb-8">Select your department type:</p>
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => handleSelect("internal")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Internal Department
          </button>
          <button
            onClick={() => handleSelect("external")}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
          >
            External Department
          </button>
        </div>
      </div>
    </main>
  );
}
