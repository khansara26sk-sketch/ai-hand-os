export class HandEngine {
  constructor() {
    this._landmarks = null;
    this._handDetected = false;
    this._handedness = null;
    this._fps = 0;
    this._gesture = "none";
    this._subscribers = new Set();

    this.update = this.update.bind(this);
  }

  update(results, fps) {
    const points = results?.landmarks?.[0] || null;
    const hasHand = Boolean(points);

    this._handDetected = hasHand;
    this._landmarks = points;
    this._handedness = hasHand
      ? results?.handedness?.[0]?.[0]?.categoryName ?? null
      : null;

    if (typeof fps === "number") {
      this._fps = fps;
    }

    this._gesture = this._recognizeGesture(this._landmarks);
    this._notify();
  }

  _recognizeGesture(landmarks) {
    if (!landmarks || landmarks.length < 21) {
      return "none";
    }

    const TIP_IDS = {
      thumb: 4,
      index: 8,
      middle: 12,
      ring: 16,
      pinky: 20,
    };

    const PIP_IDS = {
      thumb: 2,
      index: 6,
      middle: 10,
      ring: 14,
      pinky: 18,
    };

    const isExtended = (finger) => {
      return landmarks[TIP_IDS[finger]].y < landmarks[PIP_IDS[finger]].y;
    };

    const extended = {
      thumb: isExtended("thumb"),
      index: isExtended("index"),
      middle: isExtended("middle"),
      ring: isExtended("ring"),
      pinky: isExtended("pinky"),
    };

    const extendedCount = Object.values(extended).filter(Boolean).length;

    // 🤟 I LOVE YOU = SCREENSHOT
    // Thumb + index + pinky extended
    if (
      extended.thumb &&
      extended.index &&
      !extended.middle &&
      !extended.ring &&
      extended.pinky
    ) {
      return "screenshot";
    }

    // 🤙 SHAKA = PRESENTATION MODE
    // Thumb + pinky extended, other fingers folded
    if (
      extended.thumb &&
      !extended.index &&
      !extended.middle &&
      !extended.ring &&
      extended.pinky
    ) {
      return "presentation";
    }

    // 👍 THUMBS UP = VOLUME
    // Thumb extended, other fingers folded
    if (
      extended.thumb &&
      !extended.index &&
      !extended.middle &&
      !extended.ring &&
      !extended.pinky
    ) {
      return "thumbs_up";
    }

    // ☝️ THREE FINGERS = BRIGHTNESS
    // Index + middle + ring extended, pinky folded
    if (
      extended.index &&
      extended.middle &&
      extended.ring &&
      !extended.pinky
    ) {
      return "brightness";
    }

    // ✌️ TWO FINGERS = SCROLL
    if (
      extended.index &&
      extended.middle &&
      !extended.ring &&
      !extended.pinky
    ) {
      return "scroll";
    }

    // 👉 ONE FINGER = POINTING
    if (
      extended.index &&
      !extended.middle &&
      !extended.ring &&
      !extended.pinky
    ) {
      return "pointing";
    }

    // 🖐 OPEN PALM = CURSOR
    if (extendedCount >= 4) {
      return "open_palm";
    }

    // ✊ FIST
    // Ignore thumb because thumb detection is unstable
    if (
      !extended.index &&
      !extended.middle &&
      !extended.ring &&
      !extended.pinky
    ) {
      return "fist";
    }

    return "unknown";
  }

  getLandmarks() {
    return this._landmarks;
  }

  getGesture() {
    return this._gesture;
  }

  getFPS() {
    return this._fps;
  }

  getHandDetected() {
    return this._handDetected;
  }

  getHandedness() {
    return this._handedness;
  }

  getState() {
    return {
      landmarks: this._landmarks,
      handDetected: this._handDetected,
      handedness: this._handedness,
      fps: this._fps,
      gesture: this._gesture,
    };
  }

  subscribe(callback) {
    if (typeof callback !== "function") {
      throw new TypeError("HandEngine.subscribe expects a function callback.");
    }

    this._subscribers.add(callback);
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback) {
    this._subscribers.delete(callback);
  }

  _notify() {
    const snapshot = this.getState();

    this._subscribers.forEach((callback) => {
      try {
        callback(snapshot);
      } catch (err) {
        console.error("[HandEngine] Subscriber error:", err);
      }
    });
  }

  reset() {
    this._landmarks = null;
    this._handDetected = false;
    this._handedness = null;
    this._fps = 0;
    this._gesture = "none";
    this._subscribers.clear();
  }
}

const handEngine = new HandEngine();
export default handEngine;