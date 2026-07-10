import { useRef } from "react";

function DragBox() {
  const boxRef = useRef(null);
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    draggingRef.current = true;

    const rect = boxRef.current.getBoundingClientRect();

    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;

    const parentRect = boxRef.current.parentElement.getBoundingClientRect();

    const x = e.clientX - parentRect.left - offsetRef.current.x;
    const y = e.clientY - parentRect.top - offsetRef.current.y;

    boxRef.current.style.left = `${x}px`;
    boxRef.current.style.top = `${y}px`;
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
  };

  return (
    <div
      ref={boxRef}
      id="drag-box"
      data-ai-clickable="true"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="
  absolute
  top-4 left-1/2 -translate-x-1/2
  z-[9999]
  px-4 py-2
  text-sm
  rounded-xl
  bg-purple-600 text-white
  font-semibold
  pointer-events-auto
  sm:px-5 sm:py-2.5 sm:text-base
  md:px-8 md:py-3 md:text-xl
"
      style={{
        left: "100px",
        top: "80px",
      }}
    >
      Drag Me
    </div>
  );
}

export default DragBox;