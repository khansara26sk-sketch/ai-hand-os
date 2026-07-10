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

  const activeTheme = settings?.theme || "cyan";

  return (
    <div
  className={`h-screen h-[100dvh] overflow-hidden bg-[#070b16] text-white flex theme-${activeTheme}`}
>
      {/* Global HUD overlays */}
      <VolumeHUD
        visible={Boolean(volumeHUD?.visible)}
        volume={volumeHUD?.volume ?? 50}
      />

      <BrightnessHUD
        visible={Boolean(brightnessHUD?.visible)}
        brightness={brightnessHUD?.brightness ?? 50}
      />

      <ScreenshotHUD
        visible={Boolean(screenshotHUD?.visible)}
        countdown={screenshotHUD?.countdown ?? null}
        flash={Boolean(screenshotHUD?.flash)}
        message={screenshotHUD?.message || ""}
      />

      <VoiceHUD />

      <PresentationHUD />

      {/* Desktop sidebar + mobile bottom navigation */}
      <Sidebar />

      {/* Main application area */}
      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-0">
        <Navbar />

        <main
  data-ai-scroll-container="true"
  className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6"
>
  <Outlet />
</main>

        <StatusBar />
      </div>
    </div>
  );
}

export default AppLayout;