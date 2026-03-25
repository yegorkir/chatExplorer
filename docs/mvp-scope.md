# MVP Scope

## Read this only if
- the task changes MVP boundaries
- the task adds or removes a user-facing feature
- the task changes supported browsers, extension surfaces, or permission scope
- the task changes the main export flow

## Do not read this for
- saved file structure or packaging -> see `export-format.md`
- architecture, runtime contexts, or tooling -> see `tech-stack.md`
- popup layout or screen states -> see `ui-ux.md`

## Related docs
- `export-format.md` for output rules
- `tech-stack.md` for implementation direction
- `ui-ux.md` for the visible flow

## Goal
Build a browser extension that exports the current open ChatGPT chat into a smaller reusable artifact.

## Must have
- Runs locally in the browser.
- Works on the current open chat page on ChatGPT.
- Lets the user export the current chat without leaving the page context.
- Supports at least one machine-readable output format.
- Can optionally produce a human-readable format.
- Saves the result locally.
- Requires minimal permissions.

## Chrome-first, portable by design
- Chrome is the primary target.
- Cross-browser compatibility is a design preference, not an MVP requirement.
- Avoid Chrome-only APIs when a standard WebExtensions path is good enough.

## In scope for MVP
- Export from the current visible chat.
- Trigger export from the extension UI.
- Extract message text, roles, and available metadata needed for reuse.
- Include attachment metadata when visible and accessible.
- Package output locally when useful.

## Out of scope for MVP
- Full account export.
- Crawling sidebar history.
- Exporting multiple chats in one run.
- Background sync.
- Cloud storage.
- Login, auth, or remote storage.
- Persistence of export history.
- Importing official account export archives.
- Reliance on private internal APIs when a rendered-page path works.

## Main flow
- User opens a chat on ChatGPT.
- User opens the extension UI.
- Extension detects whether the current page is exportable.
- User chooses export options.
- Extension extracts and normalizes the current chat.
- User saves the result locally.
