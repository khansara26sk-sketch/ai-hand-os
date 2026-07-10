import { useEffect, useState } from "react";
import handEngine from "../../engine/HandEngine";

function StatusBar() {
  const [system, setSystem] = useState({
    fps: 0,
    handDetected: false,
    gesture: "none",
    handedness: null,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setSystem({
        fps: handEngine.getFPS(),
        handDetected: handEngine.getHandDetected(),
        gesture: handEngine.getGesture(),
        handedness: handEngine.getHandedness(),
      });
    }, 150);

    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Desktop / tablet status bar */}
      <footer className="hidden sm:flex min-h-12 border-t border-white/10 bg-white/5 items-center justify-between gap-4 px-4 md:px-6 text-xs md:text-sm text-gray-300">
        <div className="flex items-center gap-4 md:gap-6 min-w-0">
          <span>FPS: {system.fps || "--"}</span>

          <span
            className={
              system.handDetected ? "text-green-300" : "text-gray-400"
            }
          >
            Hand: {system.handDetected ? "Detected" : "Not Detected"}
          </span>

          <span className="truncate capitalize">
            Gesture: {system.gesture || "none"}
          </span>

          <span className="hidden lg:inline">
            Hand: {system.handedness || "--"}
          </span>
        </div>

        <span className="hidden md:inline text-gray-500 shrink-0">
          AI Hand OS v1.0
        </span>
      </footer>

      {/* Mobile compact status */}
      <div className="sm:hidden fixed bottom-[72px] left-3 right-3 z-[9998] pointer-events-none">
        <div className="rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl px-4 py-2 flex items-center justify-between gap-2 text-[11px] shadow-xl">
          <span className="text-cyan-300">
            {system.fps || "--"} FPS
          </span>

          <span
            className={
              system.handDetected ? "text-green-300" : "text-gray-400"
            }
          >
            {system.handDetected ? "Hand Detected" : "No Hand"}
          </span>

          <span className="capitalize truncate max-w-24 text-gray-300">
            {system.gesture || "none"}
          </span>
        </div>
      </div>
    </>
  );
}

export default StatusBar;