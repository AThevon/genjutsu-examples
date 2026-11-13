# Ploverdesk - Design System (MASTER)

Single source of truth for the landing page. Every value in `src/` comes from the tokens below,
implemented in `src/tokens.css`.

Status: written in a headless session. Both theses are **UNVALIDATED**: no one was available to approve them.

## Theses

**Visual thesis.** A cool white working paper in near-black ink. A deep petrol blue marks only the
action (start the trial), and a single vermilion marks only a value that does not match. Matched
lines recede to grey. Everything is set in the system sans, chosen because it ships tabular figures
and costs no third-party request, so the voice comes from aligned numbers rather than a display
face. A 4px base, airy, one 12-column grid with one left edge, running text at 60ch, tables as wide
as their columns. Sharp 2px corners, 1px hairlines, flat, no shadows.

First screen: beside the headline and the trial action, one example invoice reconciled line by line
against its purchase order and delivery note. It is labelled as an example, with illustrative values.
Matched lines are grey, and the three exceptions are vermilion and named in words (unit price differs,
quantity differs, not delivered). Wide frame: text 5 columns, example 7 columns, both visible before
any scroll at 1280x720. Narrowest frame (360px): each line becomes a block, and every value sits
beside its label (Ordered / Delivered / Invoiced). At rest it already shows the idea.

**Interaction thesis.** Fast and dry: 120-180ms, `cubic-bezier(0.2, 0, 0, 1)`. Hover shifts colour
and thickens link underlines. Nothing moves on scroll. Forbidden: scroll reveals, parallax, scale on
hover, bounce, loops, counting numbers, gradients, shadows.

The one motion: the toggle "Hide matched lines" on the example. The matched rows fade out (160ms)
and are then removed, leaving only the exceptions, which is what Ploverdesk does. Before it runs, and
if it never runs, all lines are visible with the matched ones dimmed. Under reduced motion the swap
is instant.

Allowed patterns: hairline rules on the example's rows (the reader has to follow a line across three
sources), tabular figures, an example invoice with illustrative values labelled as an example, and the
founding year and team size, which come from the brief and are stated as plain facts.

Set aside: SaaS hero with a dashboard screenshot, a logo strip and pricing tiers; an empty page with a
single sentence; the accounting ledger; the paper invoice. Kept: the auditor's tick-and-tie working
paper.

Assumptions, made from the brief because no one could answer: the audience is finance leads and
accounts-payable staff; the mood is quiet, exact, auditable; no references; no web font (there is no
network, and no third-party request was agreed to). The brief says to invent no figure. The example
invoice's quantities and prices are illustrative values, labelled as such on the page. They are not
customer data and make no claim about the product's performance.

## Dials (sent to search.py)

| Dial | Value | From the thesis clause |
|---|---|---|
| variance | 2 | "one 12-column grid with one left edge ... flat" |
| motion | 2 | "fast and dry ... nothing moves on scroll" |
| density | 3 | "airy ... running text at 60ch" |

What the dataset proposed and what was kept: kept its cool slate neutral family and the idea of a
single red reserved for errors. Dropped Plus Jakarta Sans (not named in the thesis, and a third-party
request), the 900-weight oversized type (the heavy-grotesque reflex), the GSAP scroll reveal (the
thesis forbids scroll reveals) and the sky-blue CTA (replaced by the thesis's petrol blue).

## Colour

| Token | Hex | Job | Contrast |
|---|---|---|---|
| `--c-ground` | `#FAFBFC` | page ground | - |
| `--c-surface` | `#FFFFFF` | the example sheet | - |
| `--c-ink` | `#0E1621` | headings, body, figures | 17.5:1 on ground |
| `--c-ink-2` | `#46505C` | secondary text, labels | 7.9:1 on ground |
| `--c-ink-quiet` | `#6A737E` | matched lines (they recede) | 4.6:1 on ground, 4.8:1 on surface |
| `--c-rule` | `#DDE2E7` | hairlines (decorative separation only) | - |
| `--c-rule-strong` | `#8C96A1` | boundary of the secondary control | 3.0:1 on surface |
| `--c-action` | `#0B4F5C` | the trial action, links, focus ring. Action only | white on it 9.2:1 |
| `--c-action-hover` | `#083B45` | hover on action | white on it 12.2:1 |
| `--c-action-active` | `#062D35` | pressed action | - |
| `--c-on-action` | `#FFFFFF` | text on action | - |
| `--c-signal` | `#B3321A` | a value that does not match. Signal only, never an action | 6.2:1 on surface, 5.5:1 on tint |
| `--c-signal-tint` | `#FBEEEA` | ground of an exception row | ink on it 16.0:1 |

Colour is never the only indicator: each exception also carries its reason in words.
No dark theme (the brief does not ask for one).
Semantic success, warning and info colours are not needed on this page and are not defined.

## Typography

Font stack, `--font-sans`: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
All four main faces ship tabular figures (`font-variant-numeric: tabular-nums`), which the example relies on.

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `--fs-display` | `clamp(2rem, 1.5rem + 1.8vw, 2.625rem)` | 1.15 | 500 | the one h1 |
| `--fs-h2` | `1.5rem` | 1.25 | 500 | section heads |
| `--fs-h3` | `1.0625rem` | 1.4 | 600 | step titles |
| `--fs-lead` | `1.1875rem` | 1.5 | 400 | hero sub |
| `--fs-body` | `1rem` | 1.6 | 400 | running text |
| `--fs-small` | `0.875rem` | 1.5 | 400/500 | table, labels, notes |

Letter spacing is never changed. Weights used: 400, 500, 600. Measure: `--measure: 60ch`.

## Spacing (4px base)

`--s-1` 4px, `--s-2` 8px, `--s-3` 12px, `--s-4` 16px, `--s-5` 24px, `--s-6` 32px, `--s-7` 48px,
`--s-8` 64px, `--s-9` 96px, `--s-10` 128px.

Layout: `--page-max` 1200px, `--gutter` 24px (16px under 640px), 12 columns. Every section starts at
the same left edge (column 1). Sections are separated by `--s-9` (`--s-8` under 640px).

## Radii

`--r-0` 0, `--r-1` 2px. Nothing larger.

## Shadows

None. Elevation level 0 only. Separation comes from hairlines and the surface/ground step.

## Motion

| Token | Value |
|---|---|
| `--dur-fast` | 120ms (colour on hover) |
| `--dur-base` | 160ms (the matched-line fade) |
| `--dur-slow` | 180ms (underline thickness) |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` |

No stagger. Under `prefers-reduced-motion: reduce`, every duration is 0.

## Base components

- **Primary button (link to /trial):** `--c-action` fill, `--c-on-action` text, `--fs-body` 500,
  padding `--s-3` `--s-5`, radius `--r-1`, min height 44px. Hover: `--c-action-hover`.
  Active: `--c-action-active`. Focus: 2px `--c-action` outline at 3px offset. Disabled is never
  rendered (links are always live), but it is styled for the toggle: `--c-ink-quiet` text, no pointer.
- **Quiet link (to /demo):** `--c-action` text, 1px underline at 0.2em offset. Hover: underline
  2px, `--c-action-hover`. Focus as above.
- **Secondary control (toggle):** `--c-surface` fill, 1px `--c-rule-strong` border, `--c-ink`
  text, `--fs-small` 500, radius `--r-1`, min height 36px (44px touch area via padding). Hover:
  border `--c-ink-2`. Pressed (`aria-pressed=true`): border and text `--c-ink`, ground `--c-ground`.
- **Card:** none. The page uses hairlines, not cards.
- **Badge:** none, except the exception reason, which is set as text in `--c-signal` with no fill.
