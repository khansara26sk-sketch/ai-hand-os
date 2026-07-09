// GestureRecognizer.js
// -----------------------------------------------------------------------
// GestureRecognizer
//
// A reusable, pure JavaScript class that classifies a static hand pose
// from a single frame's worth of 21 hand landmarks (the same landmark
// format produced by MediaPipe Hands / Tasks Vision: an array of 21
// {x, y, z} points, normalized to [0, 1] relative to the image).
//
// This class knows NOTHING about MediaPipe, React, or how the landmarks
// were produced — it only consumes the landmark array. That keeps it
// reusable anywhere in the app (or in a totally different project) as
// long as the caller hands it 21 points in the expected order.
//
// Supported gestures: openPalm, fist, pointing, pinch, peace, thumbsUp.
// Falls back to "none" when no known pose matches.
// -----------------------------------------------------------------------

export class GestureRecognizer {
  constructor() {
    // Landmark indices, following the standard MediaPipe Hands layout.
    // Kept as instance constants so helper methods stay readable instead
    // of being littered with magic numbers.
    this.LANDMARKS = {
      WRIST: 0,
      THUMB_CMC: 1,
      THUMB_MCP: 2,
      THUMB_IP: 3,
      THUMB_TIP: 4,
      INDEX_MCP: 5,
      INDEX_PIP: 6,
      INDEX_DIP: 7,
      INDEX_TIP: 8,
      MIDDLE_MCP: 9,
      MIDDLE_PIP: 10,
      MIDDLE_DIP: 11,
      MIDDLE_TIP: 12,
      RING_MCP: 13,
      RING_PIP: 14,
      RING_DIP: 15,
      RING_TIP: 16,
      PINKY_MCP: 17,
      PINKY_PIP: 18,
      PINKY_DIP: 19,
      PINKY_TIP: 20,
    };

    // The last landmark set passed to recognize(), cached so the
    // individual isX() methods can be called afterwards without the
    // caller having to re-pass landmarks every time.
    this._landmarks = null;
  }

  // =====================================================================
  // PUBLIC API
  // =====================================================================

  /**
   * recognize
   * Main entry point. Classifies the given landmarks into a single
   * gesture label. Caches the landmarks internally so the individual
   * isX() helper methods can also be called afterward with no arguments.
   *
   * Checks are ordered from most specific/constrained to least, so that
   * a pose which could arguably satisfy more than one rule resolves to
   * the most meaningful label (e.g. a pinch is checked before openPalm,
   * since a pinch can otherwise look like a mostly-open hand).
   *
   * @param {Array<{x:number, y:number, z:number}>} landmarks - 21 hand
   *        landmarks for a single hand, in MediaPipe order.
   * @returns {string} one of: "pinch", "fist", "pointing", "peace",
   *          "thumbsUp", "openPalm", or "none" if nothing matches.
   */
  recognize(landmarks) {
    if (!this._isValidLandmarkSet(landmarks)) {
      this._landmarks = null;
      return "none";
    }

    this._landmarks = landmarks;

    if (this.isPinching()) return "pinch";
    if (this.isFist()) return "fist";
    if (this.isPeace()) return "peace";
    if (this.isThumbsUp()) return "thumbsUp";
    if (this.isPointing()) return "pointing";
    if (this.isOpenPalm()) return "openPalm";

    return "none";
  }

  /**
   * isPinching
   * True when the thumb tip and index fingertip are close together
   * relative to the size of the hand (distance is normalized against
   * palm width so it works regardless of how close/far the hand is
   * from the camera).
   * @returns {boolean}
   */
  isPinching() {
    const lm = this._landmarks;
    if (!lm) return false;

    const thumbTip = lm[this.LANDMARKS.THUMB_TIP];
    const indexTip = lm[this.LANDMARKS.INDEX_TIP];

    const pinchDistance = this._distance(thumbTip, indexTip);
    const handScale = this._palmWidth(lm);

    // Tips are considered "touching" once they're within ~40% of the
    // palm's width — tuned to be forgiving of camera noise while still
    // requiring a clear, deliberate pinch.
    return pinchDistance < handScale * 0.28;
  }

  /**
   * isPointing
   * True when only the index finger is extended and every other finger
   * (middle, ring, pinky) is curled. Thumb state is ignored, since a
   * relaxed or extended thumb is common in a natural pointing pose.
   * @returns {boolean}
   */
  isPointing() {
    const lm = this._landmarks;
    if (!lm) return false;

    const index = this._isFingerExtended("INDEX");
    const middle = this._isFingerExtended("MIDDLE");
    const ring = this._isFingerExtended("RING");
    const pinky = this._isFingerExtended("PINKY");

    return index && !middle && !ring && !pinky;
  }

  /**
   * isOpenPalm
   * True when all five fingers (thumb included) are extended — a fully
   * open hand.
   * @returns {boolean}
   */
  isOpenPalm() {
    const lm = this._landmarks;
    if (!lm) return false;

    return (
      this._isThumbExtended() &&
      this._isFingerExtended("INDEX") &&
      this._isFingerExtended("MIDDLE") &&
      this._isFingerExtended("RING") &&
      this._isFingerExtended("PINKY")
    );
  }

  /**
   * isFist
   * True when all five fingers (thumb included) are curled into the
   * palm — a closed hand.
   * @returns {boolean}
   */
  isFist() {
    const lm = this._landmarks;
    if (!lm) return false;

    return (
      !this._isThumbExtended() &&
      !this._isFingerExtended("INDEX") &&
      !this._isFingerExtended("MIDDLE") &&
      !this._isFingerExtended("RING") &&
      !this._isFingerExtended("PINKY")
    );
  }

