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

**durations** - 10 distinct value(s). Durations in use. A designed system has three to five. Fifteen is an accident.

- `700ms` x1 - `src/AnimatedAmount.tsx:36`
- `300ms` x1 - `src/App.tsx:96`
- `120ms` x1 - `src/InvoiceList.tsx:117`
- `100ms` x1 - `src/InvoiceList.tsx:118`
- `320ms` x1 - `src/InvoiceList.tsx:141`
- `200ms` x1 - `src/InvoiceList.tsx:186`
- `1600ms` x1 - `src/index.css:235`
- `1400ms` x1 - `src/index.css:285`
- `150ms` x1 - `src/index.css:285`
- `1200ms` x1 - `src/index.css:306`

**easings** - 2 distinct value(s). Easings in use. Same rule: a handful, named, or it is not a system.

- `cubic-bezier(0.16, 1, 0.3, 1)` x2 - `src/index.css:235`, `src/index.css:240`
- `ease-out` x2 - `src/index.css:241`, `src/index.css:285`

**colors** - 15 distinct value(s). Colours written as literal values or palette utilities. No verdict: each one should trace back to a token the design system or the thesis names.

- `#1f2328` x6 - `src/index.css:9`, `src/index.css:25`, `src/index.css:26`, `src/index.css:35`, `src/index.css:73`
- `#fff` x5 - `src/index.css:27`, `src/index.css:34`, `src/index.css:52`, `src/index.css:102`, `src/index.css:123`
- `#59636e` x5 - `src/index.css:69`, `src/index.css:109`, `src/index.css:137`, `src/index.css:157`, `src/index.css:175`
- `#1a7f37` x4 - `src/index.css:190`, `src/index.css:230`, `src/index.css:256`, `src/index.css:276`
- `rgba(26, 127, 55, 0)` x4 - `src/index.css:290`, `src/index.css:291`, `src/index.css:298`, `src/index.css:299`
- `#e3e5e8` x3 - `src/index.css:53`, `src/index.css:103`, `src/index.css:124`
- `#eef0f2` x2 - `src/index.css:133`, `src/index.css:174`
- `#1d4ed8` x2 - `src/index.css:180`, `src/index.css:205`
- `#e6f4ea` x2 - `src/index.css:189`, `src/index.css:246`
- `#f6f7f9` x1 - `src/index.css:10`
- `#e7f0fe` x1 - `src/index.css:179`
- `#fdecec` x1 - `src/index.css:184`

**radii** - 4 distinct value(s). Corner radii in use. No verdict: compare the spread with the radius scale the design system declares.

- `8px` x2 - `src/index.css:104`, `src/index.css:125`
- `6px` x1 - `src/index.css:28`
- `999px` x1 - `src/index.css:168`
- `inherit` x1 - `src/index.css:283`

**fonts** - 2 distinct value(s). Font families named in the code. No verdict: each one should be a family the thesis names, for the reason it gives.

- `system-ui` x1 - `src/index.css:8`
- `ui-monospace` x1 - `src/index.css:152`

