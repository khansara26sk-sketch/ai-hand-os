import { useEffect, useState } from "react";
import presentationController from "../presentation/PresentationController";

export default function usePresentation() {
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      force((v) => v + 1);
    }, 80);

    return () => clearInterval(id);
  }, []);

  return presentationController.getState();
}