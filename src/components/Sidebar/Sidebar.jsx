import { NavLink } from "react-router-dom";
import {
  Home,
  MousePointer2,
  Keyboard,
  Brush,
  Settings,
  Info,
  Monitor,
} from "lucide-react";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/", icon: <Home size={20} /> },
    { name: "Mouse", path: "/mouse", icon: <MousePointer2 size={20} /> },
    { name: "Keyboard", path: "/keyboard", icon: <Keyboard size={20} /> },
    { name: "Canvas", path: "/canvas", icon: <Brush size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
    { name: "About", path: "/about", icon: <Info size={20} /> },
    { name: "Presentation", path: "/presentation-demo", icon: <Monitor size={20} /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 min-h-screen bg-white/5 border-r border-white/10 p-4 shrink-0">
        <h1 className="text-2xl font-bold mb-8">🖐 AI Hand OS</h1>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              data-ai-clickable="true"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-gray-300 hover:bg-white/10"
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[99999] bg-[#0b1020]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2">
        <div className="grid grid-cols-5 gap-1">
          {links.slice(0, 5).map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              data-ai-clickable="true"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-xs ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-gray-400"
                }`
              }
            >
              {link.icon}
              <span className="text-[10px]">{link.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Sidebar;