import CameraView from "../components/Camera/CameraView";
import VirtualKeyboard from "../components/Keyboard/VirtualKeyboard";

function Keyboard() {
  return (
    <div className="space-y-6 md:space-y-8 pb-6">
      <section>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Virtual Keyboard
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-3xl">
          Use your hand cursor to select a key and pinch to type.
        </p>
      </section>

      <CameraView />

      <section className="overflow-x-auto">
        <div className="min-w-0">
          <VirtualKeyboard />
        </div>
      </section>
    </div>
  );
}

export default Keyboard;