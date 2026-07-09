import usePresentation from "../../hooks/usePresentation";

function PresentationHUD() {
  const presentation = usePresentation();

  if (!presentation.visible) return null;

  return (
    <div className="fixed top-8 right-8 z-[999999] pointer-events-none">
      <div className="w-80 rounded-3xl bg-black/80 backdrop-blur-xl border border-cyan-400/40 p-6 shadow-[0_0_40px_rgba(34,211,238,0.35)]">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">🖥️</div>

          <div>
            <h2 className="text-white text-2xl font-bold">
              Presentation
            </h2>

            <p className="text-green-300 text-sm">
              ● ACTIVE
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 p-4 text-cyan-300 font-semibold">
          {presentation.lastAction}
        </div>

        <p className="text-gray-400 text-xs mt-3">
          Swipe right = Next • Swipe left = Previous • 👍 Exit
        </p>
      </div>
    </div>
  );
}

export default PresentationHUD;