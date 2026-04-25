---
name: zhaoyang-excalidraw-explainer
description: 'Create and refine Excalidraw explainer canvases in the "朝阳不吐不快" style: handwritten education boards, knowledge maps, and video-lecture canvases using fontFamily 5, mostly 20px body text, transparent backgrounds, boxes, arrows, evidence blocks, and concise on-canvas explainer copy. Use when Codex needs to design, edit, or summarize the layout/style of .excalidraw files for public-education topics. Pair with zhaoyang-excalidraw-toolkit for MCP, REST, import/export, screenshot, and canvas verification work. Do not use this as a full long-form script-writing skill.'
---

# Zhaoyang Excalidraw Explainer

## Purpose

Use this skill to turn a topic into an Excalidraw explainer canvas that can support a spoken explanation. Optimize for a board that is easy to teach from: clear concepts, clear arrows, visible evidence, and short on-canvas prompts.

This skill is about canvas style and on-canvas explainer structure. Do not produce a complete 口播稿 here; keep text as labels, prompts, claims, formulas, examples, and reminders.

Use `zhaoyang-excalidraw-toolkit` for actual canvas operations, MCP/REST fallback, screenshot checks, import/export, and troubleshooting.

For detailed style observations from source canvases, read `references/style-profile.md`.

## Workflow

1. Start with one main question.
   - Examples: "这东西到底是什么？", "为什么会这样？", "普通人容易误会在哪？"
   - Put the question near the start of the reading path, not as a decorative title only.

2. Split the topic into three node types.
   - Concept: definitions, named terms, categories.
   - Relationship: cause/effect, comparison, flow, constraint, feedback loop.
   - Evidence: screenshot, chart, number, formula, quote fragment, date, case.

3. Build a reading path before drawing.
   - Preferred chain: definition -> mechanism -> example -> misconception -> conclusion.
   - Use arrows for logic, not decoration.
   - Keep each box to one idea. If a box needs a paragraph, split it.

4. Draw in a large free canvas.
   - Use frames for major sections when the board has multiple parts.
   - Keep backgrounds mostly transparent.
   - Let spacing and arrows organize the board instead of polished card UI.

5. Verify the board as an explainer.
   - A viewer should follow the arrows and understand the rough argument without hearing the full narration.
   - Important red text should be rare and immediately meaningful.
   - Text must not be clipped; arrows should not cut through unrelated nodes.

## Visual Defaults

- Font: use Excalidraw `fontFamily: 5`.
- Body text: use `fontSize: 20` for most labels and explanations.
- Local emphasis: use `30-45`.
- Section titles: use `55-100`.
- Huge section markers: use only when the board is very large and needs distant navigation.
- Main color: `#1e1e1e`.
- Red `#e03131`: use only for key conclusions, anti-misconceptions, risk, negation, warnings, and "do not do this" claims.
- Blue `#1971c2`, green `#2f9e44`, orange `#f08c00`: use sparingly for secondary categories, formulas, variables, paths, or annotations.
- Background: default to `transparent`.
- Strokes: use `strokeWidth: 2` for ordinary boxes/arrows; use `4` for important modules or rougher teaching-board emphasis.
- Fill: prefer transparent or hachure. Avoid polished colored cards unless the source material needs a distinct block.

## Box And Arrow Rules

- Use boxes to package concepts, comparisons, process steps, and evidence blocks.
- Use circles/ellipses for emphasis, grouping, or "this is the key" marks.
- Use arrows to show:
  - "leads to"
  - "depends on"
  - "is converted into"
  - "compared with"
  - "therefore"
- Avoid unlabeled arrow tangles. If more than two arrows meet, add a small text label explaining the junction.
- Keep screenshots and charts as evidence blocks near the claim they support.

## On-Canvas Copy Style

Write like teaching notes, not an article.

- Use short clauses and sentence fragments.
- Prefer "不是 X，而是 Y" when correcting a misconception.
- Use phrases such as "核心是", "问题在于", "所以", "普通人容易误会", "这里要分清".
- Put numbers, formulas, dates, and named rules in their own blocks.
- Use red for the decisive sentence, not the setup.
- Keep long narration outside the canvas; the canvas should cue the explanation.

Good canvas text patterns:

```text
不是收益率高就值得买
核心是：你承担了什么风险？
```

```text
定义
机制
例子
反常识
结论
```

```text
M x V = P x Y
先单独放公式，再用箭头拆变量
```

## Excalidraw Tooling

- Use `zhaoyang-excalidraw-toolkit` whenever the task requires live drawing, scene inspection, canvas screenshots, file import/export, or REST fallback.
- If Excalidraw MCP tools are available, prefer batch creation and iterative screenshot checks.
- If MCP tools are not loaded, use the toolkit's REST fallback or work directly with `.excalidraw` JSON.
- When modifying an existing canvas, preserve the user's current elements and add new regions beside or below the existing board unless asked to restructure it.
