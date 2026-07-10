import { useEffect, useRef, useState } from "react";

function AirCanvas() {
  const canvasRef = useRef(null);

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const currentStrokeRef = useRef(null);

  const strokesRef = useRef([]);
  const redoRef = useRef([]);

  const colorRef = useRef("#22d3ee");
  const sizeRef = useRef(6);
  const toolRef = useRef("brush");

  const [color, setColor] = useState("#22d3ee");
  const [size, setSize] = useState(6);
  const [tool, setTool] = useState("brush");
  const [historyCount, setHistoryCount] = useState(0);
  const [redoCount, setRedoCount] = useState(0);

  const colors = [
    "#22d3ee",
    "#ef4444",
    "#22c55e",
    "#a855f7",
    "#facc15",
    "#ffffff",
  ];

  const sizes = [3, 6, 10, 16];

  const shapeTools = [
    "line",
    "rectangle",
    "square",
    "circle",
    "ellipse",
    "triangle",
  ];

  const updateCounts = () => {
    setHistoryCount(strokesRef.current.length);
    setRedoCount(redoRef.current.length);
  };

  const resizeCanvasToDisplaySize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.floor(rect.width));
    const nextHeight = Math.max(1, Math.floor(rect.height));

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      redraw();
    }
  };

  const drawPerfectShape = (ctx, stroke) => {
    const points = stroke.points;
    if (!points || points.length < 2) return;

    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = stroke.size;
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 2;
    ctx.shadowColor = stroke.color;
    ctx.strokeStyle = stroke.color;

    if (stroke.shape === "line") {
      const first = points[0];
      const last = points[points.length - 1];

      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
      return;
    }

    if (stroke.shape === "rectangle") {
      ctx.beginPath();
      ctx.rect(minX, minY, width, height);
      ctx.stroke();
      return;
    }

    if (stroke.shape === "square") {
      const side = Math.max(Math.abs(width), Math.abs(height));
      const start = points[0];
      const end = points[points.length - 1];

      const directionX = end.x >= start.x ? 1 : -1;
      const directionY = end.y >= start.y ? 1 : -1;

      ctx.beginPath();
      ctx.rect(start.x, start.y, side * directionX, side * directionY);
      ctx.stroke();
      return;
    }

    if (stroke.shape === "circle") {
      const cx = minX + width / 2;
      const cy = minY + height / 2;
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }

    if (stroke.shape === "ellipse") {
      const cx = minX + width / 2;
      const cy = minY + height / 2;

      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        Math.max(Math.abs(width / 2), 1),
        Math.max(Math.abs(height / 2), 1),
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      return;
    }

    if (stroke.shape === "triangle") {
      const top = {
        x: minX + width / 2,
        y: minY,
      };

      const left = {
        x: minX,
        y: maxY,
      };

      const right = {
        x: maxX,
        y: maxY,
      };

      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(left.x, left.y);
      ctx.lineTo(right.x, right.y);
      ctx.closePath();
      ctx.stroke();
    }
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokesRef.current.forEach((stroke) => {
      if (!stroke.points || stroke.points.length < 2) return;

      if (stroke.shape && shapeTools.includes(stroke.shape)) {
        drawPerfectShape(ctx, stroke);
        return;
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = stroke.size;

      if (stroke.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(0,0,0,1)";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.shadowBlur = 2;
        ctx.shadowColor = stroke.color;
        ctx.strokeStyle = stroke.color;
      }

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.stroke();
    });

    ctx.globalCompositeOperation = "source-over";
  };

  const undo = () => {
    if (strokesRef.current.length === 0) return;

    const lastStroke = strokesRef.current.pop();
    redoRef.current.push(lastStroke);

    redraw();
    updateCounts();
  };

  const redo = () => {
    if (redoRef.current.length === 0) return;

    const stroke = redoRef.current.pop();
    strokesRef.current.push(stroke);

    redraw();
    updateCounts();
  };

  const savePNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "air-canvas-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const clearCanvas = () => {
    redoRef.current = [];
    strokesRef.current = [];
    redraw();
    updateCounts();
  };

  const changeColor = (newColor) => {
    colorRef.current = newColor;
    toolRef.current = "brush";
    setColor(newColor);
    setTool("brush");
  };

  const changeSize = (newSize) => {
    sizeRef.current = newSize;
    setSize(newSize);
  };

  const changeTool = (newTool) => {
    toolRef.current = newTool;
    setTool(newTool);
  };

  useEffect(() => {
    window.__AIR_CANVAS__ = {
      start(cursor) {
        resizeCanvasToDisplaySize();

        const canvas = canvasRef.current;
        if (!canvas || !cursor) return;

        const rect = canvas.getBoundingClientRect();

        const startPoint = {
          x: cursor.x - rect.left,
          y: cursor.y - rect.top,
        };

        isDrawingRef.current = true;
        lastPointRef.current = startPoint;

        currentStrokeRef.current = {
          tool: toolRef.current,
          color: colorRef.current,
          size: sizeRef.current,
          shape: shapeTools.includes(toolRef.current)
            ? toolRef.current
            : "freehand",
          points: [startPoint],
        };
      },

      draw(cursor) {
        const canvas = canvasRef.current;
        if (!canvas || !cursor || !isDrawingRef.current) return;
        if (!lastPointRef.current || !currentStrokeRef.current) return;

        const rect = canvas.getBoundingClientRect();

        const raw = {
          x: cursor.x - rect.left,
          y: cursor.y - rect.top,
        };

        const smoothing = 0.35;

        const current = {
          x:
            lastPointRef.current.x +
            (raw.x - lastPointRef.current.x) * smoothing,
          y:
            lastPointRef.current.y +
            (raw.y - lastPointRef.current.y) * smoothing,
        };

        const dx = current.x - lastPointRef.current.x;
        const dy = current.y - lastPointRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 2) return;

        currentStrokeRef.current.points.push(current);

        const ctx = canvas.getContext("2d");

        if (shapeTools.includes(currentStrokeRef.current.tool)) {
          redraw();

          const previewStroke = {
            ...currentStrokeRef.current,
            shape: currentStrokeRef.current.tool,
            points: [currentStrokeRef.current.points[0], current],
          };

          drawPerfectShape(ctx, previewStroke);

          lastPointRef.current = current;
          return;
        }

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = currentStrokeRef.current.size;

        if (currentStrokeRef.current.tool === "eraser") {
          ctx.globalCompositeOperation = "destination-out";
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "rgba(0,0,0,1)";
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.shadowBlur = 2;
          ctx.shadowColor = currentStrokeRef.current.color;
          ctx.strokeStyle = currentStrokeRef.current.color;
        }

        ctx.beginPath();
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(current.x, current.y);
        ctx.stroke();

        lastPointRef.current = current;
      },

      stop() {
        const stroke = currentStrokeRef.current;

        if (stroke?.points?.length > 1) {
          if (shapeTools.includes(stroke.tool)) {
            stroke.shape = stroke.tool;
            stroke.points = [
              stroke.points[0],
              stroke.points[stroke.points.length - 1],
            ];
          } else {
            stroke.shape = "freehand";
          }

          strokesRef.current.push(stroke);
          redoRef.current = [];
          updateCounts();
          redraw();
        }

        isDrawingRef.current = false;
        lastPointRef.current = null;
        currentStrokeRef.current = null;
      },

      clear: clearCanvas,
      undo,
      redo,
    };

    return () => {
      delete window.__AIR_CANVAS__;
    };
  }, []);

  useEffect(() => {
    resizeCanvasToDisplaySize();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => {
      resizeCanvasToDisplaySize();
    });

    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 md:p-6 overflow-hidden">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold">Air Canvas</h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Pinch and move to draw. Choose a tool, color and brush size below.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            data-ai-clickable="true"
            onClick={undo}
            disabled={historyCount === 0}
            className="min-h-11 rounded-xl border border-white/10 bg-white/10 px-3 sm:px-4 py-2 text-sm sm:text-base text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Undo
          </button>

          <button
            type="button"
            data-ai-clickable="true"
            onClick={redo}
            disabled={redoCount === 0}
            className="min-h-11 rounded-xl border border-white/10 bg-white/10 px-3 sm:px-4 py-2 text-sm sm:text-base text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Redo
          </button>

          <button
            type="button"
            data-ai-clickable="true"
            data-save-canvas="true"
            onClick={savePNG}
            className="min-h-11 rounded-xl border border-green-400/40 bg-green-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base text-green-300 transition active:scale-[0.98]"
          >
            Save PNG
          </button>

          <button
            type="button"
            data-ai-clickable="true"
            onClick={clearCanvas}
            className="min-h-11 rounded-xl border border-red-400/40 bg-red-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base text-red-300 transition active:scale-[0.98]"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mb-4 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">
            Colors
          </p>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {colors.map((currentColor) => (
              <button
                type="button"
                key={currentColor}
                data-ai-clickable="true"
                aria-label={`Choose color ${currentColor}`}
                onClick={() => changeColor(currentColor)}
                className={`h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full border-2 transition-all active:scale-95 ${
                  color === currentColor && tool === "brush"
                    ? "scale-110 border-white shadow-[0_0_14px_rgba(255,255,255,0.35)]"
                    : "border-white/20"
                }`}
                style={{ backgroundColor: currentColor }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">
            Brush size
          </p>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {sizes.map((currentSize) => (
              <button
                type="button"
                key={currentSize}
                data-ai-clickable="true"
                onClick={() => changeSize(currentSize)}
                className={`min-h-10 shrink-0 rounded-xl border px-3 sm:px-4 py-2 text-sm transition active:scale-[0.98] ${
                  size === currentSize
                    ? "border-cyan-300 bg-cyan-500/30 text-cyan-200"
                    : "border-white/10 bg-white/10 text-white"
                }`}
              >
                {currentSize}px
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">
            Tools
          </p>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              ["brush", "Brush"],
              ["eraser", "Eraser"],
              ["line", "Line"],
              ["rectangle", "Rectangle"],
              ["square", "Square"],
              ["circle", "Circle"],
              ["ellipse", "Oval"],
              ["triangle", "Triangle"],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                data-ai-clickable="true"
                onClick={() => changeTool(value)}
                className={`min-h-10 shrink-0 rounded-xl border px-3 sm:px-4 py-2 text-sm transition active:scale-[0.98] ${
                  tool === value
                    ? value === "eraser"
                      ? "border-red-300 bg-red-500/30 text-red-200"
                      : "border-cyan-300 bg-cyan-500/30 text-cyan-200"
                    : "border-white/10 bg-white/10 text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-cyan-400/40 bg-black/40">
        <canvas
          ref={canvasRef}
          className="block h-[300px] w-full touch-none sm:h-[380px] md:h-[460px] lg:h-[540px]"
        />

        <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] sm:text-xs text-gray-300 backdrop-blur-md">
          {tool === "eraser" ? "Eraser" : tool} • {size}px
        </div>
      </div>
    </section>
  );
}

export default AirCanvas;