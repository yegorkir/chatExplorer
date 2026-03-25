# MVP Scope

## Read this only if
- the task changes MVP boundaries
- the task adds/removes a user-facing feature
- the task changes the main export flow

## Do not read this for
- JSON schema or file packaging details -> see `export-format.md`
- stack, architecture, or dependency choices -> see `tech-stack.md`

## Related docs
- `export-format.md` for output contract
- `tech-stack.md` for implementation direction

## Goal
Build a static browser app that helps a user extract one ChatGPT conversation from an exported ChatGPT data archive into a smaller, reusable artifact.

## Must have
- Runs fully in the browser.
- Can open a user-provided ChatGPT export archive.
- Can show available conversations/projects in a human-readable way.
- Can let the user select one conversation to export.
- Can export the selected conversation in at least one machine-readable format.
- Can optionally include referenced attachments when available in the export.
- Can save the result locally.

## Out of scope for MVP
- Backend or cloud storage.
- Automatic download from email links.
- Persistent history of already exported chats.
- Cross-device sync.
- Collaboration features.
- Multi-conversation batch export.
- Full-text search across all chats.
- Complex project knowledge merging.

## UX assumptions
- The user manually downloads the ChatGPT export archive.
- The user uploads that archive into the app.
- The app processes data locally.
- The default flow should stay simple: select archive -> select conversation -> choose options -> export.
