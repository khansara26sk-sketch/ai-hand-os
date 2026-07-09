import { useEffect, useState } from "react";
import screenshotController from "../screenshot/ScreenshotController";

export default function useScreenshotHUD() {
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      force((v) => v + 1);
    }, 50);

    return () => clearInterval(id);
  }, []);

  return screenshotController.getState();
}