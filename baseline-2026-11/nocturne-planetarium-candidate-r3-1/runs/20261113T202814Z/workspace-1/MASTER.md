# Nocturne - design system (MASTER)

Single source of truth for the Nocturne landing page. Code tokens live in `src/tokens.css`
(CSS) and `src/sky/tokens.ts` (the three star tints and the Saturn mark, which the SVG
renderer needs as values). Any value not in this file does not ship.

Status: theses **UNVALIDATED** (headless run, nobody available to validate).

## Theses

**Visual thesis.** The page is the dome seen from the reclining seat: one dark ground that
starts at dusk blue and dims to dome black, the stars in their own colour (tinted from each
star's B-V index in `data/stars.json`), one gold that marks Saturn - the one planet up, the
signal - and nothing else, one torch red (the red light that keeps eyes dark-adapted) that
marks the ticket action and nothing else. Type: the system serif, light and very large, set
roman, for the name Nocturne (no third-party font request is approved; the serif carries the
concert-programme register of the word), and system sans with tabular figures for every time,
price, altitude and magnitude. Airy, 8px base, one left edge every section answers to,
running text at 60ch, the sky table at the width its columns need. Flat, sharp, hairline,
2px radius, no shadows.

**First screen.** The sky over Lisbon at 22:00 WEST on Friday 9 October 2026, drawn from the
data as an azimuthal projection (zenith at centre, horizon as the rim, N top, E left so it
reads overhead). Wide: the dome takes `min(88svh, 56vw)` on the right; Nocturne, the one-line
program and the ticket button sit at reading measure on the left edge; whole at 1280x720. At
rest: dusk ground, the 40 objects of magnitude 2.5 or brighter, Vega, Capella, Altair,
Fomalhaut, Deneb, Polaris and Saturn named beside their points, caption with place and time.
Narrow (375): title, dome at full width, then the line and the button; the seven names stay
beside their points.

**Interaction thesis.** Slow and quiet. The one motion: as the hero scrolls through (pinned
with `position: sticky` on frames at least 1024x640, amended from 900x640), progress p 0 to 1 fades a night layer
over the dusk ground and brings the stars in by magnitude, brightest first, in 8 bands of 0.25
mag from 2.5 to 4.5; linear to scroll, no duration of its own. Before it runs and if it never
runs: the dusk sky with 40 stars. Reduced motion: the full night sky at once, no pinning.
Hover 160ms `cubic-bezier(0.2, 0, 0, 1)`, colour and underline only. Nothing else moves.
Forbidden: twinkling (a dome has no atmosphere), shooting stars, particles, nebula gradients,
parallax, fade-up reveals, scroll-jacking, bounce, any loop.

**Allowed patterns:** dark ground; the scroll-linked dimming; pinned sticky hero; hairline
rules (under section labels and the table header only, not on every row); uppercase
letter-spaced small labels (compass points, section labels); tabular figures; star colour
from B-V data; display serif (system serif, roman, reason above).

Set aside: navy hero with stock starfield, nebula gradient and "explore the cosmos"; a white
editorial text page with no sky; the paper planisphere; the observatory telescope and
eyepiece. Kept: the dome seen from the reclining seat.

## Dials

| Dial | Value | Clause |
|---|---|---|
| variance | 6 | "the dome takes min(88svh, 56vw) on the right ... on the left edge" (asymmetric) |
| motion | 2 | "The one motion ... Nothing else moves" |
| density | 3 | "Airy, 8px base" |

## Colour

| Token | Hex | Job | Contrast on night `#05070d` / dusk `#1a2242` |
|---|---|---|---|
| `--c-night` | `#05070d` | dome black, page ground | - |
| `--c-dusk` | `#1a2242` | hero ground at rest | - |
| `--c-raised` | `#0b0f1c` | table row hover, ticket block ground | - |
| `--c-ink` | `#ece9e1` | text | 16.6 / 12.8 |
| `--c-ink-dim` | `#a3a8b8` | secondary text, compass points | 8.5 / 6.6 |
| `--c-rule` | `#3a4266` | hairlines, dome rim (decorative) | - |
| `--c-torch` | `#ff6b57` | **the action only**: ticket button, links | 7.2 / 5.5 |
| `--c-torch-hover` | `#ff8573` | button hover | - |
| `--c-torch-active` | `#e5523f` | button active | - |
| `--c-on-torch` | `#05070d` | text on the button | 7.2 on torch |
| `--c-disabled` | `#2a2f45` | disabled button ground (text `--c-ink-dim`, 5.6:1) | - |
| `--c-saturn` | `#e8c873` | **the signal only**: Saturn's mark and name | 12.4 / 9.6 |
| star tints | `#cfdcff` / `#fffaf0` / `#ffcda0` | B-V -0.3 / 0.7 / 1.7, interpolated | data |

No semantic success/warning/error colours: the page has no form and no state to report.

## Typography

- `--font-display`: `ui-serif, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif` - weight 300, roman.
- `--font-text`: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif` - 400 body, 600 labels and button.
- Figures: `font-variant-numeric: tabular-nums` on every time, price, magnitude, angle.
- Scale: `--fs-label .75rem` (uppercase, `--ls-label .16em`), `--fs-small .875rem`, `--fs-body 1.0625rem`,
  `--fs-lead clamp(1.125rem, 1rem + .6vw, 1.375rem)`, `--fs-h2 clamp(1.75rem, 1.2rem + 2vw, 2.75rem)`,
  `--fs-time clamp(2rem, 1.4rem + 2.4vw, 3.25rem)`, `--fs-display clamp(3.5rem, 1rem + 6vw, 8.5rem)`.
- Line height: `--lh-tight 1`, `--lh-head 1.15`, `--lh-body 1.6`.

## Spacing and layout

- Scale (8px base, 4px half step): `--s-1 .25rem`, `--s-2 .5rem`, `--s-3 .75rem`, `--s-4 1rem`,
  `--s-5 1.5rem`, `--s-6 2rem`, `--s-7 3rem`, `--s-8 4rem`, `--s-9 6rem`, `--s-10 8rem`.
- `--edge: clamp(1.25rem, 6vw, 6rem)` - the one left (and right) edge of every section.
- `--measure: 60ch` - running text.
- `--table-max: 44rem` - the sky table; its five columns set the width.
- `--section-gap: clamp(5rem, 10vw, 9rem)`.
- `--dome-size: min(80svh, 48vw)` wide (amended from the thesis's 88svh/56vw so dome, compass
  and caption stand whole inside one pinned 100svh frame); full content width narrow.
- `--target-min: 2.75rem` (44px) - minimum height of every tap target.
- The dusk-to-night ground is one fixed full-viewport layer under all content, so no section
  edge ever shows a seam between dimmed and undimmed ground.
- Breakpoints: `64rem` (1024px) two-column hero, so "Nocturne" fits beside the dome; pinning also needs `min-height: 40rem`; `36rem` the table becomes stacked blocks.

## Radii, shadows

- `--r-0 0`, `--r-1 2px` (button, ticket block). No other radius.
- Shadows: none. Elevation is level 0 everywhere; separation is a hairline or a ground change.

## Motion

- `--dur-hover 160ms`, `--ease-out cubic-bezier(0.2, 0, 0, 1)`.
- Dimming: `--p` 0..1 written by `src/sky/useDimming.ts` from scroll; night layer opacity `p`;
  band k (0..7) opacity `clamp(0, 8p - k, 1)`; bands of 0.25 mag from 2.5 to 4.5.
- Pin: hero height `--hero-pin 190svh` when pinned; content sticky at top.
- Reduced motion: p fixed at 1, no pin, no hover transition.

## Base components

- **Button (primary)** - torch ground, on-torch text, 600, `--s-3 --s-5` padding, `--r-1`.
  Hover `--c-torch-hover`; focus 2px `--c-ink` outline, 3px offset; active `--c-torch-active`;
  disabled `--c-disabled` ground, `--c-ink-dim` text, `cursor: not-allowed`.
- **Link** - torch text, 1px underline at .2em offset; hover underline 2px; focus as button;
  active `--c-torch-active`.
- **Ticket block** - `--c-raised` ground, 1px `--c-rule` border, `--r-1`. Not interactive.
- **Section label** - `--fs-label`, uppercase, `--ls-label`, `--c-ink-dim`, hairline above.
- No badge, no input, no card grid: the page has none of these.
