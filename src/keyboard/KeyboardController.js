class KeyboardController {
  constructor() {
    this.hoveredKey = null;
  }

  update(cursor) {
    if (!cursor) return;

    const keys = document.querySelectorAll("[data-ai-key]");

    let nearest = null;
    let nearestDistance = Infinity;

    keys.forEach((key) => {
      const rect = key.getBoundingClientRect();

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const distance = Math.hypot(
        cursor.x - cx,
        cursor.y - cy
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = key;
      }
    });

    if (this.hoveredKey !== nearest) {
      this.hoveredKey?.classList.remove("ai-key-hover");

      if (nearest) {
        nearest.classList.add("ai-key-hover");
      }

      this.hoveredKey = nearest;
    }
  }

  press() {
    if (!this.hoveredKey) return;

    this.hoveredKey.click();
  }
}

export default new KeyboardController();