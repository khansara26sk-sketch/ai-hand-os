function BrightnessHUD({ visible, brightness }) {
  if (!visible) return null;

  return (
    <div className="fixed top-56 left-1/2 -translate-x-1/2 z-[999999] pointer-events-none">

      <div className="w-80 rounded-3xl bg-black/80 backdrop-blur-xl border border-yellow-400/40 p-6 shadow-[0_0_40px_rgba(250,204,21,0.35)]">

        <div className="flex gap-4 items-center mb-4">

          <div className="text-5xl">
            ☀️
          </div>

          <div>
            <h2 className="text-white text-2xl font-bold">
              Brightness
            </h2>

            <p className="text-yellow-300">
              {brightness}%
            </p>
          </div>

        </div>

        <div className="h-4 rounded-full bg-white/10 overflow-hidden">

          <div
            className="h-full bg-yellow-400 transition-all duration-150"
            style={{
              width: `${brightness}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}

export default BrightnessHUD;