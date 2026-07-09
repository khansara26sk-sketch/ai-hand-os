function Navbar() {
  return (
    <header className="h-16 border-b border-white/10 bg-white/5 flex items-center justify-between px-6">
      <div>
        <h2 className="font-semibold text-xl">Control Center</h2>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="text-gray-300">Camera Offline</span>
      </div>
    </header>
  );
}

export default Navbar;