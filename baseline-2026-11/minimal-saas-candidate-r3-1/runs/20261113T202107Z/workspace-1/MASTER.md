# Ploverdesk - Design System (MASTER)

Single source of truth. Every value in `src/` comes from `src/tokens.css`, which mirrors this file.
Status: **UNVALIDATED** (headless run, nobody available to approve).

## Theses

**Visual thesis.** A cool near-white page with near-black ink, set in the system sans with
tabular figures. No web font request was agreed and none loads here, so the voice comes from
exact figures, one weight step and size contrast. There is one colour, the auditor's red, and it
appears only on a value that does not match. The action is solid ink, never red. Matched lines
get a grey tick. Spacing is airy around a dense table, on an 8px base, with one left edge and a
72rem frame; running text stays at 36rem. Corners are 2px, borders are hairlines, everything is
flat. The first screen is an example invoice from a packaging wholesaler, labelled as an example,
checked line by line against its order and its delivery note. On a phone each line stacks, with
every value next to its label.

**Interaction thesis.** Fast and dry. Hover changes colour in 120ms with
`cubic-bezier(0.2, 0, 0, 1)` and nothing moves. Scrolling does nothing. Forbidden: scroll
reveals, parallax, bounce, scale on hover, loops, count-ups, glows, shadows. The one motion: the
"What you review" toggle lets the matched lines leave in 160ms through the native View
Transitions API, so only the exceptions remain. At rest, the full table already shows every
exception. With reduced motion the switch is instant.

**Allowed patterns:** hairline table rules; tick marks on matched lines; a status colour used
only for mismatched values.

Set aside: SaaS hero + dashboard screenshot + feature grid; a blank page with giant type; the
accounting ledger; the paper invoice. Kept: the auditor's tickmark and exception report.

Dials sent to the lookup: variance 2 ("one left edge, flat"), motion 2 ("fast and dry, scroll does
nothing"), density 4 ("airy around a dense table"). From the lookup I took the cool slate neutral
family and the ink focus ring. I dropped Plus Jakarta Sans, the 900-weight display type, the blue
CTA, the scroll reveal and the centred layout.

## Colour

| Token | Hex | Job | Contrast |
|---|---|---|---|
| `--c-ground` | `#F7F8F8` | page background | - |
| `--c-surface` | `#FFFFFF` | table surface | - |
| `--c-ink` | `#15181C` | text; **the action** (filled button) | 16.74:1 on ground, 17.81:1 on surface |
| `--c-ink-hover` | `#2A2F35` | button hover | white on it 13.49:1 |
| `--c-ink-2` | `#5A6169` | secondary text; matched tick | 5.89:1 on ground, 6.27:1 on surface |
| `--c-rule` | `#D9DDE1` | hairline separators (non-interactive) | decorative boundary, exempt |
| `--c-control` | `#80868C` | border of the quiet button | 3.68:1 on surface (UI boundary ≥ 3:1) |
| `--c-signal` | `#B3261E` | **the state**: a value that does not match | 6.54:1 on surface, 5.82:1 on tint |
| `--c-signal-tint` | `#FBEFEE` | background of an exception row | - |
| `--c-disabled` | `#8A9199` | disabled text | exempt (disabled) |

Action and signal are separate on purpose: ink asks you to act; red reports a discrepancy.
Light mode only. The product's material is printed documents.

## Typography

- Family: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
  The system face is a choice: no third-party font request was agreed, and the finance lead's own
  OS face has tabular figures. `font-variant-numeric: tabular-nums` on every figure.
- Weights: 400 body, 600 headings and emphasis. No other weights.
- Scale (rem): `--t-xs 0.8125`, `--t-sm 0.875`, `--t-base 1`, `--t-md 1.125`, `--t-lg 1.5`,
  `--t-xl clamp(2rem, 1.4rem + 2.4vw, 3rem)`.
- Line height: 1.5 body, 1.15 display, 1.35 table.
- Tracking: display -0.015em, otherwise 0.

## Spacing (8px base)

`--s-1 4px`, `--s-2 8px`, `--s-3 12px`, `--s-4 16px`, `--s-5 24px`, `--s-6 32px`, `--s-7 48px`,
`--s-8 64px`, `--s-9 96px`.

- Frame: `--frame 72rem`, side gutter `--gutter clamp(16px, 4vw, 32px)`. Every section starts at
  the same left edge.
- Measure: `--measure 36rem` for running text. The match table takes the full frame width; its
  five columns set that width.
- Section rhythm: `--s-9` between sections on wide frames, `--s-8` on narrow ones.

## Radii, borders, elevation

- `--r-sm 2px` on buttons and the table. Nothing else is rounded.
- Hairline `1px solid var(--c-rule)`.
- Elevation: none. No shadows.

## Motion

- `--ease cubic-bezier(0.2, 0, 0, 1)`
- `--d-fast 120ms`: colour on hover and focus.
- `--d-collapse 160ms`: the matched lines leaving (View Transitions).
- No stagger, no loops, nothing on scroll.
- `prefers-reduced-motion: reduce`: every transition is off and the toggle switches instantly.

## Components

- **Primary button** (`.btn`): ink fill, white text, 2px radius, 12px/20px padding.
  Hover `--c-ink-hover`; focus-visible 2px ink outline offset 2px; active `translateY(0)` with
  inset ink-2 border (no movement); disabled `--c-disabled` on `--c-rule`.
- **Quiet link** (`.link`): ink text, 1px underline at 0.2em offset; hover thickens the underline
  to 2px; focus-visible outline.
- **Segmented toggle** (`.seg`): two buttons, `aria-pressed`, hairline control border; the pressed
  one is filled ink.
- **Match table** (`.match`): surface, hairline rules on every row (allowed), tabular figures.
  Mismatched cell in `--c-signal` weight 600; exception row on `--c-signal-tint`. Below 720px each
  row becomes a block with labelled values.
