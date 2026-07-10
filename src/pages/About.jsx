import { useEffect, useState } from "react";
import handEngine from "../engine/HandEngine";

function About() {
  const [system, setSystem] = useState({
    fps: 0,
    gesture: "none",
    hand: false,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSystem({
        fps: handEngine.getFPS(),
        gesture: handEngine.getGesture(),
        hand: handEngine.getHandDetected(),
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  const modules = [
    { name: "Virtual Mouse", icon: "🖱️" },
    { name: "Virtual Keyboard", icon: "⌨️" },
    { name: "Air Canvas", icon: "🎨" },
    { name: "Volume Control", icon: "🔊" },
    { name: "Brightness Control", icon: "☀️" },
    { name: "Voice Commands", icon: "🎤" },
    { name: "Presentation Mode", icon: "🖥️" },
    { name: "Screenshot", icon: "📸" },
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
    <div className="space-y-6 md:space-y-8 pb-6">
      <section className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white/5 border border-cyan-400/20 p-5 sm:p-7 md:p-10 shadow-xl">
        <div className="absolute -top-20 -right-16 w-52 h-52 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-cyan-300">
            About the Project
          </p>

          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
            AI Hand OS
          </h1>

          <p className="mt-3 text-base sm:text-lg md:text-xl text-cyan-300">
            Gesture-Controlled Operating System
          </p>

          <p className="mt-4 max-w-3xl text-sm sm:text-base text-gray-400 leading-relaxed">
            A browser-based interaction platform that combines hand tracking,
            voice commands and real-time gesture controls in one interface.
          </p>

          <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
            <span className="inline-flex px-4 py-2 rounded-full bg-green-500/20 border border-green-400/40 text-green-300 text-xs sm:text-sm">
              Version 1.0
            </span>

            <span className="inline-flex px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs sm:text-sm">
              Browser Edition
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        <article className="rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6">
          <p className="text-sm text-gray-400">Tracking FPS</p>

          <div className="mt-3 flex items-end gap-2">
            <h2 className="text-3xl md:text-5xl font-bold text-cyan-300">
              {system.fps || "--"}
            </h2>

            <span className="mb-1 text-xs sm:text-sm text-gray-500">
              frames/sec
            </span>
          </div>
        </article>

        <article className="rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6">
          <p className="text-sm text-gray-400">Current Gesture</p>

          <h2 className="mt-3 text-2xl md:text-3xl font-bold text-cyan-300 capitalize break-words">
            {system.gesture || "none"}
          </h2>
        </article>

        <article className="rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6 sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-400">Tracking Status</p>

            <span
              className={`w-3 h-3 rounded-full ${
                system.hand
                  ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                  : "bg-red-500"
              }`}
            />
          </div>

          <h2
            className={`mt-3 text-2xl md:text-3xl font-bold ${
              system.hand ? "text-green-300" : "text-red-300"
            }`}
          >
            {system.hand ? "ONLINE" : "OFFLINE"}
          </h2>
        </article>
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5">
          Enabled Modules
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {modules.map((module) => (
            <article
              key={module.name}
              className="min-w-0 rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl sm:text-3xl">{module.icon}</span>

                <span className="text-green-400 text-sm">✔</span>
              </div>

              <h3 className="mt-3 text-sm sm:text-base font-semibold leading-snug">
                {module.name}
              </h3>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5">
          Technology Stack
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {tech.map((item) => (
            <article
              key={item}
              className="rounded-2xl bg-cyan-500/10 border border-cyan-400/20 p-4 sm:p-5 text-center text-sm sm:text-base"
            >
              {item}
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5">
          Upcoming Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {roadmap.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 flex items-center justify-between gap-3"
            >
              <span className="text-sm sm:text-base">{item.title}</span>

              <span
                className={
                  item.done ? "text-green-400" : "text-yellow-300"
                }
              >
                {item.done ? "✔" : "⏳"}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl md:rounded-3xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/20 p-5 sm:p-7 md:p-10">
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gray-400">
          Developer
        </p>

        <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">
          Developed By
        </h2>

        <p className="mt-3 text-xl sm:text-2xl text-cyan-300">
          Sara Khan
        </p>

        <p className="mt-4 max-w-3xl text-sm sm:text-base text-gray-400 leading-relaxed">
          AI Hand OS is a real-time gesture-controlled interface built with
          React, MediaPipe Hands and modern browser APIs. It demonstrates mouse
          control, virtual typing, drawing, screenshots, system HUDs, voice
          navigation and presentation controls through hand gestures.
        </p>
      </section>
    </div>
  );
}

export default About;