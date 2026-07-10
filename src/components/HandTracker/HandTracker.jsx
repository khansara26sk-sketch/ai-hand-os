import { useEffect } from "react";
import { useHandLandmarker } from "../../hooks/useHandLandmarker";
import handEngine from "../../engine/HandEngine";

import VirtualCursor from "../Cursor/VirtualCursor";
import { isPinching } from "../../utils/gestureUtils";

import mouseController from "../../mouse/MouseController";
import clickManager from "../../mouse/ClickManager";
import browserMouseController from "../../mouse/BrowserMouseController";
import scrollController from "../../scroll/ScrollController";
import volumeController from "../../volume/VolumeController";
import brightnessController from "../../brightness/BrightnessController";
import screenshotController from "../../screenshot/ScreenshotController";
import presentationController from "../../presentation/PresentationController";
import useAppSettings from "../../hooks/useAppSettings";
function HandTracker({ videoRef, enableCursor = false, mirrorMode = true }) {
  const {
    canvasRef,
    landmarks,
    isHandDetected,
    fps,
    startTracking,
    stopTracking,
  } = useHandLandmarker();

  const { settings } = useAppSettings();

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const start = () => {
      mouseController.reset(video);
      startTracking(video);
    };

    if (video.readyState >= 2) {
      start();
    } else {
      video.addEventListener("loadeddata", start);
    }

    return () => {
      video.removeEventListener("loadeddata", start);
      stopTracking();

      clickManager.reset();
      scrollController.reset();
      screenshotController.cancel();
    };
  }, [videoRef, startTracking, stopTracking]);

  const cursorPosition = mouseController.update(landmarks, videoRef.current);

  let clicking = false;
  let clickState = { type: "none" };

  if (isHandDetected && landmarks) {
    const gesture = handEngine.getGesture();

    clicking = isPinching(landmarks);
    clickState = clickManager.update(clicking);

    browserMouseController.update(cursorPosition, clickState);

    if (window.__AIR_CANVAS__) {
      if (clickState.type === "click") {
        window.__AIR_CANVAS__.start(cursorPosition);
      }

      if (clickState.type === "hold") {
        window.__AIR_CANVAS__.draw(cursorPosition);
      }

      if (clickState.type === "release") {
        window.__AIR_CANVAS__.stop();
      }
    }

    scrollController.update(gesture, cursorPosition, clickState);
    volumeController.update(gesture, landmarks);
    brightnessController.update(gesture, landmarks);
    presentationController.update(gesture, cursorPosition);
    screenshotController.update(gesture);
  } else {
    clickManager.reset();
    scrollController.reset();
    screenshotController.cancel();
  }

  return (
<div
  data-hand-overlay="true"
  className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
>
  <canvas
    ref={canvasRef}
    className={`absolute inset-0 w-full h-full object-contain ${
      settings.showLandmarks ? "opacity-100" : "opacity-0"
    } ${mirrorMode ? "scale-x-[-1]" : ""}`}
  />

  {enableCursor && isHandDetected && (
    <VirtualCursor
      x={cursorPosition.x}
      y={cursorPosition.y}
      isClicking={clicking}
    />
  )}

  <div
    className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs sm:text-sm border backdrop-blur-md ${
      isHandDetected
        ? "bg-green-500/20 border-green-400/40 text-green-300"
        : "bg-white/10 border-white/20 text-gray-300"
    }`}
  >
    {isHandDetected
      ? clicking
        ? `🤏 Pinch Click • ${fps} FPS`
        : `🖐 Hand Detected • ${fps} FPS`
      : "Waiting for Hand..."}
  </div>
</div>
  );
}

export default HandTracker;