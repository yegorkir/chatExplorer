# Tech Stack

## Read this only if
- the task changes tooling or dependencies
- the task changes rendering or runtime model
- the task changes architecture boundaries or worker usage

## Do not read this for
- MVP feature scope or UX boundaries -> see `mvp-scope.md`
- exported file shape or packaging rules -> see `export-format.md`

## Related docs
- `mvp-scope.md` for product boundaries
- `export-format.md` for output contract

## Chosen stack
- Frontend: React + TypeScript
- Build tool: Vite
- Deploy target: GitHub Pages
- Rendering: client-side only
- Styling: CSS Modules or plain CSS
- Heavy processing: Web Worker
- Archive handling: `zip.js`
- Save/export: `Blob` + object URL + download
- Testing: Vitest + Testing Library

## Why this stack
- Fits static hosting.
- Keeps all processing in the browser.
- Separates UI from heavy file processing.
- Avoids backend complexity.
- Keeps the MVP small and reversible.

## Architecture direction
Split the app into three layers:
1. UI
2. parse/normalize/export logic
3. worker-based heavy file processing

The UI should not contain archive parsing logic.

## Explicit non-goals
Do not add for MVP:
- Next.js
- Astro
- SSR/SSG features
- Redux/Zustand unless state complexity proves it necessary
- mandatory local persistence
- server APIs
