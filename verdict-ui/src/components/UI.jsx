import { DIFFICULTY_COLORS, STATUS_CONFIG } from '../data/sampleData';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export function DifficultyBadge({ difficulty, className = '' }) {
  const cfg = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.Easy;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.text} ${cfg.bg} ${cfg.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {difficulty}
    </span>
  );
}

export function StatusBadge({ status, className = '' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Wrong Answer'];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.text} ${cfg.bg} ${cfg.border} ${className}`}
    >
      {cfg.label}
    </span>
  );
}

export function SolvedIcon({ solved, attempted = false }) {
  if (solved) return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
  if (attempted) return <Clock className="w-4 h-4 text-amber-400 shrink-0" />;
  return <Circle className="w-4 h-4 text-slate-600 shrink-0" />;
}

export function TagChip({ label }) {
  return (
    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-white/5 text-slate-400 border border-white/5 hover:text-slate-200 transition-colors cursor-default">
      {label}
    </span>
  );
}

export function StatCard({ value, label, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
  };
  return (
    <div className={`flex flex-col items-center gap-2 p-5 rounded-2xl border bg-gradient-to-b ${colorMap[color]} backdrop-blur-sm`}>
      {Icon && <Icon className={`w-6 h-6 ${colorMap[color].split(' ')[3]}`} />}
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs text-slate-400 font-medium text-center">{label}</div>
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, ...props }) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold hover:from-blue-400 hover:to-violet-500 shadow-lg hover:shadow-blue-500/30 active:scale-95',
    secondary: 'bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5',
    danger: 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20',
    success: 'bg-emerald-500 text-white font-semibold hover:bg-emerald-400 shadow-lg hover:shadow-emerald-500/30',
    run: 'bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border ${
          error ? 'border-rose-500/50 focus:border-rose-400' : 'border-white/10 focus:border-blue-500/50'
        } text-white placeholder-slate-500 outline-none transition-all duration-200 focus:bg-white/8 text-sm ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

export function Panel({ children, className = '', padding = true }) {
  return (
    <div className={`rounded-2xl border border-white/5 bg-[#111827] ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className={`${sizes[size]} border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin`} />
  );
}
