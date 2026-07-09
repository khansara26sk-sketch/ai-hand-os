import { createPortal } from "react-dom";

function VirtualCursor({ x, y, isClicking }) {
  const size = isClicking ? 56 : 48;

  return createPortal(
    <div
      data-virtual-cursor="true"
      className="fixed z-[999999] pointer-events-none rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x - size / 2}px`,
        top: `${y - size / 2}px`,
      }}
    >
      <div
        className={`w-full h-full rounded-full ${
          isClicking
            ? "bg-red-500/80 shadow-[0_0_40px_red]"
            : "bg-cyan-400/80 shadow-[0_0_40px_#22d3ee]"
        }`}
      />

      <div className="absolute left-1/2 top-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
    </div>,
    document.body
  );
}

export default VirtualCursor;