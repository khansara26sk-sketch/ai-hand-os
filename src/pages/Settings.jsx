import useAppSettings from "../hooks/useAppSettings";

function Settings() {
  const { settings, update, reset, exportSettings, importSettings } =
    useAppSettings();

  const Slider = ({ label, value, onChange, suffix = "%" }) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm sm:text-base font-medium">{label}</span>

        <span className="shrink-0 text-sm sm:text-base text-cyan-300">
          {value}
          {suffix}
        </span>
      </div>

      <input
        data-ai-clickable="true"
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-cyan-400"
      />
    </div>
  );

  const Toggle = ({ label, description, value, onChange }) => (
    <button
      type="button"
      data-ai-clickable="true"
      onClick={() => onChange(!value)}
      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-left flex items-center justify-between gap-4 active:scale-[0.99] transition"
    >
      <span className="min-w-0">
        <span className="block text-sm sm:text-base font-medium text-white">
          {label}
        </span>

        {description && (
          <span className="mt-1 block text-xs sm:text-sm text-gray-500 leading-relaxed">
            {description}
          </span>
        )}
      </span>

      <span
        className={`relative h-8 w-14 shrink-0 rounded-full p-1 transition ${
          value ? "bg-cyan-500" : "bg-gray-600"
        }`}
      >
        <span
          className={`block h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
            value ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );

  const themes = [
    {
      id: "cyan",
      label: "Cyan",
      previewClass: "bg-cyan-400",
    },
    {
      id: "purple",
      label: "Purple",
      previewClass: "bg-purple-500",
    },
    {
      id: "green",
      label: "Green",
      previewClass: "bg-green-500",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-6">
      <section>
        <p className="text-xs sm:text-sm uppercase tracking-[0.22em] text-cyan-300">
          System Preferences
        </p>

        <h1 className="mt-2 text-3xl sm:text-4xl font-bold">
          AI Control Center
        </h1>

        <p className="mt-3 max-w-3xl text-sm sm:text-base text-gray-300 leading-relaxed">
          Customize cursor behavior, camera controls, voice commands and the
          appearance of AI Hand OS.
        </p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">🖱 Cursor</h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Adjust movement, smoothness and pinch recognition.
            </p>
          </div>

          <Slider
            label="Cursor Speed"
            value={settings.cursorSpeed}
            onChange={(value) => update("cursorSpeed", value)}
          />

          <Slider
            label="Cursor Smoothness"
            value={settings.cursorSmoothness}
            onChange={(value) => update("cursorSmoothness", value)}
          />

          <Slider
            label="Pinch Sensitivity"
            value={settings.pinchSensitivity}
            onChange={(value) => update("pinchSensitivity", value)}
          />

          <Slider
            label="Gesture Sensitivity"
            value={settings.gestureSensitivity}
            onChange={(value) => update("gestureSensitivity", value)}
          />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">📷 Camera</h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Manage camera rendering and hand tracking overlays.
            </p>
          </div>

          <Slider
            label="Camera FPS"
            value={settings.cameraFPS}
            onChange={(value) => update("cameraFPS", value)}
          />

          <Toggle
            label="Mirror Camera"
            description="Flip the video horizontally for a natural mirror view."
            value={settings.mirrorCamera}
            onChange={(value) => update("mirrorCamera", value)}
          />

          <Toggle
            label="Show Hand Landmarks"
            description="Display the hand skeleton and tracking points."
            value={settings.showLandmarks}
            onChange={(value) => update("showLandmarks", value)}
          />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              🎤 Voice & Sound
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Enable or disable voice navigation and feedback sounds.
            </p>
          </div>

          <Toggle
            label="Voice Commands"
            description="Show the voice assistant and allow spoken navigation."
            value={settings.voiceCommands}
            onChange={(value) => update("voiceCommands", value)}
          />

          <Toggle
            label="Sound Effects"
            description="Play feedback sounds for supported actions."
            value={settings.soundEffects}
            onChange={(value) => update("soundEffects", value)}
          />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">🎨 Theme</h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Choose the accent color used throughout the interface.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themes.map((theme) => {
              const selected = settings.theme === theme.id;

              return (
                <button
                  type="button"
                  key={theme.id}
                  data-ai-clickable="true"
                  onClick={() => update("theme", theme.id)}
                  className={`rounded-2xl border p-4 sm:p-5 text-left transition active:scale-[0.98] ${
                    selected
                      ? "border-cyan-300 bg-cyan-500/20 text-cyan-200"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  <span
                    className={`block h-8 w-8 rounded-full ${theme.previewClass}`}
                  />

                  <span className="mt-3 block font-semibold">
                    {theme.label}
                  </span>

                  <span className="mt-1 block text-xs text-gray-500">
                    {selected ? "Currently active" : "Tap to activate"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <h2 className="text-lg sm:text-xl font-bold">Settings Management</h2>

        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Export your preferences, restore a saved configuration or return to
          the defaults.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            data-ai-clickable="true"
            onClick={exportSettings}
            className="w-full rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-4 py-3 text-sm sm:text-base font-medium text-cyan-300 active:scale-[0.98] transition"
          >
            Export Settings
          </button>

          <label className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-center text-sm sm:text-base font-medium text-white cursor-pointer active:scale-[0.98] transition">
            Import Settings

            <input
              type="file"
              accept="application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  importSettings(file);
                  event.target.value = "";
                }
              }}
              className="hidden"
            />
          </label>

          <button
            type="button"
            data-ai-clickable="true"
            onClick={reset}
            className="w-full rounded-xl border border-red-400/40 bg-red-500/20 px-4 py-3 text-sm sm:text-base font-medium text-red-300 active:scale-[0.98] transition"
          >
            Reset All
          </button>
        </div>
      </section>
    </div>
  );
}

export default Settings;