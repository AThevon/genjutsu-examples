# Ploverdesk landing page: design system (MASTER)

Single source of truth. Every value in `src/` comes from `src/tokens.css`, which mirrors this file.
Status: **UNVALIDATED**. This was a headless run, so no reviewer approved the theses or this system.

## Theses

**Visual thesis.** A white page with graphite ink. The one image is an auditor's
three-way-match worksheet: tabular figures in the system sans, graphite tickmarks on every invoice
figure that ties, and a red pencil ring around each figure that does not. Red has one job: *this
line needs a person*. The action (start the trial) is solid ink, never red. The type is the
platform's system sans. No web face was approved and the build has no network, so the voice
comes from tabular figures, tight size steps and one weight change (400 / 600), not from a face.
Spacing is airy around a dense worksheet. Every section starts on the same left edge of one
1120px, 12-column container, and running text stops at 60ch. Components are sharp (2px radius)
and flat: no shadows, no gradients.

**First screen:** on a wide frame, the left 4 columns hold the headline, one paragraph, the
trial button, the demo link and the terms line. The right 8 columns hold an *example* invoice of
five lines, labelled as illustrative. Each line's quantity (invoice / order / delivered) and unit
price (invoice / order) sit side by side. Two lines tie and carry tickmarks. Three are ringed in
red, one each for a wrong quantity, a wrong unit price and a delivery that never arrived, and each
is named in words in a Result column. Below 720px the table becomes one block per line: name and
result on top, then each figure next to its label (Invoiced qty, Ordered, Delivered, Invoice
price, Order price). At rest, before any motion, the marks are already there.

**Interaction thesis.** Fast and dry. Hover changes colour or underline thickness in 160ms with
`cubic-bezier(0.2, 0, 0, 1)`: no lift, no scale, no shadow. Nothing moves on scroll.

**The one motion:** on first load the worksheet runs its match once. Row by row (300ms start,
90ms stagger), the tickmarks draw in (180ms) and each red ring draws around its figure (240ms,
120ms after its row's ticks). It takes about 0.9s in total and never loops. Before it runs, the
figures are on screen without marks. If it never runs, the marks are simply there. With
`prefers-reduced-motion: reduce`, no animation runs and the marks are present from the start.

**Allowed patterns:** auditor tickmarks and red rings on the example worksheet; one rule under
the worksheet header; tabular figures; a draw-in of those marks that plays once and does not
loop; an example worksheet built as a real `<table>` and labelled as an example. (The thesis is
unvalidated, so under `tells` these still count at audit and are reported, not waved through.)

**Forbidden:** scroll reveals, parallax, bounce or overshoot, scale on hover, shadows, gradients,
looping animation, counters, logo strips, testimonials, usage numbers, any figure not in the brief
outside the labelled example.

Set aside: hero + dashboard screenshot + logo strip + three feature cards + pricing tiers; the
bare centred one-liner; the accounting ledger; the bank statement. Kept: the auditor's
tickmarked worksheet.

## Dials (sent to search.py)

| Dial | Value | Thesis clause |
|---|---|---|
| variance | 2 | "sharp and flat, one container, one left edge" |
| motion | 2 | "fast and dry, nothing on scroll, one motion" |
| density | 4 | "airy around a dense worksheet" (label only, spacing set by hand below) |

Lookup result: kept the white ground, the 7:1+ dark action and the 150–300ms hover band. Dropped
Plus Jakarta Sans (a Google Fonts request nobody approved; "SaaS" summoned it), the navy + blue
CTA (the fintech reflex; the thesis's action is ink), the 900-weight oversized display, the GSAP
scroll reveal (forbidden) and the centred single-column pattern (the worksheet needs the width).

## Colour

| Token | Hex | Job | Contrast |
|---|---|---|---|
| `--c-ground` | `#FFFFFF` | page ground | - |
| `--c-sheet` | `#F5F6F7` | worksheet ground | - |
| `--c-ink` | `#15181B` | text, action button ground, focus ring | 17.8:1 on ground |
| `--c-ink-hover` | `#33393F` | action button hover | 11.7:1 white text on it |
| `--c-ink-active` | `#000000` | action button pressed | - |
| `--c-ink-2` | `#474E55` | secondary text | 8.4:1 on ground |
| `--c-ink-3` | `#5E666E` | labels, tickmarks, matched result | 5.8:1 ground, 5.4:1 sheet, 5.2:1 wash |
| `--c-rule` | `#8A9198` | the one header rule, UI boundaries | 3.2:1 ground (2.95:1 on sheet, where it is a non-UI header rule) |
| `--c-flag` | `#B3261E` | **exception only**: ring, result text | 6.5:1 ground, 5.8:1 on wash |
| `--c-flag-wash` | `#FBEEEC` | exception row ground | - |
| `--c-on-ink` | `#FFFFFF` | text on the action button | 17.8:1 |

There is no success green. A matched line recedes into graphite, because the product's stance is
that matched lines need nobody.

## Typography

Stack: `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
`font-variant-numeric: tabular-nums` on the whole page. Weights: 400 and 600 only.

| Token | Size | Line height | Use |
|---|---|---|---|
| `--t-display` | `clamp(2rem, 1.25rem + 2.2vw, 2.75rem)` | 1.1 | h1 (600, -0.02em) |
| `--t-h2` | `1.5rem` | 1.25 | section heads (600, -0.01em) |
| `--t-lead` | `1.125rem` | 1.55 | hero paragraph |
| `--t-body` | `1rem` | 1.5 | body |
| `--t-figure` | `0.9375rem` | 1.4 | worksheet figures |
| `--t-label` | `0.8125rem` | 1.35 | column labels, captions (600 for labels) |

## Spacing (base 4px)

`--s-1 4px` `--s-2 8px` `--s-3 12px` `--s-4 16px` `--s-5 24px` `--s-6 32px` `--s-7 48px`
`--s-8 64px` `--s-9 96px` `--s-10 128px`.
Container `--w-container 1120px`, gutter `--s-5`, side padding `--s-5` (`--s-4` below 480px).
Reading measure `--w-measure 60ch`. Section rhythm: `--s-10` between sections on wide, `--s-8`
on narrow.

## Radii, shadows

`--r-0 0`, `--r-1 2px` (buttons, worksheet). No shadows: elevation is 0 everywhere.

## Motion

| Token | Value |
|---|---|
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--d-hover` | `160ms` |
| `--d-tick` | `180ms` |
| `--d-ring` | `240ms` |
| `--d-stagger` | `90ms` |
| `--d-start` | `300ms` |
| `--d-ring-lag` | `120ms` (ring starts after its row's ticks) |

Other sizing tokens: `--h-control 44px` (touch target), `--stroke 1px`, `--stroke-mark 1.5px`,
`--focus-width 2px`, `--focus-offset 3px`, `--underline-offset 3px`.

## Components

- **Button (primary)**: ink ground, white 600 text, 44px min height, 0 20px padding, `--r-1`.
  Hover `--c-ink-hover`, active `--c-ink-active`, focus 2px ink outline offset 3px, disabled
  (`aria-disabled="true"`) `--c-sheet` ground with `--c-ink-3` text and no pointer.
- **Link (quiet)**: ink text, 1px underline offset 3px. Hover underline 2px, active `--c-ink-2`,
  focus as the button, disabled `--c-ink-3` with no underline.
- **Worksheet**: `<table>` on `--c-sheet`, one `--c-rule` line under the header and no row rules.
  Exception rows on `--c-flag-wash`.

## Breakpoints

`720px`: the worksheet becomes stacked blocks below it. `1024px`: the hero splits into 4 / 8
columns at and above it.
