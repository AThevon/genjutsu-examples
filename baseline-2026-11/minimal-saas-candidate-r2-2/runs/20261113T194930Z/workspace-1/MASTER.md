# Ploverdesk: design system (MASTER)

Single source of truth for the landing page. Code tokens live in `src/tokens.css` and mirror this file one to one.
Status: **UNVALIDATED**. Written in a session where no one could approve it; every choice below comes from the brief and is marked as an assumption in the thesis.

## Theses

**Visual thesis.** Ploverdesk looks like an auditor's reconciliation worksheet: a cool white ground, near-black ink, ruled with 1px hairlines. Exactly one accent, a burnt-orange exception mark, appears only where a line does not match, never on buttons or decoration. The type is the system sans with tabular figures, set at 400 and 600 only, with a moderate size contrast. There is no web face: the voice comes from the ruled check columns, and from tabular figures where a real figure exists (the price). Spacing is airy on an 8px base, and every section starts from the same left edge on a 12-column grid, with text held at about 60ch. Components are sharp (2px radius), bordered, flat and unshadowed.

**First screen.** The headline, one sentence and the trial button sit at reading measure on the left. The width belongs to a worksheet for one invoice, labelled as an illustrative example. Each line is checked against the purchase order (quantity, unit price) and the delivery note. Five lines carry quiet ticks, and on one line the delivery-note check is circled in the exception colour. At rest it already shows that only that one line needs a person. On a phone the worksheet sits under the CTA: matched lines shrink to one row each (item and result), and the exception line keeps its three checks (PO quantity / PO price / Delivery) whole.

*Amendment, made during implementation:* the first draft showed example quantities and prices. The brief says "invent no other figure", so the worksheet shows the checks (agrees / differs) and no invented numbers. Tabular figures remain for the one real figure, the price.

**Interaction thesis.** The motion is fast and dry: 120ms for colour changes on hover, 180ms for fades, all on `cubic-bezier(0.2, 0, 0, 1)`. On hover only colour and underline change, and nothing moves or scales. Nothing happens on scroll. Forbidden: scroll reveals, parallax, bounce or overshoot, scale on hover, loops, count-ups and staggers. The one motion is the worksheet's toggle, "Show exceptions only". Pressing it fades the matched lines out over 180ms, and the exception line then slides up into place over 240ms (FLIP, transform only). Before it runs, and if it never runs, all six lines are visible and the exception is already circled. With reduced motion, the toggle switches instantly.

**Allowed patterns:** hairline rules (the worksheet's ruling); tick marks and the circled exception mark (auditor's tick-and-tie); tabular figures (the price).

Set aside: SaaS routine (centred hero, dashboard screenshot in a browser frame, three icon cards, logo strip); its opposite (one huge sentence on a blank page); spreadsheet grid; bank statement. Kept: the auditor's tick-and-tie reconciliation worksheet.

## Dials (sent to search.py)

| Dial | Value | Clause |
|---|---|---|
| variance | 3 | "every section starts from the same left edge… sharp, bordered, flat" |
| motion | 2 | "fast and dry… nothing happens on scroll" |
| density | 3 | "airy on an 8px base" (spacing scale derived by hand below) |

## Color

