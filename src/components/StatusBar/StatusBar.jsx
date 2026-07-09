function StatusBar() {
  return (
    <footer className="h-12 border-t border-white/10 bg-white/5 flex items-center gap-6 px-6 text-sm text-gray-300">
      <span>FPS: --</span>
      <span>Hand: Not Detected</span>
      <span>Gesture: None</span>
      <span>Confidence: --</span>
    </footer>
  );
}

export default StatusBar;