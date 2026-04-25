---
name: zhaoyang-excalidraw-toolkit
description: Programmatic Excalidraw canvas toolkit for the Zhaoyang explainer plugin. Use when Codex needs to create, inspect, edit, import, export, screenshot, or quality-check Excalidraw diagrams through the `excalidraw` MCP server or the local canvas REST API. Requires a running Excalidraw canvas server, defaulting to `http://127.0.0.1:3000`.
---

# Zhaoyang Excalidraw Toolkit

## Purpose

Use this skill for actual Excalidraw operations: drawing elements, reading the current scene, fixing layout problems, importing/exporting `.excalidraw` files, exporting PNG/SVG images, and checking rendered canvas quality.

Pair it with `zhaoyang-excalidraw-explainer`:

- `zhaoyang-excalidraw-explainer` decides the teaching-board argument, copy style, colors, and section structure.
- `zhaoyang-excalidraw-toolkit` performs the canvas operations and technical verification.

For the full MCP/REST operation map, read `references/cheatsheet.md`.

## Runtime

The Excalidraw runtime has two parts:

1. Canvas server: web UI, REST API, and sync, defaulting to `http://127.0.0.1:3000`.
2. MCP server: stdio process named `excalidraw`, connected to the canvas through `EXPRESS_SERVER_URL`.

Before drawing on a live canvas:

1. Prefer MCP tools if `excalidraw/*` tools are available.
2. If MCP tools are missing but the canvas server is running, use the REST API documented in `references/cheatsheet.md`.
3. If neither is available, tell the user to start the canvas with `npx zhaoyang-canvas start` or `npm run excalidraw:canvas:start`, then retry.

## MCP Workflow

1. Use `read_diagram_guide` before creating a substantial diagram.
2. Use `describe_scene` before editing an existing canvas.
3. Create elements with `batch_create_elements`; bind arrows using `startElementId` and `endElementId`.
4. Use `set_viewport` with `scrollToContent: true`.
5. Use `get_canvas_screenshot` to verify visual quality.
6. Fix clipping, overlaps, and bad arrow routing before exporting or continuing.

## REST Fallback

Use these scripts from this skill's `scripts/` directory when MCP tools are not available but the canvas server is reachable:

```bash
node scripts/healthcheck.cjs
node scripts/clear-canvas.cjs --force
node scripts/export-elements.cjs --out diagram.elements.json
node scripts/import-elements.cjs --in diagram.elements.json --mode batch
node scripts/create-element.cjs --data '{"type":"rectangle","x":100,"y":100,"width":260,"height":80,"label":{"text":"Concept"}}'
node scripts/update-element.cjs --id <id> --data '{"width":320}'
node scripts/delete-element.cjs --id <id>
```

All scripts accept `--url <canvasUrl>` and otherwise use `EXPRESS_SERVER_URL` or `http://127.0.0.1:3000`.
On Windows, prefer `--file element.json` and `--file updates.json` instead of inline `--data` JSON.

## Quality Rules

- Text must not be clipped.
- Elements must not overlap unless deliberately grouped.
- Arrows should not cut through unrelated nodes.
- Use background zone labels as free-standing text elements, not centered rectangle labels.
- After every meaningful batch of edits, verify with a screenshot or export.
- Export `.excalidraw` JSON plus PNG/SVG when the user asks for reusable output.
