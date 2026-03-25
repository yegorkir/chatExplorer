# Export Format

## Read this only if
- the task changes saved files
- the task changes JSON or Markdown shape
- the task changes attachment handling, packaging, or filenames

## Do not read this for
- feature boundaries or browser support -> see `mvp-scope.md`
- extension architecture or build/runtime choices -> see `tech-stack.md`
- popup states or interaction copy -> see `ui-ux.md`

## Related docs
- `mvp-scope.md` for what MVP exports
- `tech-stack.md` for how export is produced
- `ui-ux.md` for when export options are shown

## Purpose
Define the local artifact produced when exporting the current open chat.

## Default artifacts
- `chat.json`
- optional `chat.md`
- optional `.zip` only when extra files make loose output awkward

## JSON requirements
The JSON should be:
- human-inspectable
- stable enough for reuse in later tooling
- limited to one current-chat export

## Recommended top-level shape
```json
{
  "version": 1,
  "source": "chatgpt-page",
  "conversation": {
    "id": "...",
    "title": "...",
    "url": "...",
    "messages": []
  },
  "attachments": []
}
```

## Message shape
Each message should include only reusable fields:
- local message id if derivable
- author role
- text content
- attachment references linked to that message if present
- optional timestamps only when the source exposes them reliably

Do not preserve raw DOM dumps or page HTML unless explicitly required.

## Attachment policy
- Attachments are optional.
- If binary content is not directly accessible, export metadata instead of pretending the file was captured.
- JSON references must match exported files when files are included.
- Keep filenames deterministic where possible.

## Packaging rules
Use plain files when the export contains only text output or a small number of extra files.

Use `.zip` only when:
- multiple files are being saved, and
- packaging improves usability.

Packaging is a convenience format, not a guarantee about later ChatGPT re-upload behavior.

## Naming
Recommended names:
- `chat.json`
- `chat.md`
- `chat-with-assets.zip`
