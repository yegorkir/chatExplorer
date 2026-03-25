# Tech Stack

## Read this only if
- the task changes build tooling or dependencies
- the task changes runtime contexts or extension surfaces
- the task changes browser target, permissions implementation, or cross-browser strategy

## Do not read this for
- MVP feature scope -> see `mvp-scope.md`
- saved file shape -> see `export-format.md`
- popup layout or labels -> see `ui-ux.md`

## Related docs
- `mvp-scope.md` for product limits
- `export-format.md` for output contract
- `ui-ux.md` for UI constraints

## Chosen stack
- Platform: Browser extension
- Primary target: Chrome, Manifest V3
- Portability goal: WebExtensions-friendly structure
- Build tool: WXT
- UI: React + TypeScript
- Styling: CSS Modules or plain CSS
- Runtime contexts:
  - popup UI for user actions
  - content script for page extraction
  - background/service worker only for coordination when needed
- Browser API access: `browser`/WebExtensions-compatible style
- Save/export: downloads API or Blob-based save path, whichever is simpler and reliable
- Testing: Vitest for pure logic; lightweight UI tests only where useful

## Why this stack
- Matches the extension runtime directly.
- Keeps Chrome as the fast path.
- Leaves room for later Firefox/Edge support.
- Separates page extraction from UI.
- Avoids backend complexity.

## Architecture direction
Split the extension into four parts:
1. popup UI
2. content extraction layer
3. normalize/export core
4. background coordination only if required

The normalize/export core must not depend on DOM APIs.
The popup must not parse the page directly.

## Permission direction
Prefer the smallest workable permission set.
Start with only what is needed for:
- ChatGPT host access
- current-tab/page interaction
- local file save

Do not add broad permissions without a concrete feature need.

## Explicit non-goals
Do not add for MVP:
- backend services
- analytics
- account sync
- IndexedDB/localStorage export history as a core feature
- Chrome-only UI surfaces when a portable surface works
- scraping through private internal APIs unless explicitly required
