import { NavLink } from "react-router-dom";
import {
  Home,
  MousePointer2,
  Keyboard,
  Brush,
  Settings,
  Info,
} from "lucide-react";
import { Monitor } from "lucide-react";
import { Presentation } from "lucide-react";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/", icon: <Home size={20} /> },
    { name: "Mouse", path: "/mouse", icon: <MousePointer2 size={20} /> },
    { name: "Keyboard", path: "/keyboard", icon: <Keyboard size={20} /> },
    { name: "Canvas", path: "/canvas", icon: <Brush size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
    { name: "About", path: "/about", icon: <Info size={20} /> },
    {name: "Presentation", path: "/presentation-demo", icon: <Presentation size={20} />}
    
  ];

  return (
    <aside className="w-64 min-h-screen bg-white/5 border-r border-white/10 p-4">
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
  );
}

export default Sidebar;