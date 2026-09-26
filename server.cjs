const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 3001;

/* =========================================================
   COMPILER MAP
   ========================================================= */

const COMPILER_MAP = {
  python: "cpython-3.12.7",
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
   PYTHON
   ========================================================= */

function makePythonCode(studentCode, problem, tests) {
  const testData = JSON.stringify(
    tests.map((test) => test.input)
  );

  return `
${studentCode}

import json
import time

_TESTS = json.loads(${JSON.stringify(testData)})

def _run():
    solution = Solution()

    for test in _TESTS:
        try:
            start = time.perf_counter()

            output = solution.${problem.method}(*test)

            elapsed = (time.perf_counter() - start) * 1000

            print(json.dumps({
                "output": output,
                "ms": elapsed,
                "error": None,
                "stdout": ""
            }, separators=(",", ":")))

        except Exception as e:
            print(json.dumps({
                "output": None,
                "ms": 0,
                "error": str(e),
                "stdout": ""
            }, separators=(",", ":")))

_run()
`;
}

/* =========================================================
   JAVA INPUT LITERALS
   ========================================================= */

function javaLiteral(problemId, input) {
  if (problemId === "two-sum") {
    const nums = input[0];
    const target = input[1];

    return {
      args: `new int[]{${nums.join(", ")}}, ${target}`,
      type: "int[]",
    };
  }

  if (problemId === "reverse-string") {
    return {
      args: JSON.stringify(String(input[0])),
      type: "String",
    };
  }

  if (problemId === "palindrome") {
    return {
      args: JSON.stringify(String(input[0])),
      type: "String",
    };
  }
  if (problemId === "add-two-integers") {
    return {
        args: `${input[0]}, ${input[1]}`,
        type: "int"
    };
}

 

  throw new Error(
    "Unsupported Java problem: " + problemId
  );
}

/* =========================================================
   JAVA OUTPUT SERIALIZATION
   ========================================================= */

function javaSerialize(problemId, variable) {
  if (problemId === "two-sum") {
    return `Arrays.toString(${variable})`;
  }

  if (problemId === "reverse-string") {
    return `jsonString(${variable})`;
  }

  if (problemId === "palindrome") {
    return `${variable} ? "true" : "false"`;
  }
  if (problemId === "add-two-integers") {
    return variable;
}


  throw new Error(
    "Unsupported Java problem: " + problemId
  );
}

/* =========================================================
   JAVA DRIVER
   ========================================================= */

function makeJavaCode(studentCode, problem, tests) {

  /*
   * LeetCode-style submission:
   *
   * class Solution {
   *     ...
   * }
   *
   * Never allow public class Solution.
   */

  studentCode = studentCode.replace(
    /public\s+class\s+Solution\b/g,
    "class Solution"
  );

  const calls = tests
    .map((test) => {

      const literal = javaLiteral(
        problem.id,
        test.input
      );

      const serializer = javaSerialize(
        problem.id,
        "output"
      );

      return String.raw`
        try {

            long start = System.nanoTime();

            ${literal.type} output =
                solution.${problem.method}(${literal.args});

            double ms =
                (System.nanoTime() - start) / 1_000_000.0;

            System.out.println(
                "{\"output\":" +
                ${serializer} +
                ",\"ms\":" + ms + ",\"error\":null,\"stdout\":\"\"}"
            );

        } catch (Exception e) {

            System.out.println(
                "{\"output\":null,\"ms\":0,\"error\":" +
                jsonString(
                    e.getMessage() == null
                        ? e.toString()
                        : e.getMessage()
                ) +
                ",\"stdout\":\"\"}"
            );
        }
`;
    })
    .join("\n");

  return String.raw`
import java.util.*;

${studentCode}

class Main {

    /* -----------------------------------------------------
       Convert Java String to JSON string
       ----------------------------------------------------- */

    static String jsonString(String s) {

        if (s == null) {
            return "null";
        }

        StringBuilder out =
            new StringBuilder("\"");

        for (char c : s.toCharArray()) {

            if (c == '\\') {
                out.append("\\\\");
            }

            else if (c == '"') {
                out.append("\\\"");
            }

            else if (c == '\n') {
                out.append("\\n");
            }

            else if (c == '\r') {
                out.append("\\r");
            }

            else if (c == '\t') {
                out.append("\\t");
            }

            else {
                out.append(c);
            }
        }

        out.append("\"");

        return out.toString();
    }

    /* -----------------------------------------------------
       Convert List<String> to JSON array
       ----------------------------------------------------- */

    static String jsonList(List<String> list) {

        StringBuilder sb =
            new StringBuilder("[");

        for (int i = 0; i < list.size(); i++) {

            if (i > 0) {
                sb.append(",");
            }

            sb.append(
                jsonString(list.get(i))
            );
        }

        sb.append("]");

        return sb.toString();
    }

    /* -----------------------------------------------------
       Main driver
       ----------------------------------------------------- */

    public static void main(String[] args) {

        Solution solution =
            new Solution();

${calls}

    }
}
`;
}
/* =========================================================
   C++ INPUT LITERALS
   ========================================================= */

function cppLiteral(problemId, input) {

  if (problemId === "two-sum") {

    const nums = input[0];
    const target = input[1];

    return {
      args: `{${nums.join(", ")}}, ${target}`,
      type: "vector<int>",
    };
  }

  if (
    problemId === "reverse-string" ||
    problemId === "palindrome"
  ) {

    return {
      args: cppString(input[0]),
      type: "string",
    };
  }
  if (problemId === "add-two-integers") {
    return {
        args: `${input[0]}, ${input[1]}`,
        type: "int"
    };
}

 

  throw new Error(
    "Unsupported C++ problem: " + problemId
  );
}

/* =========================================================
   C++ OUTPUT SERIALIZATION
   ========================================================= */

function cppSerialize(problemId) {

  if (problemId === "two-sum") {
    return "jsonVector(output)";
  }

  if (problemId === "reverse-string") {
    return "jsonString(output)";
  }

  if (problemId === "palindrome") {
    return 'output ? "true" : "false"';
  }

  
  throw new Error(
    "Unsupported C++ problem: " + problemId
  );
}

/* =========================================================
   C++ DRIVER
   ========================================================= */

function makeCppCode(studentCode, problem, tests) {

  const calls = tests
    .map((test) => {

      const literal = cppLiteral(
        problem.id,
        test.input
      );

      const serializer = cppSerialize(
        problem.id
      );

      return String.raw`
        try {

            auto start =
                chrono::high_resolution_clock::now();

            ${literal.type} output =
                solution.${problem.method}(${literal.args});

            auto end =
                chrono::high_resolution_clock::now();

            double ms =
                chrono::duration<double, milli>(
                    end - start
                ).count();

            cout
                << "{\"output\":"
                << ${serializer}
                << ",\"ms\":"
                << ms
                << ",\"error\":null,\"stdout\":\"\"}"
                << endl;

        }

        catch (const exception& e) {

            cout
                << "{\"output\":null,\"ms\":0,\"error\":"
                << jsonString(e.what())
                << ",\"stdout\":\"\"}"
                << endl;
        }
`;
    })
    .join("\n");

  return String.raw`
#include <bits/stdc++.h>
using namespace std;

${studentCode}

/* =========================================================
   JSON STRING
   ========================================================= */

string jsonString(const string& s) {

    string out = "\"";

    for (char c : s) {

        if (c == '\\') {
            out += "\\\\";
        }

        else if (c == '"') {
            out += "\\\"";
        }

        else if (c == '\n') {
            out += "\\n";
        }

        else if (c == '\r') {
            out += "\\r";
        }

        else if (c == '\t') {
            out += "\\t";
        }

        else {
            out += c;
        }
    }

    out += "\"";

    return out;
}

/* =========================================================
   JSON VECTOR<int>
   ========================================================= */

string jsonVector(
    const vector<int>& v
) {

    string out = "[";

    for (size_t i = 0; i < v.size(); i++) {

        if (i > 0) {
            out += ",";
        }

        out += to_string(v[i]);
    }

    out += "]";

    return out;
}

/* =========================================================
   JSON VECTOR<string>
   ========================================================= */

string jsonStringVector(
    const vector<string>& v
) {

    string out = "[";

    for (size_t i = 0; i < v.size(); i++) {

        if (i > 0) {
            out += ",";
        }

        out += jsonString(v[i]);
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
   BUILD SOURCE
   ========================================================= */

function buildCode(payload) {

  const language =
    String(payload.language || "").toLowerCase();

  const problem = {
    id: payload.problemId,
    method: payload.method,
  };

  const tests = Array.isArray(payload.tests)
    ? payload.tests
    : [];

  if (language === "python") {

    return makePythonCode(
      payload.code,
      problem,
      tests
    );
  }

  if (language === "java") {

    return makeJavaCode(
      payload.code,
      problem,
      tests
    );
  }

  if (
    language === "cpp" ||
    language === "c++"
  ) {

    return makeCppCode(
      payload.code,
      problem,
      tests
    );
  }

  throw new Error(
    "Unsupported language: " + language
  );
}

/* =========================================================
   WANDBOX EXECUTION
   ========================================================= */

function executeOnWandbox(
  payload,
  sourceCode,
  res
) {

  const compiler =
    payload.compiler ||
    COMPILER_MAP[payload.language] ||
    "cpython-3.12.7";

  const wandboxPayload =
    JSON.stringify({
      compiler: compiler,
      code: sourceCode,
      stdin: "",
    });

  const request =
    https.request(
      "https://wandbox.org/api/compile.json",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "Content-Length":
            Buffer.byteLength(
              wandboxPayload
            ),
        },

        timeout: 30000,
      },

      (wandboxRes) => {

        let raw = "";

        wandboxRes.on(
          "data",
          (chunk) => {
            raw += chunk;
          }
        );

        wandboxRes.on(
          "end",
          () => {

            try {

              const data =
                JSON.parse(raw);

              const compilerError =
                String(
                  data.compiler_error || ""
                ).trim();

              const runCode =
                Number(
                  data.status || 0
                );

              const response = {

                compile: {

                  code:
                    compilerError
                      ? 1
                      : 0,

                  stderr:
                    compilerError,

                  output:
                    data.compiler_output ||
                    "",
                },

                run: {

                  code:
                    runCode,

                  stdout:
                    data.program_output ||
                    "",

                  stderr:
                    data.program_error ||
                    "",

                  output:
                    data.program_message ||
                    "",

                  signal:
                    data.signal ||
                    "",
                },
              };

              /* -----------------------------------------
                 Compilation failed
                 ----------------------------------------- */

              if (compilerError) {

                res.writeHead(
                  200,
                  {
                    "Content-Type":
                      "application/json",
                  }
                );

                res.end(
                  JSON.stringify(
                    response
                  )
                );

                return;
              }

              /* -----------------------------------------
                 Runtime failure
                 ----------------------------------------- */

              if (runCode !== 0) {

                res.writeHead(
                  200,
                  {
                    "Content-Type":
                      "application/json",
                  }
                );

                res.end(
                  JSON.stringify(
                    response
                  )
                );

                return;
              }

              /* -----------------------------------------
                 Convert driver output
                 ----------------------------------------- */

              const lines =
                String(
                  data.program_output ||
                  ""
                )
                  .split(/\r?\n/)
                  .map(
                    (line) =>
                      line.trim()
                  )
                  .filter(Boolean);

              const results = [];

              for (
                const line of lines
              ) {

                try {

                  const parsed =
                    JSON.parse(line);

                  results.push(
                    parsed
                  );

                } catch (err) {

                  results.push({
                    output: null,
                    ms: 0,

                    error:
                      "Invalid judge output: " +
                      line,

                    stdout: "",
                  });
                }
              }

              response.results =
                results;

              res.writeHead(
                200,
                {
                  "Content-Type":
                    "application/json",
                }
              );

              res.end(
                JSON.stringify(
                  response
                )
              );

            } catch (err) {

              res.writeHead(
                502,
                {
                  "Content-Type":
                    "application/json",
                }
              );

              res.end(
                JSON.stringify({
                  error:
                    "Invalid response from Wandbox: " +
                    err.message,
                })
              );
            }
          }
        );
      }
    );

  /* -----------------------------------------------
     Request error
     ----------------------------------------------- */

  request.on(
    "error",
    (err) => {

      res.writeHead(
        502,
        {
          "Content-Type":
            "application/json",
        }
      );

      res.end(
        JSON.stringify({
          error:
            "Failed to contact Wandbox: " +
            err.message,
        })
      );
    }
  );

  /* -----------------------------------------------
     Timeout
     ----------------------------------------------- */

  request.on(
    "timeout",
    () => {

      request.destroy(
        new Error(
          "Wandbox request timed out."
        )
      );
    }
  );

  request.write(
    wandboxPayload
  );

  request.end();
}

/* =========================================================
   HTTP SERVER
   ========================================================= */

const server =
  http.createServer(
    (req, res) => {

      /* -----------------------------------------------
         CORS
         ----------------------------------------------- */

      res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
      );

      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
      );

      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
      );

      /* -----------------------------------------------
         OPTIONS
         ----------------------------------------------- */

      if (
        req.method === "OPTIONS"
      ) {

        res.writeHead(204);

        res.end();

        return;
      }

      /* -----------------------------------------------
         Health check
         ----------------------------------------------- */

      if (
        req.url === "/health" &&
        req.method === "GET"
      ) {

        res.writeHead(
          200,
          {
            "Content-Type":
              "application/json",
          }
        );

        res.end(
          JSON.stringify({
            ok: true,
            service:
              "Verdict execution server",
          })
        );

        return;
      }

      /* -----------------------------------------------
         Execute endpoint
         ----------------------------------------------- */

      if (
        req.url === "/api/execute" &&
        req.method === "POST"
      ) {

        let body = "";

        req.on(
          "data",
          (chunk) => {
            body += chunk;
          }
        );

        req.on(
          "end",
          () => {

            try {

              const payload =
                JSON.parse(body);

              /* -------------------------------
                 Validate request
                 ------------------------------- */

              if (
                !payload.language
              ) {
                throw new Error(
                  "Missing language"
                );
              }

              if (
                !payload.code
              ) {
                throw new Error(
                  "Missing code"
                );
              }

              if (
                !payload.problemId
              ) {
                throw new Error(
                  "Missing problemId"
                );
              }

              if (
                !payload.method
              ) {
                throw new Error(
                  "Missing method"
                );
              }

              if (
                !Array.isArray(
                  payload.tests
                )
              ) {
                throw new Error(
                  "Missing tests array"
                );
              }

              /* -------------------------------
                 Build driver
                 ------------------------------- */

              const sourceCode =
                buildCode(
                  payload
                );

              console.log(
                "--------------------------------"
              );

              console.log(
                "Language:",
                payload.language
              );

              console.log(
                "Problem:",
                payload.problemId
              );

              console.log(
                "Method:",
                payload.method
              );

              console.log(
                "Tests:",
                payload.tests.length
              );

              console.log(
                "--------------------------------"
              );

              /* -------------------------------
                 Send to Wandbox
                 ------------------------------- */

              executeOnWandbox(
                payload,
                sourceCode,
                res
              );

            } catch (err) {

              res.writeHead(
                400,
                {
                  "Content-Type":
                    "application/json",
                }
              );

              res.end(
                JSON.stringify({
                  error:
                    "Malformed request: " +
                    err.message,
                })
              );
            }
          }
        );

        return;
      }

      /* -----------------------------------------------
         404
         ----------------------------------------------- */

      res.writeHead(
        404,
        {
          "Content-Type":
            "application/json",
        }
      );

      res.end(
        JSON.stringify({
          error: "Not found",
        })
      );
    }
  );

/* =========================================================
   SERVER ERRORS
   ========================================================= */

server.on(
  "error",
  (err) => {
    console.error(
      "Server error:",
      err
    );
  }
);

process.on(
  "uncaughtException",
  (err) => {
    console.error(
      "Uncaught exception:",
      err
    );
  }
);

process.on(
  "unhandledRejection",
  (reason) => {
    console.error(
      "Unhandled rejection:",
      reason
    );
  }
);

/* =========================================================
   START SERVER
   ========================================================= */

server.listen(
  PORT,
  () => {

    console.log(
      "========================================"
    );

    console.log(
      `Execution server running on http://localhost:${PORT}`
    );

    console.log(
      `Execute API: http://localhost:${PORT}/api/execute`
    );

    console.log(
      `Health: http://localhost:${PORT}/health`
    );

    console.log(
      "========================================"
    );
  }
);