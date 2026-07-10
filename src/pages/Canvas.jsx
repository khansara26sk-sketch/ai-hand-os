import CameraView from "../components/Camera/CameraView";
import AirCanvas from "../components/Canvas/AirCanvas";

function Canvas() {
  return (
    <div className="space-y-6 md:space-y-8 pb-6">
      <section>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Air Canvas
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-3xl">
          Pinch and move your hand to draw, erase, create shapes and save your
          artwork.
        </p>
      </section>

      <CameraView />

      <section className="overflow-x-hidden">
        <AirCanvas />
      </section>
    </div>
  );
}

export default Canvas;