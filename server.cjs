const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 3001;

/* =========================================================
   COMPILER MAP
   ========================================================= */

const COMPILER_MAP = {
  javascript: "nodejs-20.17.0",
  js: "nodejs-20.17.0",
  node: "nodejs-20.17.0",
  python: "cpython-3.12.7",
  python3: "cpython-3.12.7",
  java: "openjdk-jdk-21+35",
  cpp: "gcc-13.2.0",
  "c++": "gcc-13.2.0",
};

/* =========================================================
   GENERAL HELPERS
   ========================================================= */

function jsonString(value) {
  return JSON.stringify(String(value));
}

function cppString(value) {
  return JSON.stringify(String(value));
}

/* =========================================================
   JAVASCRIPT (NODE.JS) DRIVER GENERATOR
   ========================================================= */

function makeJavaScriptCode(studentCode, problem, tests) {
  const testData = JSON.stringify(tests.map((test) => test.input));

  return `"use strict";
const { performance } = require("perf_hooks");

${studentCode}

const _TESTS = ${testData};

function _findSolveFn() {
  const candidateNames = [
    "${problem.method}",
    "sum",
    "addTwoIntegers",
    "add",
    "twoSum",
    "two_sum",
    "isPalindrome",
    "is_palindrome",
    "reverseString",
    "reverse_string",
    "solve"
  ];

  // 1. Check top-level function
  for (const name of candidateNames) {
    if (typeof global[name] === "function") return global[name];
    try {
      const fn = eval(name);
      if (typeof fn === "function") return fn;
    } catch (_) {}
  }

  // 2. Check class Solution
  let SolutionClass = null;
  if (typeof Solution === "function") SolutionClass = Solution;
  else if (typeof global.Solution === "function") SolutionClass = global.Solution;

  if (SolutionClass) {
    let inst = null;
    try { inst = new SolutionClass(); } catch (_) {}

    for (const name of candidateNames) {
      if (inst && typeof inst[name] === "function") return inst[name].bind(inst);
      if (typeof SolutionClass[name] === "function") return SolutionClass[name].bind(SolutionClass);
    }
    if (inst) {
      const proto = Object.getPrototypeOf(inst);
      const props = Object.getOwnPropertyNames(proto);
      for (const p of props) {
        if (p !== "constructor" && typeof inst[p] === "function") return inst[p].bind(inst);
      }
    }
  }

  throw new Error("Could not find method '${problem.method}' or solution function.");
}

function _run() {
  let solveFn;
  try {
    solveFn = _findSolveFn();
  } catch (err) {
    for (let i = 0; i < _TESTS.length; i++) {
      console.log("__JUDGE_RESULT__:" + JSON.stringify({
        output: null,
        ms: 0,
        error: err.message || String(err),
        stdout: ""
      }));
    }
    return;
  }

  for (const test of _TESTS) {
    const logs = [];
    const origLog = console.log;
    console.log = function(...args) {
      logs.push(args.map(x => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" "));
    };

    try {
      const start = performance.now();
      const inputCopy = JSON.parse(JSON.stringify(test));
      let output = solveFn(...inputCopy);
      const elapsed = performance.now() - start;

      if (typeof output === "string" && (output.toLowerCase() === "true" || output.toLowerCase() === "false")) {
        output = output.toLowerCase() === "true";
      }

      console.log = origLog;
      console.log("__JUDGE_RESULT__:" + JSON.stringify({
        output: output === undefined ? null : output,
        ms: elapsed,
        error: null,
        stdout: logs.join("\\n")
      }));
    } catch (err) {
      console.log = origLog;
      console.log("__JUDGE_RESULT__:" + JSON.stringify({
        output: null,
        ms: 0,
        error: err.message || String(err),
        stdout: logs.join("\\n")
      }));
    }
  }
}

_run();
`;
}

/* =========================================================
   PYTHON DRIVER GENERATOR
   ========================================================= */

