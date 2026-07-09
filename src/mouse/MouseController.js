import appSettings from "../settings/AppSettings";

class MouseController {
  constructor() {
    this.position = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    this.margin = 0.18;
  }

  update(landmarks, videoElement) {
    if (!landmarks || !videoElement) return this.position;

    const indexTip = landmarks[8];

    let x = 1 - indexTip.x;
    let y = indexTip.y;

    x = (x - this.margin) / (1 - this.margin * 2);
    y = (y - this.margin) / (1 - this.margin * 2);

    x = Math.min(Math.max(x, 0), 1);
    y = Math.min(Math.max(y, 0), 1);

    const mappedX = x * window.innerWidth;
    const mappedY = y * window.innerHeight;

    const cursorSpeed = appSettings.getValue("cursorSpeed") ?? 50;
    const speed = cursorSpeed / 50;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const targetX = centerX + (mappedX - centerX) * speed;
    const targetY = centerY + (mappedY - centerY) * speed;

    const cursorSmoothness = appSettings.getValue("cursorSmoothness") ?? 35;

    const smoothing = Math.min(
      Math.max(cursorSmoothness / 100, 0.05),
      0.9
    );

    this.position.x += (targetX - this.position.x) * smoothing;
    this.position.y += (targetY - this.position.y) * smoothing;

    return {
      x: this.position.x,
      y: this.position.y,
    };
  }

  reset(videoElement) {
    if (videoElement) {
      const rect = videoElement.getBoundingClientRect();

      this.position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      return;
    }

    this.position = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }
}

const mouseController = new MouseController();

export default mouseController;