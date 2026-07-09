import { useEffect, useState } from "react";
import appSettings from "../settings/AppSettings";

export default function useAppSettings() {
  const [settings, setSettings] = useState(() => appSettings.get());

  useEffect(() => {
    return appSettings.subscribe((nextSettings) => {
      setSettings({ ...nextSettings });
    });
  }, []);

  return {
    settings,
    update: (key, value) => appSettings.update(key, value),
    reset: () => appSettings.reset(),
    exportSettings: () => appSettings.export(),
    importSettings: (file) => appSettings.import(file),
  };
}