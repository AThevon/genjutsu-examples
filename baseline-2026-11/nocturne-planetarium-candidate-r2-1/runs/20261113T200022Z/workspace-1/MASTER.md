# Nocturne - Design System (MASTER)

Single source of truth for the Nocturne landing page. Every value in `src/tokens.css` comes from
this file; components read only the CSS custom properties defined there.

Status: **UNVALIDATED** (headless run, nobody available to approve the theses).

## Theses

**Visual thesis.** An observer's all-sky chart printed in light on night: the page ground darkens
section by section from a dusk blue-slate to near-black ink, stars are warm-white dots sized by
magnitude and tinted by their catalogue B-V, and one night-vision red is kept for the pointer,
the times and the ticket action. System faces only: the system sans for display and body, its
voice carried by size contrast and tabular figures; star and planet names in italic system serif,
after the star-atlas habit of italic proper names. Airy, 8px base, one left edge on a 12-column
grid, reading measure 34rem; only the charts leave the measure. Sharp, flat, hairline-bordered,
no shadows; the only curves are the dome circles.

**First screen.** The sky over Lisbon at 22:00 on Friday 9 October 2026, drawn as an SVG disc
from `data/stars.json` (zenith at the centre, horizon at the rim, north up and east left,
altitude rings every 30 degrees, cardinal letters, Saturn and the brightest named stars labelled).
Wide: the disc takes the right seven columns at viewport height, the title, the date and the
times stay at reading measure on the left. Narrow: title first, then the disc at full width,
whole. Fully drawn at rest, no load-in.

**Interaction thesis.** Medium and dry: link and button hovers are 160ms ease-out on colour and
underline only; nothing reveals, parallaxes or moves with scroll (the dusk-to-night shift is
static, section by section). Forbidden: twinkling, particles, glows, load-in fades, bounce, scale
on hover, constellation lines. **The one motion** is the narrator's pointer: in "Tonight's sky",
hovering, focusing or tapping an object moves a red ring across the chart to it (transform,
420ms, `cubic-bezier(0.2, 0, 0, 1)`) and brightens its label. At rest the ring already sits on
Saturn; if it never runs, every list entry gives direction and altitude in words. Reduced motion:
the ring jumps, no transition.

**Allowed patterns:** hairline rules and altitude rings; italic serif object labels; tabular
figures for times, prices and coordinates; a stepped dusk-to-night section ground; a red pointer
ring; small uppercase letter-spaced labels for the cardinal points and section stamps.

Set aside: navy + twinkling particles + nebula; white museum page with photos; sci-fi HUD console;
nebula astrophotography. Kept: the observer's all-sky horizon chart (red observing light as accent).

### Assumptions (headless run, answered from the brief)

- Product: the hero is the actual sky the dome shows, from `data/stars.json`. No stars, lines,
  events or claims beyond the data and the brief.
- Audience: adults in their 20s to 40s on an evening out: a late listing's register, not a lesson.
- Mood: nocturnal, exact, unhurried, intimate.
- References: none supplied, none invented.
- Fonts: no font request was agreed and there is no network, so system faces. Nothing to load.

### Dials (sent to the design-system lookup)

| Dial | Value | From the thesis clause |
|---|---|---|
| variance | 6 | "the disc takes the right seven columns, the title ... on the left" (asymmetric, not experimental) |
| motion | 2 | "nothing reveals, parallaxes or moves with scroll" + one pointer motion |
| density | 3 | "Airy, 8px base" |

Lookup kept: hero-centred structure, 44px targets, 4.5:1 contrast floor, test widths. Dropped:
waitlist/countdown pattern (invented scarcity), light academic-navy palette, Outfit + Work Sans
(a geometric-sans reflex needing an unagreed font request), scroll reveal, parallax, CTA glow.

## Color

All ratios computed (WCAG 2.x relative luminance).

| Token | Hex | Role |
|---|---|---|
| `--ground-dusk` | `#1c2735` | hero ground (dusk) |
| `--ground-evening` | `#141c27` | program section |
| `--ground-night` | `#0d131b` | tonight's sky section |
| `--ground-late` | `#06080b` | practical section, footer |
| `--dome` | `#04060a` | chart disc fill |
| `--ink` | `#ece6da` | text; 12.15:1 on dusk, 16.13:1 on late |
| `--ink-dim` | `#9aa3ae` | secondary text; 5.91:1 on dusk, 7.85:1 on late |
| `--red` | `#ff6a55` | pointer, times, ticket action; 5.35:1 on dusk, 7.11:1 on late |
| `--red-hover` | `#ff7a66` | ticket button hover; 5.91:1 on dusk |
| `--on-red` | `#06080b` | text on red; 7.11:1 |
| `--line` | `#2e3a49` | decorative hairlines, altitude rings (not a UI boundary) |
| `--line-strong` | `#6b7788` | UI boundaries (buttons, list entries); 3.32:1 on dusk, 4.41:1 on late |
| `--star-cool` | `#cad8ff` | stars with B-V < 0 |
| `--star-neutral` | `#f4efe6` | stars with 0 <= B-V < 0.8, and B-V null |
| `--star-warm` | `#ffcf9e` | stars with B-V >= 0.8 |

No semantic success/warning/error colours: the page has no form and no state to report.
Dark only; there is no light mode (the page is the night).

## Typography

| Token | Value |
|---|---|
| `--font-sans` | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--font-serif` | `"Iowan Old Style", "Charter", "Bitstream Charter", Georgia, "Times New Roman", serif` (italic only, object names) |

Figures: `font-variant-numeric: tabular-nums` on every time, price, altitude and magnitude.

| Step | Value | Use |
|---|---|---|
| `--step--1` | `0.8125rem` | stamps, cardinal labels (uppercase, `--track-wide`) |
| `--step-0` | `1.0625rem` | body, line-height 1.6 |
| `--step-1` | `1.375rem` | lede, object names, line-height 1.4 |
| `--step-2` | `clamp(1.75rem, 3.2vw, 2.5rem)` | section headings, line-height 1.15 |
| `--step-3` | `clamp(3rem, 8vw, 6rem)` | wordmark title, line-height 1 |
| `--step-4` | `clamp(3.5rem, 10vw, 7.5rem)` | the program times, line-height 1 |

Weights: 300 for `--step-3` and `--step-4` (light numerals on night), 400 body, 600 stamps.
`--track-wide: 0.14em` for uppercase stamps; `--track-tight: -0.02em` for steps 3 and 4.
`--measure: 34rem`.

## Spacing

Base 8px. `--space-1` 4px, `--space-2` 8px, `--space-3` 12px, `--space-4` 16px, `--space-5` 24px,
`--space-6` 32px, `--space-7` 48px, `--space-8` 64px, `--space-9` 96px, `--space-10` 128px.

Layout: 12-column grid, `--gutter: clamp(1.25rem, 4vw, 3rem)` page edge, `--col-gap: var(--space-5)`,
`--page-max: 90rem`. Every section starts text at column 1 of the same grid. The hero chart spans
columns 6-12; "The evening" sets its heading in columns 1-4 and the times in 5-12; the sky
chart takes columns 1-6 (sticky), its list 8-12; "Practical" reads across, its facts a row of
columns on the full width. Narrow (below 56rem): one column; the sky chart sticks to the top at
up to 42svh so a tapped name shows its ring. Section padding
`--space-10` top and bottom on wide, `--space-8` on narrow.

## Radii and elevation

`--radius-none: 0` for everything; `--radius-full: 50%` only for the dome disc and the pointer
ring. Elevation: level 0 only. No shadows anywhere (a shadow on night is a glow).

## Components

- **Ticket action** (`.btn`): filled `--red`, text `--on-red`, `--step-0` weight 600, padding
  `--space-3 --space-5`, min height 44px, radius 0. Hover: `--red-hover`. Focus-visible: 2px
  `--ink` outline, 3px offset. Active: `--ink` background. Disabled: transparent, 1px
  `--line-strong` border, `--ink-dim` text, `cursor: not-allowed`. One label everywhere:
  "Book tickets".
- **Link** (`.link`): `--ink`, 1px underline at 0.2em offset in `--line-strong`. Hover: underline
  and text `--red`. Focus-visible: as button. Active: `--ink-dim`.
- **Object entry** (`.sky-item`): a full-width button, 1px `--line` top rule, min height 44px.
  Default: name `--ink-dim`. Hover / focus / selected: name `--ink`, a 2px `--red` bar at the
  start edge (opacity change, not width). Focus-visible: 2px `--ink` outline inset.
  Active: `--ground-evening` background. Disabled: not used.
- **Chart**: `--dome` disc, `--line` rings at altitude 0, 30, 60, cardinal letters `--ink-dim`
  `--step--1` uppercase; star radius `max(0.35, 2.5 - 0.48 * mag)` user units on a 200-unit disc.
  Chart geometry, in SVG user units (R = 100, viewBox padding 14): rings stroke 0.4, horizon
  0.6; pointer ring radius 7, stroke 1; labels 4.6 (7 on the narrow frame), cardinals 6 (8 narrow);
  label offset `r + 2`, or `7 + 2` on a chart with a pointer. Projection: zenith-centred
  azimuthal equidistant, north up, east left. Constellation lines: none (not in the data).

## Motion

| Token | Value | Use |
|---|---|---|
| `--dur-hover` | `160ms` | colour / underline on links, buttons, entries |
| `--ease-hover` | `ease-out` | hover |
| `--dur-pointer` | `420ms` | the pointer ring travelling to an object |
| `--ease-pointer` | `cubic-bezier(0.2, 0, 0, 1)` | pointer |

No stagger, no entrance, no exit animation (nothing unmounts). `prefers-reduced-motion: reduce`
sets `--dur-pointer: 0ms` and `--dur-hover: 0ms`.
