import CameraView from "../components/Camera/CameraView";

function Mouse() {
  return (
    <div className="space-y-6 md:space-y-8 pb-6">
      <section>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Virtual Mouse
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-3xl">
          Start your camera and control the cursor using your hand. Use pinch
          for click and two fingers for scrolling.
        </p>
      </section>

      <CameraView />

      <section className="mt-8 md:mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Scroll Test Area
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Show two fingers and move your hand up or down.
            </p>
          </div>

          <span className="w-fit rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-300">
            25 sections
          </span>
        </div>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {Array.from({ length: 25 }, (_, index) => (
            <div
              key={index}
              className="
                min-h-24 sm:min-h-28 md:h-32
                rounded-xl sm:rounded-2xl
                bg-white/5 border border-white/10
                flex items-center justify-between
                gap-3 px-4 sm:px-6
                transition
                hover:bg-white/10 hover:border-cyan-400/30
              "
            >
              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  Section
                </p>

                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white truncate">
                  Scroll Test Section {index + 1}
                </h3>
              </div>

              <span className="shrink-0 text-2xl sm:text-3xl text-cyan-300">
                ↕
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Mouse;