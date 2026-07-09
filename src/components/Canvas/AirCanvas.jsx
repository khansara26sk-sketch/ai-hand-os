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
    <div className="w-full h-full p-4 rounded-2xl bg-white/5 border border-white/10 overflow-auto">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold whitespace-nowrap">Air Canvas</h2>

        <div className="flex gap-3">
          <button
            data-ai-clickable="true"
            onClick={undo}
            disabled={historyCount === 0}
            className="px-5 py-2 rounded-xl bg-white/10 border border-white/10 text-white disabled:opacity-40"
          >
            Undo
          </button>

          <button
            data-ai-clickable="true"
            onClick={redo}
            disabled={redoCount === 0}
            className="px-5 py-2 rounded-xl bg-white/10 border border-white/10 text-white disabled:opacity-40"
          >
            Redo
          </button>

          <button
            data-ai-clickable="true"
            data-save-canvas="true"
            onClick={savePNG}
            className="px-5 py-2 rounded-xl bg-green-500/20 border border-green-400/40 text-green-300"
          >
            Save PNG
          </button>

          <button
            data-ai-clickable="true"
            onClick={clearCanvas}
            className="px-5 py-2 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              data-ai-clickable="true"
              onClick={() => changeColor(c)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                color === c && tool === "brush"
                  ? "border-white scale-110"
                  : "border-white/20"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="flex gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              data-ai-clickable="true"
              onClick={() => changeSize(s)}
              className={`px-4 py-2 rounded-xl border transition ${
                size === s
                  ? "bg-cyan-500/30 border-cyan-300 text-cyan-200"
                  : "bg-white/10 border-white/10 text-white"
              }`}
            >
              {s}px
            </button>
          ))}
        </div>

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
            key={value}
            data-ai-clickable="true"
            onClick={() => changeTool(value)}
            className={`px-5 py-2 rounded-xl border transition ${
              tool === value
                ? value === "eraser"
                  ? "bg-red-500/30 border-red-300 text-red-200"
                  : "bg-cyan-500/30 border-cyan-300 text-cyan-200"
                : "bg-white/10 border-white/10 text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className="block w-full h-[420px] rounded-xl bg-black/40 border border-cyan-400/40"
      />
    </div>
  );
}

export default AirCanvas;
