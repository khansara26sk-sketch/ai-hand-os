class PresentationController {
  constructor() {
    this.active = false;
    this.visible = false;
    this.lastAction = "Idle";

    this.startX = null;
    this.lastSwipeTime = 0;
    this.cooldown = 900;
    this.swipeThreshold = 120;

    this.toggleStartTime = null;
    this.lastToggleTime = 0;
    this.toggleHoldTime = 1000;
    this.toggleCooldown = 1500;
  }

  update(gesture, cursorPosition) {
    const now = Date.now();

    // 🤙 Shaka hold = Presentation ON/OFF
    if (gesture === "presentation") {
      if (!this.toggleStartTime) {
        this.toggleStartTime = now;
      }

      if (
        now - this.toggleStartTime >= this.toggleHoldTime &&
        now - this.lastToggleTime >= this.toggleCooldown
      ) {
        this.toggle();
        this.lastToggleTime = now;
        this.toggleStartTime = null;
      }
    } else {
      this.toggleStartTime = null;
    }

    if (!this.active || !cursorPosition) return;

    if (this.startX === null) {
      this.startX = cursorPosition.x;
      return;
    }

    const diff = cursorPosition.x - this.startX;

    console.log("Swipe diff px:", diff);

    if (now - this.lastSwipeTime < this.cooldown) return;

    if (diff > this.swipeThreshold) {
      this.nextSlide();
      this.startX = cursorPosition.x;
      this.lastSwipeTime = now;
      return;
    }

    if (diff < -this.swipeThreshold) {
      this.previousSlide();
      this.startX = cursorPosition.x;
      this.lastSwipeTime = now;
      return;
    }
  }

  toggle() {
    if (this.active) {
      this.active = false;
      this.visible = false;
      this.startX = null;
      this.lastAction = "Presentation Mode OFF";
      console.log("🛑 Presentation OFF");
    } else {
      this.active = true;
      this.visible = true;
      this.startX = null;
      this.lastAction = "Presentation Mode ON";
      console.log("🖥️ Presentation ON");
    }
  }

  fireKey(key) {
    const eventOptions = {
      key,
      code: key,
      keyCode: key === "ArrowRight" ? 39 : 37,
      which: key === "ArrowRight" ? 39 : 37,
      bubbles: true,
      cancelable: true,
    };

    document.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
    window.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
    document.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
    window.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
  }

  nextSlide() {
    this.lastAction = "➡ Next Slide";
    console.log("➡ Next Slide");

    window.dispatchEvent(new CustomEvent("presentation-next"));
    this.fireKey("ArrowRight");
  }

  previousSlide() {
    this.lastAction = "⬅ Previous Slide";
    console.log("⬅ Previous Slide");

    window.dispatchEvent(new CustomEvent("presentation-prev"));
    this.fireKey("ArrowLeft");
  }

  getState() {
    return {
      active: this.active,
      visible: this.visible,
      lastAction: this.lastAction,
    };
  }
}

export default new PresentationController();