"use client";

// Remove Lucide icons and use simpler elements since there might be import issues
const SplashScreen = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center overflow-hidden">
      {/* Vending Machine Frame */}
      <div className="relative w-64 h-96 bg-gray-200 rounded-lg shadow-2xl border-4 border-gray-300">
        {/* Machine Header */}
        <div className="absolute top-4 w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 animate-bounce">
            Smart Vending
          </h1>
        </div>

        {/* Display Screen */}
        <div className="absolute top-20 left-6 right-6 h-24 bg-blue-100 rounded-md flex items-center justify-center border-2 border-blue-300">
          <p className="text-blue-600 font-semibold animate-pulse">
            Welcome...
          </p>
        </div>

        {/* Product Icons - Using emoji instead of Lucide icons */}
        <div className="absolute top-52 w-full grid grid-cols-3 gap-4 px-4">
          <div className="flex justify-center animate-bounce delay-100">
            <span className="text-2xl">🥤</span>
          </div>
          <div className="flex justify-center animate-bounce delay-200">
            <span className="text-2xl">☕</span>
          </div>
          <div className="flex justify-center animate-bounce delay-300">
            <span className="text-2xl">🍕</span>
          </div>
        </div>

        {/* Dispenser Slot */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-12 bg-gray-700 rounded-t-md">
          <div className="w-28 h-2 bg-black mx-auto mt-2"></div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-8 text-white text-lg font-semibold animate-pulse">
        Loading your experience...
      </div>
    </div>
  );
};

export default SplashScreen;
