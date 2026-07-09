class VoiceCommandController {
  constructor() {
    this.listening = false;
    this.transcript = "";
    this.message = "";
    this.recognition = null;
  }

  init() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.message = "Voice commands not supported in this browser";
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = "en-US";

    this.recognition.onresult = (event) => {
      const text =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      this.transcript = text;
      this.message = `Heard: ${text}`;
      this.handleCommand(text);
    };

    this.recognition.onend = () => {
      if (this.listening) {
        this.recognition.start();
      }
    };
  }

  navigate(path) {
    window.location.hash = path;
  }

  start() {
    if (!this.recognition) this.init();
    if (!this.recognition || this.listening) return;

    this.listening = true;
    this.message = "Listening...";
    this.recognition.start();
  }

  stop() {
    if (!this.recognition) return;

    this.listening = false;
    this.message = "Voice stopped";
    this.recognition.stop();
  }

  toggle() {
    if (this.listening) this.stop();
    else this.start();
  }

  handleCommand(text) {
    if (text.includes("open dashboard") || text.includes("open home")) {
      this.navigate("/");
      this.message = "Opening dashboard";
    }

    if (text.includes("open mouse")) {
      this.navigate("/mouse");
      this.message = "Opening mouse";
    }

    if (text.includes("open keyboard")) {
      this.navigate("/keyboard");
      this.message = "Opening keyboard";
    }

    if (text.includes("open canvas")) {
      this.navigate("/canvas");
      this.message = "Opening canvas";
    }

    if (text.includes("open settings")) {
      this.navigate("/settings");
      this.message = "Opening settings";
    }

    if (text.includes("open about")) {
      this.navigate("/about");
      this.message = "Opening about";
    }

    if (text.includes("open presentation")) {
      this.navigate("/presentation-demo");
      this.message = "Opening presentation";
    }

    if (text.includes("clear canvas")) {
      window.__AIR_CANVAS__?.clear();
      this.message = "Canvas cleared";
    }

    if (text.includes("save canvas")) {
      document.querySelector("[data-save-canvas='true']")?.click();
      this.message = "Canvas saved";
    }

    if (text.includes("stop listening") || text.includes("stop voice")) {
      this.stop();
    }
  }

  getState() {
    return {
      listening: this.listening,
      transcript: this.transcript,
      message: this.message,
    };
  }
}

export default new VoiceCommandController();