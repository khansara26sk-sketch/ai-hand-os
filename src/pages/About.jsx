import { useEffect, useState } from "react";
import handEngine from "../engine/HandEngine";

function About() {
  const [system, setSystem] = useState({
    fps: 0,
    gesture: "None",
    hand: false,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setSystem({
        fps: handEngine.getFPS(),
        gesture: handEngine.getGesture(),
        hand: handEngine.getHandDetected(),
      });
    }, 100);

    return () => clearInterval(id);
  }, []);

  const modules = [
    "Virtual Mouse",
    "Virtual Keyboard",
    "Air Canvas",
    "Volume Control",
    "Brightness Control",
    "Voice Commands",
    "Presentation Mode",
    "Screenshot",
  ];

  const roadmap = [
    { title: "Media Controller", done: false },
    { title: "Eye Tracking", done: false },
    { title: "Object Detection", done: false },
    { title: "Face Unlock", done: false },
    { title: "AI Assistant", done: false },
    { title: "Gesture Training", done: false },
  ];

  const tech = [
    "React",
    "Vite",
    "Tailwind CSS",
    "MediaPipe",
    "HTML5 Canvas",
    "Speech Recognition",
    "JavaScript",
    "Web APIs",
  ];

  return (
    <div className="space-y-8">

      {/* Hero */}

      <div className="rounded-3xl bg-white/5 border border-cyan-400/20 p-10 shadow-xl">

        <h1 className="text-5xl font-black">
          AI Hand OS
        </h1>

        <p className="text-cyan-300 mt-3 text-xl">
          Gesture Controlled Operating System
        </p>

        <div className="mt-6 inline-flex px-5 py-2 rounded-full bg-green-500/20 border border-green-400/40 text-green-300">
          Version 1.0
        </div>

      </div>

      {/* Live Status */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <p className="text-gray-400">FPS</p>

          <h2 className="text-5xl font-bold text-cyan-300 mt-3">
            {system.fps}
          </h2>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <p className="text-gray-400">Current Gesture</p>

          <h2 className="text-2xl font-bold text-cyan-300 mt-3">
            {system.gesture}
          </h2>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <p className="text-gray-400">Camera</p>

          <h2
            className={`text-2xl font-bold mt-3 ${
              system.hand ? "text-green-300" : "text-red-300"
            }`}
          >
            {system.hand ? "ONLINE" : "OFFLINE"}
          </h2>
        </div>

      </div>

      {/* Features */}

      <div>

        <h2 className="text-3xl font-bold mb-5">
          Enabled Modules
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

          {modules.map((module) => (
            <div
              key={module}
              className="rounded-2xl bg-white/5 border border-white/10 p-5"
            >
              <div className="text-green-400 text-2xl mb-3">
                ✔
              </div>

              <h3 className="font-semibold">
                {module}
              </h3>
            </div>
          ))}

        </div>

      </div>

      {/* Tech */}

      <div>

        <h2 className="text-3xl font-bold mb-5">
          Technology Stack
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

          {tech.map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-cyan-500/10 border border-cyan-400/20 p-5 text-center"
            >
              {item}
            </div>
          ))}

        </div>

      </div>

      {/* Roadmap */}

      <div>

        <h2 className="text-3xl font-bold mb-5">
          Upcoming Features
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          {roadmap.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white/5 border border-white/10 p-5 flex justify-between"
            >
              <span>{item.title}</span>

              <span
                className={
                  item.done
                    ? "text-green-400"
                    : "text-yellow-300"
                }
              >
                {item.done ? "✔" : "⏳"}
              </span>
            </div>
          ))}

        </div>

      </div>

      {/* Developer */}

      <div className="rounded-3xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/20 p-10">

        <h2 className="text-4xl font-bold">
          Developed By
        </h2>

        <p className="text-cyan-300 text-2xl mt-3">
          Sara Khan
        </p>

        <p className="text-gray-400 mt-4 max-w-3xl">
          AI Hand OS is a real-time gesture-controlled operating
          system built using React, MediaPipe Hands and modern web
          technologies. It demonstrates computer interaction through
          hand gestures, voice commands and AI-powered controls.
        </p>

      </div>

    </div>
  );
}

export default About;