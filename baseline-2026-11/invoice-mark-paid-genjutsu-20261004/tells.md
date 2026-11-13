## Static audit

Roots: detected: src. 6 file(s) examined.

**18 checked, 0 with findings, 0 tells to confront, 0 not applicable.**

Every line below is evidence, not a verdict. A check listed as not applicable did not
run: report it as not checked, never as passed. This covers none of the items that need
a profiler, a device or a pointer.

### Checked, nothing found

- **Blurred background blob** - No element blurred by 40px or more (blur-2xl, blur-3xl, filter: blur), and no positioned element painted with a radial gradient that fades from a colour to transparent. (5 file(s))
- **Middle-dot run** - No displayed line strings two or more middle dots together. (4 file(s))
- **One intent under several button labels** - Every call to action intent found uses a single label. (4 file(s))
- **U+2014 (em dash) in displayed text** - No U+2014 (em dash) in the displayed text, as a character or as an entity. (4 file(s))
- **Three equal cards** - No three-column container holds three children with the same class list. (4 file(s))
- **Part number or section code that points to nothing** - No code like SEC-01, REF-204 or MK.I in the displayed text. (4 file(s))
- **Filler verb** - None of the listed filler verbs appears in the displayed text. (4 file(s))
- **Generic step label** - No text starts with Stage, Step, Phase or Pass followed by a number. (4 file(s))
- **Glassmorphism panel** - No panel blurs what sits behind it, in classes or in CSS. (5 file(s))
- **Glow or neon shadow** - No shadow with zero offset and a blur of 20px or more. (5 file(s))
- **Gradient-filled text** - No text is clipped to a background, in classes or in CSS. (5 file(s))
- **Invented build or release status** - No version stamp, sync time or build number in the displayed text. (4 file(s))
- **Weather, clock or timezone strip** - No clock, temperature or timezone strip in the displayed text. (4 file(s))
- **Numbered eyebrow or tile pagination** - No zero-padded section number and no `01 / 4` counter in the displayed text. (4 file(s))
- **Animation that never stops** - No infinite animation: no infinite iteration, no animate-pulse/ping/bounce/spin, no repeat: Infinity. (5 file(s))
- **Placeholder name or brand** - No John Doe, Jane Doe, Acme or lorem ipsum in the displayed text. (4 file(s))
- **Round or unsourced figure** - No 99.9%, 100%, 10,000+ or 10x style figure in the displayed text. (4 file(s))
- **Scroll cue** - No short text telling the visitor to scroll. (4 file(s))

### Inventory

**durations** - 3 distinct value(s). Durations in use. A designed system has three to five. Fifteen is an accident.

- `150ms` x2 - `src/InvoiceList.tsx:12`, `src/InvoiceList.tsx:14`
- `100ms` x2 - `src/InvoiceList.tsx:78`, `src/index.css:187`
- `700ms` x1 - `src/LedgerFigure.tsx:6`

**easings** - 1 distinct value(s). Easings in use. Same rule: a handful, named, or it is not a system.

- `ease-out` x1 - `src/index.css:187`

**colors** - 13 distinct value(s). Colours written as literal values or palette utilities. No verdict: each one should trace back to a token the design system or the thesis names.

- `#59636e` x6 - `src/index.css:69`, `src/index.css:126`, `src/index.css:130`, `src/index.css:158`, `src/index.css:178`
- `#1f2328` x5 - `src/index.css:9`, `src/index.css:25`, `src/index.css:26`, `src/index.css:35`, `src/index.css:73`
- `#fff` x5 - `src/index.css:27`, `src/index.css:34`, `src/index.css:52`, `src/index.css:102`, `src/index.css:144`
- `#e3e5e8` x3 - `src/index.css:53`, `src/index.css:103`, `src/index.css:145`
- `#1a7f37` x2 - `src/index.css:122`, `src/index.css:239`
- `#eef0f2` x2 - `src/index.css:154`, `src/index.css:223`
- `#1d4ed8` x2 - `src/index.css:195`, `src/index.css:229`
- `#f6f7f9` x1 - `src/index.css:10`
- `#000` x1 - `src/index.css:191`
- `#e7f0fe` x1 - `src/index.css:228`
- `#fdecec` x1 - `src/index.css:233`
- `#b42318` x1 - `src/index.css:234`

**radii** - 3 distinct value(s). Corner radii in use. No verdict: compare the spread with the radius scale the design system declares.

- `8px` x2 - `src/index.css:104`, `src/index.css:146`
- `6px` x1 - `src/index.css:28`
- `999px` x1 - `src/index.css:217`

**fonts** - 2 distinct value(s). Font families named in the code. No verdict: each one should be a family the thesis names, for the reason it gives.

- `system-ui` x1 - `src/index.css:8`
- `ui-monospace` x1 - `src/index.css:173`

