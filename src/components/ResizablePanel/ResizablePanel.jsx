import { useRef, useState } from "react";

function ResizablePanel({ children, defaultWidth = 720, defaultHeight = null }) {
  const panelRef = useRef(null);
  const resizingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const [size, setSize] = useState({
    width: defaultWidth,
    height: defaultHeight,
  });

  const startResize = (e) => {
    e.preventDefault();

    const rect = panelRef.current.getBoundingClientRect();

    resizingRef.current = true;
    startRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
    };

    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
  };

  const resize = (e) => {
    if (!resizingRef.current) return;

    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    setSize({
      width: Math.max(360, startRef.current.width + dx),
      height:
        defaultHeight === null
          ? null
          : Math.max(260, startRef.current.height + dy),
    });
  };

  const stopResize = () => {
    resizingRef.current = false;

    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
  };

  return (
    <div
      ref={panelRef}
      className="relative"
      style={{
        width: `${size.width}px`,
        height: size.height ? `${size.height}px` : "auto",
        maxWidth: "100%",
      }}
    >
      {children}

      <div
        data-ai-clickable="true"
        onMouseDown={startResize}
        className="absolute bottom-2 right-2 z-[9999] h-6 w-6 cursor-se-resize rounded-md bg-cyan-400/70 shadow-[0_0_20px_#22d3ee]"
      />
    </div>
  );
}

export default ResizablePanel;