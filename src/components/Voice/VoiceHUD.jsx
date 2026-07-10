import { useCallback, useEffect, useRef, useState } from "react";
import voiceCommandController from "../../voice/VoiceCommandController";
import useVoiceCommand from "../../hooks/useVoiceCommand";
import useAppSettings from "../../hooks/useAppSettings";

function VoiceHUD() {
  const voice = useVoiceCommand();
  const { settings } = useAppSettings();

  const [panelOpen, setPanelOpen] = useState(false);

  const [position, setPosition] = useState(() => ({
    x:
      typeof window !== "undefined"
        ? Math.max(16, window.innerWidth - 320)
        : 900,
    y: 120,
  }));

  const draggingRef = useRef(false);

  const startRef = useRef({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
  });

  const stopDrag = useCallback(() => {
    draggingRef.current = false;

    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", stopDrag);
  }, []);

  const handleDrag = useCallback((event) => {
    if (!draggingRef.current) return;

    const nextX =
      startRef.current.left +
      (event.clientX - startRef.current.x);

    const nextY =
      startRef.current.top +
      (event.clientY - startRef.current.y);

    const maxX = Math.max(12, window.innerWidth - 304);
    const maxY = Math.max(12, window.innerHeight - 250);

    setPosition({
      x: Math.min(Math.max(12, nextX), maxX),
      y: Math.min(Math.max(12, nextY), maxY),
    });
  }, []);

  const startDrag = (event) => {
    if (window.innerWidth < 768) return;

    event.preventDefault();

    draggingRef.current = true;

    startRef.current = {
      x: event.clientX,
      y: event.clientY,
      left: position.x,
      top: position.y,
    };

    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => ({
        x: Math.min(
          Math.max(12, current.x),
          Math.max(12, window.innerWidth - 304)
        ),
        y: Math.min(
          Math.max(12, current.y),
          Math.max(12, window.innerHeight - 250)
        ),
      }));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleCommandComplete = () => {
      // Command execute hone ke baad panel automatically close
      setPanelOpen(false);
    };

    window.addEventListener(
      "voice-command-complete",
      handleCommandComplete
    );

    return () => {
      window.removeEventListener(
        "voice-command-complete",
        handleCommandComplete
      );
    };
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [handleDrag, stopDrag]);

  if (!settings?.voiceCommands) {
    return null;
  }

  const toggleListening = () => {
    voiceCommandController.toggle();
  };

  const closePanel = () => {
    if (voice.listening) {
      voiceCommandController.stop();
    }

    setPanelOpen(false);
  };

  return (
    <>
      {/* Dark background on mobile only */}
      {panelOpen && (
        <button
          type="button"
          aria-label="Close voice assistant"
          onClick={closePanel}
          className="md:hidden fixed inset-0 z-[999990] bg-black/40"
        />
      )}

      {/* Voice Assistant Panel */}
      {panelOpen && (
        <div
          className="
            fixed z-[999999]
            left-3 right-3 bottom-24
            md:left-auto md:right-auto md:bottom-auto
          "
          style={
            typeof window !== "undefined" &&
            window.innerWidth >= 768
              ? {
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  right: "auto",
                }
              : undefined
          }
        >
          <div
            className={`w-full md:w-72 rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden ${
              voice.listening
                ? "bg-green-950/95 border-green-400/40"
                : "bg-black/90 border-white/10"
            }`}
          >
            <div
              data-ai-clickable="true"
              onMouseDown={startDrag}
              className="
                px-4 py-3 bg-white/10
                flex items-center justify-between
                select-none md:cursor-move
              "
            >
              <span className="text-white font-semibold">
                🎤 Voice Assistant
              </span>

              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-xs text-gray-400">
                  Drag
                </span>

                <button
                  type="button"
                  data-ai-clickable="true"
                  aria-label="Close voice assistant"
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={closePanel}
                  className="
                    w-8 h-8 min-h-0 rounded-lg
                    bg-white/10 text-gray-300
                    hover:bg-white/20
                  "
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 md:p-5">
              <button
                type="button"
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

              <p className="mt-4 text-sm text-gray-300">
                {voice.message || "Say a command..."}
              </p>

              {voice.transcript && (
                <div className="mt-3 rounded-xl bg-black/30 p-3 text-sm text-cyan-300 break-words">
                  “{voice.transcript}”
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Small microphone button */}
      {!panelOpen && (
        <button
          type="button"
          data-ai-clickable="true"
          aria-label="Open voice assistant"
          onClick={() => setPanelOpen(true)}
          className={`
            fixed z-[999999]
            right-4 bottom-24
            md:right-8 md:bottom-8
            w-14 h-14 min-h-0
            rounded-full border
            flex items-center justify-center
            text-2xl shadow-[0_0_30px_rgba(34,211,238,0.35)]
            transition active:scale-95
            ${
              voice.listening
                ? "bg-green-500 border-green-300 animate-pulse"
                : "bg-cyan-500 border-cyan-300"
            }
          `}
        >
          🎤
        </button>
      )}
    </>
  );
}

export default VoiceHUD;