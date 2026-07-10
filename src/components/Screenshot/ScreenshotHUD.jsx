function ScreenshotHUD({ visible, countdown, flash, message }) {
  return (
    <>
      {visible && (
        <div className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center px-4">
          <div className="w-full max-w-72 rounded-2xl sm:rounded-3xl bg-black/85 border border-cyan-400/40 backdrop-blur-xl p-6 sm:p-8 text-center shadow-[0_0_40px_rgba(34,211,238,0.4)]">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">
              📸
            </div>

            <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">
              Screenshot
            </h2>

            <div className="text-cyan-300 text-6xl sm:text-7xl font-bold leading-none">
              {countdown}
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Keep the gesture steady
            </p>
          </div>
        </div>
      )}

      {flash && (
        <div className="fixed inset-0 z-[1000000] bg-white pointer-events-none animate-pulse" />
      )}

      {message && (
        <div className="fixed top-20 sm:top-8 left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[999999] pointer-events-none">
          <div className="w-full sm:w-auto sm:min-w-64 rounded-2xl bg-black/85 border border-green-400/40 text-green-300 px-4 sm:px-6 py-3 sm:py-4 text-center text-sm sm:text-base shadow-[0_0_30px_rgba(34,197,94,0.4)] break-words">
            {message}
          </div>
        </div>
      )}
    </>
  );
}

export default ScreenshotHUD;