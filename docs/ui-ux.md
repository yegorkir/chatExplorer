# UI / UX

## Read this only if
- you are changing popup/page layout, screen structure, or user-facing states
- you are implementing export options, status, or save interactions
- you need required UI states for MVP

## Do not read this for
- extraction internals
- saved file schema
- build or runtime architecture

## Related docs
- `../AGENTS.md` for repo rules
- `README.md` for doc routing
- `mvp-scope.md` for feature boundaries
- `export-format.md` for saved output rules
- `tech-stack.md` for extension architecture

## Purpose
The extension UI is a quick local export tool.
It must help the user:
1. confirm the current page is exportable
2. choose a small set of export options
3. run export
4. save the result

## UX principles
- Prefer speed and clarity over visual complexity.
- Keep the default path short.
- Show one primary action.
- Make local processing obvious.
- Fail with specific recovery advice.

## Primary surface
Use the extension popup as the MVP UI.
Do not require a separate full page for the main flow.

## Popup structure
### 1. Header
Contains:
- tool name
- one-line local-processing note

Example:
- `Export current chat`
- `Runs locally in your browser.`

### 2. Page status block
Must show one of:
- supported chat page detected
- unsupported page
- extraction in progress
- extraction failed

### 3. Export options
Keep MVP options minimal:
- output format: JSON / Markdown
- include timestamps: on / off when available
- include attachment metadata: on / off

### 4. Export summary
Show:
- detected chat title if available
- expected output type
- packaging note only when relevant

### 5. Actions
Primary:
- `Export current chat`

Secondary when needed:
- `Retry`
- `Reset`

## Required states
### Ready
Current page is supported.
Export action is enabled.

### Unsupported page
Explain that the user must open a ChatGPT chat page.
Do not show fake export controls.

### Busy
Disable repeated export clicks.
Show current stage.

### Success
Confirm what was generated.

### Error
State:
- what failed
- likely cause
- next action

## Interaction rules
- Do not auto-export on popup open.
- Do not hide critical options behind ambiguous icons.
- Do not pretend an attachment was captured if only metadata was available.
- Keep copy literal.

## Copy rules
Prefer:
- `Current chat detected`
- `Open a ChatGPT chat to export`
- `Include attachment metadata`
- `Export current chat`
- `Saving locally`

Avoid:
- `Ingest`
- `Hydrate`
- `Artifact`
- `Sync`

## Accessibility
- Full keyboard access.
- Visible labels for all controls.
- Status text must not rely on color alone.
- Popup must remain usable at small sizes.

## Non-goals for MVP
- multi-chat selection UI
- history browser UI
- analytics dashboard
- visual conversation analysis
