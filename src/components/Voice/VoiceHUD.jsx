import { useEffect, useRef, useState } from "react";
import voiceCommandController from "../../voice/VoiceCommandController";
import useVoiceCommand from "../../hooks/useVoiceCommand";
import useAppSettings from "../../hooks/useAppSettings";

function VoiceHUD() {
  const voice = useVoiceCommand();
  const { settings } = useAppSettings();

  const [pos, setPos] = useState({ x: 900, y: 120 });
  const [mobileOpen, setMobileOpen] = useState(false);

  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });

  useEffect(() => {
    const handleResize = () => {
      setPos((current) => ({
        x: Math.min(current.x, Math.max(16, window.innerWidth - 320)),
        y: Math.min(current.y, Math.max(16, window.innerHeight - 280)),
      }));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", drag);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, []);

  if (!settings.voiceCommands) {
    return null;
  }

  const startDrag = (event) => {
    if (window.innerWidth < 768) return;

    event.preventDefault();
    draggingRef.current = true;

    startRef.current = {
      x: event.clientX,
      y: event.clientY,
      left: pos.x,
      top: pos.y,
    };

    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", stopDrag);
  };

  const drag = (event) => {
    if (!draggingRef.current) return;

    const nextX =
      startRef.current.left + (event.clientX - startRef.current.x);
    const nextY =
      startRef.current.top + (event.clientY - startRef.current.y);

    const maxX = Math.max(12, window.innerWidth - 300);
    const maxY = Math.max(12, window.innerHeight - 260);

    setPos({
      x: Math.min(Math.max(12, nextX), maxX),
      y: Math.min(Math.max(12, nextY), maxY),
    });
  };

  const stopDrag = () => {
    draggingRef.current = false;

    window.removeEventListener("mousemove", drag);
    window.removeEventListener("mouseup", stopDrag);
  };

  const toggleListening = () => {
    voiceCommandController.toggle();
  };

  return (
    <>
      {/* Desktop draggable voice panel */}
      <div
        className="hidden md:block fixed z-[999999]"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      >
        <div
          className={`w-72 rounded-2xl backdrop-blur-xl border shadow-2xl overflow-hidden ${
            voice.listening
              ? "bg-green-500/20 border-green-400/40"
              : "bg-black/75 border-white/10"
          }`}
        >
          <div
            data-ai-clickable="true"
            onMouseDown={startDrag}
            className="cursor-move px-4 py-2.5 bg-white/10 flex justify-between items-center select-none"
          >
            <span className="text-white font-semibold">
              🎤 Voice Assistant
            </span>

            <span className="text-gray-400 text-xs">
              Drag
            </span>
          </div>

          <div className="p-5">
            <button
              data-ai-clickable="true"
              onClick={toggleListening}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                voice.listening
                  ? "bg-green-500 text-white"
                  : "bg-cyan-500 hover:bg-cyan-400 text-white"
              }`}
            >
              {voice.listening
                ? "🛑 Stop Listening"
                : "🎤 Start Listening"}
            </button>

            <div className="mt-4 text-gray-300 text-sm">
              {voice.message || "Say a command..."}
            </div>

            {voice.transcript && (
              <div className="mt-3 rounded-lg bg-black/30 p-3 text-cyan-300 text-sm break-words">
                “{voice.transcript}”
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile voice action button */}
      <div className="md:hidden fixed bottom-24 right-4 z-[999999]">
        {mobileOpen && (
          <>
            <button
              aria-label="Close voice panel"
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
            />

            <div
              className={`absolute bottom-16 right-0 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden ${
                voice.listening
                  ? "bg-green-950/95 border-green-400/40"
                  : "bg-[#0b1020]/95 border-white/10"
              }`}
            >
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <span className="font-semibold">🎤 Voice Assistant</span>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="p-4">
                <button
                  data-ai-clickable="true"
                  onClick={toggleListening}
                  className={`w-full py-3 rounded-xl font-semibold ${
                    voice.listening
                      ? "bg-green-500 text-white"
                      : "bg-cyan-500 text-white"
                  }`}
                >
                  {voice.listening
                    ? "🛑 Stop Listening"
                    : "🎤 Start Listening"}
                </button>

                <p className="mt-3 text-sm text-gray-300">
                  {voice.message || "Say a command..."}
                </p>

                {voice.transcript && (
                  <div className="mt-3 rounded-xl bg-black/30 p-3 text-sm text-cyan-300 break-words">
                    “{voice.transcript}”
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <button
          data-ai-clickable="true"
          aria-label="Open voice assistant"
          onClick={() => setMobileOpen((current) => !current)}
          className={`relative w-14 h-14 rounded-full border shadow-[0_0_30px_rgba(34,211,238,0.35)] flex items-center justify-center text-2xl ${
            voice.listening
              ? "bg-green-500 border-green-300 text-white animate-pulse"
              : "bg-cyan-500 border-cyan-300 text-white"
          }`}
        >
          🎤

          {voice.listening && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#070b16]" />
          )}
        </button>
      </div>
    </>
  );
}

export default VoiceHUD;