| Token | Hex | Use | Contrast on #FFFFFF |
|---|---|---|---|
| `--color-ground` | `#FFFFFF` | page ground | n/a |
| `--color-surface` | `#F4F5F6` | worksheet header band, pressed state | n/a |
| `--color-rule` | `#DADDE1` | hairline ruling (decorative separation only) | 1.4:1, not a UI boundary |
| `--color-rule-control` | `#82898F` | borders of controls (UI boundary) | 3.54:1 (3.25:1 on surface; was #8C939B, 2.85:1 on surface, fixed at audit) |
| `--color-ink` | `#15191E` | text, primary button fill, focus ring | 17.65:1 |
| `--color-ink-hover` | `#2A3038` | primary button hover | 13.31:1 |
| `--color-ink-2` | `#4A525C` | secondary text | 7.92:1 |
| `--color-ink-3` | `#69717B` | matched lines, captions | 4.94:1 (4.53:1 on surface) |
| `--color-exception` | `#A63A12` | the exception mark and its figures, nothing else | 6.49:1 (5.84:1 on tint) |
| `--color-exception-tint` | `#FBF1EC` | background of the exception row | n/a |
| `--color-on-ink` | `#FFFFFF` | text on the primary button | 17.65:1 |

No dark mode: the worksheet is a light document by thesis.
Semantic colours: `--color-exception` is the only semantic colour. Success is shown by the tick in ink-3, never green.

## Typography

- Face: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. The thesis chooses the system face because nobody could approve a third-party font request; its voice comes from `font-variant-numeric: tabular-nums` on every figure.
- Weights: 400 (`--weight-regular`), 600 (`--weight-strong`). Nothing else.

| Token | Size | Line-height | Use |
|---|---|---|---|
| `--text-display` | `clamp(2rem, 1.4rem + 2.2vw, 3rem)` | 1.12 | h1 |
| `--text-h2` | `clamp(1.375rem, 1.2rem + 0.6vw, 1.75rem)` | 1.25 | section headings |
| `--text-figure` | `clamp(2.5rem, 1.9rem + 2.4vw, 3.5rem)` | 1 | the price |
| `--text-lead` | `1.1875rem` | 1.5 | hero sentence |
| `--text-body` | `1rem` | 1.6 | body |
| `--text-small` | `0.875rem` | 1.5 | table cells, captions |

Letter-spacing: `-0.01em` on display and figure only (`--tracking-tight`). Measure: `--measure: 60ch` for text, `--measure-display: 20ch` for the h1. Price figure line-height `--leading-figure: 1`. Link underline offset `--underline-offset: 0.2em`.

## Spacing (8px base)

`--space-1` 4px · `--space-2` 8px · `--space-3` 12px · `--space-4` 16px · `--space-5` 24px · `--space-6` 32px · `--space-7` 48px · `--space-8` 64px · `--space-9` 96px · `--space-10` 128px.
Section rhythm: `--space-9` between sections on wide frames, `--space-8` on narrow.

## Layout

- Container: `--container: 72rem`, inline padding `--space-5` (wide), `--space-4` (≤ 640px).
- Grid: 12 columns, gap `--space-5`. Every section starts at column 1, the same left edge.
- Text blocks: at most `--measure`.
- Breakpoints: narrow 640px, mid 960px (CSS media queries cannot read custom properties, so they use these literal values). The worksheet takes its stacked form at 960px, where eight columns stop fitting.

## Radii

`--radius-none` 0 · `--radius-sm` 2px (buttons, worksheet frame) · `--radius-full` 999px (only the circled exception mark).

## Shadows

None. Elevation is 0 everywhere; separation is done with hairlines.

## Motion

| Token | Value |
|---|---|
| `--dur-fast` | 120ms (hover colour, underline) |
| `--dur-normal` | 180ms (fade of matched lines) |
| `--dur-settle` | 240ms (FLIP of the exception line) |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` |
| stagger | none (forbidden) |

Reduced motion: every transition set to 0.01ms, and the toggle switches state with no fade and no FLIP.

## Base components

- **Primary button** (`.btn-primary`): ink fill, white text, 1px ink border, `--radius-sm`, padding `--space-3 --space-5`, min-height 44px. Hover: `--color-ink-hover`. Focus: 2px ink outline, 2px offset. Active: `--color-ink-2`. Disabled: `--color-ink-3` fill, cursor not-allowed.
- **Quiet button** (`.btn-quiet`): transparent, ink text, 1px `--color-rule-control` border. Hover: border ink. Focus: as above. Active: `--color-surface` fill. Disabled: ink-3 text, rule border.
- **Link** (`.link`): ink text, 1px underline in `--color-rule-control` at offset 0.2em. Hover: underline ink, 2px. Focus: outline. Active: ink-2.
- **Worksheet** (the card of this system): 1px `--color-rule` frame, `--radius-sm`, no shadow, header band in `--color-surface`.
- **Marks**: the tick is a 14px SVG stroke (`--mark-tick-size`) in `--color-ink-3`; the exception mark is an 18px circle (`--mark-exception-size`) with a 1.5px (`--mark-stroke`) `--color-exception` stroke. Meaning is also carried in text (Result column), never by colour alone.
- No input or badge on this page: none is needed.
