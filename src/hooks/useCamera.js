import { useRef, useState, useCallback, useEffect } from "react";

export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async () => {
    console.log("Start camera clicked");
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsCameraOn(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);

      setIsCameraOn(false);
      setStream(null);
      streamRef.current = null;

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera permission was denied. Please allow camera access.");
      } else if (err.name === "NotFoundError") {
        setError("No camera device was found.");
      } else {
        setError("Unable to access the camera.");
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    streamRef.current = null;
    setStream(null);
    setIsCameraOn(false);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    stream,
    isCameraOn,
    error,
    startCamera,
    stopCamera,
  };
}