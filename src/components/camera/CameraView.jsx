import { useCamera } from "../../hooks/useCamera";
import HandTracker from "../HandTracker/HandTracker";
import DragBox from "../DragTest/DragBox";
import ResizablePanel from "../ResizablePanel/ResizablePanel";
import useAppSettings from "../../hooks/useAppSettings";

function CameraView() {
  const { videoRef, isCameraOn, error, startCamera, stopCamera } = useCamera();
  const { settings } = useAppSettings();

  return (
    <ResizablePanel defaultWidth={720}>
      <div className="relative w-full mx-auto p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white tracking-wide">
            Camera Feed
          </h2>

          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isCameraOn
                  ? "bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]"
                  : "bg-gray-500"
              }`}
            />

            <span className="text-sm text-gray-300">
              {isCameraOn ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-cyan-400/60 bg-black/40 flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${
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
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-8 py-3 rounded-xl bg-cyan-500 text-white hover:bg-cyan-400 transition pointer-events-auto"
            onClick={() => {
              console.log("BUTTON CLICKED");
              alert("BUTTON CLICKED");
            }}
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

        <div className="mt-6 flex gap-4">
          <button
            data-ai-clickable="true"
            onClick={startCamera}
            disabled={isCameraOn}
            className="flex-1 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-medium hover:bg-cyan-500/30 hover:text-cyan-200 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Start Camera
          </button>

          <button
            data-ai-clickable="true"
            onClick={stopCamera}
            disabled={!isCameraOn}
            className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 font-medium hover:bg-red-500/30 hover:text-red-200 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Stop Camera
          </button>
        </div>
      </div>
    </ResizablePanel>
  );
}

export default CameraView;