function makePythonCode(studentCode, problem, tests) {
  const testData = JSON.stringify(tests.map((test) => test.input));

  return `import sys
import io
import json
import time
import math
import collections
import heapq
import re
from typing import *

${studentCode}

_TESTS = json.loads(${JSON.stringify(testData)})

def _find_solve_fn():
    # 1. Look inside class Solution
    if "Solution" in globals() and isinstance(globals()["Solution"], type):
        try:
            sol = Solution()
            # Preferred LeetCode method
            if hasattr(sol, "${problem.method}"):
                return getattr(sol, "${problem.method}")
            # Known aliases across problem sets
            for alias in ["sum", "addTwoIntegers", "add", "twoSum", "two_sum", "isPalindrome", "is_palindrome", "reverseString", "reverse_string", "solve"]:
                if hasattr(sol, alias):
                    return getattr(sol, alias)
            # Find any user-defined callable on Solution
            for attr in dir(sol):
                if not attr.startswith("_") and callable(getattr(sol, attr)):
                    return getattr(sol, attr)
        except Exception:
            pass

    # 2. Check top-level functions
    if "${problem.method}" in globals() and callable(globals()["${problem.method}"]):
        return globals()["${problem.method}"]

    for alias in ["sum", "addTwoIntegers", "add", "twoSum", "two_sum", "isPalindrome", "is_palindrome", "reverseString", "reverse_string", "solve"]:
        if alias in globals() and callable(globals()[alias]):
            return globals()[alias]

    # Any top-level user function
    for k, v in list(globals().items()):
        if not k.startswith("_") and callable(v) and k not in ("loads", "dumps", "perf_counter", "_run", "_find_solve_fn"):
            return v

    raise NameError("Could not find method '${problem.method}' or solution function.")

def _run():
    solve_fn = _find_solve_fn()

    for test in _TESTS:
        old_stdout = sys.stdout
        captured = io.StringIO()
        try:
            sys.stdout = captured
            start = time.perf_counter()

            # Problem specific handling for reverse-string (in-place vs return)
            if "${problem.id}" == "reverse-string":
                test_arg = test[0]
                try:
                    output = solve_fn(test_arg)
                except (TypeError, AttributeError):
                    char_list = list(test_arg)
                    output = solve_fn(char_list)
                    if output is None:
                        output = "".join(char_list)
                if isinstance(output, list):
                    output = "".join(output)
            else:
                output = solve_fn(*test)

            elapsed = (time.perf_counter() - start) * 1000
            user_stdout = captured.getvalue()
            sys.stdout = old_stdout

            # If user returned string "true" or "false" for boolean problems, normalize it
            if isinstance(output, str) and output.lower() in ("true", "false"):
                output = (output.lower() == "true")
            elif isinstance(output, (int, bool)) and "${problem.id}" == "palindrome":
                output = bool(output)
            elif "${problem.id}" == "add-two-integers" and output is not None:
                try:
                    output = int(output)
                except Exception:
                    pass
            elif "${problem.id}" == "two-sum" and isinstance(output, (tuple, list)):
                output = list(output)

            print("__JUDGE_RESULT__:" + json.dumps({
                "output": output,
                "ms": elapsed,
                "error": None,
                "stdout": user_stdout
            }, separators=(",", ":")))
        except Exception as e:
            user_stdout = captured.getvalue()
            sys.stdout = old_stdout
            print("__JUDGE_RESULT__:" + json.dumps({
                "output": None,
                "ms": 0,
                "error": str(e),
                "stdout": user_stdout
            }, separators=(",", ":")))
        finally:
            sys.stdout = old_stdout

_run()
`;
}

/* =========================================================
   PROBLEM KEY NORMALIZER
   ========================================================= */

function normalizeProblemKey(problemId, method) {
  const p = String(problemId || "").toLowerCase();
  const m = String(method || "").toLowerCase();
  if (p === "1" || p === "two-sum" || p === "twosum" || m.includes("twosum")) return "two-sum";
  if (p === "2" || p === "reverse-string" || p === "reversestring" || m.includes("reversestring")) return "reverse-string";
  if (p === "3" || p === "palindrome" || p === "valid-palindrome" || m.includes("palindrome")) return "palindrome";
  if (p === "4" || p === "add-two-integers" || p === "add-two-numbers" || p === "sum" || m === "sum" || m.includes("add")) return "add-two-integers";
  return p;
}

