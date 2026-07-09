import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import StatusBar from "../StatusBar/StatusBar";

import VolumeHUD from "../Volume/VolumeHUD";
import BrightnessHUD from "../Brightness/BrightnessHUD";
import ScreenshotHUD from "../Screenshot/ScreenshotHUD";
import VoiceHUD from "../Voice/VoiceHUD";
import PresentationHUD from "../Presentation/PresentationHUD";

import useVolumeHUD from "../../hooks/useVolumeHUD";
import useBrightnessHUD from "../../hooks/useBrightnessHUD";
import useScreenshotHUD from "../../hooks/useScreenshotHUD";
import useAppSettings from "../../hooks/useAppSettings";

function AppLayout() {
  const volumeHUD = useVolumeHUD();
  const brightnessHUD = useBrightnessHUD();
  const screenshotHUD = useScreenshotHUD();
  const { settings } = useAppSettings();

  const themeClass =
    settings.theme === "purple"
      ? "theme-purple"
      : settings.theme === "green"
      ? "theme-green"
      : "theme-cyan";

  return (
    <div className={`min-h-screen bg-[#070b16] text-white flex ${themeClass}`}>
      <VolumeHUD visible={volumeHUD.visible} volume={volumeHUD.volume} />

      <BrightnessHUD
        visible={brightnessHUD.visible}
        brightness={brightnessHUD.brightness}
      />

      <ScreenshotHUD
        visible={screenshotHUD.visible}
        countdown={screenshotHUD.countdown}
        flash={screenshotHUD.flash}
        message={screenshotHUD.message}
      />

      <VoiceHUD />
      <PresentationHUD />

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

        <StatusBar />
      </div>
    </div>
  );
}

export default AppLayout;