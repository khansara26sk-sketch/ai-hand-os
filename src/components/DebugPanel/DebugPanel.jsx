function DebugPanel({
  gesture,
  handedness,
  fps,
  cursor,
  pinching,
}) {
  const rows = [
    { label: "Gesture", value: gesture || "None" },
    { label: "Hand", value: handedness || "None" },
    { label: "FPS", value: fps },
    { label: "Cursor X", value: Math.round(cursor?.x || 0) },
    { label: "Cursor Y", value: Math.round(cursor?.y || 0) },
    { label: "Pinch", value: pinching ? "TRUE" : "FALSE" },
  ];

  return (
    <div
    data-debug-panel="true"
    className="absolute top-4 right-4 w-72 rounded-2xl bg-black/60 backdrop-blur-xl border border-cyan-500/30 p-5 shadow-lg">
      <h2 className="text-cyan-400 font-bold text-lg mb-4">
        AI Debug Panel
      </h2>

      <div className="space-y-3">
        {rows.map((item) => (
          <div
            key={item.label}
            className="flex justify-between text-sm"
          >
            <span className="text-gray-400">
              {item.label}
            </span>

            <span className="text-white font-semibold">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DebugPanel;