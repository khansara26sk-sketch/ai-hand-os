class VoiceCommandController {
  constructor() {
    this.listening = false;
    this.transcript = "";
    this.message = "";
    this.recognition = null;
    this.isStopping = false;
  }

  init() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.message = "Voice commands are not supported in this browser";
      this.emitUpdate();
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = "en-US";

    this.recognition.onstart = () => {
      this.listening = true;
      this.isStopping = false;
      this.message = "Listening...";
      this.emitUpdate();
    };

    this.recognition.onresult = (event) => {
      const latestResult = event.results[event.results.length - 1];

      if (!latestResult?.[0]?.transcript) return;

      const text = latestResult[0].transcript
        .trim()
        .toLowerCase();

      this.transcript = text;
      this.message = `Heard: ${text}`;
      this.emitUpdate();

      this.handleCommand(text);
    };

    this.recognition.onerror = (event) => {
      const ignoredErrors = ["no-speech", "aborted"];

      if (!ignoredErrors.includes(event.error)) {
        this.message = `Voice error: ${event.error}`;
      }

      if (event.error === "not-allowed") {
        this.listening = false;
        this.message = "Microphone permission denied";
      }

      this.emitUpdate();
    };

    this.recognition.onend = () => {
      /*
        Restart only when listening is intentionally active.
        After a command, finishCommand() sets listening to false,
        so recognition will not restart.
      */
      if (this.listening && !this.isStopping) {
        try {
          this.recognition.start();
        } catch {
          // Recognition may already be restarting.
        }

        return;
      }

      this.listening = false;
      this.isStopping = false;
      this.emitUpdate();
    };
  }

  emitUpdate() {
    window.dispatchEvent(
      new CustomEvent("voice-state-change", {
        detail: this.getState(),
      })
    );
  }

  emitCommandComplete(message) {
    window.dispatchEvent(
      new CustomEvent("voice-command-complete", {
        detail: {
          message,
          transcript: this.transcript,
        },
      })
    );
  }

  navigate(path) {
    window.location.hash = path;
  }

  start() {
    if (!this.recognition) {
      this.init();
    }

    if (!this.recognition || this.listening) return;

    this.isStopping = false;
    this.listening = true;
    this.message = "Listening...";
    this.emitUpdate();

    try {
      this.recognition.start();
    } catch (error) {
      this.listening = false;
      this.message = "Unable to start voice recognition";
      this.emitUpdate();

      console.error(
        "[VoiceCommandController] Start error:",
        error
      );
    }
  }

  stop(message = "Voice stopped") {
    this.listening = false;
    this.isStopping = true;
    this.message = message;
    this.emitUpdate();

    if (!this.recognition) {
      this.isStopping = false;
      return;
    }

    try {
      this.recognition.stop();
    } catch {
      this.isStopping = false;
    }
  }

  toggle() {
    if (this.listening) {
      this.stop();
    } else {
      this.start();
    }
  }

  finishCommand(message) {
    this.message = message;

    /*
      Set listening false before stopping recognition.
      Otherwise onend could restart it.
    */
    this.listening = false;
    this.isStopping = true;

    this.emitUpdate();
    this.emitCommandComplete(message);

    if (!this.recognition) {
      this.isStopping = false;
      return;
    }

    try {
      this.recognition.stop();
    } catch {
      this.isStopping = false;
    }
  }

  handleCommand(text) {
    if (
      text.includes("open dashboard") ||
      text.includes("open home") ||
      text.includes("go to dashboard") ||
      text.includes("go home")
    ) {
      this.navigate("/");
      this.finishCommand("Opening dashboard");
      return;
    }

    if (
      text.includes("open mouse") ||
      text.includes("go to mouse")
    ) {
      this.navigate("/mouse");
      this.finishCommand("Opening mouse");
      return;
    }

    if (
      text.includes("open keyboard") ||
      text.includes("go to keyboard")
    ) {
      this.navigate("/keyboard");
      this.finishCommand("Opening keyboard");
      return;
    }

    if (
      text.includes("open canvas") ||
      text.includes("go to canvas")
    ) {
      this.navigate("/canvas");
      this.finishCommand("Opening canvas");
      return;
    }

    if (
      text.includes("open settings") ||
      text.includes("go to settings")
    ) {
      this.navigate("/settings");
      this.finishCommand("Opening settings");
      return;
    }

    if (
      text.includes("open about") ||
      text.includes("go to about")
    ) {
      this.navigate("/about");
      this.finishCommand("Opening about");
      return;
    }

    if (
      text.includes("open presentation") ||
      text.includes("start presentation") ||
      text.includes("go to presentation")
    ) {
      this.navigate("/presentation-demo");
      this.finishCommand("Opening presentation");
      return;
    }

    if (text.includes("clear canvas")) {
      const canvasApi = window.__AIR_CANVAS__;

      if (canvasApi?.clear) {
        canvasApi.clear();
        this.finishCommand("Canvas cleared");
      } else {
        this.finishCommand("Canvas is not open");
      }

      return;
    }

    if (text.includes("save canvas")) {
      const saveButton = document.querySelector(
        "[data-save-canvas='true']"
      );

      if (saveButton) {
        saveButton.click();
        this.finishCommand("Canvas saved");
      } else {
        this.finishCommand("Canvas is not open");
      }

      return;
    }

    if (
      text.includes("stop listening") ||
      text.includes("stop voice") ||
      text.includes("close voice assistant")
    ) {
      this.stop("Voice stopped");
      this.emitCommandComplete("Voice stopped");
      return;
    }

    this.message = `Command not recognized: ${text}`;
    this.emitUpdate();
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