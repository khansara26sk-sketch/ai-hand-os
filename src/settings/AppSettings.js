const DEFAULT_SETTINGS = {
  cursorSpeed: 50,
  cursorSmoothness: 35,
  pinchSensitivity: 45,
  gestureSensitivity: 60,
  cameraFPS: 60,
  mirrorCamera: true,
  showLandmarks: true,
  voiceCommands: true,
  soundEffects: true,
  theme: "cyan",
};

class AppSettings {
  constructor() {
    this.key = "ai-hand-os-settings";
    this.listeners = new Set();
    this.settings = this.load();
  }

  getDefaults() {
    return { ...DEFAULT_SETTINGS };
  }

  load() {
    try {
      const saved = localStorage.getItem(this.key);

      if (!saved) {
        return this.getDefaults();
      }

      return {
        ...this.getDefaults(),
        ...JSON.parse(saved),
      };
    } catch {
      return this.getDefaults();
    }
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.settings));
    this.emit();
  }

  emit() {
    const snapshot = { ...this.settings };
    this.listeners.forEach((cb) => cb(snapshot));
  }

  get() {
    return { ...this.settings };
  }

  getValue(key) {
    return this.settings[key];
  }

  update(key, value) {
    this.settings = {
      ...this.settings,
      [key]: value,
    };

    this.save();
  }

  reset() {
    this.settings = this.getDefaults();
    this.save();
  }

  export() {
    const blob = new Blob([JSON.stringify(this.settings, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ai-hand-os-settings.json";
    link.click();

    URL.revokeObjectURL(link.href);
  }

  import(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);

        this.settings = {
          ...this.getDefaults(),
          ...data,
        };

        this.save();
      } catch {
        alert("Invalid settings file");
      }
    };

    reader.readAsText(file);
  }

  subscribe(cb) {
    this.listeners.add(cb);
    cb({ ...this.settings });

    return () => {
      this.listeners.delete(cb);
    };
  }
}

export { DEFAULT_SETTINGS };
export default new AppSettings();