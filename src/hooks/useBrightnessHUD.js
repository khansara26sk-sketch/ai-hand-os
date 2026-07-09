import { useEffect, useState } from "react";
import brightnessController from "../brightness/BrightnessController";

export default function useBrightnessHUD() {
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      force(v => v + 1);
    }, 30);

    return () => clearInterval(id);
  }, []);

  return {
    visible: brightnessController.getVisible(),
    brightness: brightnessController.getBrightness(),
  };
}