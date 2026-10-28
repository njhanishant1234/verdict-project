import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send, Filter, Search, ChevronRight, Clock, MemoryStick,
  SlidersHorizontal, X, ExternalLink, TrendingUp,
  CheckCircle2, XCircle, AlertTriangle,
} from 'lucide-react';
import { SUBMISSIONS, STATUS_CONFIG, PROBLEMS } from '../data/sampleData';
import { StatusBadge, DifficultyBadge, Panel } from '../components/UI';

const LANG_COLORS = {
  JavaScript: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Python: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Java: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  'C++': 'text-violet-400 bg-violet-400/10 border-violet-400/20',
};

const STATUS_FILTER_OPTIONS = ['All', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'];
const LANG_OPTIONS = ['All', 'JavaScript', 'Python', 'Java', 'C++'];

const STATS = {
  total: SUBMISSIONS.length,
  accepted: SUBMISSIONS.filter((s) => s.status === 'Accepted').length,
  problems: [...new Set(SUBMISSIONS.filter((s) => s.status === 'Accepted').map((s) => s.problemId))].length,
  avgRuntime: '0.18s',
};

export default function SubmissionsPage() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [langFilter, setLangFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = SUBMISSIONS.filter((s) => {
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchLang = langFilter === 'All' || s.language === langFilter;
    const matchSearch = s.problemTitle.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchLang && matchSearch;
  });

  const acceptedRate = Math.round((STATS.accepted / STATS.total) * 100);

  return (
    <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Send className="w-6 h-6 text-blue-400" />
            <h1 className="text-3xl font-black text-white">My Submissions</h1>
          </div>
          <p className="text-slate-400 text-sm ml-9">Track your submission history and results</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: 'Total Submissions',
              value: STATS.total,
              icon: Send,
              color: 'blue',
              sub: 'all time',
            },
            {
              label: 'Accepted',
              value: STATS.accepted,
              icon: CheckCircle2,
              color: 'emerald',
              sub: `${acceptedRate}% rate`,
            },
            {
              label: 'Problems Solved',
              value: STATS.problems,
              icon: TrendingUp,
              color: 'violet',
              sub: 'unique',
            },
            {
              label: 'Avg Runtime',
              value: STATS.avgRuntime,
              icon: Clock,
              color: 'amber',
              sub: 'accepted',
            },
          ].map((card) => {
            const Icon = card.icon;
            const colorMap = {
              blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
              emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
              violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
              amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
            };
            return (
              <div key={card.label} className={`p-4 rounded-2xl border ${colorMap[card.color]} backdrop-blur-sm`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium opacity-70 leading-tight">{card.label}</span>
                  <Icon className="w-4 h-4 opacity-70 shrink-0" />
                </div>
                <div className="text-2xl font-black text-white">{card.value}</div>
                <div className="text-xs opacity-50 mt-0.5">{card.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Acceptance Rate Bar */}
        <Panel className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">Acceptance Rate</span>
            <span className="text-sm font-bold text-emerald-400">{acceptedRate}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${acceptedRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1.5">
            <span>{STATS.accepted} accepted</span>
            <span>{STATS.total - STATS.accepted} failed</span>
          </div>
        </Panel>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by problem..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111827] border border-white/5 text-white placeholder-slate-500 text-sm outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#111827] border border-white/5 text-white text-sm outline-none focus:border-blue-500/40 cursor-pointer"
          >
            {STATUS_FILTER_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#111827] border border-white/5 text-white text-sm outline-none focus:border-blue-500/40 cursor-pointer"
          >
            {LANG_OPTIONS.map((l) => (
              <option key={l} value={l}>{l === 'All' ? 'All Languages' : l}</option>
            ))}
          </select>
        </div>

        {/* Result count */}
        <p className="text-xs text-slate-500 mb-3 font-medium">
          {filtered.length} submission{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Table */}
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 bg-[#0d1420] border-b border-white/5">
            {['Problem', 'Status', 'Language', 'Runtime', 'Memory', 'Submitted'].map((h) => (
              <span key={h} className="text-xs font-semibold text-slate-500">{h}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Send className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-slate-400 font-medium">No submissions match your filters</p>
                <button
                  onClick={() => { setStatusFilter('All'); setLangFilter('All'); setSearch(''); }}
                  className="mt-3 text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.id}
                  className="group flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto_auto] items-start sm:items-center gap-3 sm:gap-4 px-5 py-4 bg-[#111827] hover:bg-[#141e2e] transition-all duration-150"
                >
                  {/* Problem */}
                  <div className="flex items-center gap-2 min-w-0">
                    <Link
                      to={`/problems/${s.problemId}`}
                      className="text-sm font-semibold text-slate-200 hover:text-blue-400 transition-colors truncate flex items-center gap-1.5 group/link"
                    >
                      {s.problemTitle}
                      <ExternalLink className="w-3 h-3 text-slate-600 group-hover/link:text-blue-400 shrink-0" />
                    </Link>
                  </div>

                  {/* Status */}
                  <StatusBadge status={s.status} />

                  {/* Language */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${LANG_COLORS[s.language] || 'text-slate-400 bg-white/5 border-white/10'}`}
                  >
                    {s.language}
                  </span>

                  {/* Runtime */}
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span className="font-mono">{s.runtime}</span>
                  </div>

                  {/* Memory */}
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="font-mono">{s.memory}</span>
                  </div>

                  {/* Submitted */}
                  <span className="text-xs text-slate-500">{s.submittedAt}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                page === 1
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {page}
            </button>
          ))}
          <span className="text-slate-600">...</span>
          <button className="text-slate-500 hover:text-white hover:bg-white/5 w-8 h-8 rounded-lg text-sm transition-all">
            8
          </button>
        </div>
      </div>
    </div>
  );
}
