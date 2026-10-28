import React, { useState, useCallback } from "react";
import {
  Play, Send, CheckCircle2, XCircle, Clock, RotateCcw,
  ChevronRight, Loader2, History, AlertTriangle, Menu, X, Code, FileText,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
 /*solve problem like leetcode */
/* ---------------------------------------------------------------------- */

const C = {
  base: "#0B0E14", panel: "#12161F", panelAlt: "#181D29",
  border: "#242B3A", borderSoft: "#1B2130",
  text: "#E7E9EE", muted: "#838EA3", faint: "#535C70",
  brand: "#6C8CFF", success: "#34D399", error: "#F87171", warning: "#FBBF24",
};
const DIFFICULTY_COLOR = { Easy: C.success, Medium: C.warning, Hard: C.error };
const FONT_UI = "'Sora', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

/* ---------------------------------------------------------------------- */
/* Languages                                                              */
/* ---------------------------------------------------------------------- */
/* JavaScript runs locally in a Web Worker (with a hard time limit).
   Python / Java / C++ are sent to your judge server, which must wrap the
   user's `class Solution` in a driver and call `method` with `tests`. */

const LANGUAGES = [
  { id: "javascript", label: "JavaScript", engine: "remote", compiler: "nodejs-20.17.0", filename: "main.js" },
  { id: "python", label: "Python3", engine: "remote", compiler: "cpython-3.12.7", filename: "main.py" },
  { id: "java", label: "Java", engine: "remote", compiler: "openjdk-jdk-21+35", filename: "Main.java" },
  { id: "cpp", label: "C++", engine: "remote", compiler: "gcc-13.2.0", filename: "main.cpp" },
];

/* ---------------------------------------------------------------------- */
/* Problem bank — LeetCode format                                          */
/* `method` is the real LeetCode method name; `params` are the argument    */
/* names shown in "Input: nums = [...], target = ..".                      */
/* ---------------------------------------------------------------------- */

const PROBLEMS = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    method: "twoSum",
    params: ["nums", "target"],
    compare: "unordered", 
    prompt:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    visibleTests: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: [[3, 2, 4], 6], expected: [1, 2], explanation: "nums[1] + nums[2] == 6, so we return [1, 2]." },
    ],
    hiddenTests: [
      { input: [[3, 3], 6], expected: [0, 1] },
      { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
    ],
    starter: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    return [];
};`,
      python: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{};
    }
}`,
      
cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        return {};
    }
};`,
    },
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    method: "reverseString",
    params: ["s"],
    prompt: "Given a string s, return the string with its characters in reverse order.",
    constraints: ["0 <= s.length <= 10^4", "s consists of printable ASCII characters."],
    visibleTests: [
      { input: ["hello"], expected: "olleh" },
      { input: ["Judge"], expected: "egduJ" },
    ],
    hiddenTests: [
      { input: [""], expected: "" },
      { input: ["a"], expected: "a" },
    ],
    starter: {
      javascript: `/**
 * @param {string} s
 * @return {string}
 */
var reverseString = function(s) {
    return "";
};`,
      python: `class Solution:
    def reverseString(self, s: str) -> str:
        return ""`,
      java: `class Solution {
    public String reverseString(String s) {
        return "";
    }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    string reverseString(string s) {
        return "";
    }
};`,
    },
  },
  {
    id: "palindrome",
    title: "Valid Palindrome",
    difficulty: "Medium",
    method: "isPalindrome",
    params: ["s"],
    prompt:
      "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.",
    constraints: ["0 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
    visibleTests: [
      { input: ["A man, a plan, a canal: Panama"], expected: true, explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: ["race a car"], expected: false, explanation: '"raceacar" is not a palindrome.' },
    ],
    hiddenTests: [
      { input: [" "], expected: true },
      { input: ["0P"], expected: false },
    ],
    starter: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    return false;
};`,
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        return False`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        return false;
    }
}`,cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        return false;
    }
};`,
    },
  },
  {
    id: "add-two-integers",
    title: "Add Two Integers",
    difficulty: "Easy",
    method: "sum",
    params: ["num1", "num2"],
    compare: "exact",

    prompt:
      "Given two integers num1 and num2, return the sum of the two integers.",

    constraints: [
      "-1000 <= num1 <= 1000",
      "-1000 <= num2 <= 1000",
    ],

    visibleTests: [
      {
        input: [2, 3],
        expected: 5,
        explanation: "2 + 3 = 5."
      },
      {
        input: [10, 20],
        expected: 30,
        explanation: "10 + 20 = 30."
      }
    ],

    hiddenTests: [
      {
        input: [-5, 3],
        expected: -2
      },
      {
        input: [100, -200],
        expected: -100
      }
    ],

    starter: {
      javascript: `/**
 * @param {number} num1
 * @param {number} num2
 * @return {number}
 */
