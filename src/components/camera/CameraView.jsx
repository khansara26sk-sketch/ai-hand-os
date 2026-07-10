import { useCamera } from "../../hooks/useCamera";
import HandTracker from "../HandTracker/HandTracker";
import DragBox from "../DragTest/DragBox";
import ResizablePanel from "../ResizablePanel/ResizablePanel";
import useAppSettings from "../../hooks/useAppSettings";

function CameraCard() {
  const { videoRef, isCameraOn, error, startCamera, stopCamera } = useCamera();
  const { settings } = useAppSettings();

  return (
    <div className="relative w-full mx-auto p-4 md:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Camera Feed
        </h2>

        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isCameraOn ? "bg-cyan-400" : "bg-gray-500"
            }`}
          />
          <span className="text-sm text-gray-300">
            {isCameraOn ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-cyan-400/60 bg-black flex items-center justify-center">
        <video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  className={`absolute inset-0 w-full h-full object-cover ${
    settings.mirrorCamera ? "scale-x-[-1]" : ""
  }`}
/>

        {isCameraOn && (
          <HandTracker
            videoRef={videoRef}
            enableCursor={true}
            mirrorMode={settings.mirrorCamera}
          />
        )}

        <DragBox />

        <button
          id="ai-test-click"
          data-ai-clickable="true"
          className="
  absolute
  bottom-4 left-1/2 -translate-x-1/2
  z-[9999]
  px-4 py-2
  text-sm
  rounded-xl
  bg-cyan-500 text-white
  pointer-events-auto
  transition
  sm:px-5 sm:py-2.5 sm:text-base
  md:bottom-6 md:px-8 md:py-3 md:text-lg
"
          onClick={() => alert("BUTTON CLICKED")}
        >
          Test Click
        </button>

        {!isCameraOn && (
          <span className="absolute text-gray-400 text-sm">
            Camera is currently off
          </span>
        )}
      </div>

      {error && (
        <div className="mt-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-400/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="mt-5 md:mt-6 flex flex-col sm:flex-row gap-3 md:gap-4">
        <button
          data-ai-clickable="true"
          onClick={startCamera}
          disabled={isCameraOn}
          className="flex-1 py-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-medium disabled:opacity-40"
        >
          Start Camera
        </button>

        <button
          data-ai-clickable="true"
          onClick={stopCamera}
          disabled={!isCameraOn}
          className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 font-medium disabled:opacity-40"
        >
          Stop Camera
        </button>
      </div>
    </div>
  );
}

function CameraView() {
  return (
    <>
      <div className="hidden md:block">
        <ResizablePanel defaultWidth={720}>
          <CameraCard />
        </ResizablePanel>
      </div>

      <div className="block md:hidden w-full">
        <CameraCard />
      </div>
    </>
  );
}

export default CameraView;