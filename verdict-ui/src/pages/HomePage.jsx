import { Link } from 'react-router-dom';
import {
  ArrowRight, Code2, Zap, Trophy, Users, BookOpen,
  Terminal, CheckCircle, Star, ChevronRight, Globe,
  Shield, TrendingUp,
} from 'lucide-react';
import { STATS, LANGUAGES, PROBLEMS, DIFFICULTY_COLORS } from '../data/sampleData';
import { StatCard, DifficultyBadge, Panel } from '../components/UI';

const FEATURES = [
  {
    icon: Terminal,
    title: 'Real-time Code Execution',
    desc: 'Run your code instantly against test cases with detailed output and error messages.',
    color: 'blue',
  },
  {
    icon: Trophy,
    title: 'Leaderboard & Rankings',
    desc: 'Compete with developers worldwide and track your progress on a global leaderboard.',
    color: 'violet',
  },
  {
    icon: BookOpen,
    title: 'Curated Problem Sets',
    desc: 'Practice with problems from real tech interviews at top companies.',
    color: 'emerald',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    desc: 'Detailed analytics on your solving patterns, strengths, and improvement areas.',
    color: 'amber',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    desc: 'Code in Python, JavaScript, Java, and C++ with syntax highlighting.',
    color: 'blue',
  },
  {
    icon: Shield,
    title: 'Secure Sandboxed Environment',
    desc: 'Your code runs in an isolated container ensuring safety and fairness.',
    color: 'violet',
  },
];