var sum = function(num1, num2) {
    return 0;
};`,

      python: `class Solution:
    def sum(self, num1: int, num2: int) -> int:
        return 0`,

      java: `class Solution {
    public int sum(int num1, int num2) {
        return 0;
    }
}`,

      cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int sum(int num1, int num2) {
        return 0;
    }
};`
    },
  },
];

/* ---------------------------------------------------------------------- */
/* JavaScript engine — Web Worker with a wall-clock limit                  */
/* Supports both LeetCode JS styles:                                       */
/*   var twoSum = function(...) {}      and      class Solution { ... }    */
/* ---------------------------------------------------------------------- */

const JS_TIME_LIMIT_MS = 3000;

const WORKER_SRC =
  "(" +
  function () {
    self.onmessage = function (e) {
      const { code, tests, method } = e.data;
      let target = null;

      try {
        const candidateNames = [
          method,
          "sum",
          "addTwoIntegers",
          "add",
          "twoSum",
          "two_sum",
          "isPalindrome",
          "is_palindrome",
          "reverseString",
          "reverse_string",
          "solve",
        ];

        const runner = new Function(
          code +
            "\nreturn {" +
            "  Solution: typeof Solution !== 'undefined' ? Solution : null," +
            "  getFn: function(name) { try { return eval(name); } catch(_) { return undefined; } }" +
            "};"
        );

        const exported = runner();

        // 1. Direct function in global scope
        for (const name of candidateNames) {
          if (!name) continue;
          const fn = exported.getFn(name);
          if (typeof fn === "function") {
            target = fn;
            break;
          }
        }

        // 2. Class Solution
        if (!target && exported.Solution) {
          let inst = null;
          try {
            inst = new exported.Solution();
          } catch (_) {}

          for (const name of candidateNames) {
            if (!name) continue;
            if (inst && typeof inst[name] === "function") {
              target = inst[name].bind(inst);
              break;
            }
            if (typeof exported.Solution[name] === "function") {
              target = exported.Solution[name].bind(exported.Solution);
              break;
            }
          }

          if (!target && inst) {
            const proto = Object.getPrototypeOf(inst);
            const props = Object.getOwnPropertyNames(proto);
            for (const prop of props) {
              if (prop !== "constructor" && typeof inst[prop] === "function") {
                target = inst[prop].bind(inst);
                break;
              }
            }
          }
        }

        if (!target) {
          postMessage({
            compileError: "Could not find function '" + method + "' or 'class Solution'.",
          });
          return;
        }
      } catch (err) {
        postMessage({ compileError: (err && err.message) || String(err) });
        return;
      }

      const results = [];
      for (const test of tests) {
        const logs = [];
        const original = console.log;
        console.log = function () {
          logs.push(
            Array.prototype.map
              .call(arguments, (x) => (typeof x === "object" ? JSON.stringify(x) : String(x)))
              .join(" ")
          );
        };
        try {
          const start = performance.now();
          const input = JSON.parse(JSON.stringify(test.input)); // fresh copy per test
          let output = target.apply(null, input);
          const ms = performance.now() - start;

          // Normalize boolean strings
          if (typeof output === "string" && (output.toLowerCase() === "true" || output.toLowerCase() === "false")) {
            output = output.toLowerCase() === "true";
          }

          let safe = output === undefined ? null : output;
          try {
            safe = JSON.parse(JSON.stringify(safe));
          } catch (_) {
            safe = String(safe);
          }
          results.push({ output: safe, ms, error: null, stdout: logs.join("\n") });
        } catch (err) {
          results.push({
            output: null,
            ms: 0,
            error: (err && err.message) || String(err),
            stdout: logs.join("\n"),
          });
        } finally {
          console.log = original;
        }
      }
      postMessage({ results });
    };
  }.toString() +
  ")()";

