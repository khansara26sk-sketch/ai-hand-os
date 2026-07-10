import { useCallback, useEffect, useRef, useState } from "react";
import {
  closeHandLandmarker,
  detectHands,
  initializeHandLandmarker,
} from "../services/visionService";
import handEngine from "../engine/HandEngine";

const HAND_CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],

  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],

  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],

  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],

  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],

  [5, 9],
  [9, 13],
  [13, 17],
];

export function useHandLandmarker() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const videoRefInternal = useRef(null);

  const isRunningRef = useRef(false);
  const lastTimeRef = useRef(performance.now());

  const fpsRef = useRef(0);
  const handDetectedRef = useRef(false);

  const [landmarks, setLandmarks] = useState(null);
  const [isHandDetected, setIsHandDetected] = useState(false);
  const [fps, setFps] = useState(0);

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRefInternal.current;

    if (!canvas || !video) return null;

    const rect = video.getBoundingClientRect();

    const displayWidth = Math.max(1, Math.round(rect.width));
    const displayHeight = Math.max(1, Math.round(rect.height));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const internalWidth = Math.round(displayWidth * dpr);
    const internalHeight = Math.round(displayHeight * dpr);

    if (
      canvas.width !== internalWidth ||
      canvas.height !== internalHeight
    ) {
      canvas.width = internalWidth;
      canvas.height = internalHeight;
    }

    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    return {
      displayWidth,
      displayHeight,
      dpr,
    };
  }, []);

  const drawHand = useCallback(
    (points) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const size = syncCanvasSize();
      if (!size) return;

      const { displayWidth, displayHeight, dpr } = size;

      const ctx = canvas.getContext("2d");

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      if (!points || points.length < 21) return;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(2, displayWidth / 180);
      ctx.strokeStyle = "#22c55e";
      ctx.shadowBlur = 4;
      ctx.shadowColor = "rgba(34, 197, 94, 0.55)";

      HAND_CONNECTIONS.forEach(([startIndex, endIndex]) => {
        const startPoint = points[startIndex];
        const endPoint = points[endIndex];

        if (!startPoint || !endPoint) return;

        ctx.beginPath();
        ctx.moveTo(
          startPoint.x * displayWidth,
          startPoint.y * displayHeight
        );
        ctx.lineTo(
          endPoint.x * displayWidth,
          endPoint.y * displayHeight
        );
        ctx.stroke();
      });

      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ef4444";

      const pointRadius = Math.max(3, displayWidth / 150);

      points.forEach((point) => {
        if (!point) return;

        ctx.beginPath();
        ctx.arc(
          point.x * displayWidth,
          point.y * displayHeight,
          pointRadius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
    },
    [syncCanvasSize]
  );

  const loop = useCallback(() => {
    if (!isRunningRef.current) return;

    const video = videoRefInternal.current;

    if (!video || video.readyState < 2) {
      animationRef.current = requestAnimationFrame(loop);
      return;
    }

    const now = performance.now();
    const delta = Math.max(1, now - lastTimeRef.current);

    lastTimeRef.current = now;

    const currentFPS = Math.min(120, Math.round(1000 / delta));

    if (currentFPS !== fpsRef.current) {
      fpsRef.current = currentFPS;
      setFps(currentFPS);
    }

    const results = detectHands(video, now);

    handEngine.update(results, currentFPS);

    const points = handEngine.getLandmarks();
    const detected = handEngine.getHandDetected();

    if (detected !== handDetectedRef.current) {
      handDetectedRef.current = detected;
      setIsHandDetected(detected);
    }

    setLandmarks(points);
    drawHand(points);

    animationRef.current = requestAnimationFrame(loop);
  }, [drawHand]);

  const startTracking = useCallback(
    async (videoElement) => {
      if (!videoElement || isRunningRef.current) return;

      videoRefInternal.current = videoElement;

      await initializeHandLandmarker();

      syncCanvasSize();

      isRunningRef.current = true;
      lastTimeRef.current = performance.now();

      animationRef.current = requestAnimationFrame(loop);
    },
    [loop, syncCanvasSize]
  );

  const stopTracking = useCallback(() => {
    isRunningRef.current = false;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    videoRefInternal.current = null;

    fpsRef.current = 0;
    handDetectedRef.current = false;

    setLandmarks(null);
    setIsHandDetected(false);
    setFps(0);

    handEngine.reset();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      syncCanvasSize();
      drawHand(handEngine.getLandmarks());
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [drawHand, syncCanvasSize]);

  useEffect(() => {
    return () => {
      stopTracking();
      closeHandLandmarker();
    };
  }, [stopTracking]);

  return {
    canvasRef,
    landmarks,
    isHandDetected,
    fps,
    startTracking,
    stopTracking,
  };
}