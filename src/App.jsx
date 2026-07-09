import { HashRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import Home from "./pages/Home";
import Mouse from "./pages/Mouse";
import Keyboard from "./pages/Keyboard";
import Canvas from "./pages/Canvas";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Desktop from "./pages/Desktop";
import PresentationDemo from "./pages/PresentationDemo";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="mouse" element={<Mouse />} />
          <Route path="keyboard" element={<Keyboard />} />
          <Route path="canvas" element={<Canvas />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
          <Route path="desktop" element={<Desktop />} />
          <Route path="presentation-demo" element={<PresentationDemo />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;