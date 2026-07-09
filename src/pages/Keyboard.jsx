import CameraView from "../components/Camera/CameraView";
import VirtualKeyboard from "../components/Keyboard/VirtualKeyboard";

function Keyboard() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-3">Virtual Keyboard</h1>

      <p className="text-gray-300 mb-8">
        Use your hand cursor and pinch gesture to type.
      </p>

      <CameraView />

      <VirtualKeyboard />
    </div>
  );
}

export default Keyboard;