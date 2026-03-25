# AGENTS.md

## Project rules
- This project is a static web app deployed to GitHub Pages.
- It must run entirely in the user's browser.
- Do not add a backend, database, authentication, analytics, telemetry, or hidden network calls.
- Prefer local-first, privacy-preserving solutions.

## Engineering rules
- Prefer TypeScript.
- Keep parsing/export logic separate from UI code.
- Prefer pure, deterministic transformation functions.
- Prefer browser-native APIs before adding dependencies.
- Keep dependencies minimal and justified.

## Scope rules
- Do not implement backlog ideas unless explicitly requested.
- If requirements are ambiguous, choose the smallest reversible solution.
- Keep product details and format decisions in `docs/`, not here.

## Docs map
- Read `docs/mvp-scope.md` only for MVP boundaries, user flow, and feature inclusion/exclusion.
- Read `docs/export-format.md` only for exported artifact shape, attachment rules, packaging, and naming.
- Read `docs/tech-stack.md` only for stack choice, architecture boundaries, runtime model, and dependency direction.
- Do not read docs speculatively. Open only the file that matches the task.

## Change rules
- Make small targeted changes.
- Do not refactor unrelated code.
- If you add a dependency, explain why it is necessary.
- Do not silently change output formats or user-visible behavior without a clear reason.

## Before finishing
- Run build if configured.
- Run typecheck if configured.
- Run tests if configured.
- State clearly which checks were run and which were unavailable.


## Docs map
- `docs/README.md` - routing for docs
- `docs/ui-ux.md` - read only for layout, user flow, screen states, and required user-facing interactions
