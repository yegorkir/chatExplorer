# AGENTS.md

## Project rules
- This repository is a browser extension for exporting the current ChatGPT chat.
- Primary target: Chrome, Manifest V3.
- Keep cross-browser portability possible when it has low implementation cost.
- All extraction and export must happen locally in the browser.
- Do not add a backend, database, authentication, analytics, telemetry, or hidden network calls.

## Engineering rules
- Prefer TypeScript.
- Keep extraction, normalization, export formatting, and UI separate.
- Prefer pure, deterministic transformation functions.
- Prefer browser-native APIs before adding dependencies.
- Keep permissions and dependencies minimal and justified.

## Scope rules
- Do not implement backlog ideas unless explicitly requested.
- If requirements are ambiguous, choose the smallest reversible solution.
- Keep product details and output rules in `docs/`, not here.

## Docs map
- Read `docs/README.md` first only when you need doc routing.
- Read `docs/mvp-scope.md` only for feature boundaries, supported surfaces, permission scope, and user flow.
- Read `docs/export-format.md` only for saved file shape, attachment policy, packaging, and naming.
- Read `docs/tech-stack.md` only for extension architecture, runtime contexts, build tools, browser target, and dependency direction.
- Read `docs/ui-ux.md` only for popup/page layout, states, labels, and interaction behavior.
- Do not read docs speculatively.

## Change rules
- Make small targeted changes.
- Do not refactor unrelated areas.
- If you add a permission or dependency, explain why it is necessary.
- Do not silently change saved output or user-visible behavior without a clear reason.
- Do not claim checks passed if you did not run them.

## Before finishing
- Run build if configured.
- Run typecheck if configured.
- Run tests if configured.
- State clearly which checks were run and which were unavailable.
