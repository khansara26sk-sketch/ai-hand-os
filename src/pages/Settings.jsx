import useAppSettings from "../hooks/useAppSettings";

function Settings() {
  const { settings, update, reset, exportSettings, importSettings } =
    useAppSettings();

  const Slider = ({ label, value, onChange }) => (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex justify-between mb-3">
        <span className="font-medium">{label}</span>
        <span className="text-cyan-300">{value}%</span>
      </div>

      <input
        data-ai-clickable="true"
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-400"
      />
    </div>
  );

  const Toggle = ({ label, value, onChange }) => (
    <button
      data-ai-clickable="true"
      onClick={() => onChange(!value)}
      className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
    >
      <span className="font-medium">{label}</span>

      <span
        className={`w-14 h-8 rounded-full p-1 transition ${
          value ? "bg-cyan-500" : "bg-gray-600"
        }`}
      >
        <span
          className={`block w-6 h-6 rounded-full bg-white transition ${
            value ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-3">AI Control Center</h1>

      <p className="text-gray-300 mb-8">
        Customize gestures, cursor, camera, voice, and appearance.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">🖱 Cursor</h2>

          <Slider
            label="Cursor Speed"
            value={settings.cursorSpeed}
            onChange={(v) => update("cursorSpeed", v)}
          />

          <Slider
            label="Cursor Smoothness"
            value={settings.cursorSmoothness}
            onChange={(v) => update("cursorSmoothness", v)}
          />

          <Slider
            label="Pinch Sensitivity"
            value={settings.pinchSensitivity}
            onChange={(v) => update("pinchSensitivity", v)}
          />

          <Slider
            label="Gesture Sensitivity"
            value={settings.gestureSensitivity}
            onChange={(v) => update("gestureSensitivity", v)}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">📷 Camera</h2>

          <Slider
            label="Camera FPS"
            value={settings.cameraFPS}
            onChange={(v) => update("cameraFPS", v)}
          />

          <Toggle
            label="Mirror Camera"
            value={settings.mirrorCamera}
            onChange={(v) => update("mirrorCamera", v)}
          />

          <Toggle
            label="Show Hand Landmarks"
            value={settings.showLandmarks}
            onChange={(v) => update("showLandmarks", v)}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">🎤 Voice & Sound</h2>

          <Toggle
            label="Voice Commands"
            value={settings.voiceCommands}
            onChange={(v) => update("voiceCommands", v)}
          />

          <Toggle
            label="Sound Effects"
            value={settings.soundEffects}
            onChange={(v) => update("soundEffects", v)}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">🎨 Theme</h2>

          <div className="grid grid-cols-3 gap-3">
            {["cyan", "purple", "green"].map((theme) => (
              <button
                key={theme}
                data-ai-clickable="true"
                onClick={() => update("theme", theme)}
                className={`p-5 rounded-2xl border capitalize ${
                  settings.theme === theme
                    ? "border-cyan-300 bg-cyan-500/20 text-cyan-200"
                    : "border-white/10 bg-white/5 text-white"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          data-ai-clickable="true"
          onClick={exportSettings}
          className="px-6 py-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300"
        >
          Export Settings
        </button>

        <label className="px-6 py-3 rounded-xl bg-white/10 border border-white/10 text-white cursor-pointer">
          Import Settings
          <input
            type="file"
            accept="application/json"
            onChange={(e) => importSettings(e.target.files?.[0])}
            className="hidden"
          />
        </label>

        <button
          data-ai-clickable="true"
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}

export default Settings;