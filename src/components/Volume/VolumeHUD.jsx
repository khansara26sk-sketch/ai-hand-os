function VolumeHUD({ visible, volume }) {
  if (!visible) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[999999] pointer-events-none">
      <div className="w-80 rounded-3xl bg-black/80 backdrop-blur-xl border border-cyan-400/40 p-6 shadow-[0_0_40px_rgba(34,211,238,0.35)]">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">🔊</div>

          <div>
            <h3 className="text-white font-bold text-2xl">Volume Mode</h3>
            <p className="text-cyan-300 text-lg">{volume}%</p>
          </div>
        </div>

        <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-150"
            style={{ width: `${volume}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default VolumeHUD;