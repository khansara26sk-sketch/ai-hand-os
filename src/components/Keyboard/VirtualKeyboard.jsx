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
      setText((previous) => `${previous} `);
      return;
    }

    if (key === "BACKSPACE") {
      setText((previous) => previous.slice(0, -1));
      return;
    }

    if (key === "CLEAR") {
      setText("");
      return;
    }

    setText((previous) => previous + key);
  };

  return (
    <section className="mt-6 md:mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 md:p-6">
      <div className="mb-5 md:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Virtual Keyboard
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Point at a key and pinch to type.
          </p>
        </div>

        <button
          type="button"
          data-ai-key
          data-ai-clickable="true"
          onClick={() => pressKey("CLEAR")}
          disabled={!text}
          className="w-full sm:w-auto rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear Text
        </button>
      </div>

      <div className="mb-5 md:mb-6 min-h-20 sm:min-h-24 rounded-xl border border-white/10 bg-black/30 p-3 sm:p-4">
        <p className="break-words whitespace-pre-wrap text-base sm:text-xl md:text-2xl tracking-wide leading-relaxed">
          {text || (
            <span className="text-sm sm:text-base text-gray-500">
              Typed text will appear here...
            </span>
          )}
        </p>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <div className="mx-auto min-w-[520px] md:min-w-0 space-y-2 sm:space-y-3">
          {keys.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-center gap-1.5 sm:gap-2 md:gap-3"
            >
              {row.map((key) => (
                <button
                  type="button"
                  key={key}
                  data-ai-key
                  data-ai-clickable="true"
                  onClick={() => pressKey(key)}
                  className="
                    flex h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14
                    shrink-0 items-center justify-center
                    rounded-lg sm:rounded-xl
                    border border-white/10
                    bg-white/10
                    text-sm sm:text-base md:text-xl font-bold
                    transition
                    hover:border-cyan-400/30 hover:bg-cyan-500/30
                    active:scale-95
                  "
                >
                  {key}
                </button>
              ))}
            </div>
          ))}

          <div className="flex justify-center gap-2 sm:gap-3 pt-1">
            <button
              type="button"
              data-ai-key
              data-ai-clickable="true"
              onClick={() => pressKey("SPACE")}
              className="
                h-11 sm:h-12 md:h-14
                w-52 sm:w-64 md:w-72
                shrink-0 rounded-lg sm:rounded-xl
                border border-white/10
                bg-white/10
                text-xs sm:text-sm md:text-base font-bold
                transition
                hover:border-cyan-400/30 hover:bg-cyan-500/30
                active:scale-[0.98]
              "
            >
              SPACE
            </button>

            <button
              type="button"
              data-ai-key
              data-ai-clickable="true"
              onClick={() => pressKey("BACKSPACE")}
              disabled={!text}
              className="
                h-11 sm:h-12 md:h-14
                w-28 sm:w-32 md:w-36
                shrink-0 rounded-lg sm:rounded-xl
                border border-white/10
                bg-white/10
                text-[10px] sm:text-xs md:text-sm font-bold
                transition
                hover:border-red-400/30 hover:bg-red-500/30
                active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-40
              "
            >
              BACKSPACE
            </button>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-gray-500 sm:hidden">
        Swipe horizontally if the keyboard is wider than your screen.
      </p>
    </section>
  );
}

export default VirtualKeyboard;