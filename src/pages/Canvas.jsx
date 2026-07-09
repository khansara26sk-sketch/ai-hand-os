import CameraView from "../components/Camera/CameraView";
import AirCanvas from "../components/Canvas/AirCanvas";

function Canvas() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-3">Air Canvas</h1>

      <p className="text-gray-300 mb-8">
        Pinch and move your hand to draw in the air.
      </p>

      <CameraView />

      <AirCanvas />
    </div>
  );
}

export default Canvas;