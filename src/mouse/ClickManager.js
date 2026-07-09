class ClickManager {
  constructor() {
    this.isPinching = false;
    this.lastPinchTime = 0;
    this.doubleClickThreshold = 350;
    this.clickCooldown = 250;
  }

  update(pinching) {
    const now = Date.now();

    if (pinching && !this.isPinching) {
      this.isPinching = true;

      if (now - this.lastPinchTime < this.clickCooldown) {
        return { type: "none" };
      }

      this.lastPinchTime = now;
      return { type: "click" };
    }

    if (pinching && this.isPinching) {
      return { type: "hold" };
    }

    if (!pinching && this.isPinching) {
      this.isPinching = false;
      return { type: "release" };
    }

    return { type: "none" };
  }

  reset() {
    this.isPinching = false;
    this.lastPinchTime = 0;
  }
}

export default new ClickManager();