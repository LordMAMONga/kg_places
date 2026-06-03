import { Link, useLocation } from "react-router-dom";
import { Compass, Bookmark, AlertTriangle } from "lucide-react";

export function Header() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
        >
          <Compass className="w-6 h-6" />
          <span className="font-black text-xl tracking-widest uppercase drop-shadow-md hidden sm:block">
            Places{" "}
          </span>
        </Link>

        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            to="/"
            className={`text-xs md:text-sm font-bold uppercase tracking-wider transition-colors ${
              location.pathname === "/"
                ? "text-amber-500"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Энциклопедия
          </Link>
          <Link
            to="/favorites"
            className={`text-xs md:text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              location.pathname === "/favorites"
                ? "text-amber-500"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${location.pathname === "/favorites" ? "fill-amber-500" : ""}`}
            />
            <span className="hidden md:block">Экспедиции</span>
          </Link>

          <div className="w-px h-6 bg-slate-800 mx-2 hidden sm:block"></div>

          <Link
            to="/report"
            className="flex items-center gap-2 px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-400 hover:text-red-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:block">Сообщить</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
