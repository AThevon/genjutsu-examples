# Nocturne - design system (MASTER)

Single source of truth for the Nocturne landing page. Code tokens live in `src/tokens.css`;
every value used in `src/` comes from there.

## Theses (UNVALIDATED - headless run, nobody answered the gates)

**Visual thesis.** The page is the inside of the dome at lights-down: a near-black ground (no
navy, no purple), star-white type, and one accent, a pale Saturn amber, kept for Saturn and for
booking only, because Saturn is the only planet in tonight's sky. Type is the system sans: no
web face can be requested in this build (no network, no agreed third-party request), so its
voice comes from scale contrast, with the times 21:30 / 22:00 / 23:30 set as huge light
tabular numerals and small letter-spaced capitals for coordinates. Airy 8px base, sharp
corners, hairline rules, flat (no shadows, no cards). First screen: the all-sky disc of 22:00,
Friday 9 October 2026 over Lisbon, plotted from `data/stars.json` (403 stars + Saturn),
zenith at the centre, north at top and east at left as seen looking up; size from magnitude,
tint from B-V; the brightest stars named with their IAU names, Saturn in amber. On a wide frame
the disc takes the right side at viewport height; title, nights, times and booking sit at
reading measure on the left.

**Interaction thesis.** Medium timing: 160ms `cubic-bezier(0.2, 0, 0, 1)` hover/focus shifts
(underline and colour on links, fill on the button, no scale). Only the hero is scroll-linked;
the rest of the page has no reveals and no parallax. Forbidden: twinkle loops, glow pulses,
bounce, reveal-on-scroll fades, constellation lines, any object not in the data. The one
motion, "house lights down": while the hero is pinned, scrolling dims the ground from dusk to
night and the stars light in order of magnitude (Saturn, Vega and Capella first, down to
magnitude 4.5), with a tabular counter of how many of the 403 stars are lit. Reduced motion:
no pin, night ground, every star shown at once.

`Allowed patterns: a vertical dusk-to-night ground gradient in the hero; hairline rules; small letter-spaced uppercase labels for coordinates and times; a live scroll-linked star counter; tabular figures; a near-black ground.`

`Set aside: navy nebula space page; white museum page; deep-space imagery; antique star atlas. Kept: the dome's own projection (all-sky disc, zenith centre).`

Display face (amended at this gate): **system sans** (`ui-sans-serif, system-ui,
-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`). Reason: nothing can be
fetched in this build and no font request was agreed; the system face renders instantly in a
dark room on a phone, and the light weights at display size plus tabular figures carry the voice.

## Dials

| Dial | Value | From |
|---|---|---|
| variance | 6 | "the disc takes the right side ... title at reading measure on the left": asymmetric, calm |
| motion | 3 | "only the hero is scroll-linked; no reveals, no parallax" |
| density | 3 | "airy 8px base" (label only; the scale below is derived by hand) |

## Colour

Dark only. The dome is dark; there is no light mode.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--c-night` | `#05070a` | page ground, the dome at full dark | - |
| `--c-dusk` | `#1a2633` | hero ground at the top of the scroll, before the lights go down | - |
| `--c-ink` | `#e8ebf0` | body text, star white | 16.88:1 on night, 12.84:1 on dusk |
| `--c-ink-2` | `#9aa3b0` | secondary text, labels | 7.91:1 on night, 6.02:1 on dusk |
| `--c-ink-3` | `#5d6672` | horizon ring, cardinal letters (graphic, large) | 3.47:1 on night |
| `--c-rule` | `#2a313b` | hairline rules (decorative separators only) | 1.54:1, never a boundary |
| `--c-saturn` | `#e6c07b` | Saturn, booking button fill | 11.71:1 on night; night text on it 11.71:1 |
| `--c-saturn-hi` | `#f2d39a` | booking button hover | night text on it 13.98:1 |
| `--c-saturn-lo` | `#d4ab5f` | booking button active | - |

Semantic colours (success / warning / error / info): none. The page has no form, status or
error state; adding them would be tokens nothing uses.

Star tint: computed per star from the catalogue B-V index, interpolated between
`--c-ink` (blue-white end) and `--c-saturn` (orange end) with CSS `color-mix`, at
`(bv + 0.2) / 1.8` capped at 0.6 so that no star takes Saturn's amber. Stars with no B-V take
0.3. Saturn alone is full amber, with a ring to mark it as the planet.

## Type

Family: `--font-sans` (system stack above) for everything. No monospace anywhere.
All numerals: `font-variant-numeric: tabular-nums`.

| Token | Value | Use |
|---|---|---|
| `--fs-label` | `0.75rem` | uppercase labels, letter-spacing `0.14em`, weight 500 |
| `--fs-small` | `0.875rem` | captions, credits |
| `--fs-body` | `1.0625rem` | body, line-height 1.6 |
| `--fs-lead` | `clamp(1.125rem, 1.6vw, 1.375rem)` | intro paragraph, line-height 1.5 |
| `--fs-h2` | `clamp(2rem, 4.5vw, 3.25rem)` | section titles, weight 300, tracking -0.02em |
| `--fs-time` | `clamp(3.5rem, 9vw, 7.5rem)` | the times, weight 200, tracking -0.03em |
| `--fs-display` | `clamp(3.5rem, 10vw, 8.5rem)` | "Nocturne", weight 200, tracking -0.035em |

Weights: 200 (display, times), 300 (h2), 400 (body), 500 (labels), 600 (button).
Measure: `--measure: 34rem` for reading columns.

## Spacing (8px base)

`--s-1 4px, --s-2 8px, --s-3 12px, --s-4 16px, --s-5 24px, --s-6 32px, --s-7 48px, --s-8 64px, --s-9 96px, --s-10 128px`.
Sections are separated by `--s-10` on wide frames, `--s-9` on narrow ones. Gutter `--s-5` narrow, `--s-7` wide.

## Radii

`--radius-none: 0` everywhere. `--radius-round: 50%` only for star and planet marks.

## Shadows / elevation

None, at every level. Flat, by thesis: a shadow on a black ground is invisible, and nothing on
the page floats.

## Components

- **Button (booking)**: Saturn fill, night text, weight 600, `--s-4` x `--s-5` padding, min
  height 48px, radius 0. Hover: `--c-saturn-hi`. Active: `--c-saturn-lo`. Focus-visible: 2px
  `--c-ink` outline, 3px offset. Disabled (`aria-disabled="true"`): 40% opacity, no pointer.
  One label everywhere: "Book tickets", always to `/tickets`.
- **Text link**: `--c-ink`, underline 1px at 0.2em offset; hover underline 2px; focus-visible
  as the button.
- **Label**: `--fs-label`, uppercase, `0.14em`, `--c-ink-2`.
- **Rule**: 1px `--c-rule`. Between sections and between table groups, never on every row.
- **Data table**: tabular figures, right-aligned numbers, no row rules.
- No card, no badge, no input: the page has nothing they would hold.

## Motion

| Token | Value |
|---|---|
| `--dur-fast` | `160ms` (hover, focus, active) |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--hero-pin` | `230svh` (scroll length of the stage that keeps the disc pinned) |
| star fade window | `0.06` of hero progress (JS constant `FADE`, in `src/sky.ts`) |
| stagger | none: no reveals exist to stagger |

Reduced motion: `--hero-pin` collapses to the hero's own height, progress is fixed at 1, no
transitions longer than 0ms.
