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

  const runningRef = useRef(false);
  const lastFrameTimeRef = useRef(performance.now());

  const fpsRef = useRef(0);
  const detectedRef = useRef(false);

  const [landmarks, setLandmarks] = useState(null);
  const [isHandDetected, setIsHandDetected] = useState(false);
  const [fps, setFps] = useState(0);

  const getVideoCoverMetrics = useCallback(() => {
    const video = videoRefInternal.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return null;

    const rect = video.getBoundingClientRect();

    const containerWidth = Math.max(1, rect.width);
    const containerHeight = Math.max(1, rect.height);

    const sourceWidth = video.videoWidth || containerWidth;
    const sourceHeight = video.videoHeight || containerHeight;

    /*
      object-cover uses the larger scale, so the video fills the box
      and some area may be cropped.
    */
    const scale = Math.max(
      containerWidth / sourceWidth,
      containerHeight / sourceHeight
    );

    const renderedWidth = sourceWidth * scale;
    const renderedHeight = sourceHeight * scale;

    const offsetX = (containerWidth - renderedWidth) / 2;
    const offsetY = (containerHeight - renderedHeight) / 2;

    return {
      containerWidth,
      containerHeight,
      renderedWidth,
      renderedHeight,
      offsetX,
      offsetY,
    };
  }, []);

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRefInternal.current;

    if (!canvas || !video) return null;

    const rect = video.getBoundingClientRect();

    const cssWidth = Math.max(1, Math.round(rect.width));
    const cssHeight = Math.max(1, Math.round(rect.height));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const internalWidth = Math.round(cssWidth * dpr);
    const internalHeight = Math.round(cssHeight * dpr);

    if (
      canvas.width !== internalWidth ||
      canvas.height !== internalHeight
    ) {
      canvas.width = internalWidth;
      canvas.height = internalHeight;
    }

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    return {
      cssWidth,
      cssHeight,
      dpr,
    };
  }, []);

  const drawHand = useCallback(
    (points) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasSize = syncCanvasSize();
      const metrics = getVideoCoverMetrics();

      if (!canvasSize || !metrics) return;

      const { cssWidth, cssHeight, dpr } = canvasSize;
      const {
        renderedWidth,
        renderedHeight,
        offsetX,
        offsetY,
      } = metrics;

      const ctx = canvas.getContext("2d");

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      if (!points || points.length < 21) return;

      const mapPoint = (point) => ({
        x: offsetX + point.x * renderedWidth,
        y: offsetY + point.y * renderedHeight,
      });

      ctx.save();

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(2, cssWidth / 190);
      ctx.strokeStyle = "#22c55e";
      ctx.shadowBlur = 4;
      ctx.shadowColor = "rgba(34, 197, 94, 0.55)";

      HAND_CONNECTIONS.forEach(([startIndex, endIndex]) => {
        const start = points[startIndex];
        const end = points[endIndex];

        if (!start || !end) return;

        const mappedStart = mapPoint(start);
        const mappedEnd = mapPoint(end);

        ctx.beginPath();
        ctx.moveTo(mappedStart.x, mappedStart.y);
        ctx.lineTo(mappedEnd.x, mappedEnd.y);
        ctx.stroke();
      });

      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ef4444";

      const radius = Math.max(3, cssWidth / 155);

      points.forEach((point) => {
        if (!point) return;

        const mapped = mapPoint(point);

        ctx.beginPath();
        ctx.arc(
          mapped.x,
          mapped.y,
          radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      ctx.restore();
    },
    [getVideoCoverMetrics, syncCanvasSize]
  );

  const trackingLoop = useCallback(() => {
    if (!runningRef.current) return;

    const video = videoRefInternal.current;

    if (!video || video.readyState < 2) {
      animationRef.current = requestAnimationFrame(trackingLoop);
      return;
    }

    const now = performance.now();
    const delta = Math.max(1, now - lastFrameTimeRef.current);

    lastFrameTimeRef.current = now;

    const currentFPS = Math.min(
      120,
      Math.round(1000 / delta)
    );

    if (currentFPS !== fpsRef.current) {
      fpsRef.current = currentFPS;
      setFps(currentFPS);
    }

    const results = detectHands(video, now);

    handEngine.update(results, currentFPS);

    const currentLandmarks = handEngine.getLandmarks();
    const detected = handEngine.getHandDetected();

    if (detected !== detectedRef.current) {
      detectedRef.current = detected;
      setIsHandDetected(detected);
    }

    setLandmarks(currentLandmarks);
    drawHand(currentLandmarks);

    animationRef.current = requestAnimationFrame(trackingLoop);
  }, [drawHand]);

  const startTracking = useCallback(
    async (videoElement) => {
      if (!videoElement || runningRef.current) return;

      videoRefInternal.current = videoElement;

      await initializeHandLandmarker();

      syncCanvasSize();

      runningRef.current = true;
      lastFrameTimeRef.current = performance.now();

      animationRef.current =
        requestAnimationFrame(trackingLoop);
    },
    [syncCanvasSize, trackingLoop]
  );

  const stopTracking = useCallback(() => {
    runningRef.current = false;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    videoRefInternal.current = null;

    fpsRef.current = 0;
    detectedRef.current = false;

    setLandmarks(null);
    setIsHandDetected(false);
    setFps(0);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      syncCanvasSize();
      drawHand(handEngine.getLandmarks());
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener(
      "orientationchange",
      handleResize
    );

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener(
        "orientationchange",
        handleResize
      );
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