function runViaWorker(code, tests, method) {
  return new Promise((resolve) => {
    let worker;
    let url;
    try {
      url = URL.createObjectURL(new Blob([WORKER_SRC], { type: "application/javascript" }));
      worker = new Worker(url);
    } catch (err) {
      resolve({ runtimeError: "Could not start the sandbox: " + (err?.message || err) });
      return;
    }

    const finish = (value) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(value);
    };

    // Kills infinite loops
    const timer = setTimeout(() => finish({ timedOut: true }), JS_TIME_LIMIT_MS);

    worker.onmessage = (e) => finish(e.data);
    worker.onerror = (e) => finish({ runtimeError: e.message || "Worker crashed." });
    worker.postMessage({ code, tests, method });
  });
}

/* ---------------------------------------------------------------------- */
/* Remote engine (Python / Java / C++)                                     */
/* ---------------------------------------------------------------------- */
const EXECUTION_ENDPOINT =
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_EXECUTION_API_URL) ||
  "http://localhost:3001/api/execute";

async function runViaRemote(langCfg, problem, code, tests) {
  const controller = new AbortController();

  const abortTimer = setTimeout(() => {
    controller.abort();
  }, 20000);

  try {
    const res = await fetch(EXECUTION_ENDPOINT, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        language: langCfg.id,
        compiler: langCfg.compiler,
        filename: langCfg.filename,

        // LeetCode problem
        problemId: problem.id,

        // Actual LeetCode method
        method: problem.method,

        // Parameter names
        params: problem.params,

        // Student code only
        code,

        // DO NOT send expected answers
        tests: tests.map((test) => ({
          input: test.input,
        })),
      }),

      signal: controller.signal,
    });

    if (!res.ok) {
      return {
        networkError:
          `Judge server returned HTTP ${res.status}.`,
      };
    }

    const data = await res.json();

    /* ---------------- Compilation error ---------------- */

    if (
      data.compileError ||
      (
        data.compile &&
        data.compile.code !== undefined &&
        data.compile.code !== 0
      )
    ) {
      return {
        compileError:
          data.compileError ||
          data.compile?.stderr ||
          data.compile?.output ||
          "Compilation failed.",
      };
    }

    /* ---------------- Time limit ---------------- */

    if (
      data.timedOut ||
      data.run?.signal
    ) {
      return {
        timedOut: true,
      };
    }

    /* ---------------- Runtime error ---------------- */

    if (data.runtimeError) {
      return {
        runtimeError: data.runtimeError,
      };
    }

    /* ---------------- Structured results ---------------- */

    if (Array.isArray(data.results)) {
      return {
        results: data.results.map((r) => ({
          output:
            r.output === undefined
              ? null
              : r.output,

          ms:
            typeof r.ms === "number"
              ? r.ms
              : null,

          error:
            r.error || null,

          stdout:
            r.stdout || null,
        })),
      };
    }

    /* ---------------- Old-style server response ---------------- */

    if (
      data.run &&
      data.run.code !== undefined &&
      data.run.code !== 0
    ) {
      return {
        runtimeError:
          data.run.stderr ||
          data.run.output ||
          "Program exited with an error.",
      };
    }

    return {
      networkError:
        "Invalid response received from judge server.",
    };

  } catch (err) {
    return {
      networkError:
        err?.name === "AbortError"
          ? "Execution timed out while contacting the judge."
          : `Cannot reach the judge server: ${
              String(err?.message || err)
            }`,
    };

  } finally {
    clearTimeout(abortTimer);
  }
}


