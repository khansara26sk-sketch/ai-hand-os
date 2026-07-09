import { useEffect, useState } from "react";
import voiceCommandController from "../voice/VoiceCommandController";

export default function useVoiceCommand() {
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      force((v) => v + 1);
    }, 100);

    return () => clearInterval(id);
  }, []);

  return voiceCommandController.getState();
}