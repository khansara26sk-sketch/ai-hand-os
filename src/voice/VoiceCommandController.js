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
    if (text.includes("open canvas")) {
      window.location.href = "/canvas";
    }

    if (text.includes("open keyboard")) {
      window.location.href = "/keyboard";
    }

    if (text.includes("open mouse")) {
      window.location.href = "/mouse";
    }

    if (text.includes("open dashboard")) {
      window.location.href = "/";
    }

    if (text.includes("clear canvas")) {
      window.__AIR_CANVAS__?.clear();
      this.message = "Canvas cleared";
    }

    if (text.includes("save canvas")) {
      document.querySelector("[data-save-canvas='true']")?.click();
      this.message = "Canvas saved";
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