const HERO_PROBLEMS = PROBLEMS.slice(0, 3);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0b0f1a]">
      {/* ─── HERO ──────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-blue-500/5 rounded-full blur-3xl" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Now with AI-powered hints & analysis
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-none">
            <span className="text-white">Solve. Code.</span>
            <br />
            <span className="gradient-text">Get Your Verdict.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A modern competitive programming judge for the next generation of developers.
            Practice real interview problems, track progress, and ace your coding rounds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/problems"
              className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-bold text-base shadow-xl hover:shadow-blue-500/30 hover:from-blue-400 hover:to-violet-500 transition-all duration-300 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              Start Coding
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/problems"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-base hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              Explore Problems
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <StatCard value={`${STATS.totalProblems}+`} label="Problems" icon={Code2} color="blue" />
            <StatCard value={`${STATS.languages}`} label="Languages" icon={Terminal} color="violet" />
            <StatCard value={`${(STATS.totalUsers / 1000).toFixed(0)}K+`} label="Active Users" icon={Users} color="emerald" />
            <StatCard value={`${(STATS.submissions / 1000).toFixed(0)}K+`} label="Submissions" icon={CheckCircle} color="amber" />
          </div>
        </div>
      </section>

      {/* ─── FLOATING EDITOR PREVIEW ───────────────────────── */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Panel className="overflow-hidden" padding={false}>
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-[#0d1420]">
              <span className="w-3 h-3 rounded-full bg-rose-500/70" />
              <span className="w-3 h-3 rounded-full bg-amber-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-xs text-slate-500 font-mono">verdict — Two Sum.js</span>
            </div>
            {/* Code */}
            <div className="p-5 font-mono text-sm bg-[#0d1420] overflow-x-auto">
              <pre className="text-slate-300 leading-7">
{`  1  `}<span className="text-slate-500">/**</span>{'\n'}
{`  2  `}<span className="text-slate-500"> * @param </span><span className="text-blue-400">{'{'}</span><span className="text-amber-400">number[]</span><span className="text-blue-400">{'}'}</span><span className="text-slate-500"> nums</span>{'\n'}
{`  3  `}<span className="text-slate-500"> * @return </span><span className="text-blue-400">{'{'}</span><span className="text-amber-400">number[]</span><span className="text-blue-400">{'}'}</span>{'\n'}
{`  4  `}<span className="text-slate-500"> */</span>{'\n'}
{`  5  `}<span className="text-violet-400">var</span> <span className="text-blue-400">twoSum</span> <span className="text-white">= </span><span className="text-violet-400">function</span><span className="text-white">(nums, target) {'{'}</span>{'\n'}
{`  6  `}  <span className="text-violet-400">const</span> map <span className="text-white">= </span><span className="text-violet-400">new</span> <span className="text-emerald-400">Map</span><span className="text-white">();</span>{'\n'}
{`  7  `}  <span className="text-violet-400">for</span> <span className="text-white">(</span><span className="text-violet-400">let</span> i <span className="text-white">= </span><span className="text-amber-400">0</span><span className="text-white">; i &lt; nums.</span><span className="text-blue-400">length</span><span className="text-white">; i++) {'{'}</span>{'\n'}
{`  8  `}    <span className="text-violet-400">const</span> comp <span className="text-white">= target - nums[i];</span>{'\n'}
{`  9  `}    <span className="text-violet-400">if</span> <span className="text-white">(map.</span><span className="text-blue-400">has</span><span className="text-white">(comp)) </span><span className="text-violet-400">return</span> <span className="text-white">[map.</span><span className="text-blue-400">get</span><span className="text-white">(comp), i];</span>{'\n'}
{` 10  `}    map.<span className="text-blue-400">set</span><span className="text-white">(nums[i], i);</span>{'\n'}
{` 11  `}  <span className="text-white">{'}'}</span>{'\n'}
{` 12  `}<span className="text-white">{'}'}</span>
</pre>
            </div>
            {/* Test result bar */}
            <div className="flex items-center gap-4 px-5 py-3 border-t border-white/5 bg-[#0d1420]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-[#0b0f1a]" />
                </div>
                <span className="text-emerald-400 font-semibold text-sm">All Test Cases Passed</span>
              </div>
              <div className="text-slate-500 text-xs">2/2 passed</div>
              <div className="ml-auto flex gap-4 text-xs text-slate-400">
                <span>⚡ 0.12s</span>
                <span>💾 12.4 MB</span>
              </div>
            </div>
          </Panel>
        </div>
      </section>

      {/* ─── SUPPORTED LANGUAGES ───────────────────────────── */}
      <section className="px-4 py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-8">Supported Languages</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.id}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-white/5 bg-[#111827] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 cursor-default"
              >
                <span className="text-3xl">{lang.icon}</span>
                <div className="text-center">
                  <div className="text-white font-bold text-sm">{lang.label}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{lang.version}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─────────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Everything you need to{' '}
              <span className="gradient-text">level up</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Built for developers who take their craft seriously.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              const colorMap = {
                blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
                emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
              };
              return (
                <Panel key={f.title} className="hover:border-white/10 transition-all duration-300 group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-4 ${colorMap[f.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </Panel>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SAMPLE PROBLEMS ───────────────────────────────── */}
      <section className="px-4 py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Featured Problems</h2>
              <p className="text-slate-400 text-sm">Start with these popular picks</p>
            </div>
            <Link to="/problems" className="flex items-center gap-1.5 text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {HERO_PROBLEMS.map((p, i) => (
              <Link
                key={p.id}
                to={`/problems/${p.id}`}
                className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-[#111827] hover:border-blue-500/20 hover:bg-blue-500/5 transition-all duration-200"
              >
                <span className="text-slate-600 font-mono text-sm w-5 text-right shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors">
                    {p.title}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <DifficultyBadge difficulty={p.difficulty} />
                <span className="text-slate-500 text-xs shrink-0">{p.acceptance}%</span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section className="px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative p-10 rounded-3xl border border-white/5 bg-gradient-to-br from-blue-600/10 via-[#111827] to-violet-600/10 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <Star className="w-8 h-8 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to prove yourself?
              </h2>
              <p className="text-slate-400 mb-8 text-lg">
                Join thousands of developers sharpening their skills on Verdict every day.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-bold text-base shadow-xl hover:shadow-blue-500/30 hover:from-blue-400 hover:to-violet-500 transition-all duration-300 active:scale-95"
              >
                <Zap className="w-4 h-4" />
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            <span className="text-slate-400 text-sm">© 2026 Verdict. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
