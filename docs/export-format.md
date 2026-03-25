# Export Format

## Read this only if
- the task changes exported files
- the task changes JSON shape
- the task changes attachment handling, packaging, or filenames

## Do not read this for
- MVP feature boundaries or UX scope -> see `mvp-scope.md`
- stack, rendering, worker, or dependency choices -> see `tech-stack.md`

## Related docs
- `mvp-scope.md` for what MVP must support
- `tech-stack.md` for implementation direction

## Purpose
Define the output produced by the app when exporting one selected conversation.

## Default artifact
The default export artifact is one JSON file representing one selected conversation.

## JSON requirements
The JSON should be:
- readable by a developer
- stable enough for reuse in later tooling
- limited to data needed for a single-conversation export

## Recommended top-level shape
```json
{
  "version": 1,
  "source": "chatgpt-export",
  "conversation": {
    "id": "...",
    "title": "...",
    "messages": []
  },
  "attachments": []
}
```

## Message shape
Each message should include only fields needed for reuse:
- stable local message id if available
- author role
- textual content
- attachment references linked to that message if present
- optional timestamps only when the user includes metadata

Do not preserve raw source blobs unless a task explicitly requires them.

## Attachment handling
- Attachments are optional.
- If excluded, the JSON should still remain valid.
- If included, attachment references in JSON should match exported files.
- Keep attachment filenames deterministic where possible.

## Packaging rules
Use a plain `.json` file when the export contains only conversation data or a small number of extra files.

Use a `.zip` package when:
- the export includes multiple attachment files, and
- packaging improves usability over loose files.

Zip packaging is a convenience format, not a product guarantee about ChatGPT re-upload compatibility.

## Naming
Recommended output naming:
- `conversation.json`
- `conversation-with-assets.zip`