/* ---------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ---------------------------------------------------------------------- */

const fmt = (val) => (val === undefined ? "undefined" : JSON.stringify(val));

// LeetCode shows inputs as "nums = [2,7,11,15]" one argument per line
const fmtInput = (problem, input) => input.map((v, i) => `${problem.params[i]} = ${fmt(v)}`);

function isCorrect(problem, output, expected) {
  if (typeof expected === "boolean") {
    if (output === "true" || output === 1) output = true;
    if (output === "false" || output === 0) output = false;
  }
  if (typeof expected === "number" && typeof output === "string" && !isNaN(Number(output))) {
    output = Number(output);
  }
  if (problem.compare === "unordered" && Array.isArray(output) && Array.isArray(expected)) {
    const norm = (a) => JSON.stringify([...a].sort((x, y) => x - y));
    return norm(output) === norm(expected);
  }
  return JSON.stringify(output) === JSON.stringify(expected);
}

/* ---------------------------------------------------------------------- */
/* UI atoms                                                                */
/* ---------------------------------------------------------------------- */

function Pill({ color, children }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-sm"
      style={{ color, border: `1px solid ${color}55`, background: `${color}14` }}
    >
      {children}
    </span>
  );
}

const VERDICT_STYLE = {
  Accepted: { color: C.success, Icon: CheckCircle2 },
  "Wrong Answer": { color: C.error, Icon: XCircle },
  "Runtime Error": { color: C.error, Icon: XCircle },
  "Compilation Error": { color: C.error, Icon: XCircle },
  "Time Limit Exceeded": { color: C.warning, Icon: Clock },
  "Judge Unavailable": { color: C.warning, Icon: AlertTriangle },
};

function VerdictBanner({ verdict }) {
  if (!verdict) return null;
  const { color, Icon } = VERDICT_STYLE[verdict.status] || VERDICT_STYLE["Runtime Error"];
  return (
    <div
      className="relative flex items-center justify-between p-3.5 sm:p-4 mb-3 rounded-lg overflow-hidden"
      style={{
        background: verdict.status === "Accepted" ? "rgba(52, 211, 153, 0.1)" : verdict.status === "Time Limit Exceeded" ? "rgba(251, 191, 36, 0.1)" : "rgba(248, 113, 113, 0.12)",
        border: `1px solid ${color}44`,
      }}
    >
      <div
        className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r"
        style={{ background: color }}
      />
      <div className="flex items-center gap-3 pl-2 min-w-0">
        <Icon size={20} color={color} className="shrink-0" />
        <div className="min-w-0">
          <div className="text-sm sm:text-base font-bold leading-tight" style={{ color, fontFamily: FONT_UI }}>
            {verdict.status}
          </div>
          {verdict.detail && (
            <div
              className="text-xs mt-0.5 whitespace-pre-wrap break-words"
              style={{ color: C.muted, fontFamily: verdict.mono ? FONT_MONO : FONT_UI }}
            >
              {verdict.detail}
            </div>
          )}
        </div>
      </div>
      {verdict.ms != null && (
        <div className="hidden sm:flex items-center gap-3 text-xs" style={{ color: C.faint, fontFamily: FONT_MONO }}>
          <span>⚡ {Number(verdict.ms).toFixed(2)}s</span>
          <span>💾 11.8 MB</span>
        </div>
      )}
    </div>
  );
}

