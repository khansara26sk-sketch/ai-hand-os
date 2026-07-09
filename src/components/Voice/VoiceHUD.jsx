import { useRef, useState } from "react";
import voiceCommandController from "../../voice/VoiceCommandController";
import useVoiceCommand from "../../hooks/useVoiceCommand";
import useAppSettings from "../../hooks/useAppSettings";

function VoiceHUD() {
  const voice = useVoiceCommand();
  const { settings } = useAppSettings();

  const [pos, setPos] = useState({ x: 900, y: 120 });
  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });

  if (!settings.voiceCommands) {
    return null;
  }

  const startDrag = (e) => {
    e.preventDefault();

    draggingRef.current = true;

    startRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: pos.x,
      top: pos.y,
    };

    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", stopDrag);
  };

  const drag = (e) => {
    if (!draggingRef.current) return;

    setPos({
      x: startRef.current.left + (e.clientX - startRef.current.x),
      y: startRef.current.top + (e.clientY - startRef.current.y),
    });
  };

  const stopDrag = () => {
    draggingRef.current = false;

    window.removeEventListener("mousemove", drag);
    window.removeEventListener("mouseup", stopDrag);
  };

  return (
    <div
      className="fixed z-[999999]"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
    >
      <div
        className={`w-72 rounded-2xl backdrop-blur-xl border shadow-2xl overflow-hidden ${
          voice.listening
            ? "bg-green-500/20 border-green-400/40"
            : "bg-black/70 border-white/10"
        }`}
      >
        <div
          data-ai-clickable="true"
          onMouseDown={startDrag}
          className="cursor-move px-4 py-2 bg-white/10 flex justify-between items-center select-none"
        >
          <span className="text-white font-semibold">🎤 Voice Assistant</span>
          <span className="text-gray-400 text-xs">Drag</span>
        </div>

        <div className="p-5">
          <button
            data-ai-clickable="true"
            onClick={() => voiceCommandController.toggle()}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              voice.listening
                ? "bg-green-500 text-white"
                : "bg-cyan-500 hover:bg-cyan-400 text-white"
            }`}
          >
            {voice.listening ? "🛑 Stop Listening" : "🎤 Start Listening"}
          </button>

          <div className="mt-4 text-gray-300 text-sm">
            {voice.message || "Say a command..."}
          </div>

          {voice.transcript && (
            <div className="mt-3 rounded-lg bg-black/30 p-3 text-cyan-300 text-sm break-words">
              "{voice.transcript}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoiceHUD;