import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Play, Upload, RotateCcw,
  CheckCircle2, XCircle, Clock, AlertTriangle, Terminal,
  ChevronDown, Copy, Check,
  Lightbulb, Send,
} from 'lucide-react';
import { PROBLEMS, LANGUAGES, SUBMISSIONS } from '../data/sampleData';
import { DifficultyBadge, TagChip, Button, Panel, LoadingSpinner, StatusBadge } from '../components/UI';

// Syntax highlight helpers (lightweight)
function highlightCode(code, lang) {
  // Very simple tokenizer for visual effect
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\/\/.*$)/gm, '<span class="text-slate-500">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-slate-500">$1</span>')
    .replace(/\b(var|let|const|function|return|if|else|for|while|class|new|this|import|export|default|null|undefined|true|false|void|typeof|instanceof|public|private|static|int|float|double|bool|string|auto|vector)\b/g,
      '<span class="text-violet-400">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-amber-400">$1</span>')
    .replace(/"([^"]*)"/g, '<span class="text-emerald-400">"$1"</span>')
    .replace(/'([^']*)'/g, "<span class=\"text-emerald-400\">'$1'</span>");
}

const EXECUTION_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EXECUTION_API_URL) ||
  '/api/execute';

const LANG_CONFIG = {
  javascript: { compiler: 'nodejs-20.17.0', filename: 'main.js' },
  python: { compiler: 'cpython-3.12.7', filename: 'main.py' },
  java: { compiler: 'openjdk-jdk-21+35', filename: 'Main.java' },
  cpp: { compiler: 'gcc-13.2.0', filename: 'main.cpp' },
};

function isCorrect(problem, output, expected) {
  if (typeof expected === 'boolean') {
    if (output === 'true' || output === 1) output = true;
    if (output === 'false' || output === 0) output = false;
  }
  if (typeof expected === 'number' && typeof output === 'string' && !isNaN(Number(output))) {
    output = Number(output);
  }
  if (problem?.compare === 'unordered' && Array.isArray(output) && Array.isArray(expected)) {
    const norm = (a) => JSON.stringify([...a].sort((x, y) => x - y));
    return norm(output) === norm(expected);
  }
  return JSON.stringify(output) === JSON.stringify(expected);
}

