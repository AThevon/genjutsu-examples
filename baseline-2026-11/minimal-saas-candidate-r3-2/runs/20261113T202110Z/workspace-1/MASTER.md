# Ploverdesk - Design System (MASTER)

Single source of truth for the landing page. Every value in `src/tokens.css` comes from here.
Status: **UNVALIDATED** - written in a headless session with nobody to approve the theses.

## Theses

**Visual thesis:** A cool white page set in graphite ink, flat and hairline-ruled like an
auditor's working paper. One near-black marks the action (the trial button); one audit red is used
for nothing except a line that does not match. The type is the system sans with tabular figures,
because the product's voice is its numbers lining up. The first screen is a three-way match of one
example invoice, at rest: matched lines receded to grey, exceptions in full ink with the differing
value in red.

**Interaction thesis:** Fast and dry (120-240ms, `cubic-bezier(0.2, 0, 0, 1)`): hovers change only
a background or an underline in 120ms, scroll does nothing, and the one motion is the match
itself. On first paint the matched lines settle from full ink to grey (240ms each, 60ms stagger,
after 400ms), so the exceptions are what stay. If it never runs, or with reduced motion, the
resting state is already the end state. Forbidden: scroll reveals, parallax, scale on hover,
bounce, looping animation, counters, shadows, gradients, glass.

**Allowed patterns:** hairline rules (the table rules of a working paper); tabular figures; one
table as the hero object, labelled as an example; the system font stack.

Set aside: SaaS hero with a dashboard mock, icon cards and a logo strip; an empty white page of
oversized type; the accounting ledger; the invoice PDF. Kept: the auditor's tick-and-tie.

**Assumptions made from the brief (nobody to ask):** audience is a finance lead or AP manager at
an EU mid-size wholesaler; no references; light mode only (a marketing page read in office
daylight, no dark mode requested); English copy; the example invoice is illustrative, not
customer data, and says so on the page.

## Colour

| Token | Hex | Job | Contrast |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | page ground | - |
| `--color-surface` | `#F5F6F7` | quiet hover fill, terms band | - |
| `--color-line` | `#DADDE1` | hairline rules (decorative, not UI boundaries) | 1.4:1 |
| `--color-line-strong` | `#8A9097` | input and secondary button borders | 3.2:1 on bg |
| `--color-ink` | `#15171A` | text, headings, the action (primary button fill) | 18.0:1 on bg, 16.6:1 on surface |
| `--color-ink-hover` | `#2B2F35` | primary button hover | white on it 13.5:1 |
| `--color-ink-muted` | `#5C636B` | matched lines, labels, secondary text | 6.1:1 on bg, 5.6:1 on surface |
| `--color-signal` | `#B42318` | a mismatch, and only a mismatch | 6.6:1 on bg, 6.1:1 on surface |
| `--color-on-ink` | `#FFFFFF` | text on the primary button | 18.0:1 |

Action and signal are deliberately separate. Red never appears on a button, link or heading.
Semantic success/warning/info are not defined: the page has no such states. A matched line is
"success" and uses `--color-ink-muted`, because on this page matching is the quiet case.

## Typography

- Stack: `--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
  No web font: no font request leaves the page (consistent with the EU-hosting promise), and the
  system face is what the reader's own finance tools use. The voice comes from tabular figures,
  weight contrast and the table.
- Figures: `font-variant-numeric: tabular-nums` on every figure.

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `--text-display` | `clamp(2rem, 1.5rem + 2vw, 3rem)` | 1.12 | 600 | h1 |
| `--text-h2` | `1.5rem` | 1.25 | 600 | section headings |
| `--text-lead` | `1.125rem` | 1.5 | 400 | hero sub-copy |
| `--text-body` | `1rem` | 1.5 | 400 | running text |
| `--text-table` | `0.9375rem` | 1.4 | 400 | match table |
| `--text-small` | `0.8125rem` | 1.4 | 500 | column headers, example label |

Weights: `--weight-regular 400`, `--weight-medium 500`, `--weight-bold 600`. Letter-spacing: `-0.01em` on h1 only.

## Spacing (4px base)

`--space-1 4px`, `--space-2 8px`, `--space-3 12px`, `--space-4 16px`, `--space-6 24px`,
`--space-8 32px`, `--space-12 48px`, `--space-16 64px`, `--space-24 96px`.

Layout extras: `--measure-display 28ch` (h1), `--term-label 10rem` (terms label column),
`--target-min 44px` (touch target), `--hairline 1px`, `--focus-width 2px`, `--focus-offset 2px`,
`--underline-offset 3px`.

Layout: `--container 1120px`; side padding `--space-4` below 720px, `--space-12` above. One left
edge for every section. Running text at `--measure 62ch`. The match table takes the container
width, set by its five columns. Section rhythm: `--space-24` between sections wide, `--space-16` narrow.

## Radii

`--radius-none 0`, `--radius-sm 2px` (buttons, inputs), `--radius-md 4px` (reserved). No pills, no full radii.

## Elevation

Flat. Levels 0-4 all resolve to `none`; separation is done by hairlines (`--color-line`) and the
`--color-surface` band. No shadows anywhere.

## Motion

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | `120ms` | hover, focus, active |
| `--dur-settle` | `240ms` | one matched line settling to grey |
| `--stagger` | `60ms` | between matched lines |
| `--delay-settle` | `400ms` | before the first line settles |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | everything |

Animated properties: `color`, `background-color`, `text-decoration-color` only. Reduced motion:
the settle animation is removed; the resting state is the end state.

## Base components

- **Button primary** (`.btn-primary`): ink fill, white text, `--radius-sm`, padding `--space-3 --space-6`, 500 weight.
  - default: bg ink / text on-ink
  - hover: bg ink-hover
  - focus-visible: `outline: 2px solid var(--color-ink); outline-offset: 2px`
  - active: bg ink, `translate` none, text underlined (no scale - forbidden)
  - disabled: bg `--color-line`, text `--color-ink-muted`, cursor not-allowed
- **Link quiet** (`.link`): ink text, underline 1px `--color-line-strong`, offset 3px. Hover: underline `--color-ink`. Focus: same outline as button. Active: `--color-ink-muted`.
- **Card**: none. The page has no cards.
- **Badge**: the "Example" label only - small text, muted, no fill, no border.
- **Input**: not used on this page (the trial form lives at /trial).
- **Table** (`.match`): header row 1px ink rule, body rows 1px `--color-line`, figures right-aligned and tabular.
  Narrow (< 720px): each row becomes a block; each value shows its own label beside it.
