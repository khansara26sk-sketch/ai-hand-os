function ScreenshotHUD({ visible, countdown, flash, message }) {
  return (
    <>
      {visible && (
        <div className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center">
          <div className="w-72 rounded-3xl bg-black/80 border border-cyan-400/40 backdrop-blur-xl p-8 text-center shadow-[0_0_40px_rgba(34,211,238,0.4)]">
            <div className="text-5xl mb-4">📸</div>
            <h2 className="text-white text-2xl font-bold mb-2">
              Screenshot
            </h2>
            <div className="text-cyan-300 text-7xl font-bold">
              {countdown}
            </div>
          </div>
        </div>
      )}

      {flash && (
        <div className="fixed inset-0 z-[999999] bg-white pointer-events-none animate-pulse" />
      )}

      {message && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[999999] pointer-events-none">
          <div className="rounded-2xl bg-black/80 border border-green-400/40 text-green-300 px-6 py-4 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
            {message}
          </div>
        </div>
      )}
    </>
  );
}

export default ScreenshotHUD;