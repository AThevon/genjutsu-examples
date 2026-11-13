# Ploverdesk design system (MASTER)

Single source of truth for the landing page. Every value in `src/tokens.css` comes from here.
Theses status: **UNVALIDATED** (headless session, nobody available to approve).

## Theses

**Visual thesis.** A cool white ground with graphite ink and no colour at all except where a line
fails to match: one dark amber, used only for the discrepancy, so the page's colour behaves like
the product. Type is the system sans: no third-party font request was agreed to and there is no
network, so the voice comes from tabular figures, column alignment and a restrained two-step size
contrast at weight 500, not from a display face. Airy page on a 4px base, dense inside the match
table. Sharp 2px corners, 1px hairlines, flat, no shadows. First screen: headline and trial link at
reading measure on the left edge; across the full content width, an illustrative three-way match
(labelled as an example, not customer data) where matched lines are ticked and quiet, and the one
line where quantity invoiced differs from quantity delivered is ringed in amber.

**Interaction thesis.** Fast and dry: 140ms `cubic-bezier(0.2, 0, 0, 1)` hovers (button ink
darkens, link underline thickens, no scale), nothing on scroll. Forbidden: scroll reveals,
parallax, bounce, loops, counters, scale on hover, layout-property animation. The one motion: once,
600ms after load, matched rows recede to secondary ink (280ms, 40ms stagger) and an amber ring draws
around the mismatched cell, leaving only the exception in front of the reader. A button replays it.
Reduced motion: the end state, immediately, no transition.

**Allowed patterns:** tabular figures; 1px hairline rules, with a rule on every row of the match
table only (the reader tracks across invoiced, ordered and delivered); tickmark glyphs in the
example; an example drawn in markup standing in for the product, labelled as illustrative; the
one-shot recede-and-ring motion.

**Amendment (design-system gate):** no monospace. The example carries no document reference
numbers, because they would be invented codes, so mono has nothing left to set.

Set aside: SaaS hero with dashboard screenshot and logo strip; bare page with one sentence; the
ledger; the invoice PDF. Kept: the auditor's tickmark legend.

## Assumptions (brief answered without a human)

- Audience: the finance lead or AP manager of a mid-size EU wholesaler.
- Mood: quiet, precise, exact, unadorned.
- No references supplied; none borrowed.
- No web font: the system sans, chosen for tabular figures and zero network cost.
- Example goods are generic hardware lines; every figure in them is illustrative and labelled so.

## Colour (light only)

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--c-ground` | `#FBFBFC` | page | ink 17.2:1 |
| `--c-surface` | `#FFFFFF` | match table | ink 17.8:1 |
| `--c-ink` | `#16181D` | text, primary button | white on it 17.8:1 |
| `--c-ink-hover` | `#2C3038` | button hover | white 13.2:1 |
| `--c-ink-2` | `#4A4F59` | secondary text, button active | 8.0:1 on ground |
| `--c-ink-3` | `#666B75` | receded rows, captions | 5.4:1 surface, 5.2:1 ground |
| `--c-rule` | `#D9DCE1` | hairlines (separators, not boundaries) | 1.3:1 |
| `--c-exception` | `#8A4B00` | exception text | 6.3:1 on wash, 6.8:1 on white |
| `--c-exception-mark` | `#A35A00` | the ring | 5.2:1 on white |
| `--c-exception-wash` | `#FCF5EA` | exception row ground | ink 16.4:1 |
| `--c-disabled` | `#8C919A` | disabled border | 3.1:1 on ground |
| `--c-disabled-bg` | `#F1F2F4` | disabled fill | ink-3 on it 4.8:1 |
| `--c-on-ink` | `#FFFFFF` | text on ink | |

Semantic: the only semantic colour is *exception* (amber). Success is not coloured: a match is
the quiet default, shown as a tick in `--c-ink-3`.

## Typography

- `--font-sans`: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Figures: `font-variant-numeric: tabular-nums` everywhere.
- Weights: 400 body, 500 headings and buttons. Nothing heavier.

| Token | Value | Line height |
|---|---|---|
| `--t-display` | `clamp(2rem, 1.4rem + 2.4vw, 2.75rem)` | 1.15, tracking -0.01em |
| `--t-heading` | `1.5rem` | 1.25 |
| `--t-lead` | `1.25rem` | 1.5 |
| `--t-body` | `1rem` | 1.5 |
| `--t-table` | `0.9375rem` | 1.4 |
| `--t-small` | `0.8125rem` | 1.4 |

Measure: `--measure: 36rem`. Content width: `--content: 72rem`. Headline measure:
`--display-measure: 18em`. Match table minimum width (scrolls inside its frame below it):
`--table-min: 40rem`. Touch target: `--target: 2.75rem` (44px).

Lines: `--hairline: 1px`, `--focus-width: 2px`, `--focus-offset: 3px`, `--underline: 1px`,
`--underline-hover: 2px`, `--underline-offset: 4px`.

## Spacing (4px base)

`--s-1 .25rem` · `--s-2 .5rem` · `--s-3 .75rem` · `--s-4 1rem` · `--s-6 1.5rem` · `--s-8 2rem` ·
`--s-12 3rem` · `--s-16 4rem` · `--s-24 6rem` · `--s-32 8rem`.
Sections are separated by `--s-24` (`--s-16` under 768px). Table cells: `--s-3`/`--s-4`.

## Radii and elevation

`--r-0: 0`, `--r-1: 2px`. No shadows: elevation 0 only, separation is a 1px `--c-rule` line.

## Motion

| Token | Value |
|---|---|
| `--d-fast` | `140ms` (hover, focus) |
| `--d-recede` | `280ms` (matched rows recede) |
| `--d-ring` | `280ms` (ring draws), delay `--d-ring-delay: 160ms` |
| `--stagger` | `40ms` per row |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` |
| first run delay | `600ms` after mount (JS constant `FIRST_RUN_DELAY_MS`) |

Animated properties: `color`, `background-color`, `stroke-dashoffset`, `text-decoration-thickness`.
Never width, height, top, left, margin, padding. `prefers-reduced-motion: reduce` sets every
transition to none and the JS applies the end state without delay.

## Components

- **Button (primary)**: ink fill, `--c-on-ink` text, 1px ink border, `--r-1`, padding `--s-3`/`--s-6`,
  weight 500. Hover `--c-ink-hover`; focus 2px ink outline offset 3px; active `--c-ink-2`;
  disabled `--c-disabled-bg` fill, `--c-disabled` border, `--c-ink-3` text.
- **Button (quiet)**: transparent, ink text, 1px `--c-rule` border; hover border ink.
- **Link**: ink, 1px underline offset 4px; hover thickness 2px; focus as button.
- **Match table**: surface, 1px rule border, header rule in ink, a rule on every row.
- No cards, no badges, no inputs on this page.
