## Static audit

Roots: detected: src. 7 file(s) examined.

**18 checked, 0 with findings, 0 tells to confront, 0 not applicable.**

Every line below is evidence, not a verdict. A check listed as not applicable did not
run: report it as not checked, never as passed. This covers none of the items that need
a profiler, a device or a pointer.

### Checked, nothing found

- **Blurred background blob** - No element blurred by 40px or more (blur-2xl, blur-3xl, filter: blur), and no positioned element painted with a radial gradient that fades from a colour to transparent. (6 file(s))
- **Middle-dot run** - No displayed line strings two or more middle dots together. (4 file(s))
- **One intent under several button labels** - Every call to action intent found uses a single label. (4 file(s))
- **U+2014 (em dash) in displayed text** - No U+2014 (em dash) in the displayed text, as a character or as an entity. (4 file(s))
- **Three equal cards** - No three-column container holds three children with the same class list. (4 file(s))
- **Part number or section code that points to nothing** - No code like SEC-01, REF-204 or MK.I in the displayed text. (4 file(s))
- **Filler verb** - None of the listed filler verbs appears in the displayed text. (4 file(s))
- **Generic step label** - No text starts with Stage, Step, Phase or Pass followed by a number. (4 file(s))
- **Glassmorphism panel** - No panel blurs what sits behind it, in classes or in CSS. (6 file(s))
- **Glow or neon shadow** - No shadow with zero offset and a blur of 20px or more. (6 file(s))
- **Gradient-filled text** - No text is clipped to a background, in classes or in CSS. (6 file(s))
- **Invented build or release status** - No version stamp, sync time or build number in the displayed text. (4 file(s))
- **Weather, clock or timezone strip** - No clock, temperature or timezone strip in the displayed text. (4 file(s))
- **Numbered eyebrow or tile pagination** - No zero-padded section number and no `01 / 4` counter in the displayed text. (4 file(s))
- **Animation that never stops** - No infinite animation: no infinite iteration, no animate-pulse/ping/bounce/spin, no repeat: Infinity. (6 file(s))
- **Placeholder name or brand** - No John Doe, Jane Doe, Acme or lorem ipsum in the displayed text. (4 file(s))
- **Round or unsourced figure** - No 99.9%, 100%, 10,000+ or 10x style figure in the displayed text. (4 file(s))
- **Scroll cue** - No short text telling the visitor to scroll. (4 file(s))

### Inventory

**durations** - 0 distinct value(s). Durations in use. A designed system has three to five. Fifteen is an accident.

**easings** - 3 distinct value(s). Easings in use. Same rule: a handful, named, or it is not a system.

- `ease-out` x7 - `src/index.css:131`, `src/index.css:165`, `src/index.css:166`, `src/index.css:167`, `src/index.css:245`
- `cubic-bezier(0.2, 0, 0, 1)` x1 - `src/tokens.css:62`
- `cubic-bezier(0.05, 0.7, 0.1, 1)` x1 - `src/tokens.css:63`

**colors** - 8 distinct value(s). Colours written as literal values or palette utilities. No verdict: each one should trace back to a token the design system or the thesis names.

- `#0e1315` x1 - `src/tokens.css:6`
- `#151c1f` x1 - `src/tokens.css:7`
- `#2a3438` x1 - `src/tokens.css:8`
- `#e8ecea` x1 - `src/tokens.css:9`
- `#93a0a4` x1 - `src/tokens.css:10`
- `#6f8f96` x1 - `src/tokens.css:11`
- `#f0b43c` x1 - `src/tokens.css:12`
- `#ffffff` x1 - `src/tokens.css:13`

**radii** - 2 distinct value(s). Corner radii in use. No verdict: compare the spread with the radius scale the design system declares.

- `var(--radius-sm)` x4 - `src/index.css:129`, `src/index.css:162`, `src/index.css:236`, `src/index.css:589`
- `var(--radius-full)` x3 - `src/index.css:380`, `src/index.css:421`, `src/index.css:435`

**fonts** - 1 distinct value(s). Font families named in the code. No verdict: each one should be a family the thesis names, for the reason it gives.

- `var(--font)` x1 - `src/index.css:18`

