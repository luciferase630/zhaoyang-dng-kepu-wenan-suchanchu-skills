---
name: zhaoyang-explainer-scriptwriter
description: 'Write, rewrite, and structure complete Chinese public-education explainer video scripts in the "朝阳不吐不快" style. Use when Codex needs to draft a full script from a topic, outline, Excalidraw canvas, research notes, or existing .docx/.md script; preserve conclusion-first framing, misconception correction, lecture-like pacing, definitions, mechanisms, examples, evidence, risk boundaries, and Markdown-first output. Pair with zhaoyang-excalidraw-explainer for canvas work; this skill does not draw Excalidraw canvases.'
---

# Zhaoyang Explainer Scriptwriter

## Purpose

Use this skill to produce complete Chinese explainer-video scripts that sound like a dense, direct, lecture-style science popularization account. Optimize for clarity, argument flow, and speakability.

Default to Markdown output. Do not create a `.docx` unless the user asks for Word export. For detailed style rules, read `references/script-style-profile.md`. For source-corpus boundaries, read `references/corpus-notes.md`.

## Core Workflow

1. Identify the viewer's likely misunderstanding.
   - Ask: "普通人最容易误会什么？"
   - Turn the misunderstanding into the opening tension.

2. Put the conclusion near the start.
   - Say the useful judgment first.
   - Then explain why the judgment is not obvious.
   - If the topic involves money, policy, risk, or investment, include a clear non-advice boundary.

3. Build the script in this order:
   - Problem
   - Conclusion
   - Definition
   - Mechanism
   - Example, history, data, or formula
   - Misconception correction
   - Risk boundary
   - Final takeaway

4. Write as spoken explanation.
   - Use short paragraphs.
   - Prefer direct transitions: "问题在于", "真正核心是", "所以", "这里要分清".
   - Use contrast structures: "不是 X，而是 Y".
   - Split hard concepts before judging them.
   - Keep factual claims checkable and avoid fake certainty.

5. Add canvas hooks when useful.
   - Include brief `[画布提示]` notes for concepts, arrows, formulas, or evidence blocks.
   - Keep canvas hooks short; full drawing decisions belong to `zhaoyang-excalidraw-explainer`.

## Default Markdown Shape

Use this structure unless the user provides a different format:

```markdown
# 标题

## 开场结论
...

## 正文
### 1. 先把问题说清楚
...

### 2. 定义：这东西到底是什么
...

### 3. 机制：为什么会这样
...

### 4. 误区：普通人容易想错在哪
...

### 5. 风险边界：哪些情况不能乱推
...

## 结尾
...

## 画布提示
- ...
```

## Voice Rules

- Be direct, not polite fluff.
- Be skeptical of easy stories.
- Use "我先把结论放在前面" style framing when the answer matters.
- Use judgment, but explain the chain of reasoning immediately after the judgment.
- Do not use motivational slogans, sales language, or exaggerated emotional hooks.
- Do not write like an encyclopedia entry; define terms only when they help the argument move.
- Do not bury the core claim after a long background section.

## Revision Rules

When rewriting an existing script:

- Preserve the user's core viewpoint unless it is factually unsafe.
- Strengthen the opening conclusion and section transitions.
- Cut repeated setup, empty throat-clearing, and vague claims.
- Move long definitions after the viewer knows why they matter.
- Turn dense paragraphs into spoken beats.
- Add risk boundaries where the script could be mistaken for investment, legal, or policy advice.

## Coordination With Excalidraw

- If the user gives an Excalidraw file, extract the argument path before writing.
- If the user gives only a topic, write the script first and include short canvas hooks at the end.
- If both this skill and `zhaoyang-excalidraw-explainer` apply, use this skill for the full narration and the Excalidraw skill for the visual knowledge map.
