class BrightnessController {
  constructor() {
    this.mode = false;
    this.startY = null;

    this.brightness = 50;

    this.visible = false;

    this.lastUpdate = 0;
    this.hideTimeout = null;
  }

  update(gesture, landmarks) {
    if (gesture !== "brightness") {
      this.mode = false;
      this.startY = null;
      this.visible = false;
      return;
    }

    if (!landmarks) return;

    const wrist = landmarks[0];

    if (!this.mode) {
      this.mode = true;
      this.startY = wrist.y;
      this.visible = true;

      clearTimeout(this.hideTimeout);

      return;
    }

    const diff = this.startY - wrist.y;

    const now = Date.now();

    if (now - this.lastUpdate < 60) return;

    this.lastUpdate = now;

    if (Math.abs(diff) < 0.015) return;

    if (diff > 0) {
      this.brightness = Math.min(100, this.brightness + 2);
    } else {
      this.brightness = Math.max(0, this.brightness - 2);
    }

    this.startY = wrist.y;

    clearTimeout(this.hideTimeout);

    this.hideTimeout = setTimeout(() => {
      this.visible = false;
    }, 1000);

    console.log("Brightness:", this.brightness);
  }

  getBrightness() {
    return this.brightness;
  }

  getVisible() {
    return this.visible;
  }
}

export default new BrightnessController();