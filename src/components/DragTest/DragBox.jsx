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
      className="absolute z-[10000] bg-purple-600 text-white px-8 py-4 rounded-xl cursor-grab select-none"
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