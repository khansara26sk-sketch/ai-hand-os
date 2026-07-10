import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import handEngine from "../engine/HandEngine";
import useAppSettings from "../hooks/useAppSettings";

function Home() {
  const { settings } = useAppSettings();

  const [system, setSystem] = useState({
    fps: 0,
    gesture: "none",
    handDetected: false,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSystem({
        fps: handEngine.getFPS(),
        gesture: handEngine.getGesture(),
        handDetected: handEngine.getHandDetected(),
      });
    }, 150);

    return () => clearInterval(intervalId);
  }, []);

  const modules = [
    {
      name: "Mouse",
      icon: "🖱️",
      path: "/mouse",
      status: "Ready",
      description: "Control the virtual cursor, clicks and scrolling.",
    },
    {
      name: "Keyboard",
      icon: "⌨️",
      path: "/keyboard",
      status: "Ready",
      description: "Type using hand-controlled virtual keys.",
    },
    {
      name: "Canvas",
      icon: "🎨",
      path: "/canvas",
      status: "Ready",
      description: "Draw, erase and create shapes in the air.",
    },
    {
      name: "Presentation",
      icon: "🖥️",
      path: "/presentation-demo",
      status: "Ready",
      description: "Navigate slides using swipe gestures.",
    },
    {
      name: "Settings",
      icon: "⚙️",
      path: "/settings",
      status: "Active",
      description: "Customize cursor, camera, voice and themes.",
    },
    {
      name: "About",
      icon: "ℹ️",
      path: "/about",
      status: "Info",
      description: "View system details, modules and roadmap.",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-6">
      <section className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white/5 border border-cyan-400/20 p-5 sm:p-6 md:p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
        <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-cyan-300 mb-3">
            Gesture-Controlled Interface
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
            AI Hand OS
          </h1>

          <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl leading-relaxed">
            Control mouse, keyboard, canvas, presentations, voice commands and
            system tools using real-time hand gestures.
          </p>

          <div className="mt-5 md:mt-6 flex flex-wrap gap-2 sm:gap-3">
            <span className="px-3 sm:px-4 py-2 rounded-full bg-green-500/20 text-green-300 border border-green-400/30 text-xs sm:text-sm">
              ● Engine Ready
            </span>

            <span className="px-3 sm:px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs sm:text-sm capitalize">
              Theme: {settings.theme}
            </span>

            <span className="px-3 sm:px-4 py-2 rounded-full bg-white/10 text-gray-300 border border-white/10 text-xs sm:text-sm">
              Version 1.0
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-400">Hand Tracking</p>

            <span
              className={`w-3 h-3 rounded-full ${
                system.handDetected
                  ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                  : "bg-red-500"
              }`}
            />
          </div>

          <h2
            className={`mt-3 text-2xl md:text-3xl font-bold ${
              system.handDetected ? "text-green-300" : "text-red-300"
            }`}
          >
            {system.handDetected ? "Detected" : "Offline"}
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6">
          <p className="text-sm text-gray-400">Current Gesture</p>

          <h2 className="mt-3 text-2xl md:text-3xl font-bold text-cyan-300 capitalize break-words">
            {system.gesture || "none"}
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-gray-400">Tracking FPS</p>

          <div className="mt-3 flex items-end gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-300">
              {system.fps || "--"}
            </h2>

            <span className="text-sm text-gray-500 mb-1">frames/sec</span>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3 mb-4 md:mb-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Quick Launch</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Open any AI Hand OS module.
            </p>
          </div>

          <span className="hidden sm:inline text-xs text-gray-500">
            {modules.length} modules
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {modules.map((module) => (
            <Link
              key={module.name}
              to={module.path}
              data-ai-clickable="true"
              className="group min-w-0 rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 md:p-6 hover:bg-cyan-500/10 hover:border-cyan-400/40 active:scale-[0.98] transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-3xl sm:text-4xl">{module.icon}</div>

                <span className="text-[9px] sm:text-xs px-2 sm:px-3 py-1 rounded-full bg-green-500/20 text-green-300 whitespace-nowrap">
                  {module.status}
                </span>
              </div>

              <h3 className="mt-4 text-base sm:text-lg md:text-xl font-bold truncate">
                {module.name}
              </h3>

              <p className="hidden sm:block text-sm text-gray-400 mt-2 leading-relaxed">
                {module.description}
              </p>

              <p className="sm:hidden text-[11px] text-gray-500 mt-1">
                Open module
              </p>

              <div className="mt-4 text-xs sm:text-sm text-cyan-300 opacity-70 group-hover:opacity-100 transition">
                Launch →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;