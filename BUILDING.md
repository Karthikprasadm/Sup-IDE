# Building Sup (Sup-IDE fork)

Beginner-friendly guide: clone → install → build → run → test. No prior experience required.

---

## 1) Prerequisites
**Everyone (all OS)**
- Git
- Node.js **20.18.2** (project expects this exact version; Windows repo bundles a portable copy in `.tools/node-v20.18.2-win-x64`)
- npm (ships with Node)
- pnpm (optional; some CI scripts use it — `npm install -g pnpm`)
- Python **3.x** (needed by node-gyp)
- A C/C++ build toolchain for native modules (node-gyp)

**Windows**
- PowerShell
- Visual Studio Build Tools 2022 (Desktop C++ workload) or full VS 2022
- 7zip in PATH (helpful for packaging; not strictly required to run dev builds)

**macOS**
- Xcode Command Line Tools: `xcode-select --install`

**Linux (Debian/Ubuntu examples)**
- `build-essential python3 pkg-config libx11-dev libxkbfile-dev libsecret-1-dev`

---

## 2) Clone the repo
```bash
git clone https://github.com/Karthikprasadm/Sup-IDE.git
cd Sup-IDE
```

---

## 3) Use the correct Node (20.18.2)
- **Windows (PowerShell, use bundled portable Node):**
  ```powershell
  set PATH=%CD%\.tools\node-v20.18.2-win-x64;%PATH%
  node -v   # should print v20.18.2
  ```
- **macOS/Linux (use nvm/asdf or install Node 20.18.2 manually):**
  ```bash
  node -v   # ensure v20.18.2
  ```
If you see a different version, switch to 20.18.2 before continuing.

---

## 4) Install dependencies (clean)
From the repo root:
```bash
npm ci
```
This installs root deps and triggers installs inside `build/`, `extensions/`, `remote/`, `test/`, etc.

---

## 5) Apply local patches (zod/SDK fixes)
Run after every fresh install or lockfile change:
```bash
npm run apply-patches
```

---

## 6) Build the monorepo
1) Compile sources (core, extensions, out artifacts):
```bash
npm run compile
```
2) Build Sup React UI bundles:
```bash
npm run buildreact
```

---

## 7) Run the desktop app (dev/selfhost)
- **Windows (PowerShell):**
  ```powershell
  .\scripts\code.bat
  ```
- **macOS/Linux:**
  ```bash
  ./scripts/code.sh
  ```
This opens the Sup-IDE (VS Code fork) window. Keep the terminal open.

---

## 8) Live development (optional watch mode)
For automatic rebuilds in another shell:
```bash
npm run watch
```

---

## 9) Run tests
- Browser unit tests:
  ```bash
  npm run test-browser
  ```
- Node unit tests:
  ```bash
  npm run test-node
  ```
- Smoke tests (after building):
  ```bash
  npm run smoketest
  ```

---

## 10) Workspace structure (what’s where)
- `src/` — core editor/workbench (TypeScript/React/Electron)
- `extensions/` — built-in extensions’ source
- `out/` — generated build output (don’t edit; delete to clean)
- `build/` — build tooling (gulp tasks, scripts)
- `scripts/` — helper scripts (`code.bat`/`code.sh` to run selfhost)
- `product.json` — product branding/config (Sup-specific)
- `remote/` — remote server/web pieces
- `test/` — automation, smoke, unit tests

---

## 11) Rebuild after changes
If you changed code:
```bash
npm run compile
npm run buildreact   # if you touched React bundles
```
For faster iteration, keep `npm run watch` running.

---

## 12) Clean the environment
- Remove built output:
  ```bash
  rimraf out      # or: rm -rf out
  ```
- Fully clean and rebuild from scratch:
  ```bash
  rimraf node_modules build/node_modules extensions/**/node_modules
  npm ci
  npm run apply-patches
  npm run compile
  npm run buildreact
  ```

---

## 13) Common errors and fixes
- **`Cannot find module ... zod/v4`** → Re-run `npm run apply-patches`.
- **node-gyp / native build errors**:
  - Windows: install VS Build Tools 2022 (C++ workload) + Python 3.x; restart shell.
  - macOS: run `xcode-select --install`.
  - Linux: install `build-essential` + required dev libs.
  - Ensure **Node 20.18.2** (not newer).
- **Unknown project config warnings (disturl/target/etc.)** → Safe to ignore for dev.
- **Missing `pnpm`** when a script asks → `npm install -g pnpm`.
- **React bundles missing** → `npm run buildreact`.
- **PowerShell chaining** → use `;` instead of `&&`.
- **Codicon/font decode warnings** → cosmetic; ignore.
- **Deprecation warnings (N-API)** → ignore for dev.

---

## 14) Quick start (Windows, PowerShell)
```powershell
git clone https://github.com/Karthikprasadm/Sup-IDE.git
cd Sup-IDE
set PATH=%CD%\.tools\node-v20.18.2-win-x64;%PATH%
npm ci
npm run apply-patches
npm run compile
npm run buildreact
.\scripts\code.bat
```

## 15) Quick start (macOS/Linux, bash/zsh)
```bash
git clone https://github.com/Karthikprasadm/Sup-IDE.git
cd Sup-IDE
# ensure node -v == v20.18.2 (use nvm/asdf if needed)
npm ci
npm run apply-patches
npm run compile
npm run buildreact
./scripts/code.sh
```

---

You’re ready! If something breaks, re-run `npm run apply-patches` and confirm Node is 20.18.2. Ask for help anytime.