  /**
   * isPeace
   * True when index and middle fingers are extended (forming a "V"),
   * while ring and pinky are curled. Thumb state is ignored, matching
   * how people naturally make this gesture.
   * @returns {boolean}
   */
  isPeace() {
    const lm = this._landmarks;
    if (!lm) return false;

    const index = this._isFingerExtended("INDEX");
    const middle = this._isFingerExtended("MIDDLE");
    const ring = this._isFingerExtended("RING");
    const pinky = this._isFingerExtended("PINKY");

    return index && middle && !ring && !pinky;
  }

  /**
   * isThumbsUp
   * True when the thumb is extended and pointing upward (tip well above
   * its base joint), while all four fingers are curled into a fist.
   * @returns {boolean}
   */
  isThumbsUp() {
    const lm = this._landmarks;
    if (!lm) return false;

    const fingersCurled =
      !this._isFingerExtended("INDEX") &&
      !this._isFingerExtended("MIDDLE") &&
      !this._isFingerExtended("RING") &&
      !this._isFingerExtended("PINKY");

    const thumbTip = lm[this.LANDMARKS.THUMB_TIP];
    const thumbMcp = lm[this.LANDMARKS.THUMB_MCP];

    // "Upward" means a smaller y value in image space (y grows downward).
    // Require a clear vertical gap, not just barely above, to avoid false
    // positives from a resting thumb.
    const thumbPointsUp = thumbTip.y < thumbMcp.y - 0.05;

    return this._isThumbExtended() && thumbPointsUp && fingersCurled;
  }

  // =====================================================================
  // HELPER METHODS (internal, prefixed with _)
  // =====================================================================

  /**
   * _isValidLandmarkSet
   * Guards every public method against malformed input.
   * @param {*} landmarks
   * @returns {boolean}
   */
  _isValidLandmarkSet(landmarks) {
    return Array.isArray(landmarks) && landmarks.length === 21;
  }

  /**
   * _distance
   * Euclidean distance between two landmark points. Uses x/y only (2D),
   * since z from MediaPipe is a rough depth estimate and noisier than
   * x/y for this kind of pose comparison.
   * @param {{x:number, y:number}} a
   * @param {{x:number, y:number}} b
   * @returns {number}
   */
  _distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * _palmWidth
   * Distance across the palm (index MCP to pinky MCP), used as a
   * hand-size reference so distance-based checks (like pinch detection)
   * scale correctly regardless of how close the hand is to the camera.
   * @param {Array} lm
   * @returns {number}
   */
  _palmWidth(lm) {
    return this._distance(lm[this.LANDMARKS.INDEX_MCP], lm[this.LANDMARKS.PINKY_MCP]);
  }

  /**
   * _isFingerExtended
   * Generic "is this finger straight/extended?" check for the four
   * fingers that share the same joint structure (index, middle, ring,
   * pinky). A finger is considered extended when its fingertip is
   * farther from the wrist than its PIP (middle) joint is — i.e. the
   * finger is reaching outward rather than curled back toward the palm.
   *
   * @param {"INDEX"|"MIDDLE"|"RING"|"PINKY"} fingerName
   * @returns {boolean}
   */
  _isFingerExtended(fingerName) {
    const lm = this._landmarks;
    const wrist = lm[this.LANDMARKS.WRIST];

    const tip = lm[this.LANDMARKS[`${fingerName}_TIP`]];
    const pip = lm[this.LANDMARKS[`${fingerName}_PIP`]];

    const tipToWrist = this._distance(tip, wrist);
    const pipToWrist = this._distance(pip, wrist);

    return tipToWrist > pipToWrist;
  }

  /**
   * _isThumbExtended
   * The thumb has a different joint structure than the other fingers
   * (no PIP joint in the same sense), so it gets its own check: the
   * thumb is considered extended when its tip is farther from the
   * index finger's base (INDEX_MCP) than the thumb's own base
   * (THUMB_MCP) is. This captures the thumb "sticking out" sideways
   * or upward, rather than tucked across the palm.
   * @returns {boolean}
   */
  _isThumbExtended() {
    const lm = this._landmarks;
    const indexMcp = lm[this.LANDMARKS.INDEX_MCP];

    const thumbTip = lm[this.LANDMARKS.THUMB_TIP];
    const thumbMcp = lm[this.LANDMARKS.THUMB_MCP];

    const tipToIndexMcp = this._distance(thumbTip, indexMcp);
    const mcpToIndexMcp = this._distance(thumbMcp, indexMcp);

    return tipToIndexMcp > mcpToIndexMcp;
  }

  /**
   * getLastLandmarks
   * Convenience accessor for the most recently recognized landmark set,
   * useful for debugging or for consumers that want to reuse the cached
   * data without passing it in again.
   * @returns {Array|null}
   */
  getLastLandmarks() {
    return this._landmarks;
  }
}

// -----------------------------------------------------------------------
// Default export — a ready-to-use instance, since gesture recognition is
// stateless-by-frame and typically only one recognizer is needed per app.
// The class is also named-exported for consumers that want an isolated
// instance (e.g. tests, or multiple simultaneous hands in the future).
// -----------------------------------------------------------------------
const gestureRecognizer = new GestureRecognizer();
export default gestureRecognizer;