/* =========================================================
   JAVA DRIVER GENERATOR
   ========================================================= */

function makeJavaCall(problemId, method, input) {
  const key = normalizeProblemKey(problemId, method);

  if (key === "two-sum") {
    const nums = input[0];
    const target = input[1];
    return `
        try {
            long start = System.nanoTime();
            Object output = invokeSolve(solution, "two-sum", new int[]{${nums.join(", ")}}, ${target});
            double ms = (System.nanoTime() - start) / 1_000_000.0;
            System.out.println(
                "__JUDGE_RESULT__:{" +
                q("output") + ":" + toJson(output) + "," +
                q("ms") + ":" + ms + "," +
                q("error") + ":null," +
                q("stdout") + ":" + q("") +
                "}"
            );
        } catch (Throwable e) {
            Throwable cause = (e instanceof InvocationTargetException && e.getCause() != null) ? e.getCause() : e;
            System.out.println(
                "__JUDGE_RESULT__:{" +
                q("output") + ":null," +
                q("ms") + ":0," +
                q("error") + ":" + jsonString(cause.getMessage() == null ? cause.toString() : cause.getMessage()) + "," +
                q("stdout") + ":" + q("") +
                "}"
            );
        }`;
  }

  if (key === "reverse-string") {
    return `
        try {
            long start = System.nanoTime();
            Object output = invokeSolve(solution, "reverse-string", ${JSON.stringify(String(input[0]))});
            double ms = (System.nanoTime() - start) / 1_000_000.0;
            System.out.println(
                "__JUDGE_RESULT__:{" +
                q("output") + ":" + toJson(output) + "," +
                q("ms") + ":" + ms + "," +
                q("error") + ":null," +
                q("stdout") + ":" + q("") +
                "}"
            );
        } catch (Throwable e) {
            Throwable cause = (e instanceof InvocationTargetException && e.getCause() != null) ? e.getCause() : e;
            System.out.println(
                "__JUDGE_RESULT__:{" +
                q("output") + ":null," +
                q("ms") + ":0," +
                q("error") + ":" + jsonString(cause.getMessage() == null ? cause.toString() : cause.getMessage()) + "," +
                q("stdout") + ":" + q("") +
                "}"
            );
        }`;
  }

  if (key === "palindrome") {
    return `
        try {
            long start = System.nanoTime();
            Object output = invokeSolve(solution, "palindrome", ${JSON.stringify(String(input[0]))});
            double ms = (System.nanoTime() - start) / 1_000_000.0;
            System.out.println(
                "__JUDGE_RESULT__:{" +
                q("output") + ":" + toJson(output) + "," +
                q("ms") + ":" + ms + "," +
                q("error") + ":null," +
                q("stdout") + ":" + q("") +
                "}"
            );
        } catch (Throwable e) {
            Throwable cause = (e instanceof InvocationTargetException && e.getCause() != null) ? e.getCause() : e;
            System.out.println(
                "__JUDGE_RESULT__:{" +
                q("output") + ":null," +
                q("ms") + ":0," +
                q("error") + ":" + jsonString(cause.getMessage() == null ? cause.toString() : cause.getMessage()) + "," +
                q("stdout") + ":" + q("") +
                "}"
            );
        }`;
  }

  if (key === "add-two-integers") {
    return `
        try {
            long start = System.nanoTime();
            Object output = invokeSolve(solution, "add-two-integers", ${Number(input[0])}, ${Number(input[1])});
            double ms = (System.nanoTime() - start) / 1_000_000.0;
            System.out.println(
                "__JUDGE_RESULT__:{" +
                q("output") + ":" + toJson(output) + "," +
                q("ms") + ":" + ms + "," +
                q("error") + ":null," +
                q("stdout") + ":" + q("") +
                "}"
            );
        } catch (Throwable e) {
            Throwable cause = (e instanceof InvocationTargetException && e.getCause() != null) ? e.getCause() : e;
            System.out.println(
                "__JUDGE_RESULT__:{" +
                q("output") + ":null," +
                q("ms") + ":0," +
                q("error") + ":" + jsonString(cause.getMessage() == null ? cause.toString() : cause.getMessage()) + "," +
                q("stdout") + ":" + q("") +
                "}"
            );
        }`;
  }

  throw new Error("Unsupported Java problem: " + problemId);
}

