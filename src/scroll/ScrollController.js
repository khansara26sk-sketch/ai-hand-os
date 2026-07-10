class ScrollController {
  constructor() {
    this.active = false;
    this.previousY = null;
    this.smoothedMovement = 0;
    this.lastUpdateTime = 0;

    this.deadZone = 0.0025;
    this.sensitivity = 1800;
    this.maxStep = 110;
    this.updateInterval = 16;
  }

  isFingerExtended(landmarks, tipId, pipId) {
    const tip = landmarks?.[tipId];
    const pip = landmarks?.[pipId];

    if (!tip || !pip) return false;

    return tip.y < pip.y;
  }

  isTwoFingerScrollGesture(landmarks) {
    if (!landmarks || landmarks.length < 21) return false;

    const indexExtended = this.isFingerExtended(landmarks, 8, 6);
    const middleExtended = this.isFingerExtended(landmarks, 12, 10);
    const ringExtended = this.isFingerExtended(landmarks, 16, 14);
    const pinkyExtended = this.isFingerExtended(landmarks, 20, 18);

    return (
      indexExtended &&
      middleExtended &&
      !ringExtended &&
      !pinkyExtended
    );
  }

  getScrollContainer() {
    const appContainer = document.querySelector(
      "[data-ai-scroll-container='true']"
    );

    if (
      appContainer &&
      appContainer.scrollHeight > appContainer.clientHeight
    ) {
      return appContainer;
    }

    return (
      document.scrollingElement ||
      document.documentElement
    );
  }

  update(landmarks) {
    const isScrollGesture =
      this.isTwoFingerScrollGesture(landmarks);

    if (!isScrollGesture) {
      this.reset();
      return;
    }

    /*
      Middle fingertip is more responsive than wrist.
      Average index + middle fingertip for stability.
    */
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];

    if (!indexTip || !middleTip) {
      this.reset();
      return;
    }

    const currentY = (indexTip.y + middleTip.y) / 2;

    if (!this.active || this.previousY === null) {
      this.active = true;
      this.previousY = currentY;
      this.smoothedMovement = 0;
      this.lastUpdateTime = performance.now();
      return;
    }

    const now = performance.now();

    if (now - this.lastUpdateTime < this.updateInterval) {
      return;
    }

    const rawMovement = currentY - this.previousY;

    this.smoothedMovement =
      this.smoothedMovement * 0.55 +
      rawMovement * 0.45;

    if (Math.abs(this.smoothedMovement) < this.deadZone) {
      return;
    }

    let scrollAmount =
      this.smoothedMovement * this.sensitivity;

    scrollAmount = Math.max(
      -this.maxStep,
      Math.min(this.maxStep, scrollAmount)
    );

    const container = this.getScrollContainer();

    if (
      container === document.documentElement ||
      container === document.body ||
      container === document.scrollingElement
    ) {
      window.scrollBy({
        top: scrollAmount,
        left: 0,
        behavior: "auto",
      });
    } else {
      container.scrollTop += scrollAmount;
    }

    this.previousY = currentY;
    this.lastUpdateTime = now;
  }

  reset() {
    this.active = false;
    this.previousY = null;
    this.smoothedMovement = 0;
    this.lastUpdateTime = 0;
  }
}

export default new ScrollController();