# Welcome to Sup.

<div align="center">
	<img
		src="./src/vs/workbench/browser/parts/editor/media/slice_of_void.png"
	 	alt="Sup Welcome"
		width="300"
	 	height="300"
	/>
</div>

Sup is the open-source Cursor alternative.

Use AI agents on your codebase, checkpoint and visualize changes, and bring any model or host locally. Sup sends messages directly to providers without retaining your data.

This repo contains the full source code for Sup. If you're new, welcome!

## What Sup is
- AI-first IDE (VS Code fork) with local/remote model support.
- Agents, change checkpoints/visualization, model bring-your-own, privacy-first (no retention).

## Quick start (see `BUILDING.md` for full beginner guide)
**Windows (PowerShell):**
```powershell
set PATH=%CD%\.tools\node-v20.18.2-win-x64;%PATH%
npm ci
npm run apply-patches
npm run compile
npm run buildreact
.\scripts\code.bat
```

**macOS/Linux (bash/zsh):**
```bash
# ensure node -v == v20.18.2 (use nvm/asdf if needed)
npm ci
npm run apply-patches
npm run compile
npm run buildreact
./scripts/code.sh
```

If anything breaks, re-run `npm run apply-patches` and confirm Node is 20.18.2. Full details (prereqs, troubleshooting, tests) are in `BUILDING.md`.

- 🧭 [Website](https://voideditor.com)

- 👋 [Discord](https://discord.gg/RSNjgaugJs)

- 🚙 [Project Board](https://github.com/orgs/voideditor/projects/2)

## Build & Run (summary)
- Prereqs: Node **20.18.2**, npm, git, Python 3.x + C/C++ build tools (node-gyp), VS Build Tools on Windows, Xcode CLT on macOS, build-essential on Linux.
- Install deps: `npm ci`
- Apply local patches: `npm run apply-patches`
- Build: `npm run compile` + `npm run buildreact`
- Run desktop (selfhost): `.\scripts\code.bat` (Windows) or `./scripts/code.sh` (macOS/Linux)
For step-by-step screenshots and fixes, read `BUILDING.md`.

## Tests
- Browser unit tests: `npm run test-browser`
- Node unit tests: `npm run test-node`
- Smoke tests: `npm run smoketest`

## Workspace at a glance
- `src/` — core editor/workbench
- `extensions/` — built-in extensions
- `out/` — build output (generated)
- `build/` — build tooling (gulp, scripts)
- `scripts/` — helpers (`code.bat`/`code.sh` to run selfhost)
- `product.json` — Sup branding/config
- `remote/` — remote server/web pieces
- `test/` — automation, smoke, unit tests

## More docs
- Full build/troubleshooting: `BUILDING.md`
- Codebase map: `VOID_CODEBASE_GUIDE.md`

## Contributing

1. To get started working on Sup, check out our Project Board! You can also see [HOW_TO_CONTRIBUTE](https://github.com/voideditor/void/blob/main/HOW_TO_CONTRIBUTE.md).

2. Feel free to attend a casual weekly meeting in our Discord channel!


## Reference

Sup is a fork of the [vscode](https://github.com/microsoft/vscode) repository. For a guide to the codebase, see `VOID_CODEBASE_GUIDE.md`.

## Note
Work is temporarily paused on the Sup IDE (this repo) while we experiment with a few novel AI coding ideas for Sup. Stay alerted with new releases in our Discord channel.

## Support
You can always reach us in our Discord server or contact us via email: hello@voideditor.com.