function Field({ label, children, error }) {
  return (
    <div className="mb-2">
      <div className="text-[11px] mb-1" style={{ color: C.faint, fontFamily: FONT_UI }}>{label}</div>
      <div
        className="px-3 py-2 text-xs whitespace-pre-wrap break-words"
        style={{ background: C.base, border: `1px solid ${C.borderSoft}`, fontFamily: FONT_MONO, color: error ? C.error : C.text }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Main app                                                                */
/* ---------------------------------------------------------------------- */

export default function App() {
  const [activeId, setActiveId] = useState(PROBLEMS[0].id);
  const problem = PROBLEMS.find((p) => p.id === activeId);

  const [code, setCode] = useState(() => {
    const init = {};
    PROBLEMS.forEach((p) => { init[p.id] = { ...p.starter }; });
    return init;
  });

  const [language, setLanguage] = useState("javascript");
  const [tab, setTab] = useState("description");
  const [running, setRunning] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [testRows, setTestRows] = useState([]);
  const [selectedCase, setSelectedCase] = useState(0);
  const [submissions, setSubmissions] = useState({});
  const [mobileTab, setMobileTab] = useState("problem");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const langMeta = LANGUAGES.find((l) => l.id === language);
  const currentCode = code[activeId][language];

  const setCurrentCode = (val) =>
    setCode((prev) => ({ ...prev, [activeId]: { ...prev[activeId], [language]: val } }));

  const resetCode = () =>
    setCode((prev) => ({ ...prev, [activeId]: { ...prev[activeId], [language]: problem.starter[language] } }));

  const selectProblem = (id) => {
    setActiveId(id);
    setVerdict(null);
    setTestRows([]);
    setSelectedCase(0);
    setTab("description");
    setSidebarOpen(false);
  };

  // Tab inserts 4 spaces instead of leaving the editor
  const onEditorKeyDown = (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.target;
    const { selectionStart: s, selectionEnd: en } = el;
    setCurrentCode(currentCode.slice(0, s) + "    " + currentCode.slice(en));
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
  };

  function recordSubmission(status) {
    setSubmissions((prev) => {
      const list = prev[activeId] ? [...prev[activeId]] : [];
      list.unshift({
        ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        lang: langMeta.label,
        status,
      });
      return { ...prev, [activeId]: list };
    });
  }

  const execute = useCallback(
    async (mode) => {
      setRunning(true);
      setVerdict(null);
      setTestRows([]);
      setSelectedCase(0);
      setMobileTab("result");

      const tests = mode === "run" ? problem.visibleTests : [...problem.visibleTests, ...problem.hiddenTests];

      const result =
        langMeta.engine === "worker"
          ? await runViaWorker(currentCode, tests, problem.method)
          : await runViaRemote(langMeta, problem, currentCode, tests);

      setRunning(false);

      if (result.networkError) {
        setVerdict({
          status: "Judge Unavailable",
          detail: `${result.networkError} Make sure the judge server is running and /api/execute is reachable. JavaScript still runs locally.`,
        });
        return;
      }
      if (result.compileError) {
        setVerdict({ status: "Compilation Error", detail: result.compileError.slice(0, 1200), mono: true });
        if (mode === "submit") recordSubmission("Compilation Error");
        return;
      }
      if (result.timedOut) {
        setVerdict({ status: "Time Limit Exceeded", detail: "Execution exceeded the time limit." });
        if (mode === "submit") recordSubmission("Time Limit Exceeded");
        return;
      }
      if (result.runtimeError) {
        setVerdict({ status: "Runtime Error", detail: result.runtimeError.slice(0, 1200), mono: true });
        if (mode === "submit") recordSubmission("Runtime Error");
        return;
      }

      const rows = result.results.map((r, i) => {
        const t = tests[i];
        const hidden = mode === "submit" && i >= problem.visibleTests.length;
        const pass = !r.error && isCorrect(problem, r.output, t.expected);
        return { ...r, ...t, pass, hidden, index: i + 1 };
      });

      const anyError = rows.some((r) => r.error);
      const allPass = rows.every((r) => r.pass);
      const status = anyError ? "Runtime Error" : allPass ? "Accepted" : "Wrong Answer";
      const passCount = rows.filter((r) => r.pass).length;
      const avgMs = rows.reduce((acc, r) => acc + (r.ms || 0), 0) / (rows.length || 1);

      setVerdict({
        status,
        ms: avgMs > 0 ? (avgMs / 1000).toFixed(2) : "0.09",
        detail:
          mode === "run"
            ? `${passCount} / ${rows.length} sample test cases passed`
            : `${passCount} / ${rows.length} test cases passed`,
      });
      setTestRows(rows);
      const firstFail = rows.findIndex((r) => !r.pass);
      setSelectedCase(firstFail === -1 ? 0 : firstFail);
      if (mode === "submit") recordSubmission(status);
    },
    [currentCode, langMeta, problem]
  );

  const mySubs = submissions[activeId] || [];
  const activeRow = testRows[selectedCase];
  // Hidden cases only reveal details when they fail (like LeetCode)
  const showDetail = activeRow && (!activeRow.hidden || !activeRow.pass);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: C.base, color: C.text, fontFamily: FONT_UI, minHeight: "700px" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded text-slate-300"
            style={{ background: C.panelAlt }}
            title="Toggle Problems"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="w-7 h-7 flex items-center justify-center text-sm font-bold rounded" style={{ background: C.brand, color: C.base }}>V</div>
          <span className="text-base font-semibold tracking-tight">Verdict</span>
          <span className="text-xs ml-1 hidden sm:inline" style={{ color: C.faint }}>online judge</span>
        </div>
        <div className="text-xs" style={{ color: C.faint }}>{PROBLEMS.length} problems</div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden shrink-0 text-xs" style={{ borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        <button
          onClick={() => setMobileTab("problem")}
          className="flex-1 py-2.5 font-medium text-center transition-colors"
          style={{
            borderBottom: mobileTab === "problem" ? `2px solid ${C.brand}` : "2px solid transparent",
            color: mobileTab === "problem" ? C.brand : C.muted,
            background: mobileTab === "problem" ? `${C.brand}15` : "transparent",
          }}
        >
          Problem
        </button>
        <button
          onClick={() => setMobileTab("editor")}
          className="flex-1 py-2.5 font-medium text-center transition-colors"
          style={{
            borderBottom: mobileTab === "editor" ? `2px solid ${C.brand}` : "2px solid transparent",
            color: mobileTab === "editor" ? C.brand : C.muted,
            background: mobileTab === "editor" ? `${C.brand}15` : "transparent",
          }}
        >
          Code Editor
        </button>
        <button
          onClick={() => setMobileTab("result")}
          className="flex-1 py-2.5 font-medium text-center flex items-center justify-center gap-1.5 transition-colors"
          style={{
            borderBottom: mobileTab === "result" ? `2px solid ${C.brand}` : "2px solid transparent",
            color: mobileTab === "result" ? C.brand : C.muted,
            background: mobileTab === "result" ? `${C.brand}15` : "transparent",
          }}
        >
          <span>Result</span>
          {verdict && (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: verdict.status === "Accepted" ? C.success : C.error }}
            />
          )}
        </button>
      </div>

      <div className="flex flex-1 min-h-0 relative">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "fixed inset-y-0 left-0 z-50 w-64 shadow-2xl block" : "hidden md:block w-56"
          } shrink-0 py-2 overflow-y-auto`}
          style={{ borderRight: `1px solid ${C.border}`, background: C.panel }}
        >
          {sidebarOpen && (
            <div className="md:hidden flex items-center justify-between px-4 py-2 mb-2" style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
              <span className="text-xs font-semibold" style={{ color: C.muted }}>Problems</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded text-slate-400">
                <X size={15} />
              </button>
            </div>
          )}
          {PROBLEMS.map((p, i) => {
            const active = p.id === activeId;
            const subStatus = (submissions[p.id] || [])[0]?.status;
            return (
              <button
                key={p.id}
                onClick={() => selectProblem(p.id)}
                className="w-full text-left px-4 py-2.5 flex items-center gap-2"
                style={{ background: active ? C.panelAlt : "transparent", borderLeft: active ? `2px solid ${C.brand}` : "2px solid transparent" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: subStatus === "Accepted" ? C.success : subStatus ? C.error : C.faint }}
                />
                <div className="min-w-0">
                  <div className="text-sm truncate" style={{ color: active ? C.text : C.muted }}>{i + 1}. {p.title}</div>
                </div>
                <span className="text-xs ml-auto shrink-0" style={{ color: DIFFICULTY_COLOR[p.difficulty] }}>{p.difficulty[0]}</span>
              </button>
            );
          })}
        </div>

        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Problem panel */}
        <div
          className={`${
            mobileTab === "problem" ? "flex w-full" : "hidden md:flex md:w-96"
          } shrink-0 flex-col min-h-0`}
          style={{ borderRight: `1px solid ${C.border}` }}
        >
          <div className="flex items-center px-5 pt-4 gap-4" style={{ borderBottom: `1px solid ${C.border}` }}>
            <button
              onClick={() => setTab("description")}
              className="pb-3 text-sm"
              style={{ color: tab === "description" ? C.text : C.faint, borderBottom: tab === "description" ? `2px solid ${C.brand}` : "2px solid transparent" }}
            >
              Description
            </button>
            <button
              onClick={() => setTab("submissions")}
              className="pb-3 text-sm flex items-center gap-1"
              style={{ color: tab === "submissions" ? C.text : C.faint, borderBottom: tab === "submissions" ? `2px solid ${C.brand}` : "2px solid transparent" }}
            >
              <History size={13} /> Submissions
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {tab === "description" ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-semibold">{problem.title}</h2>
                  <Pill color={DIFFICULTY_COLOR[problem.difficulty]}>{problem.difficulty}</Pill>
                </div>
                <p className="text-sm leading-relaxed mb-5 whitespace-pre-line" style={{ color: C.muted, maxWidth: "62ch" }}>
                  {problem.prompt}
                </p>

                {problem.visibleTests.map((t, i) => (
                  <div key={i} className="mb-4">
                    <div className="text-sm font-semibold mb-1.5">Example {i + 1}:</div>
                    <div className="text-xs px-3 py-2 leading-relaxed" style={{ fontFamily: FONT_MONO, background: C.panel, borderLeft: `2px solid ${C.border}` }}>
                      <div style={{ color: C.faint }}>
                        <b style={{ color: C.muted }}>Input:</b>{" "}
                        <span style={{ color: C.text }}>{fmtInput(problem, t.input).join(", ")}</span>
                      </div>
                      <div style={{ color: C.faint }}>
                        <b style={{ color: C.muted }}>Output:</b> <span style={{ color: C.text }}>{fmt(t.expected)}</span>
                      </div>
                      {t.explanation && (
                        <div style={{ color: C.faint }}>
                          <b style={{ color: C.muted }}>Explanation:</b> <span style={{ color: C.text }}>{t.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="text-sm font-semibold mb-1.5 mt-5">Constraints:</div>
                <ul className="text-xs space-y-1.5 list-disc pl-5" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                  {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </>
            ) : mySubs.length === 0 ? (
              <div className="text-sm" style={{ color: C.faint }}>No submissions yet for this problem.</div>
            ) : (
              <div className="space-y-2">
                {mySubs.map((s, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 text-xs" style={{ background: C.panel, border: `1px solid ${C.borderSoft}` }}>
                    <span style={{ color: s.status === "Accepted" ? C.success : C.error }}>{s.status}</span>
                    <span style={{ color: C.faint, fontFamily: FONT_MONO }}>{s.lang}</span>
                    <span style={{ color: C.faint, fontFamily: FONT_MONO }}>{s.ts}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor + console */}
        <div
          className={`${
            mobileTab !== "problem" ? "flex" : "hidden md:flex"
          } flex-1 flex-col min-h-0 min-w-0`}
        >
          <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs px-2 py-1.5 outline-none rounded"
              style={{ background: C.panel, color: C.text, border: `1px solid ${C.borderSoft}`, fontFamily: FONT_MONO }}
            >
              {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>

            <button onClick={resetCode} className="text-xs px-2 py-1.5 flex items-center gap-1 rounded" style={{ color: C.faint, border: `1px solid ${C.borderSoft}` }} title="Reset to starter code">
              <RotateCcw size={12} /> Reset
            </button>

            {langMeta.engine === "remote" && <span className="text-xs hidden sm:inline" style={{ color: C.faint }}>cloud execution</span>}

            <div className="flex-1" />

            <button
              onClick={() => execute("run")}
              disabled={running}
              className="text-xs px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 rounded"
              style={{ color: C.text, border: `1px solid ${C.borderSoft}`, background: C.panel, opacity: running ? 0.6 : 1 }}
            >
              {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
              Run
            </button>
            <button
              onClick={() => execute("submit")}
              disabled={running}
              className="text-xs px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 font-medium rounded"
              style={{ color: C.base, background: C.brand, opacity: running ? 0.6 : 1 }}
            >
              <Send size={13} /> Submit
            </button>
          </div>

          <textarea
            value={currentCode}
            onChange={(e) => setCurrentCode(e.target.value)}
            onKeyDown={onEditorKeyDown}
            spellCheck={false}
            className={`${mobileTab === "result" ? "hidden md:block" : "block"} flex-[1.3] w-full resize-none outline-none px-4 sm:px-5 py-4 text-xs sm:text-sm`}
            style={{ background: C.base, color: C.text, fontFamily: FONT_MONO, lineHeight: 1.6, minHeight: "180px", tabSize: 4 }}
          />

          {/* Console */}
          <div
            className={`${mobileTab === "editor" ? "hidden md:block" : "block"} flex-1 overflow-y-auto px-4 sm:px-5 py-4`}
            style={{ borderTop: `1px solid ${C.border}`, background: C.panel, minHeight: "220px" }}
          >
            <div className="text-xs mb-3 flex items-center gap-1.5" style={{ color: C.faint }}>
              <ChevronRight size={13} /> Test Result
            </div>

            {!verdict && !running && (
              <div className="text-xs" style={{ color: C.faint }}>
                Run your code against the sample test cases, or submit to check against all of them.
              </div>
            )}

            {running && (
              <div className="text-xs flex items-center gap-2" style={{ color: C.muted }}>
                <Loader2 size={13} className="animate-spin" />
                {langMeta.engine === "worker" ? "Executing in a sandboxed worker…" : "Compiling and running remotely — this can take a few seconds…"}
              </div>
            )}

            {!running && verdict && <VerdictBanner verdict={verdict} />}

            {!running && testRows.length > 0 && (
              <>
                <div className="flex flex-wrap gap-2 mb-3">
                  {testRows.map((r, i) => (
                    <button
                      key={r.index}
                      onClick={() => setSelectedCase(i)}
                      className="text-xs px-3 py-1.5 flex items-center gap-1.5"
                      style={{
                        background: i === selectedCase ? C.panelAlt : "transparent",
                        border: `1px solid ${i === selectedCase ? C.border : C.borderSoft}`,
                        color: i === selectedCase ? C.text : C.muted,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.pass ? C.success : C.error }} />
                      Case {r.index}
                    </button>
                  ))}
                </div>

                {activeRow && (
                  <div>
                    {showDetail ? (
                      <>
                        <Field label="Input">
                          {fmtInput(problem, activeRow.input).map((line, i) => <div key={i}>{line}</div>)}
                        </Field>
                        <Field label="Output" error={!!activeRow.error || !activeRow.pass}>
                          {activeRow.error ? activeRow.error : fmt(activeRow.output)}
                        </Field>
                        <Field label="Expected">{fmt(activeRow.expected)}</Field>
                        {activeRow.stdout && <Field label="Stdout">{activeRow.stdout}</Field>}
                      </>
                    ) : (
                      <div className="text-xs" style={{ color: C.muted }}>Hidden test case passed.</div>
                    )}
                    {activeRow.ms != null && (
                      <div className="text-[11px]" style={{ color: C.faint, fontFamily: FONT_MONO }}>
                        Runtime: {activeRow.ms.toFixed(2)} ms
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}