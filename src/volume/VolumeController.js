class VolumeController {
  constructor() {
    this.mode = false;
    this.startY = null;
    this.volume = 50;
    this.visible = false;
    this.lastUpdate = 0;
  }

  update(gesture, landmarks) {
    if (gesture !== "thumbs_up") {
      this.mode = false;
      this.startY = null;
      this.visible = false;
      return;
    }

    if (!landmarks) return;

    this.visible = true;

    const wrist = landmarks[0];

    if (!this.mode) {
      this.mode = true;
      this.startY = wrist.y;
      console.log("🔊 Volume Mode");
      return;
    }

    const diff = this.startY - wrist.y;
    const now = Date.now();

    if (now - this.lastUpdate < 60) return;
    this.lastUpdate = now;

    if (Math.abs(diff) < 0.015) return;

    if (diff > 0) {
      this.volume = Math.min(100, this.volume + 2);
    } else {
      this.volume = Math.max(0, this.volume - 2);
    }

    this.startY = wrist.y;

    console.log("Volume:", this.volume);
  }

  getVolume() {
    return this.volume;
  }

  getVisible() {
    return this.visible;
  }

  isActive() {
    return this.mode;
  }
}

export default new VolumeController();