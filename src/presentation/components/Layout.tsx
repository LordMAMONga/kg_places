import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 bg-pattern text-slate-200 font-sans selection:bg-amber-500/30">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md group-hover:bg-amber-400/40 transition-colors duration-500" />
              <svg
                className="w-10 h-10 text-amber-500 group-hover:rotate-45 transition-transform duration-700 relative z-10 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              >
                <circle cx="50" cy="50" r="42" />
                <path d="M 15 35 Q 50 25 85 35 M 10 50 Q 50 40 90 50 M 15 65 Q 50 55 85 65" />
                <path d="M 35 15 Q 25 50 35 85 M 50 10 Q 40 50 50 90 M 65 15 Q 55 50 65 85" />
              </svg>
            </div>

            <span className="text-2xl font-bold tracking-widest text-white uppercase font-serif">
              Tainy<span className="text-amber-500">KG</span>
            </span>
          </Link>

          <nav className="flex gap-8 text-sm font-medium tracking-wide uppercase">
            <Link to="/" className="hover:text-amber-400 transition-colors">
              Энциклопедия
            </Link>
            <a href="#" className="hover:text-amber-400 transition-colors">
              О проекте
            </a>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
