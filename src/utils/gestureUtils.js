import appSettings from "../settings/AppSettings";

let pinchActive = false;

export function distance(a, b) {
  if (!a || !b) return Infinity;

  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z || 0) - (b.z || 0);

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function isPinching(landmarks) {
  if (!landmarks || landmarks.length < 9) {
    pinchActive = false;
    return false;
  }

  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];

  const d = distance(thumbTip, indexTip);

  const sensitivity = appSettings.getValue("pinchSensitivity") ?? 45;

  // Higher sensitivity = easier pinch detection
  const pinchStartThreshold = 0.075 - sensitivity * 0.00045;
  const pinchReleaseThreshold = pinchStartThreshold + 0.025;

  if (!pinchActive && d < pinchStartThreshold) {
    pinchActive = true;
  }

  if (pinchActive && d > pinchReleaseThreshold) {
    pinchActive = false;
  }

  return pinchActive;
}