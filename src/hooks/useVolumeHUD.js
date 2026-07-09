import { useEffect, useState } from "react";
import volumeController from "../volume/VolumeController";

export default function useVolumeHUD() {
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      force(v => v + 1);
    }, 30);

    return () => clearInterval(id);
  }, []);

  return {
    visible: volumeController.getVisible(),
    volume: volumeController.getVolume(),
  };
}