import { useEffect, useState } from "react";
import CameraView from "../components/Camera/CameraView";

const slides = [
  {
    icon: "👋",
    title: "AI Hand OS",
    subtitle: "Gesture Controlled Computer",
    points: [
      "Control your system with hand gestures",
      "Mouse, keyboard, canvas, voice and more",
    ],
  },
  {
    icon: "🖱️",
    title: "Virtual Mouse",
    subtitle: "Move • Click • Drag",
    points: ["Control cursor with your hand", "Pinch to click", "Drag objects naturally"],
  },
  {
    icon: "⌨️",
    title: "Virtual Keyboard",
    subtitle: "Type using your hand",
    points: ["Point to a key", "Pinch to press", "Hands-free typing"],
  },
  {
    icon: "🎨",
    title: "Air Canvas",
    subtitle: "Draw in the air",
    points: ["Brush, eraser, colors", "Shapes and save PNG", "Air drawing experience"],
  },
  {
    icon: "🚀",
    title: "Thank You",
    subtitle: "AI Hand OS Demo Complete",
    points: ["Built for futuristic interaction", "Gesture + Voice + AI experience"],
  },
];

function PresentationDemo() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => Math.max(prev - 1, 0));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("presentation-next", nextSlide);
    window.addEventListener("presentation-prev", prevSlide);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("presentation-next", nextSlide);
      window.removeEventListener("presentation-prev", prevSlide);
    };
  }, []);

  const slide = slides[current];

  return (
    <div className="space-y-8">
      <CameraView />

      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="relative w-full max-w-5xl min-h-[600px] rounded-3xl bg-white/5 border border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.25)] overflow-hidden p-10">
          <button
            data-ai-clickable="true"
            onClick={toggleFullscreen}
            className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white"
          >
            ⛶ Fullscreen
          </button>

          <div className="absolute top-6 left-6 text-cyan-300 font-semibold">
            Presentation Demo
          </div>

          <div className="h-[500px] flex flex-col items-center justify-center text-center transition-all duration-300">
            <div className="text-8xl mb-8">{slide.icon}</div>
            <h1 className="text-6xl font-black mb-4">{slide.title}</h1>
            <p className="text-2xl text-cyan-300 mb-8">{slide.subtitle}</p>

            <div className="space-y-3 text-xl text-gray-300">
              {slide.points.map((point, index) => (
                <p key={index}>• {point}</p>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-3 rounded-full transition-all ${
                  index === current ? "w-10 bg-cyan-400" : "w-3 bg-white/30"
                }`}
              />
            ))}
          </div>

          <div className="absolute bottom-8 right-8 text-gray-400">
            {current + 1} / {slides.length}
          </div>

          <div className="absolute bottom-8 left-8 flex gap-3">
            <button
              data-ai-clickable="true"
              onClick={prevSlide}
              className="px-5 py-2 rounded-xl bg-white/10 border border-white/10 text-white"
            >
              ← Prev
            </button>

            <button
              data-ai-clickable="true"
              onClick={nextSlide}
              className="px-5 py-2 rounded-xl bg-cyan-500 text-white"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresentationDemo;