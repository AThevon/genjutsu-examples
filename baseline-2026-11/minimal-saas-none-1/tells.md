## Static audit

Roots: detected: src. 3 file(s) examined.

**18 checked, 0 with findings, 1 tell to confront, 0 not applicable.**

Every line below is evidence, not a verdict. A check listed as not applicable did not
run: report it as not checked, never as passed. This covers none of the items that need
a profiler, a device or a pointer.

**1 tell check(s) fired.** They are listed apart, and none of them is a
problem until it has been confronted with the validated thesis.

### Tells - confront each with the thesis before counting it

A tell is evidence that a default slipped in, not a verdict. For each one, quote the
sentence of the validated thesis that names the pattern (it is then allowed by the
thesis), or count it as a problem. A mood word such as "editorial" names nothing.

**U+2014 (em dash) in displayed text** (tell-em-dash)

- `src/App.tsx:29` - `Illustration of an invoice in Ploverdesk: five lines, three flagged &#8212; a quantity that differs from the delivery note, a unit price that differs from the purchase order, and a line with no delive`

### Checked, nothing found

- **Blurred background blob** - No element blurred by 40px or more (blur-2xl, blur-3xl, filter: blur), and no positioned element painted with a radial gradient that fades from a colour to transparent. (3 file(s))
- **Middle-dot run** - No displayed line strings two or more middle dots together. (2 file(s))
- **One intent under several button labels** - Every call to action intent found uses a single label. (2 file(s))
- **Three equal cards** - No three-column container holds three children with the same class list. (2 file(s))
- **Part number or section code that points to nothing** - No code like SEC-01, REF-204 or MK.I in the displayed text. (2 file(s))
- **Filler verb** - None of the listed filler verbs appears in the displayed text. (2 file(s))
- **Generic step label** - No text starts with Stage, Step, Phase or Pass followed by a number. (2 file(s))
- **Glassmorphism panel** - No panel blurs what sits behind it, in classes or in CSS. (3 file(s))
- **Glow or neon shadow** - No shadow with zero offset and a blur of 20px or more. (3 file(s))
- **Gradient-filled text** - No text is clipped to a background, in classes or in CSS. (3 file(s))
- **Invented build or release status** - No version stamp, sync time or build number in the displayed text. (2 file(s))
- **Weather, clock or timezone strip** - No clock, temperature or timezone strip in the displayed text. (2 file(s))
- **Numbered eyebrow or tile pagination** - No zero-padded section number and no `01 / 4` counter in the displayed text. (2 file(s))
- **Animation that never stops** - No infinite animation: no infinite iteration, no animate-pulse/ping/bounce/spin, no repeat: Infinity. (3 file(s))
- **Placeholder name or brand** - No John Doe, Jane Doe, Acme or lorem ipsum in the displayed text. (2 file(s))
- **Round or unsourced figure** - No 99.9%, 100%, 10,000+ or 10x style figure in the displayed text. (2 file(s))
- **Scroll cue** - No short text telling the visitor to scroll. (2 file(s))

### Inventory

**durations** - 0 distinct value(s). Durations in use. A designed system has three to five. Fifteen is an accident.

**easings** - 0 distinct value(s). Easings in use. Same rule: a handful, named, or it is not a system.

**colors** - 9 distinct value(s). Colours written as literal values or palette utilities. No verdict: each one should trace back to a token the design system or the thesis names.

- `#f7f6f2` x1 - `src/index.css:2`
- `#ffffff` x1 - `src/index.css:3`
- `#16181b` x1 - `src/index.css:4`
- `#55595f` x1 - `src/index.css:5`
- `#dcdad3` x1 - `src/index.css:6`
- `#9a3412` x1 - `src/index.css:7`
- `#fbf3ee` x1 - `src/index.css:8`
- `#000` x1 - `src/index.css:147`
- `#ecebe6` x1 - `src/index.css:240`

**radii** - 3 distinct value(s). Corner radii in use. No verdict: compare the spread with the radius scale the design system declares.

- `2px` x1 - `src/index.css:62`
- `4px` x1 - `src/index.css:144`
- `6px` x1 - `src/index.css:204`

**fonts** - 2 distinct value(s). Font families named in the code. No verdict: each one should be a family the thesis names, for the reason it gives.

- `var(--sans)` x1 - `src/index.css:29`
- `var(--mono)` x1 - `src/index.css:72`

