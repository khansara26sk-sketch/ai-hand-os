function BrightnessHUD({ visible, brightness }) {
  if (!visible) return null;

  const safeBrightness = Math.min(
    100,
    Math.max(0, Number(brightness) || 0)
  );

  return (
    <div className="fixed top-32 sm:top-56 left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[999999] pointer-events-none">
      <div className="w-full sm:w-80 rounded-2xl sm:rounded-3xl bg-black/85 backdrop-blur-xl border border-yellow-400/40 p-4 sm:p-6 shadow-[0_0_40px_rgba(250,204,21,0.35)]">
        <div className="flex gap-3 sm:gap-4 items-center mb-4">
          <div className="text-4xl sm:text-5xl shrink-0">
            ☀️
          </div>

          <div className="min-w-0">
            <h2 className="text-white text-xl sm:text-2xl font-bold">
              Brightness
            </h2>

            <p className="text-yellow-300 text-sm sm:text-base">
              {safeBrightness}%
            </p>
          </div>
        </div>

        <div className="h-3 sm:h-4 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-yellow-400 transition-[width] duration-150"
            style={{
              width: `${safeBrightness}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default BrightnessHUD;