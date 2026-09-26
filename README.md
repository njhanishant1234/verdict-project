# Verdict — Online Judge

A full-featured algorithmic online judge web application built with React, Tailwind CSS, Lucide icons, and Vite.

Supports client-side sandboxed execution for JavaScript via Web Workers, and server-side execution for Python, Java, and C++ via the Piston API proxy.

---

## 📁 VS Code Project Structure

This repository is organized to follow standard VS Code workspace conventions:

```text
verdict/
├── .vscode/                   # VS Code configuration
│   ├── settings.json          # Prettier, Tailwind, auto-save settings
│   ├── tasks.json             # VS Code task runner (build, start, dev)
│   ├── launch.json            # Debugging profiles (Chrome, Edge, Node)
│   └── extensions.json        # Recommended extensions for VS Code
├── src/                       # Frontend source files
│   ├── App.jsx                # Main Verdict Online Judge application
│   ├── main.jsx               # React DOM entrypoint
│   └── index.css              # Tailwind directives & theme styles
├── server.cjs                 # Remote compilation proxy (Piston API, port 3001)
├── index.html                 # HTML template with fonts and root container
├── package.json               # NPM scripts and project dependencies
├── vite.config.js             # Vite bundler configuration
├── tailwind.config.js         # Tailwind CSS theme configuration
├── postcss.config.js          # PostCSS configuration
└── .gitignore                 # Standard git ignore definitions
```

---

## 🚀 Getting Started in VS Code

### 1. Open in VS Code
Open VS Code, then:
- Go to **File** → **Open Folder...**
- Select the `verdict` folder (`c:\Users\njhan\Downloads\verdict`)

Or from your terminal:
```bash
code .
```

### 2. Start the Application
Open the integrated terminal in VS Code (`Ctrl + \`` or **Terminal** → **New Terminal**) and run:

```bash
# Starts both Vite (frontend) and the Piston proxy (backend) concurrently:
npm start
```

Or run them individually:
```bash
# Frontend only (http://localhost:5173)
npm run dev

# Remote judge execution proxy only (http://localhost:3001)
npm run server
```

### 3. VS Code Built-in Features

- **VS Code Tasks (`Ctrl + Shift + B`)**:
  Press `Ctrl + Shift + B` to instantly launch the default build task (`npm: start (Full Stack)`).
- **Run & Debug (`F5`)**:
  Open the **Run & Debug** tab in VS Code and choose:
  - *Launch Chrome against localhost*
  - *Launch Edge against localhost*
  - *Debug Server (Piston Proxy)*
- **Recommended Extensions**:
  When prompted by VS Code, click **Install All** to get syntax highlighting for Tailwind CSS, Prettier code formatting on save, and React snippets.

---

## 🧠 Languages & Execution

- **JavaScript**: Sandboxed locally inside a Web Worker. Runs instantly with zero network requests and a 3-second execution timeout.
- **Python / Java / C++**: Code is compiled and run securely via the local Node proxy (`server.cjs`), which connects to the Piston engine.
