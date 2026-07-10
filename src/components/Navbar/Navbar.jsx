import { useEffect, useState } from "react";
import handEngine from "../../engine/HandEngine";

function Navbar() {
  const [cameraOnline, setCameraOnline] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setCameraOnline(handEngine.getHandDetected());
    }, 200);

    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-40 min-h-16 border-b border-white/10 bg-[#070b16]/85 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 py-3">
      <div className="min-w-0">
        <h2 className="font-semibold text-lg sm:text-xl truncate">
          Control Center
        </h2>
        <p className="text-xs text-gray-500 md:hidden">
          AI Hand OS
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs sm:text-sm shrink-0">
        <span
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
            cameraOnline
              ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
              : "bg-red-500"
          }`}
        />

        <span
          className={`hidden xs:inline ${
            cameraOnline ? "text-green-300" : "text-gray-300"
          }`}
        >
          {cameraOnline ? "Hand Online" : "Camera Offline"}
        </span>

        <span className="xs:hidden text-gray-300">
          {cameraOnline ? "Online" : "Offline"}
        </span>
      </div>
    </header>
  );
}

export default Navbar;