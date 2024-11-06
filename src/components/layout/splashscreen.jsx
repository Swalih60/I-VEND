// components/SplashScreen.jsx
"use client";

import { useEffect, useState } from "react";

const SplashScreen = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      onComplete(); // Call the function to handle navigation
    }, 3000); // 3-second loading time

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-blue-500 text-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-md">
          <span className="text-4xl font-bold text-blue-500">🧃</span>{" "}
          {/* Vending machine icon */}
        </div>
        <h1 className="text-2xl font-semibold">Vending Machine</h1>
        <p className="text-lg">Loading...</p>
        <div className="mt-4 flex space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-75"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