async function executeCodeRemote(problem, userCode, lang, tests, isSubmit = false) {
  const cfg = LANG_CONFIG[lang] || LANG_CONFIG.javascript;
  const payload = {
    language: lang,
    compiler: cfg.compiler,
    filename: cfg.filename,
    problemId: problem.id,
    method: problem.method || 'twoSum',
    params: problem.params || ['nums', 'target'],
    code: userCode,
    tests: tests.map((t) => ({ input: t.input })),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    let res;
    try {
      res = await fetch(EXECUTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (_) {
      // Fallback directly to backend port 3001 if vite proxy failed
      res = await fetch('http://localhost:3001/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    }

    if (!res.ok) {
      return {
        status: 'Runtime Error',
        runtime: '0.00s',
        memory: 'N/A',
        testsPassed: 0,
        testsTotal: tests.length,
        error: `Judge server returned HTTP ${res.status}`,
        cases: [],
        isSubmit,
      };
    }

    const data = await res.json();

    if (data.compileError || (data.compile && data.compile.code !== 0)) {
      return {
        status: 'Compilation Error',
        runtime: '0.00s',
        memory: 'N/A',
        testsPassed: 0,
        testsTotal: tests.length,
        error:
          data.compileError ||
          data.compile?.stderr ||
          data.compile?.output ||
          'Compilation failed.',
        cases: [],
        isSubmit,
      };
    }

    if (data.timedOut || data.run?.signal) {
      return {
        status: 'Time Limit Exceeded',
        runtime: '> 3.00s',
        memory: 'N/A',
        testsPassed: 0,
        testsTotal: tests.length,
        error: 'Execution exceeded the 3000ms time limit.',
        cases: [],
        isSubmit,
      };
    }

    if (data.runtimeError) {
      return {
        status: 'Runtime Error',
        runtime: '0.00s',
        memory: 'N/A',
        testsPassed: 0,
        testsTotal: tests.length,
        error: data.runtimeError,
        cases: [],
        isSubmit,
      };
    }

    const results = Array.isArray(data.results) ? data.results : [];
    const cases = tests.map((t, idx) => {
      const r = results[idx] || {};
      const output = r.output !== undefined ? r.output : (r.error ? r.error : '[]');
      const passed = !r.error && isCorrect(problem, r.output, t.expected);
      return {
        id: idx + 1,
        input: t.inputStr || JSON.stringify(t.input),
        expected: t.expectedStr || JSON.stringify(t.expected),
        output: typeof output === 'object' ? JSON.stringify(output) : String(output),
        passed,
        hidden: !!t.hidden,
        time: r.ms ? `${r.ms.toFixed(2)}ms` : '0.04ms',
      };
    });

    const passedCount = cases.filter((c) => c.passed).length;
    const allPass = passedCount === tests.length;
    const hasError = results.some((r) => r.error);
    const status = hasError ? 'Runtime Error' : allPass ? 'Accepted' : 'Wrong Answer';
    const avgMs = results.reduce((acc, r) => acc + (r.ms || 0), 0) / (results.length || 1);

    return {
      status,
      runtime: avgMs > 0 ? `${(avgMs / 1000).toFixed(2)}s` : '0.08s',
      memory: '11.8 MB',
      testsPassed: passedCount,
      testsTotal: tests.length,
      cases,
      isSubmit,
    };
  } catch (err) {
    return {
      status: 'Judge Unavailable',
      runtime: '0.00s',
      memory: 'N/A',
      testsPassed: 0,
      testsTotal: tests.length,
      error: `Could not reach execution server: ${err?.message || err}`,
      cases: [],
      isSubmit,
    };
  } finally {
    clearTimeout(timer);
  }
}

const STATUS_ICONS = {
  Accepted: { Icon: CheckCircle2, color: 'text-emerald-400' },
  'Wrong Answer': { Icon: XCircle, color: 'text-rose-400' },
  'Time Limit Exceeded': { Icon: Clock, color: 'text-amber-400' },
  'Runtime Error': { Icon: AlertTriangle, color: 'text-violet-400' },
  'Compilation Error': { Icon: AlertTriangle, color: 'text-orange-400' },
  'Judge Unavailable': { Icon: AlertTriangle, color: 'text-amber-400' },
};

const LEFT_TABS = ['Description', 'Submissions', 'Hints'];
const BOTTOM_TABS = ['Test Results', 'Console'];

export default function WorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const problem = PROBLEMS.find((p) => p.id === Number(id)) || PROBLEMS[0];

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(problem.starterCode[language] || '');
  const [leftTab, setLeftTab] = useState('Description');
  const [bottomTab, setBottomTab] = useState('Test Results');
  const [mobileView, setMobileView] = useState('editor'); // 'problem' | 'editor' | 'results'
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setCode(problem.starterCode[language] || '');
  }, [language, problem]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleRun = async () => {
    setRunning(true);
    setBottomTab('Test Results');
    setMobileView('results');
    const tests = problem.visibleTests || [];
    const evalResult = await executeCodeRemote(problem, code, language, tests, false);
    setResult(evalResult);
    setRunning(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setBottomTab('Test Results');
    setMobileView('results');
    const tests = [
      ...(problem.visibleTests || []),
      ...(problem.hiddenTests || []).map((t) => ({ ...t, hidden: true })),
    ];
    const evalResult = await executeCodeRemote(problem, code, language, tests, true);
    setResult(evalResult);
    setSubmitting(false);

    SUBMISSIONS.unshift({
      id: `sub_${Date.now()}`,
      problemId: problem.id,
      problemTitle: problem.title,
      status: evalResult.status,
      language: selectedLang.label,
      runtime: evalResult.runtime,
      memory: evalResult.memory,
      submittedAt: 'Just now',
      timestamp: new Date(),
    });
  };

  const handleReset = () => {
    setCode(problem.starterCode[language] || '');
    setResult(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  return (
    <div className="fixed inset-0 top-16 bg-[#0b0f1a] flex flex-col overflow-hidden">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 border-b border-white/5 bg-[#0d1420] shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => navigate('/problems')}
            className="flex items-center gap-1 text-slate-400 hover:text-white text-xs sm:text-sm transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Problems</span>
          </button>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[130px] sm:max-w-xs md:max-w-none">
            {problem.title}
          </h1>
          <DifficultyBadge difficulty={problem.difficulty} className="scale-90 sm:scale-100 origin-left" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none pl-2.5 pr-7 py-1.5 rounded-lg bg-[#111827] border border-white/10 text-white text-xs font-medium outline-none focus:border-blue-500/50 cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.icon} {l.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Quick tool icons on larger displays */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              title="Reset code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
          </div>

          <Button variant="run" size="sm" onClick={handleRun} disabled={running || submitting} className="py-1 px-2.5 sm:px-3 text-xs">
            {running ? <LoadingSpinner size="sm" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>Run</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={submitting || running} className="py-1 px-2.5 sm:px-3 text-xs">
            {submitting ? <LoadingSpinner size="sm" /> : <Upload className="w-3 h-3" />}
            <span>Submit</span>
          </Button>
        </div>
      </div>

      {/* ── Mobile View Switcher Tab Bar (Below md) ──────────── */}
      <div className="flex md:hidden border-b border-white/5 bg-[#0a0e17] shrink-0 text-xs">
        <button
          onClick={() => setMobileView('problem')}
          className={`flex-1 py-2.5 font-medium text-center border-b-2 transition-colors ${
            mobileView === 'problem' ? 'border-blue-400 text-blue-400 bg-white/5' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Problem
        </button>
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2.5 font-medium text-center border-b-2 transition-colors ${
            mobileView === 'editor' ? 'border-blue-400 text-blue-400 bg-white/5' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Code Editor
        </button>
        <button
          onClick={() => setMobileView('results')}
          className={`flex-1 py-2.5 font-medium text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            mobileView === 'results' ? 'border-blue-400 text-blue-400 bg-white/5' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>Result</span>
          {result && (
            <span className={`w-1.5 h-1.5 rounded-full ${result.status === 'Accepted' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          )}
        </button>
      </div>

      {/* ── Main Split Layout ─────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Left Panel — Problem Description */}
        <div className={`w-full md:w-[420px] lg:w-[460px] xl:w-[500px] shrink-0 flex flex-col border-r border-white/5 overflow-hidden ${
          mobileView === 'problem' ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Left Tabs */}
          <div className="flex border-b border-white/5 shrink-0 bg-[#0d1420]">
            {LEFT_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                  leftTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab === 'Hints' && <Lightbulb className="w-3.5 h-3.5" />}
                {tab === 'Submissions' && <Send className="w-3.5 h-3.5" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Left Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {leftTab === 'Description' && <DescriptionPanel problem={problem} />}
            {leftTab === 'Submissions' && <SubmissionsPanel problemId={problem.id} />}
            {leftTab === 'Hints' && <HintsPanel />}
          </div>
        </div>

        {/* Right Panel — Editor + Results */}
        <div className={`flex-1 flex-col min-w-0 overflow-hidden ${
          mobileView === 'editor' || mobileView === 'results' ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Editor Container */}
          <div className={`flex-1 flex-col min-h-0 ${mobileView === 'results' ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#0d1420] shrink-0">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <span>{selectedLang.icon}</span>
                <span>{selectedLang.label}</span>
                <span className="text-slate-600 hidden sm:inline">({selectedLang.version})</span>
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span>{code.split('\n').length} lines</span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden bg-[#0d1420] font-mono text-sm relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full p-3 sm:p-4 bg-transparent text-slate-200 resize-none outline-none font-mono text-xs sm:text-sm leading-5 sm:leading-6 caret-blue-400"
                style={{ tabSize: 2 }}
              />
            </div>
          </div>

          {/* Bottom Results Panel */}
          <div className={`border-t border-white/5 flex flex-col shrink-0 bg-[#0d1420] transition-all duration-200 ${
            mobileView === 'results' ? 'flex-1 h-full' : 'h-64 sm:h-72 md:h-80'
          }`}>
            {/* Bottom Tabs */}
            <div className="flex items-center justify-between border-b border-white/5 shrink-0 bg-[#090d16] px-2 sm:px-3">
              <div className="flex items-center">
                {BOTTOM_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setBottomTab(tab)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${
                      bottomTab === tab
                        ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab === 'Console' && <Terminal className="w-3.5 h-3.5" />}
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {(running || submitting) && <LoadingSpinner size="sm" />}
                {mobileView === 'results' && (
                  <button
                    onClick={() => setMobileView('editor')}
                    className="md:hidden text-xs text-blue-400 px-2 py-1 bg-blue-500/10 rounded"
                  >
                    Back to Code
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              {bottomTab === 'Test Results' && (
                <ResultsPanel result={result} running={running} submitting={submitting} />
              )}
              {bottomTab === 'Console' && (
                <ConsolePanel
                  customInput={customInput}
                  setCustomInput={setCustomInput}
                  onRun={handleRun}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function DescriptionPanel({ problem }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-white mb-2">{problem.title}</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <DifficultyBadge difficulty={problem.difficulty} />
          {problem.tags.map((t) => <TagChip key={t} label={t} />)}
        </div>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{problem.description}</p>
      </div>

      {problem.examples.map((ex, i) => (
        <div key={i}>
          <h3 className="text-sm font-bold text-white mb-2">Example {i + 1}:</h3>
          <div className="rounded-xl bg-[#0d1420] border border-white/5 p-4 font-mono text-sm space-y-1.5">
            <div>
              <span className="text-slate-500">Input:&nbsp;</span>
              <span className="text-slate-200">{ex.input}</span>
            </div>
            <div>
              <span className="text-slate-500">Output:&nbsp;</span>
              <span className="text-emerald-400">{ex.output}</span>
            </div>
            {ex.explanation && (
              <div>
                <span className="text-slate-500">Explanation:&nbsp;</span>
                <span className="text-slate-400">{ex.explanation}</span>
              </div>
            )}
          </div>
        </div>
      ))}

      <div>
        <h3 className="text-sm font-bold text-white mb-2">Constraints:</h3>
        <ul className="space-y-1.5">
          {problem.constraints.map((c, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-400">
              <span className="text-blue-500 shrink-0">•</span>
              <span className="font-mono">{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SubmissionsPanel({ problemId }) {
  const mySubmissions = SUBMISSIONS.filter((s) => s.problemId === problemId);
  return (
    <div className="space-y-3">
      {mySubmissions.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-8">No submissions yet for this problem.</p>
      ) : (
        mySubmissions.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0d1420] border border-white/5">
            <div>
              <StatusBadge status={s.status} />
              <p className="text-xs text-slate-500 mt-1">{s.submittedAt}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">{s.language}</p>
              <p className="text-xs text-slate-500">{s.runtime} · {s.memory}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function HintsPanel() {
  const [revealed, setRevealed] = useState([]);
  const hints = [
    'Think about what data structure would let you look up complements in O(1) time.',
    'A hash map can store each number\'s index as you iterate through the array.',
    'For each number, check if (target - number) already exists in your map before storing.',
  ];
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400 mb-4">Reveal hints one at a time to guide your thinking.</p>
      {hints.map((hint, i) => (
        <div key={i}>
          {revealed.includes(i) ? (
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-sm text-slate-300">
              <span className="font-semibold text-blue-400 text-xs uppercase tracking-wider block mb-1">Hint {i + 1}</span>
              {hint}
            </div>
          ) : (
            <button
              onClick={() => setRevealed([...revealed, i])}
              disabled={i > 0 && !revealed.includes(i - 1)}
              className="w-full p-4 rounded-xl bg-[#0d1420] border border-white/5 text-sm text-slate-500 hover:text-slate-300 hover:border-blue-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-left"
            >
              <span className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Reveal Hint {i + 1}
              </span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function ResultsPanel({ result, running, submitting }) {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);

  if (running || submitting) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <LoadingSpinner size="md" />
        <p className="text-xs sm:text-sm text-slate-400">
          {submitting ? 'Submitting to judge...' : 'Running test cases...'}
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
        <Terminal className="w-8 h-8 text-slate-600" />
        <p className="text-slate-500 text-xs sm:text-sm">Click "Run" or "Submit" to see test case results</p>
      </div>
    );
  }

  const isAccepted = result.status === 'Accepted';
  const isWrong = result.status === 'Wrong Answer';
  const cases = result.cases || [];
  const currentCase = cases[activeCaseIndex] || cases[0];

  return (
    <div className="space-y-4 font-sans text-xs sm:text-sm">
      {/* ── Top Verdict Banner (Matching User's Screenshot) ── */}
      <div
        className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border ${
          isAccepted
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : isWrong
            ? 'bg-[#2a171d] border-rose-500/30 text-rose-400'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }`}
      >
        {/* Left accent bar */}
        <div
          className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${
            isAccepted ? 'bg-emerald-400' : isWrong ? 'bg-rose-500' : 'bg-amber-400'
          }`}
        />

        <div className="flex items-center gap-3 pl-2">
          {isAccepted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : isWrong ? (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}

          <div>
            <div className="font-bold text-sm sm:text-base leading-tight">
              {result.status}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {result.isSubmit
                ? `${result.testsPassed} / ${result.testsTotal} test cases passed`
                : `${result.testsPassed} / ${result.testsTotal} sample test cases passed`}
            </div>
          </div>
        </div>

        {/* Runtime & Memory Badge */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span>⚡ {result.runtime}</span>
          <span>💾 {result.memory}</span>
        </div>
      </div>

      {/* ── Compilation or Runtime Error Message ── */}
      {result.error && (
        <div className="rounded-xl bg-rose-950/30 border border-rose-500/30 p-3.5 text-xs font-mono text-rose-300 whitespace-pre-wrap overflow-x-auto">
          <div className="font-semibold text-rose-400 mb-1 font-sans">Execution Message:</div>
          {result.error}
        </div>
      )}

      {/* ── Case Tabs (Case 1, Case 2) with status dot ── */}
      {cases.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {cases.map((c, idx) => {
            const isActive = idx === activeCaseIndex;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCaseIndex(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isActive
                    ? 'bg-[#1a2333] border-blue-500/40 text-white shadow-sm'
                    : 'bg-[#111827] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    c.passed ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                />
                <span>Case {c.id}</span>
                {c.hidden && <span className="text-[10px] text-slate-500">(hidden)</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Case Details: Input / Output / Expected ── */}
      {currentCase && (
        currentCase.hidden && currentCase.passed ? (
          <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 text-slate-400 text-xs">
            Hidden test case passed. (Test inputs and outputs are hidden on accepted tests)
          </div>
        ) : (
        <div className="space-y-3 font-mono text-xs">
          {/* Input Block */}
          <div>
            <div className="text-slate-400 font-sans text-xs mb-1.5 font-medium">Input</div>
            <div className="w-full bg-[#090d16] border border-white/5 rounded-xl p-3 text-slate-200 overflow-x-auto whitespace-pre leading-relaxed">
              {currentCase.input}
            </div>
          </div>

          {/* Output Block */}
          <div>
            <div className="text-slate-400 font-sans text-xs mb-1.5 font-medium">Output</div>
            <div
              className={`w-full bg-[#090d16] border rounded-xl p-3 overflow-x-auto whitespace-pre leading-relaxed ${
                currentCase.passed
                  ? 'border-white/5 text-emerald-400'
                  : 'border-rose-500/20 text-rose-400 bg-rose-950/10'
              }`}
            >
              {currentCase.output || '[]'}
            </div>
          </div>

          {/* Expected Block */}
          <div>
            <div className="text-slate-400 font-sans text-xs mb-1.5 font-medium">Expected</div>
            <div className="w-full bg-[#090d16] border border-white/5 rounded-xl p-3 text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
              {currentCase.expected}
            </div>
          </div>
        </div>
        )
      )}
    </div>
  );
}

function ConsolePanel({ customInput, setCustomInput, onRun }) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <label className="text-xs text-slate-400 font-medium">Custom Input</label>
      <textarea
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder="Enter your test input here..."
        className="flex-1 bg-[#111827] border border-white/5 rounded-xl p-3 text-slate-300 text-xs font-mono resize-none outline-none focus:border-blue-500/40 transition-all"
      />
    </div>
  );
}
