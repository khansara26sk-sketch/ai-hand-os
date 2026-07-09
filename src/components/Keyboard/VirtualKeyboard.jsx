import { useState } from "react";

function VirtualKeyboard() {
  const [text, setText] = useState("");

  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const pressKey = (key) => {
    if (key === "SPACE") {
      setText((prev) => prev + " ");
      return;
    }

    if (key === "BACKSPACE") {
      setText((prev) => prev.slice(0, -1));
      return;
    }

    setText((prev) => prev + key);
  };

  return (
    <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
      <h2 className="text-2xl font-bold mb-6">Virtual Keyboard</h2>

      <div className="mb-6 min-h-20 rounded-xl bg-black/30 border border-white/10 p-4 text-2xl tracking-wide">
        {text || <span className="text-gray-500">Typed text will appear here...</span>}
      </div>

      <div className="space-y-3">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-3">
            {row.map((key) => (
              <button
                key={key}
                data-ai-key
                data-ai-clickable="true"
                onClick={() => pressKey(key)}
                className="w-14 h-14 rounded-xl bg-white/10 hover:bg-cyan-500/30 border border-white/10 text-xl font-bold transition-all"
              >
                {key}
              </button>
            ))}
          </div>
        ))}

        <div className="flex justify-center gap-3">
          <button
            data-ai-key
            data-ai-clickable="true"
            onClick={() => pressKey("SPACE")}
            className="w-72 h-14 rounded-xl bg-white/10 hover:bg-cyan-500/30 border border-white/10 font-bold transition-all"
          >
            SPACE
          </button>

          <button
          data-ai-key
            data-ai-clickable="true"
            onClick={() => pressKey("BACKSPACE")}
            className="w-36 h-14 rounded-xl bg-white/10 hover:bg-red-500/30 border border-white/10 font-bold transition-all"
          >
            BACKSPACE
          </button>
        </div>
      </div>
    </div>
  );
}

export default VirtualKeyboard;