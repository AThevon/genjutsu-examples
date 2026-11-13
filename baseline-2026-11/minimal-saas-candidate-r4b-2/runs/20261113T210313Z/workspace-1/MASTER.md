# Ploverdesk &#8212; design system (MASTER)

Single source of truth for the landing page. Every value in `src/tokens.css` comes from here; every
rule in `src/index.css` reads a token.

Status: written in a headless run. The theses below were **not validated by a person**.

## Theses (UNVALIDATED)

**Visual thesis:** A cool white page laid out like an auditor's tie-out sheet: three documents set
side by side in columns tied by hairline rules, near-black ink in the system sans at two weights
with tabular figures, and one hue only, a vermilion that marks a mismatch and nothing else, because
the page gives colour to the same thing the product shows a person. The action is solid ink, never
the signal colour; corners nearly square, flat, no shadows; an airy page around one dense table.

**First screen:** headline and the trial action at reading measure on the left; on the right,
taking the rest of the width and whole before any scroll, a sample tie-out labelled "Example":
rows for the three kinds of mismatch the brief names (quantity, unit price, a delivery that never
arrived), columns Purchase order, Delivery note, Invoice, Outcome. Only the disagreeing cell is
vermilion; one grey closing row says every other line agreed and went to payment approval. No
figures: the cells hold the brief's own words. On the narrowest frame each row becomes a block,
each value beside its column name.

**Interaction thesis:** Fast and dry: 140ms colour and background transitions on
`cubic-bezier(0.2, 0, 0, 1)`, on hover and focus only; nothing moves on scroll; no reveals,
parallax, scale, bounce, loops or counting numbers.

**The one motion:** none. The table states the idea at rest: matched work folded into one grey
row, the only colour on the page sitting on the exceptions.

**Allowed patterns:** hairline rules (the tie-out grid, ruled rows included); the sample tie-out
table, labelled as an example; one hue, vermilion, as the mismatch signal only; tabular figures;
the founding year 2025 and "six people in Rotterdam", stated once in the footer because they are
the brief's own facts.

Set aside: SaaS hero with a dashboard screenshot, logo strip and feature cards; a blank page with
one sentence and a button; a ledger / spreadsheet grid; the invoice as a paper document. Kept: the
auditor's tie-out sheet.

Assumptions (from the brief, nobody to ask): audience is finance leads at mid-size wholesalers;
mood is quiet, exact, restrained; no references; English copy.

## Dials sent to the lookup

| Dial | Value | From the thesis clause |
|---|---|---|
| variance | 3 | "left-aligned, flat, corners nearly square" |
| motion | 1 | "fast and dry ... nothing moves on scroll" |
| density | 4 | "an airy page around one dense table" (label only on this path; scale below set by hand) |

Lookup kept: light mode, cool slate neutrals, ink focus ring, no dark default.
Lookup dropped: navy + blue CTA, Plus Jakarta Sans (Google Fonts), 900-weight oversized type,
GSAP scroll reveal, `#DC2626` destructive red.

## Colour

| Token | Hex | Job | Contrast on `--c-ground` |
|---|---|---|---|
| `--c-ground` | `#FFFFFF` | page ground | |
| `--c-surface` | `#F5F6F7` | row hover, price block | |
| `--c-ink` | `#16191D` | text, headings, the action (filled button) | 17.63:1 |
| `--c-ink-hover` | `#2C3138` | button hover | |
| `--c-ink-2` | `#4A5058` | secondary text, column labels | 8.14:1 |
| `--c-ink-3` | `#646A72` | "agrees" cells, notes | 5.46:1 (5.05:1 on surface) |
| `--c-rule` | `#DCDFE3` | hairlines only, never a control boundary | 1.34:1 (decorative) |
| `--c-signal` | `#B23A1C` | **mismatch only** | 5.97:1 (5.31:1 on tint) |
| `--c-signal-tint` | `#FBEFEC` | ground of a mismatch cell | |
| `--c-on-ink` | `#FFFFFF` | text on the button | 17.63:1 |
| `--c-disabled` | `#8A9097` | disabled text (exempt from 4.5:1) | 3.22:1 |

Colour roles: the action is ink; the signal (mismatch) is vermilion; they never share a mark.
No semantic success / warning / info colours: the page has no such states, and adding green for
"matched" would put a second hue on work the product deliberately keeps out of sight.

## Typography

- Stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
  Reason: a page selling EU-hosted finance software makes no third-party font request, and the
  voice comes from size contrast, two weights and tabular figures rather than a display face.
- `font-variant-numeric: tabular-nums` on the whole page.
- Weights: 400 body, 600 headings, labels, the price, the button.

| Token | Size | Line-height | Use |
|---|---|---|---|
| `--t-display` | `clamp(2.25rem, 1.6rem + 2.2vw, 3.25rem)` | 1.08, tracking -0.02em | h1 |
| `--t-h2` | `1.75rem` | 1.2, tracking -0.01em | section headings |
| `--t-lead` | `1.1875rem` | 1.5 | hero sub-line |
| `--t-body` | `1rem` | 1.55 | body |
| `--t-small` | `0.875rem` | 1.45 | notes, footer |
| `--t-label` | `0.8125rem` | 1.3 | column labels |
| `--t-price` | `2.5rem` | 1 (`--lh-tight`) | the one price |

Measure: running text `--measure: 36rem`.

## Spacing (base 4px)

`--s-1 4px`, `--s-2 8px`, `--s-3 12px`, `--s-4 16px`, `--s-5 24px`, `--s-6 32px`, `--s-7 48px`,
`--s-8 64px`, `--s-9 96px`, `--s-10 128px`.

Layout: one container, `--container: 72rem`, side gutter `--gutter: clamp(20px, 4vw, 40px)`,
`--target-min: 44px` for every tap target, `--label-col: 8.5rem` for a label beside its value
(price terms; tie-out cells on narrow frames). Breakpoints (literal in media queries, CSS cannot
read tokens there): `40rem` narrow, `48rem` flow rows go two-column, `68rem` hero 5/7 split and
price block three-column.
Every section starts on the container's left edge. Wide frame (>= 64rem): hero is a 5/7 split,
the tie-out takes the 7. Below 64rem everything stacks on the same left edge. Below 40rem the
tie-out table turns into one block per row, each value under its column name.

## Radii, shadows

`--r-0 0`, `--r-1 2px` (button, focus ring). No other radius. Shadows: none, at every level; the
page is flat, separation comes from hairlines.

## Motion

| Token | Value |
|---|---|
| `--m-fast` | `140ms` |
| `--m-ease` | `cubic-bezier(0.2, 0, 0, 1)` |

Animated properties: `color`, `background-color`, `text-decoration-color`, `outline-color` only.
`prefers-reduced-motion: reduce` sets every transition duration to 0; states still change.

## Base components

- **Button (primary):** ink fill, `--c-on-ink` text, 600, padding `--s-3 --s-5`, radius `--r-1`.
  Hover `--c-ink-hover`; focus 2px ink outline offset 3px; active `--c-ink-2`; disabled
  `--c-surface` fill, `--c-disabled` text, no pointer.
- **Link (quiet):** ink text, underline in `--c-rule` offset 3px; hover underline `--c-ink`;
  focus as button; active `--c-ink-2`.
- **Tie-out table:** labels `--t-label` 600 `--c-ink-2`; rows ruled by 1px `--c-rule`; agreeing
  cells `--c-ink-3`; mismatching cell `--c-signal` 600 on `--c-signal-tint`; exception rows carry a
  2px inset `--c-signal` bar at their start; the closing "every other line" row is all `--c-ink-3`.
- No cards, no badges, no inputs on this page.
