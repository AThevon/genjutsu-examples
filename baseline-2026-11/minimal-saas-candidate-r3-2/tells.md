## Static audit

Roots: detected: src. 4 file(s) examined.

**18 checked, 0 with findings, 0 tells to confront, 0 not applicable.**

Every line below is evidence, not a verdict. A check listed as not applicable did not
run: report it as not checked, never as passed. This covers none of the items that need
a profiler, a device or a pointer.

### Checked, nothing found

- **Blurred background blob** - No element blurred by 40px or more (blur-2xl, blur-3xl, filter: blur), and no positioned element painted with a radial gradient that fades from a colour to transparent. (4 file(s))
- **Middle-dot run** - No displayed line strings two or more middle dots together. (2 file(s))
- **One intent under several button labels** - Every call to action intent found uses a single label. (2 file(s))
- **U+2014 (em dash) in displayed text** - No U+2014 (em dash) in the displayed text, as a character or as an entity. (2 file(s))
- **Three equal cards** - No three-column container holds three children with the same class list. (2 file(s))
- **Part number or section code that points to nothing** - No code like SEC-01, REF-204 or MK.I in the displayed text. (2 file(s))
- **Filler verb** - None of the listed filler verbs appears in the displayed text. (2 file(s))
- **Generic step label** - No text starts with Stage, Step, Phase or Pass followed by a number. (2 file(s))
- **Glassmorphism panel** - No panel blurs what sits behind it, in classes or in CSS. (4 file(s))
- **Glow or neon shadow** - No shadow with zero offset and a blur of 20px or more. (4 file(s))
- **Gradient-filled text** - No text is clipped to a background, in classes or in CSS. (4 file(s))
- **Invented build or release status** - No version stamp, sync time or build number in the displayed text. (2 file(s))
- **Weather, clock or timezone strip** - No clock, temperature or timezone strip in the displayed text. (2 file(s))
- **Numbered eyebrow or tile pagination** - No zero-padded section number and no `01 / 4` counter in the displayed text. (2 file(s))
- **Animation that never stops** - No infinite animation: no infinite iteration, no animate-pulse/ping/bounce/spin, no repeat: Infinity. (4 file(s))
- **Placeholder name or brand** - No John Doe, Jane Doe, Acme or lorem ipsum in the displayed text. (2 file(s))
- **Round or unsourced figure** - No 99.9%, 100%, 10,000+ or 10x style figure in the displayed text. (2 file(s))
- **Scroll cue** - No short text telling the visitor to scroll. (2 file(s))

### Inventory

**durations** - 2 distinct value(s). Durations in use. A designed system has three to five. Fifteen is an accident.

- `60ms` x1 - `src/tokens.css:58`
- `400ms` x1 - `src/tokens.css:59`

**easings** - 2 distinct value(s). Easings in use. Same rule: a handful, named, or it is not a system.

- `ease-out` x4 - `src/index.css:88`, `src/index.css:119`, `src/index.css:275`, `src/tokens.css:60`
- `cubic-bezier(0.2, 0, 0, 1)` x1 - `src/tokens.css:60`

**colors** - 8 distinct value(s). Colours written as literal values or palette utilities. No verdict: each one should trace back to a token the design system or the thesis names.

- `#ffffff` x2 - `src/tokens.css:3`, `src/tokens.css:11`
- `#f5f6f7` x1 - `src/tokens.css:4`
- `#dadde1` x1 - `src/tokens.css:5`
- `#8a9097` x1 - `src/tokens.css:6`
- `#15171a` x1 - `src/tokens.css:7`
- `#2b2f35` x1 - `src/tokens.css:8`
- `#5c636b` x1 - `src/tokens.css:9`
- `#b42318` x1 - `src/tokens.css:10`

**radii** - 1 distinct value(s). Corner radii in use. No verdict: compare the spread with the radius scale the design system declares.

- `var(--radius-sm)` x3 - `src/index.css:56`, `src/index.css:82`, `src/index.css:118`

**fonts** - 2 distinct value(s). Font families named in the code. No verdict: each one should be a family the thesis names, for the reason it gives.

- `var(--font-sans)` x1 - `src/index.css:13`
- `-apple-system` x1 - `src/tokens.css:13`

