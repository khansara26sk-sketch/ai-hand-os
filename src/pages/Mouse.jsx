import CameraView from "../components/Camera/CameraView";

function Mouse() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-3">Virtual Mouse</h1>

      <p className="text-gray-300 mb-8">
        Start your camera to begin hand-controlled mouse interaction.
      </p>

      <CameraView />

      <div className="mt-10 space-y-6">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white text-xl"
          >
            Scroll Test Section {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Mouse;