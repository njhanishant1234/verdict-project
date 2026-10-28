import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { PROBLEMS, DIFFICULTY_COLORS } from '../data/sampleData';
import { DifficultyBadge, SolvedIcon, TagChip, Panel } from '../components/UI';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const ALL_TAGS = [...new Set(PROBLEMS.flatMap((p) => p.tags))].sort();

export default function ProblemsPage() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [selectedTags, setSelectedTags] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All'); // All | Solved | Unsolved
  const [showFilters, setShowFilters] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    return PROBLEMS.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchDiff = difficulty === 'All' || p.difficulty === difficulty;
      const matchTags = selectedTags.length === 0 || selectedTags.every((t) => p.tags.includes(t));
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Solved' && p.solved) ||
        (statusFilter === 'Unsolved' && !p.solved);
      return matchSearch && matchDiff && matchTags && matchStatus;
    });
  }, [search, difficulty, selectedTags, statusFilter]);

  const counts = useMemo(() => ({
    Easy: PROBLEMS.filter((p) => p.difficulty === 'Easy').length,
    Medium: PROBLEMS.filter((p) => p.difficulty === 'Medium').length,
    Hard: PROBLEMS.filter((p) => p.difficulty === 'Hard').length,
    solved: PROBLEMS.filter((p) => p.solved).length,
  }), []);

  const clearFilters = () => {
    setSearch('');
    setDifficulty('All');
    setSelectedTags([]);
    setStatusFilter('All');
  };

  const hasActiveFilters = search || difficulty !== 'All' || selectedTags.length || statusFilter !== 'All';

  return (
    <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">Problems</h1>
          <p className="text-slate-400 text-sm">Choose a problem and start coding</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total', count: PROBLEMS.length, color: 'text-white', bg: 'bg-white/5', border: 'border-white/10' },
            { label: 'Easy', count: counts.Easy, color: DIFFICULTY_COLORS.Easy.text, bg: DIFFICULTY_COLORS.Easy.bg, border: DIFFICULTY_COLORS.Easy.border },
            { label: 'Medium', count: counts.Medium, color: DIFFICULTY_COLORS.Medium.text, bg: DIFFICULTY_COLORS.Medium.bg, border: DIFFICULTY_COLORS.Medium.border },
            { label: 'Hard', count: counts.Hard, color: DIFFICULTY_COLORS.Hard.text, bg: DIFFICULTY_COLORS.Hard.bg, border: DIFFICULTY_COLORS.Hard.border },
          ].map((s) => (
            <div
              key={s.label}
              className={`p-4 rounded-xl border ${s.bg} ${s.border} flex items-center justify-between`}
            >
              <span className="text-slate-400 text-sm font-medium">{s.label}</span>
              <span className={`text-xl font-black ${s.color}`}>{s.count}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters (desktop) */}
          <aside className="hidden lg:block w-56 shrink-0">
            <Panel>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Difficulty</h3>
              <div className="space-y-1 mb-6">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      difficulty === d
                        ? d === 'All'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : `${DIFFICULTY_COLORS[d]?.bg} ${DIFFICULTY_COLORS[d]?.text} border ${DIFFICULTY_COLORS[d]?.border}`
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="font-medium">{d}</span>
                    {d !== 'All' && (
                      <span className="text-xs opacity-60">{counts[d]}</span>
                    )}
                  </button>
                ))}
              </div>

              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Status</h3>
              <div className="space-y-1 mb-6">
                {['All', 'Solved', 'Unsolved'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      statusFilter === s
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="font-medium">{s}</span>
                    {s === 'Solved' && <span className="text-xs opacity-60">{counts.solved}</span>}
                  </button>
                ))}
              </div>

              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Topics</h3>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-white/5 text-slate-400 border border-white/5 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </Panel>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search + Filter Bar */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search problems, tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111827] border border-white/5 text-white placeholder-slate-500 outline-none focus:border-blue-500/40 transition-all text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  hasActiveFilters
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : 'bg-[#111827] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#111827] border border-white/5 text-slate-400 hover:text-white text-sm transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="lg:hidden mb-4">
                <Panel>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs font-semibold text-slate-400 self-center">Difficulty:</span>
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          difficulty === d
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-white/5 text-slate-400 border border-white/5'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-white/5 text-slate-400 border border-white/5'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {/* Active filter chips */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    {tag}
                    <button onClick={() => toggleTag(tag)} className="hover:text-blue-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Result count */}
            <div className="text-xs text-slate-500 mb-3 font-medium">
              {filtered.length} problem{filtered.length !== 1 ? 's' : ''} found
            </div>

            {/* Problem Table */}
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 bg-[#0d1420] border-b border-white/5">
                <span className="text-xs font-semibold text-slate-500 w-5">#</span>
                <span className="text-xs font-semibold text-slate-500">Title</span>
                <span className="text-xs font-semibold text-slate-500">Difficulty</span>
                <span className="text-xs font-semibold text-slate-500 hidden md:block">Acceptance</span>
                <span className="text-xs font-semibold text-slate-500 w-4"></span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Search className="w-10 h-10 text-slate-600 mb-3" />
                    <p className="text-slate-400 font-medium">No problems found</p>
                    <p className="text-slate-600 text-sm mt-1">Try adjusting your search or filters</p>
                    <button onClick={clearFilters} className="mt-4 text-blue-400 text-sm hover:text-blue-300 transition-colors">
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  filtered.map((p, i) => (
                    <Link
                      key={p.id}
                      to={`/problems/${p.id}`}
                      className="group flex sm:grid sm:grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-5 py-4 bg-[#111827] hover:bg-[#141e2e] transition-all duration-150"
                    >
                      {/* Status Icon */}
                      <div className="w-5 flex items-center justify-center">
                        <SolvedIcon solved={p.solved} />
                      </div>

                      {/* Title + Tags */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                          {i + 1}. {p.title}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {p.tags.map((t) => (
                            <TagChip key={t} label={t} />
                          ))}
                        </div>
                      </div>

                      {/* Difficulty */}
                      <DifficultyBadge difficulty={p.difficulty} />

                      {/* Acceptance */}
                      <span className="hidden md:block text-slate-500 text-xs font-mono">
                        {p.acceptance}%
                      </span>

                      {/* Arrow */}
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
