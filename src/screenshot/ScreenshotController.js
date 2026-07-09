import { toPng } from "html-to-image";

class ScreenshotController {
  constructor() {
    this.active = false;
    this.countdown = null;
    this.visible = false;
    this.flash = false;
    this.message = "";
    this.timer = null;
    this.isCapturing = false;
  }

  update(gesture) {
    if (gesture !== "screenshot") {
      this.cancel();
      return;
    }

    if (!this.active && !this.isCapturing) {
      this.start();
    }
  }

  start() {
    this.active = true;
    this.visible = true;
    this.flash = false;
    this.message = "";
    this.countdown = 3;

    this.timer = setInterval(() => {
      this.countdown -= 1;

      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.timer = null;
        this.capture();
      }
    }, 700);
  }

  cancel() {
    if (!this.active || this.isCapturing) return;

    clearInterval(this.timer);
    this.timer = null;

    this.active = false;
    this.visible = false;
    this.flash = false;
    this.countdown = null;
  }

  async capture() {
    this.isCapturing = true;
    this.visible = false;
    this.flash = true;

    setTimeout(() => {
      this.flash = false;
    }, 180);

    try {
      const target = document.getElementById("root");

      if (!target) {
        throw new Error("Root element not found");
      }

      await new Promise((resolve) => setTimeout(resolve, 250));

      const dataUrl = await toPng(target, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#070b16",

        filter: (node) => {
          if (!(node instanceof HTMLElement)) return true;

          if (node.tagName === "VIDEO") return false;
          if (node.tagName === "CANVAS") return false;

          if (node.dataset?.handOverlay === "true") return false;
          if (node.dataset?.virtualCursor === "true") return false;

          return true;
        },
      });

      const link = document.createElement("a");
      link.download = `ai-hand-os-screenshot-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      this.message = "📸 Screenshot Saved";
    } catch (error) {
      console.error("Screenshot failed:", error);
      this.message = "❌ Screenshot Failed";
    }

    setTimeout(() => {
      this.message = "";
      this.active = false;
      this.isCapturing = false;
      this.countdown = null;
    }, 2000);
  }

  getState() {
    return {
      visible: this.visible,
      countdown: this.countdown,
      flash: this.flash,
      message: this.message,
    };
  }
}

export default new ScreenshotController();