class ScrollController {
  constructor() {
    this.lastY = null;
    this.sensitivity = 3;
    this.minMovement = 3;
  }

  update(gesture, cursor, clickState) {
    if (!cursor) return;

    if (clickState?.type === "click" || clickState?.type === "hold") {
      this.reset();
      return;
    }

    if (gesture !== "scroll") {
      this.reset();
      return;
    }

    if (this.lastY === null) {
      this.lastY = cursor.y;
      return;
    }

    const dy = cursor.y - this.lastY;
    this.lastY = cursor.y;

    if (Math.abs(dy) < this.minMovement) return;

    window.scrollBy(0, -dy * this.sensitivity);
  }

  reset() {
    this.lastY = null;
  }
}

export default new ScrollController();