function makeJavaCode(studentCode, problem, tests) {
  // Prevent duplicate public class conflicts in Main.java
  studentCode = studentCode.replace(/public\s+class\s+/g, "class ");

  const calls = tests
    .map((test) => makeJavaCall(problem.id, problem.method, test.input))
    .join("\n");

  return String.raw`
import java.util.*;
import java.util.regex.*;
import java.util.stream.*;
import java.lang.*;
import java.lang.reflect.*;
import java.math.*;
import java.io.*;

${studentCode}

class Main {
    static String q(String s) {
        return String.valueOf((char) 34) + s + String.valueOf((char) 34);
    }

    static String jsonString(String s) {
        if (s == null) return "null";
        StringBuilder out = new StringBuilder();
        out.append((char) 34);
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == 92) {
                out.append((char) 92).append((char) 92);
            } else if (c == 34) {
                out.append((char) 92).append((char) 34);
            } else if (c == 10) {
                out.append((char) 92).append('n');
            } else if (c == 13) {
                out.append((char) 92).append('r');
            } else if (c == 9) {
                out.append((char) 92).append('t');
            } else {
                out.append(c);
            }
        }
        out.append((char) 34);
        return out.toString();
    }

    static String toJson(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof int[]) return Arrays.toString((int[]) obj);
        if (obj instanceof Integer[]) return Arrays.toString((Integer[]) obj);
        if (obj instanceof boolean[]) return Arrays.toString((boolean[]) obj);
        if (obj instanceof Boolean) return ((Boolean) obj) ? "true" : "false";
        if (obj instanceof String) {
            String s = (String) obj;
            if (s.equalsIgnoreCase("true") || s.equalsIgnoreCase("false")) {
                return s.toLowerCase();
            }
            return jsonString(s);
        }
        if (obj instanceof List) {
            StringBuilder sb = new StringBuilder("[");
            List<?> list = (List<?>) obj;
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(toJson(list.get(i)));
            }
            sb.append("]");
            return sb.toString();
        }
        return String.valueOf(obj);
    }

    static Method findMethod(Object sol) throws NoSuchMethodException {
        Method[] methods = sol.getClass().getDeclaredMethods();
        String[] candidates = {"${problem.method}", "sum", "addTwoIntegers", "add", "twoSum", "two_sum", "isPalindrome", "is_palindrome", "reverseString", "reverse_string", "solve"};
        for (String name : candidates) {
            for (Method m : methods) {
                if (m.getName().equals(name)) {
                    m.setAccessible(true);
                    return m;
                }
            }
        }
        for (Method m : methods) {
            if (!m.getName().startsWith("$") && !m.getName().startsWith("access$")) {
                m.setAccessible(true);
                return m;
            }
        }
        throw new NoSuchMethodException("No solution method found in Solution class.");
    }

    static Object invokeSolve(Object sol, String problemId, Object... args) throws Exception {
        Method m = findMethod(sol);
        Class<?>[] paramTypes = m.getParameterTypes();

        if ("reverse-string".equals(problemId) && paramTypes.length == 1) {
            if (paramTypes[0] == char[].class) {
                char[] chars = ((String) args[0]).toCharArray();
                Object res = m.invoke(sol, (Object) chars);
                if (m.getReturnType() == void.class || res == null) {
                    return new String(chars);
                }
                return res;
            }
            if (paramTypes[0] == StringBuilder.class) {
                StringBuilder sb = new StringBuilder((String) args[0]);
                Object res = m.invoke(sol, sb);
                if (m.getReturnType() == void.class || res == null) {
                    return sb.toString();
                }
                return res;
            }
        }

        if ("two-sum".equals(problemId) && paramTypes.length >= 2) {
            if (List.class.isAssignableFrom(paramTypes[0])) {
                int[] arr = (int[]) args[0];
                List<Integer> list = new ArrayList<>();
                for (int x : arr) list.add(x);
                return m.invoke(sol, list, args[1]);
            }
        }

        return m.invoke(sol, args);
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
${calls}
    }
}
`;
}

/* =========================================================
   C++ DRIVER GENERATOR
   ========================================================= */

function makeCppCall(problemId, method, input) {
  const key = normalizeProblemKey(problemId, method);
  const safeMethod = method || (key === "two-sum" ? "twoSum" : key === "reverse-string" ? "reverseString" : key === "palindrome" ? "isPalindrome" : "sum");

  if (key === "two-sum") {
    const nums = input[0];
    const target = input[1];
    return `
        try {
            vector<int> arg_nums = {${nums.join(", ")}};
            int arg_target = ${target};
            auto start = chrono::high_resolution_clock::now();
            auto output = callSolve(solution, arg_nums, arg_target);
            auto end = chrono::high_resolution_clock::now();
            double ms = chrono::duration<double, milli>(end - start).count();
            cout << R"(__JUDGE_RESULT__:{"output":)" << toJson(output) << R"(,"ms":)" << ms << R"(,"error":null,"stdout":""})" << endl;
        } catch (const exception& e) {
            cout << R"(__JUDGE_RESULT__:{"output":null,"ms":0,"error":)" << jsonString(e.what()) << R"(,"stdout":""})" << endl;
        } catch (...) {
            cout << R"(__JUDGE_RESULT__:{"output":null,"ms":0,"error":"Unknown runtime exception","stdout":""})" << endl;
        }`;
  }

  if (key === "reverse-string") {
    return `
        try {
            string arg_s = ${cppString(input[0])};
            auto start = chrono::high_resolution_clock::now();
            auto output = [&]() {
                if constexpr (requires { solution.${safeMethod}(arg_s); }) {
                    if constexpr (is_void_v<decltype(solution.${safeMethod}(arg_s))>) {
                        solution.${safeMethod}(arg_s);
                        return arg_s;
                    } else {
                        return solution.${safeMethod}(arg_s);
                    }
                } else if constexpr (requires { vector<char> v(arg_s.begin(), arg_s.end()); solution.${safeMethod}(v); }) {
                    vector<char> v(arg_s.begin(), arg_s.end());
                    solution.${safeMethod}(v);
                    return string(v.begin(), v.end());
                } else if constexpr (requires { vector<char> v(arg_s.begin(), arg_s.end()); solution.reverseString(v); }) {
                    vector<char> v(arg_s.begin(), arg_s.end());
                    solution.reverseString(v);
                    return string(v.begin(), v.end());
                } else {
                    return callSolve(solution, arg_s);
                }
            }();
            auto end = chrono::high_resolution_clock::now();
            double ms = chrono::duration<double, milli>(end - start).count();
            cout << R"(__JUDGE_RESULT__:{"output":)" << toJson(output) << R"(,"ms":)" << ms << R"(,"error":null,"stdout":""})" << endl;
        } catch (const exception& e) {
            cout << R"(__JUDGE_RESULT__:{"output":null,"ms":0,"error":)" << jsonString(e.what()) << R"(,"stdout":""})" << endl;
        } catch (...) {
            cout << R"(__JUDGE_RESULT__:{"output":null,"ms":0,"error":"Unknown runtime exception","stdout":""})" << endl;
        }`;
  }

  if (key === "palindrome") {
    return `
        try {
            string arg_s = ${cppString(input[0])};
            auto start = chrono::high_resolution_clock::now();
            auto output = callSolve(solution, arg_s);
            auto end = chrono::high_resolution_clock::now();
            double ms = chrono::duration<double, milli>(end - start).count();
            cout << R"(__JUDGE_RESULT__:{"output":)" << toJson(output) << R"(,"ms":)" << ms << R"(,"error":null,"stdout":""})" << endl;
        } catch (const exception& e) {
            cout << R"(__JUDGE_RESULT__:{"output":null,"ms":0,"error":)" << jsonString(e.what()) << R"(,"stdout":""})" << endl;
        } catch (...) {
            cout << R"(__JUDGE_RESULT__:{"output":null,"ms":0,"error":"Unknown runtime exception","stdout":""})" << endl;
        }`;
  }

  if (key === "add-two-integers") {
    return `
        try {
            int arg_a = ${Number(input[0])};
            int arg_b = ${Number(input[1])};
            auto start = chrono::high_resolution_clock::now();
            auto output = callSolve(solution, arg_a, arg_b);
            auto end = chrono::high_resolution_clock::now();
            double ms = chrono::duration<double, milli>(end - start).count();
            cout << R"(__JUDGE_RESULT__:{"output":)" << toJson(output) << R"(,"ms":)" << ms << R"(,"error":null,"stdout":""})" << endl;
        } catch (const exception& e) {
            cout << R"(__JUDGE_RESULT__:{"output":null,"ms":0,"error":)" << jsonString(e.what()) << R"(,"stdout":""})" << endl;
        } catch (...) {
            cout << R"(__JUDGE_RESULT__:{"output":null,"ms":0,"error":"Unknown runtime exception","stdout":""})" << endl;
        }`;
  }

  throw new Error("Unsupported C++ problem: " + problemId);
}

function makeCppCode(studentCode, problem, tests) {
  const calls = tests
    .map((test) => makeCppCall(problem.id, problem.method, test.input))
    .join("\n");

  const hasSolutionClass = /class\s+Solution\b|struct\s+Solution\b/.test(studentCode);
  const fallbackWrapper = hasSolutionClass ? "" : `
struct Solution {
    template <typename... Args>
    auto ${problem.method}(Args&&... args) {
        return ${problem.method}(std::forward<Args>(args)...);
    }
    template <typename... Args>
    auto sum(Args&&... args) {
        return ::sum(std::forward<Args>(args)...);
    }
    template <typename... Args>
    auto addTwoIntegers(Args&&... args) {
        return ::addTwoIntegers(std::forward<Args>(args)...);
    }
    template <typename... Args>
    auto add(Args&&... args) {
        return ::add(std::forward<Args>(args)...);
    }
    template <typename... Args>
    auto twoSum(Args&&... args) {
        return ::twoSum(std::forward<Args>(args)...);
    }
    template <typename... Args>
    auto isPalindrome(Args&&... args) {
        return ::isPalindrome(std::forward<Args>(args)...);
    }
    template <typename... Args>
    auto reverseString(Args&&... args) {
        return ::reverseString(std::forward<Args>(args)...);
    }
};
`;

  return String.raw`
#include <bits/stdc++.h>
using namespace std;

${studentCode}

${fallbackWrapper}

/* =========================================================
   FLEXIBLE METHOD CALL RESOLUTION
   ========================================================= */

template <typename S, typename... Args>
auto callSolve(S& s, Args&&... args) {
    if constexpr (requires { s.${problem.method}(args...); }) {
        return s.${problem.method}(args...);
    } else if constexpr (requires { s.sum(args...); }) {
        return s.sum(args...);
    } else if constexpr (requires { s.addTwoIntegers(args...); }) {
        return s.addTwoIntegers(args...);
    } else if constexpr (requires { s.add(args...); }) {
        return s.add(args...);
    } else if constexpr (requires { s.twoSum(args...); }) {
        return s.twoSum(args...);
    } else if constexpr (requires { s.two_sum(args...); }) {
        return s.two_sum(args...);
    } else if constexpr (requires { s.isPalindrome(args...); }) {
        return s.isPalindrome(args...);
    } else if constexpr (requires { s.is_palindrome(args...); }) {
        return s.is_palindrome(args...);
    } else if constexpr (requires { s.reverseString(args...); }) {
        return s.reverseString(args...);
    } else if constexpr (requires { s.reverse_string(args...); }) {
        return s.reverse_string(args...);
    } else if constexpr (requires { s.solve(args...); }) {
        return s.solve(args...);
    }
}

/* =========================================================
   GENERIC JSON SERIALIZERS
   ========================================================= */

inline string jsonString(const string& s) {
    string out;
    out += (char)34;
    for (char c : s) {
        if (c == (char)92) {
            out += (char)92;
            out += (char)92;
        } else if (c == (char)34) {
            out += (char)92;
            out += (char)34;
        } else if (c == (char)10) {
            out += (char)92;
            out += 'n';
        } else if (c == (char)13) {
            out += (char)92;
            out += 'r';
        } else if (c == (char)9) {
            out += (char)92;
            out += 't';
        } else {
            out += c;
        }
    }
    out += (char)34;
    return out;
}

inline string toJson(bool val) {
    return val ? "true" : "false";
}

inline string toJson(int val) {
    return to_string(val);
}

inline string toJson(long long val) {
    return to_string(val);
}

inline string toJson(double val) {
    return to_string(val);
}

inline string toJson(const string& val) {
    if (val == "true" || val == "false") return val;
    return jsonString(val);
}

inline string toJson(const char* val) {
    return toJson(string(val));
}

template <typename T>
string toJson(const vector<T>& v) {
    string out = "[";
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) out += ",";
        out += toJson(v[i]);
    }
    out += "]";
    return out;
}

template <typename A, typename B>
string toJson(const pair<A, B>& p) {
    return "[" + toJson(p.first) + "," + toJson(p.second) + "]";
}

template <typename T, size_t N>
string toJson(const array<T, N>& arr) {
    string out = "[";
    for (size_t i = 0; i < N; i++) {
        if (i > 0) out += ",";
        out += toJson(arr[i]);
    }
    out += "]";
    return out;
}

/* =========================================================
   MAIN DRIVER
   ========================================================= */

int main() {
    Solution solution;
${calls}
    return 0;
}
`;
}

/* =========================================================
   BUILD SOURCE DISPATCHER
   ========================================================= */

function buildCode(payload) {
  const language = String(payload.language || "").toLowerCase();

  const problem = {
    id: payload.problemId,
    method: payload.method,
  };

  const tests = Array.isArray(payload.tests) ? payload.tests : [];

  if (language === "javascript" || language === "js" || language === "node") {
    return makeJavaScriptCode(payload.code, problem, tests);
  }

  if (language === "python" || language === "python3") {
    return makePythonCode(payload.code, problem, tests);
  }

  if (language === "java") {
    return makeJavaCode(payload.code, problem, tests);
  }

  if (language === "cpp" || language === "c++") {
    return makeCppCode(payload.code, problem, tests);
  }

  throw new Error("Unsupported language: " + language);
}

/* =========================================================
   WANDBOX EXECUTION
   ========================================================= */

function executeOnWandbox(payload, sourceCode, res) {
  const langKey = String(payload.language || "").toLowerCase();
  const compiler =
    payload.compiler ||
    COMPILER_MAP[langKey] ||
    "cpython-3.12.7";

  const options = (langKey === "cpp" || langKey === "c++") ? "c++2b" : "";

  const wandboxPayload = JSON.stringify({
    compiler: compiler,
    code: sourceCode,
    options: options,
    stdin: "",
  });

  const request = https.request(
    "https://wandbox.org/api/compile.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(wandboxPayload),
      },
      timeout: 30000,
    },
    (wandboxRes) => {
      let raw = "";

      wandboxRes.on("data", (chunk) => {
        raw += chunk;
      });

      wandboxRes.on("end", () => {
        try {
          const data = JSON.parse(raw);

          const compilerError = String(data.compiler_error || "").trim();
          const programError = String(data.program_error || "").trim();
          const programOutput = String(data.program_output || "").trim();
          const runCode = Number(data.status || 0);

          // Real compile error (ignore compiler warnings like -Wliteral-suffix if run succeeded)
          const hasFatalCompileError =
            (/\berror:/i.test(compilerError) && runCode !== 0 && !programOutput) ||
            (!programOutput && !programError && runCode !== 0);

          const response = {
            compile: {
              code: hasFatalCompileError ? 1 : 0,
              stderr: compilerError,
              output: data.compiler_output || "",
            },
            run: {
              code: runCode,
              stdout: data.program_output || "",
              stderr: programError || data.program_message || "",
              output: data.program_message || "",
              signal: data.signal || "",
            },
          };

          // If compilation failed
          if (hasFatalCompileError) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(response));
            return;
          }

          // If runtime error happened and no output produced
          if (runCode !== 0 && !programOutput) {
            const isSyntax = /SyntaxError|IndentationError/i.test(programError);
            if (isSyntax) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({
                compile: { code: 1, stderr: programError, output: programError },
                run: { code: runCode, stdout: "", stderr: programError, output: programError, signal: "" },
              }));
              return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(response));
            return;
          }

          // Parse driver output
          const lines = String(data.program_output || "")
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);

          const results = [];
          const judgeLines = lines.filter((line) => line.startsWith("__JUDGE_RESULT__:"));

          if (judgeLines.length > 0) {
            for (const line of judgeLines) {
              try {
                const jsonStr = line.slice("__JUDGE_RESULT__:".length);
                const parsed = JSON.parse(jsonStr);
                results.push(parsed);
              } catch (err) {
                results.push({
                  output: null,
                  ms: 0,
                  error: "Invalid judge output: " + line,
                  stdout: "",
                });
              }
            }
          } else {
            // Fallback for non-prefixed lines
            for (const line of lines) {
              try {
                const parsed = JSON.parse(line);
                results.push(parsed);
              } catch (err) {
                results.push({
                  output: null,
                  ms: 0,
                  error: "Invalid judge output: " + line,
                  stdout: "",
                });
              }
            }
          }

          response.results = results;

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(response));
        } catch (err) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Invalid response from Wandbox: " + err.message,
            })
          );
        }
      });
    }
  );

  request.on("error", (err) => {
    const isTimeout = /timed? out/i.test(err.message);
    if (isTimeout) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          timedOut: true,
          compile: { code: 0, stderr: "", output: "" },
          run: { code: 124, stdout: "", stderr: "Time Limit Exceeded", output: "Time Limit Exceeded", signal: "SIGKILL" },
          results: []
        })
      );
      return;
    }
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Failed to contact execution engine: " + err.message,
      })
    );
  });

  request.on("timeout", () => {
    request.destroy(new Error("Execution timed out."));
  });

  request.write(wandboxPayload);
  request.end();
}

