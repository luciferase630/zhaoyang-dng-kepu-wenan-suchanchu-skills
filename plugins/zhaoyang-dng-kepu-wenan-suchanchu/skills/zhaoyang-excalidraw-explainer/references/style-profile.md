# Style Profile

This reference abstracts the observed Excalidraw canvas style into reusable rules. Do not bind the style to any specific topic; apply it to any public-education explainer board.

## What The Board Should Feel Like

- It should feel like a thinking board for a video explanation.
- It is allowed to be dense, but the reading path must be visible.
- It should look hand-built and analytical, not like a polished slide deck.
- The board should make the speaker's reasoning visible: terms, arrows, examples, evidence, and conclusions.

## Typography

- Use `fontFamily: 5` everywhere unless preserving existing user elements.
- Use `fontSize: 20` for most text. This is the default unit.
- Use `30-45` for local emphasis, small section headings, formulas, and strong intermediate claims.
- Use `55-100` for major section titles.
- Use very large text only for navigation on huge canvases.

Observed pattern: the source canvases overwhelmingly use 20px body text, with only a few oversized labels per board.

## Color

- Black `#1e1e1e`: default for almost everything.
- Red `#e03131`: conclusion, risk, negation, warning, high-difficulty item, or a claim the viewer must not miss.
- Blue `#1971c2`: optional route, timeline, secondary category, or "can read later" style note.
- Green `#2f9e44`: formulas, accounting sides, variables, or definitional contrast.
- Orange `#f08c00`: small annotation or secondary emphasis.
- Gray `#bbb`: minor separators or low-priority helper lines.

Avoid color decoration. Color must encode meaning.

## Shapes

- Rectangles are concept containers, not decorative cards.
- Ellipses mark emphasis or group attention.
- Lines and arrows carry logic.
- Images/screenshots are evidence, placed next to the claim they support.
- Use transparent backgrounds by default.
- Use white/hachure blocks only when separating a dense concept cluster helps readability.

## Layout

Use a large free canvas. Choose one of these abstract layouts:

- Flow board: left-to-right or top-to-bottom chain for definition -> mechanism -> result.
- Concept map: central concept with branches for categories, constraints, examples, and evidence.
- Evidence board: claim on one side, screenshots/charts/numbers nearby, conclusion below or to the right.
- Comparison board: two or more boxed columns with arrows showing differences and consequences.
- Long lecture board: multiple frames stacked vertically; each frame covers one teaching segment.

The board can be wider or taller than a screen. Frames are navigation devices, not slide-like pages.

## Logic Relationship Patterns

Prefer explicit relationships:

- "A 是什么" -> definition box.
- "A 为什么会变成 B" -> mechanism arrow.
- "很多人以为 X" -> misconception box.
- "但真正关键是 Y" -> red or emphasized correction.
- "看这个数据/公式/截图" -> evidence block.
- "所以结论是 Z" -> final box.

Do not create a beautiful but logic-free diagram. Every visible element should help explanation.

## On-Canvas Copy

On-canvas text is cue text, not full narration.

Use:

- short labels
- half-sentences
- formulas
- contrast pairs
- dates
- named concepts
- strong one-line judgments

Avoid:

- long paragraphs inside one box
- article-style exposition
- over-explaining what the speaker can say aloud
- red text for ordinary facts

## Quality Checklist

- Body text is mostly 20px.
- Font is hand-written style `fontFamily: 5`.
- Boxes contain one idea each.
- Arrows explain causality, flow, comparison, or dependency.
- Red text is rare and important.
- Evidence blocks sit close to the relevant claim.
- Viewer can scan the board without narration and still infer the rough story.
- No clipped text, unreadable overlaps, or arrows through unrelated concepts.
