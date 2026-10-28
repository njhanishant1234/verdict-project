import { Link, useLocation } from 'react-router-dom';
import { Code2, LayoutDashboard, FileText, Send, LogIn, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/problems', label: 'Problems', icon: FileText },
  { to: '/submissions', label: 'Submissions', icon: Send },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#0b0f1a]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">Verdict</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-400 hover:to-violet-500 transition-all duration-200 shadow-lg hover:shadow-blue-500/30"
            >
              <Zap className="w-3.5 h-3.5" />
              Sign Up Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0b0f1a]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(to)
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-white/5">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-violet-600 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