/* =========================================================
   HTTP SERVER
   ========================================================= */

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        service: "Verdict execution server",
      })
    );
    return;
  }

  // Execute endpoint
  if (req.url === "/api/execute" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const payload = JSON.parse(body);

        if (!payload.language) throw new Error("Missing language");
        if (!payload.code) throw new Error("Missing code");
        if (!payload.problemId) throw new Error("Missing problemId");
        if (!payload.method) throw new Error("Missing method");
        if (!Array.isArray(payload.tests)) throw new Error("Missing tests array");

        const sourceCode = buildCode(payload);

        console.log("--------------------------------");
        console.log("Language:", payload.language);
        console.log("Problem:", payload.problemId);
        console.log("Method:", payload.method);
        console.log("Tests:", payload.tests.length);
        console.log("--------------------------------");

        executeOnWandbox(payload, sourceCode, res);
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Malformed request: " + err.message,
          })
        );
      }
    });

    return;
  }

  // 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

/* =========================================================
   SERVER ERROR HANDLERS
   ========================================================= */

server.on("error", (err) => {
  console.error("Server error:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

/* =========================================================
   START SERVER
   ========================================================= */

server.listen(PORT, () => {
  console.log("========================================");
  console.log(`Execution server running on http://localhost:${PORT}`);
  console.log(`Execute API: http://localhost:${PORT}/api/execute`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log("========================================");
});
