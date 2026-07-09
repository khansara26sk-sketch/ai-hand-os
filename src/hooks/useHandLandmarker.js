import { useCallback, useEffect, useRef, useState } from "react";
import {
  closeHandLandmarker,
  detectHands,
  initializeHandLandmarker,
} from "../services/visionService";
import handEngine from "../engine/HandEngine";

export function useHandLandmarker() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const videoRefInternal = useRef(null);

  const isRunningRef = useRef(false);
  const lastTimeRef = useRef(performance.now());

  // prevent unnecessary renders
  const fpsRef = useRef(0);
  const handDetectedRef = useRef(false);

  const [landmarks, setLandmarks] = useState(null);
  const [isHandDetected, setIsHandDetected] = useState(false);
  const [fps, setFps] = useState(0);

  const drawHand = useCallback((points) => {
    const canvas = canvasRef.current;
    const video = videoRefInternal.current;

    if (!canvas || !video) return;

    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!points) return;

    const connections = [
      [0, 1],[1, 2],[2, 3],[3, 4],
      [0, 5],[5, 6],[6, 7],[7, 8],
      [0, 9],[9,10],[10,11],[11,12],
      [0,13],[13,14],[14,15],[15,16],
      [0,17],[17,18],[18,19],[19,20],
      [5,9],[9,13],[13,17],
    ];

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#22c55e";

    connections.forEach(([a,b])=>{
      ctx.beginPath();
      ctx.moveTo(points[a].x*canvas.width,points[a].y*canvas.height);
      ctx.lineTo(points[b].x*canvas.width,points[b].y*canvas.height);
      ctx.stroke();
    });

    ctx.fillStyle="#ef4444";

    points.forEach((p)=>{
      ctx.beginPath();
      ctx.arc(
        p.x*canvas.width,
        p.y*canvas.height,
        5,
        0,
        Math.PI*2
      );
      ctx.fill();
    });

  },[]);

  const loop = useCallback(()=>{

    if(!isRunningRef.current) return;

    const video=videoRefInternal.current;

    if(!video){
      animationRef.current=requestAnimationFrame(loop);
      return;
    }

    const now=performance.now();

    const delta=now-lastTimeRef.current;
    lastTimeRef.current=now;

    const currentFPS=Math.round(1000/delta);

    // update FPS only if changed
    if(currentFPS!==fpsRef.current){
      fpsRef.current=currentFPS;
      setFps(currentFPS);
    }

    const results=detectHands(video,now);

    handEngine.update(results,currentFPS);

    const points=handEngine.getLandmarks();

    const detected=handEngine.getHandDetected();

    // update only when detection changes
    if(detected!==handDetectedRef.current){
      handDetectedRef.current=detected;
      setIsHandDetected(detected);
    }

    // landmarks still update every frame
    setLandmarks(points);

    drawHand(points);

    animationRef.current=requestAnimationFrame(loop);

  },[drawHand]);

  const startTracking=useCallback(async(videoElement)=>{

    if(isRunningRef.current) return;

    videoRefInternal.current=videoElement;

    await initializeHandLandmarker();

    isRunningRef.current=true;

    lastTimeRef.current=performance.now();

    animationRef.current=requestAnimationFrame(loop);

  },[loop]);

  const stopTracking=useCallback(()=>{

    isRunningRef.current=false;

    if(animationRef.current){
      cancelAnimationFrame(animationRef.current);
      animationRef.current=null;
    }

    drawHand(null);

    setLandmarks(null);
    setIsHandDetected(false);
    setFps(0);

  },[drawHand]);

  useEffect(()=>{
    return ()=>{
      stopTracking();
      closeHandLandmarker();
    };
  },[stopTracking]);

  return{
    canvasRef,
    landmarks,
    isHandDetected,
    fps,
    startTracking,
    stopTracking,
  };
}