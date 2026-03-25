# UI / UX

Read this only if:
- you are changing page layout, screen structure, interaction flow, or user-facing states
- you are implementing upload, selection, export, preview, or progress UX
- you need to know which UI states are required for MVP

Do not read this for:
- archive parsing internals
- output file structure details
- stack or tooling decisions

Related docs:
- `../AGENTS.md` - repo rules and change discipline
- `README.md` - doc routing
- `mvp-scope.md` - MVP boundaries and non-goals
- `export-format.md` - export artifact rules
- `tech-stack.md` - implementation constraints

## Purpose
The page is a local-first utility, not a content site.
The UI must help the user:
1. load a ChatGPT export
2. inspect available conversations
3. choose one conversation to export
4. configure a small set of export options
5. save the result

The UI must make local processing obvious.

## UX principles
- Prioritize clarity over visual flair.
- Keep the default path short.
- Show one primary action per step.
- Avoid hidden state and ambiguous wording.
- Make heavy work visible with progress and status.
- Fail with specific recovery advice.

## Primary flow
1. User opens the page.
2. User sees a short explanation that processing happens locally.
3. User selects or drops a ChatGPT export archive.
4. App validates the file and starts parsing.
5. App shows progress while reading and indexing.
6. App shows a conversation list.
7. User selects one conversation.
8. User adjusts export options.
9. App shows a compact summary of the export result.
10. User clicks save.
11. App downloads the output artifact.

## Page structure
Use a single-page layout with clear sections.

### 1. Header
Contains:
- page title
- one-line description
- explicit local-processing notice

Example content:
- Title: `ChatGPT Export Extractor`
- Note: `All processing happens in your browser.`

### 2. Input section
Contains:
- file picker button
- drag-and-drop area
- short accepted-file hint
- current file name after selection

Behavior:
- empty state before file selection
- disabled state while parsing
- replace-file action after parsing completes or fails

### 3. Progress / status section
Visible only when needed.
Contains:
- current stage label
- optional progress bar
- short detail text

Possible stages:
- validating archive
- reading archive
- indexing conversations
- preparing export
- packaging files

### 4. Conversation list section
Shown after successful parsing.
Contains:
- searchable list of conversations
- lightweight metadata per item only if available and useful
- clear selected state

Recommended item fields:
- title
- short secondary info such as message count or date range if cheap to compute

Do not overload this list with dense metadata.

### 5. Export options section
Shown only after a conversation is selected.
Keep options minimal for MVP.

Initial options:
- include timestamps: on / off
- include attachments: on / off
- output format: json

Do not expose speculative or future options in MVP.

### 6. Export summary section
Shown before save.
Contains:
- selected conversation title
- chosen options
- expected output type
- warning if attachments may trigger packaging

### 7. Save section
Contains one primary button:
- `Save export`

Optional secondary action:
- `Reset`

## Required UI states

### Empty state
Shown on first load.
Must answer:
- what this tool does
- what file the user should provide
- that processing is local

### Parsing state
Shown after file selection.
Must prevent conflicting actions.
Must display status.

### Parsed state
Shown after successful indexing.
Must allow conversation selection and export setup.

### Exporting state
Shown while generating output.
Must disable repeated save clicks.

### Success state
Shown after save is prepared or download starts.
Must confirm what was generated.

### Error state
Must include:
- what failed
- likely cause
- next user action

Examples:
- unsupported archive structure
- missing expected conversation data
- malformed JSON
- attachment extraction failure

## Interaction rules
- Do not auto-export after parsing.
- Do not auto-select a conversation unless there is exactly one obvious candidate.
- Do not hide option changes behind icons only.
- Do not place critical actions below long scrolling content when avoidable.
- Confirm destructive reset only if it would discard meaningful in-page work.

## Copy rules
Use short, literal labels.
Avoid internal jargon.

Prefer:
- `Select export file`
- `Processing locally`
- `Choose a conversation`
- `Include attachments`
- `Save export`

Avoid:
- `Ingest`
- `Materialize`
- `Bundle artifact`
- `Hydrate`

## Accessibility
- Full keyboard navigation is required.
- All controls must have visible labels.
- Status changes must be readable by screen readers where practical.
- Contrast must be sufficient without relying on color alone.
- Drag-and-drop must not be the only upload path.

## Responsive behavior
Desktop is the main target.
Mobile should remain usable but can be simplified.

Minimum responsive rules:
- stack sections vertically on narrow screens
- keep primary actions visible without precision tapping
- do not depend on hover-only interactions

## Non-goals for MVP
- multi-conversation batch export flow
- persistent history of processed exports
- account system
- collaboration features
- rich visual analytics over conversations
- advanced filtering UI

## Done means
UI/UX work is done when:
- the page supports the primary flow without explanation from a developer
- required states are implemented
- errors are actionable
- local processing is clearly communicated
- the save path is obvious and reliable
