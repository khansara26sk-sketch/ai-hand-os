import usePresentation from "../../hooks/usePresentation";

function PresentationHUD() {
  const presentation = usePresentation();

  if (!presentation.visible) return null;

  return (
    <div className="fixed top-20 left-3 right-3 sm:left-auto sm:right-6 md:right-8 z-[999999] pointer-events-none">
      <div className="w-full sm:w-80 rounded-2xl sm:rounded-3xl bg-black/85 backdrop-blur-xl border border-cyan-400/40 p-4 sm:p-6 shadow-[0_0_40px_rgba(34,211,238,0.35)]">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div className="text-4xl sm:text-5xl shrink-0">🖥️</div>

          <div className="min-w-0">
            <h2 className="text-white text-xl sm:text-2xl font-bold truncate">
              Presentation
            </h2>

            <p className="text-green-300 text-xs sm:text-sm">
              ● ACTIVE
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 p-3 sm:p-4 text-cyan-300 text-sm sm:text-base font-semibold break-words">
          {presentation.lastAction}
        </div>

        <p className="text-gray-400 text-[10px] sm:text-xs mt-3 leading-relaxed">
          Swipe right for next • Swipe left for previous • 🤙 hold to exit
        </p>
      </div>
    </div>
  );
}

export default PresentationHUD;