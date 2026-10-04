# Nocturne - design system (MASTER)

Single source of truth for the Nocturne landing page. Every value in `src/tokens.css` comes from
this file; components read only the CSS custom properties defined there.

Status: theses **UNVALIDATED** (headless run, nobody available to approve). Preview of the
theses: `preview/thesis.html`. Preview of this system: `preview/design-system.html`.

## Theses

**Visual thesis.** The page is the dome at night: a near-black blue ground that starts as dusk
blue at the top and darkens as you scroll; the real 22:00 Lisbon sky from `data/stars.json` is
the hero, each star sized by magnitude and tinted by its catalogue B-V colour, Saturn marked and
named; one dim red accent, the light people read star charts by in the dark, kept for the
booking action; the platform's system sans (no webfont: the build is offline and the chart
carries the identity), weight 300 at display sizes against 400 body, tabular figures for times,
prices and magnitudes, no monospace; airy spacing on an 8px base, one content column beside a
sticky dome on wide screens; flat components, 1px hairlines, 2px radii, no shadows.

**Interaction thesis.** Slow where the sky moves, fast where you act: the sky is scroll-linked,
never timed; the ground goes from dusk to night and stars come in by magnitude, from 1.5 down to
4.5, as the page scrolls; hover and focus are 160ms `cubic-bezier(0.2, 0, 0, 1)` colour and
opacity changes, no scale, no lift; choosing a star in the list rings it on the dome in the same
160ms; no scroll reveals on text, no parallax, no twinkling or other loop, no bounce, no scroll
cue; reduced motion shows the full night sky from the start and sets every transition to 0ms.

**Allowed patterns:** the dome chart drawn from the data, its hairline altitude circles (0, 30,
60 degrees) and cardinal letters, a dark ground, a scroll-linked sky, tabular figures, one 1px
rule between rows of the star table, the Saturn ring marker, the dim red accent.

**Assumptions taken from the brief** (no brainstorm answers available):
- Product: the after-hours program of an unnamed Lisbon planetarium; what no template could
  claim is the real sky of a given evening, which the data provides.
- Audience: adults 20s to 40s choosing a night out; no school register, no social proof (none
  exists yet).
- Mood: dark, quiet, exact, unhurried.
- References: none given; none suggested.
- Stack: React 19 + Vite + plain CSS, no animation library (scan).

## Dials (sent to search.py)

| Dial | Value | From |
|---|---|---|
| variance | 6 | "one content column beside a sticky dome" (asymmetric, not experimental) |
| motion | 3 | "scroll-linked, never timed ... no scroll reveals, no loop" |
| density | 3 | "airy spacing on an 8px base" |

Lookup kept: dark-first, no pure #000 ground, 150-300ms hover band, responsive checks at
375/768/1024/1440, table alternative for the chart. Dropped: indigo/violet palette, Orbitron +
JetBrains Mono, glassmorphism, glow, ambient blobs, GSAP scroll reveal, scale-on-press, metrics
"operations" landing pattern.

## Colour

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--c-night` | `#06080f` | ground at full night | - |
| `--c-dusk` | `#1a2747` | ground at the top of the page | - |
| `--c-ink` | `#e6e9f0` | headings, body emphasis | 16.5:1 night, 12.1:1 dusk |
| `--c-ink-muted` | `#9aa3b5` | body text, captions | 7.9:1 night, 5.8:1 dusk |
| `--c-rule` | `#6b7488` | hairlines, chart graticule (never text) | 4.3:1 night, 3.1:1 dusk |
| `--c-accent` | `#ef7b6a` | booking action, selected star | 7.4:1 night, 5.4:1 dusk |
| `--c-accent-hover` | `#f59a8b` | accent hover | night text on it 9.4:1 |
| `--c-accent-active` | `#d9685a` | accent pressed | night text on it 5.8:1 |
| `--c-on-accent` | `#06080f` | text on accent | - |
| `--c-saturn` | `#e9cf9a` | Saturn marker and label | 13.2:1 night |
| `--c-disabled` | `#3a4255` | disabled fill | (not text) |

Star tints (from catalogue B-V, data-driven, chart only): `<0` `#b9c9ff`, `<0.3` `#e3e9ff`,
`<0.6` `#fbf7f0`, `<1.0` `#ffe6c4`, `<1.4` `#ffd2a0`, else `#ffbe82`; no B-V `#f2f4fa`.

Semantic colours: none. The page has no forms, no states that succeed or fail.

## Typography

- Family: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
  Reason: no network for webfonts, and the chart is the identity; the type stays out of its way.
- Weights: 300 display, 400 body, 600 labels and buttons.
- Numbers: `font-variant-numeric: tabular-nums` on times, prices, magnitudes, altitudes.
- Scale (rem): `--fs-xs` 0.8125, `--fs-sm` 0.875, `--fs-base` 1, `--fs-lg` 1.25,
  `--fs-xl` 1.75, `--fs-2xl` clamp(2rem, 4vw, 2.75rem), `--fs-display` clamp(3.5rem, 9vw, 7rem).
- Line height: `--lh-tight` 1.05 (display), `--lh-snug` 1.25 (headings), `--lh-body` 1.6.
- Measure: `--measure` 34rem.

## Spacing (8px base)

`--sp-1` 4px, `--sp-2` 8px, `--sp-3` 12px, `--sp-4` 16px, `--sp-5` 24px, `--sp-6` 32px,
`--sp-7` 48px, `--sp-8` 64px, `--sp-9` 96px, `--sp-10` 160px. Sections are separated by
`--sp-10`; airy, never dense.

## Radii, borders, elevation

- `--r-sm` 2px (buttons, focus), `--r-full` 999px (none in use beyond the dome circle itself).
- `--bw` 1px hairline in `--c-rule`.
- Shadows: none. Elevation level 0 only; the ground is the dome, nothing floats on it.

## Layout

- Wide (>= 960px): grid of content column (`minmax(0, 34rem)`) and sticky dome
  (`position: sticky; top: 0; height: 100svh`). Max width `--max` 1360px, gutter `--sp-7`.
- Narrow (< 960px): the dome pins inside the hero for its own scroll length, then content
  follows in one column; gutter `--sp-5`.
- z-index: `--z-base` 0, `--z-content` 10, `--z-skip` 50 (reserved).
- Breakpoints (media queries cannot read custom properties): wide from 960px; the star list
  drops its direction column below 560px.
- Tracks: `--screen` 100svh, `--pin-length` 180svh (narrow pinned dome), `--col-time` 5rem,
  `--col-num` 5rem / `--col-num-sm` 4rem (magnitude), `--col-alt` 4rem / `--col-alt-sm` 3rem
  (height), `--fact-min` 8rem.

## Chart (SVG view units, viewBox 1000)

- Projection: azimuthal, zenith at the centre, horizon at radius 470, north up, east left.
- Star disc radius: `max(1.1, 7.2 - 1.45 * magnitude)`; fill from the B-V tints above.
- Saturn: disc radius 6.5, ring ellipse 13 x 4, in `--c-saturn`.
- Selection ring: radius 20, `--c-accent`.
- `--chart-cardinal` 24, `--chart-label` 20, `--chart-scale` 16; strokes `--chart-stroke` 1
  (30 and 60 degree circles, dashed 2 6), `--chart-stroke-strong` 1.5 (horizon),
  `--chart-stroke-ring` 2.
- Labelled stars: Vega, Capella, Altair, Fomalhaut, Deneb, Mirfak, Polaris, plus Saturn.

## Motion

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 160ms | hover, focus, pressed, star ring |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | every transition |
| `--sky-p` | 0..1 (set from scroll) | ground mix, limiting magnitude |
| limiting magnitude | `1.5 + 3 * p` | star bins of 0.25 mag fade in over 0.5 mag |

No stagger, no entrance animation, no loop. Reduced motion: `--sky-p` fixed at 1,
`--dur-fast` 0ms.

## Base components

- **Button (link)** `.button`: accent fill, on-accent text, 600, `--sp-3` / `--sp-5` padding,
  `--r-sm`, min height 44px. Hover `--c-accent-hover`; focus-visible 2px `--c-ink` outline,
  3px offset; active `--c-accent-active`; disabled (`aria-disabled="true"`) `--c-disabled`
  fill, `--c-ink-muted` text, no pointer. One label everywhere: "Book tickets".
- **Text link** `.link`: `--c-ink`, underline 1px offset 3px; hover `--c-accent`; focus as
  button.
- **Star row** `.star-row` (button, `aria-pressed`): transparent, 1px top rule, tabular
  figures, min height 44px. Hover and pressed: name in `--c-accent`; focus-visible outline;
  disabled: muted, no pointer (not used, styled for completeness).
- **Fact list** `dl`: term in `--c-ink-muted` `--fs-sm`, value in `--c-ink` `--fs-lg`.
- No cards, no badges, no inputs: the page has nothing they would hold.
