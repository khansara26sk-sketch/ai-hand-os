import { useEffect, useRef, useState } from "react";

function ResizablePanel({
  children,
  defaultWidth = 720,
  defaultHeight = null,
}) {
  const panelRef = useRef(null);
  const resizingRef = useRef(false);

  const startRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  const [size, setSize] = useState({
    width: defaultWidth,
    height: defaultHeight,
  });

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", onResize);

    return () =>
      window.removeEventListener("resize", onResize);
  }, []);

  const startResize = (event) => {
    if (isMobile) return;

    event.preventDefault();

    const rect = panelRef.current.getBoundingClientRect();

    resizingRef.current = true;

    startRef.current = {
      x: event.clientX,
      y: event.clientY,
      width: rect.width,
      height: rect.height,
    };

    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
  };

  const resize = (event) => {
    if (!resizingRef.current) return;

    const dx = event.clientX - startRef.current.x;
    const dy = event.clientY - startRef.current.y;

    const maxWidth = window.innerWidth - 80;

    setSize({
      width: Math.min(
        Math.max(360, startRef.current.width + dx),
        maxWidth
      ),

      height:
        defaultHeight === null
          ? null
          : Math.max(
              260,
              startRef.current.height + dy
            ),
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
      className="relative w-full"
      style={{
        width: isMobile
          ? "100%"
          : `${size.width}px`,

        height:
          defaultHeight && !isMobile
            ? `${size.height}px`
            : "auto",

        maxWidth: "100%",
      }}
    >
      {children}

      {!isMobile && (
        <div
          data-ai-clickable="true"
          onMouseDown={startResize}
          className="
            absolute
            bottom-2
            right-2
            z-[9999]
            h-6
            w-6
            cursor-se-resize
            rounded-md
            bg-cyan-400/70
            shadow-[0_0_20px_#22d3ee]
            hover:scale-110
            transition
          "
        />
      )}
    </div>
  );
}

export default ResizablePanel;