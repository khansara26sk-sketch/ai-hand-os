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
    const id = setInterval(() => {
      setSystem({
        fps: handEngine.getFPS(),
        gesture: handEngine.getGesture(),
        handDetected: handEngine.getHandDetected(),
      });
    }, 150);

    return () => clearInterval(id);
  }, []);

  const modules = [
    { name: "Mouse", icon: "🖱️", path: "/mouse", status: "Ready" },
    { name: "Keyboard", icon: "⌨️", path: "/keyboard", status: "Ready" },
    { name: "Canvas", icon: "🎨", path: "/canvas", status: "Ready" },
    { name: "Presentation", icon: "🖥️", path: "/presentation-demo", status: "Ready" },
    { name: "Settings", icon: "⚙️", path: "/settings", status: "Active" },
    { name: "About", icon: "ℹ️", path: "/about", status: "Info" },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white/5 border border-cyan-400/20 p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
        <h1 className="text-5xl font-black mb-3">AI Hand OS</h1>
        <p className="text-gray-300 text-lg">
          Gesture-controlled operating system with mouse, keyboard, canvas,
          voice, presentation and system controls.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-300 border border-green-400/30">
            ● Engine Ready
          </span>
          <span className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            Theme: {settings.theme}
          </span>
          <span className="px-4 py-2 rounded-full bg-white/10 text-gray-300 border border-white/10">
            Version 1.0
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 mb-2">Hand Tracking</p>
          <h2
            className={`text-3xl font-bold ${
              system.handDetected ? "text-green-300" : "text-red-300"
            }`}
          >
            {system.handDetected ? "Detected" : "Offline"}
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 mb-2">Current Gesture</p>
          <h2 className="text-3xl font-bold text-cyan-300 capitalize">
            {system.gesture}
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 mb-2">FPS</p>
          <h2 className="text-3xl font-bold text-cyan-300">{system.fps || "--"}</h2>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-5">Quick Launch</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {modules.map((module) => (
            <Link
              key={module.name}
              to={module.path}
              data-ai-clickable="true"
              className="group rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-cyan-500/10 hover:border-cyan-400/40 transition"
            >
              <div className="text-4xl mb-4">{module.icon}</div>

              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{module.name}</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-300">
                  {module.status}
                </span>
              </div>

              <p className="text-gray-400 mt-3">
                Open {module.name} module.
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;