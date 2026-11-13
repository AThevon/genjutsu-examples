# Ploverdesk - Design System (MASTER)

Single source of truth. Every value in `src/` comes from `src/tokens.css`, which mirrors this file.

Status: theses **UNVALIDATED** (headless run, no human at the gates).

## Theses

**Visual thesis.** White ground, near-black ink, cool neutral greys and hairline rules, one ultramarine accent (`#2839C8`) used only for a discrepancy and for the trial action. Type is the system sans: no web face may be requested in this project, and the voice comes from tabular figures and strict right-aligned columns, the way finance teams read. Big size contrast between one headline and small, dense data. 8px base; airy around prose, tight inside the sheet. Every section starts from the same left edge of a 1120px container, prose held at 60ch. Sharp (2px radius), bordered, flat, no shadows.
First screen: under the headline, an example invoice laid out as a three-way sheet (invoice / purchase order / delivery note) takes the full container width. Matched lines are muted, the three exceptions stay in ink with the differing cell in the accent. Labelled as an example. Narrow frame: each line stacks; exceptions keep their three values side by side.

**Interaction thesis.** Fast, 120-200ms, `cubic-bezier(0.2, 0, 0, 1)`. Hover changes colour or underline only (120ms), no transform. Scroll does nothing. Forbidden: scroll reveals, parallax, bounce, scale on hover, loops, autoplay. The one motion: "Run the match again" resets the sheet and resolves rows in order (60ms stagger, 160ms per status). The resting state is the resolved sheet. Reduced motion: instant resolution. "Show exceptions only" hides matched rows instantly.

Allowed patterns: hairline rules (sheet rows and section dividers, because the reader tracks across columns); tabular figures; a status label column in the sheet.

Set aside: SaaS hero + screenshot + logo bar + icon grid; blank one-sentence page; product dashboard UI; Swiss-bank navy. Kept: the three-way reconciliation sheet.

Amendment from Phase 3: matched rows use `--color-text-muted` (#6B717C, 4.91:1), not a fainter grey, so they stay readable.

## Dials (sent to search.py)

- variance 2: "every section starts from the same left edge", "sharp, bordered, flat"
- motion 2: "fast, 120-200ms", "scroll does nothing"
- density 4: "airy around prose, tight inside the sheet" (label only; spacing scale below set by hand)

## Color

| Token | Hex | Use | Contrast on #FFFFFF |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | page ground | - |
| `--color-surface` | `#F5F6F8` | active ground of the secondary button | ink 16.61:1 |
| `--color-ink` | `#15171A` | text, headline | 17.96:1 |
| `--color-text-secondary` | `#4A505B` | body prose | 8.11:1 |
| `--color-text-muted` | `#6B717C` | labels, matched rows | 4.91:1 (4.54:1 on surface) |
| `--color-rule` | `#E2E5E9` | hairlines (separators, not UI boundaries) | 1.26:1 |
| `--color-border-control` | `#8A909A` | secondary button / checkbox boundary | 3.21:1 |
| `--color-accent` | `#2839C8` | discrepancy, primary action | 8.37:1 |
| `--color-accent-strong` | `#1F2DA3` | primary action hover/active | white on it 10.7:1 |
| `--color-accent-wash` | `#EEF0FB` | background of a discrepant cell | accent on it 7.37:1 |
| `--color-on-accent` | `#FFFFFF` | text on primary action | 8.37:1 |
| `--color-disabled` | `#C9CDD3` | disabled control ground | - |

No semantic success/warning/error palette: the page has no form and no error state. "Matched" is told by muted ink plus a label, a discrepancy by accent plus a label, never by colour alone.

## Typography

- Stack: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. No web font is requested.
- Figures: `font-variant-numeric: tabular-nums` on the whole page; numbers right-aligned in columns.
- Scale (rem): `--text-xs .8125` (13px) · `--text-sm .875` (14px) · `--text-base 1` (16px) · `--text-lg 1.125` (18px) · `--text-xl 1.5` (24px) · `--text-display clamp(2rem, 1.2rem + 3.2vw, 3.25rem)`.
- Weights: 400 body, 500 labels/buttons, 600 headline and discrepancies. Nothing heavier.
- Line-height: 1.1 display, 1.3 headings, 1.55 prose, 1.4 sheet.
- Tracking: display `-0.02em`; all else 0.
- Measure: `--measure 60ch` for prose, `--measure-display 18ch` for the headline.
- Touch target: `--target-min 44px` for every button and link that stands alone.
- Breakpoints: 640px (gutter and section padding), 720px (sheet stacks into blocks; header and price stack).

## Spacing (8px base)

`--space-1 4px` · `--space-2 8px` · `--space-3 12px` · `--space-4 16px` · `--space-5 24px` · `--space-6 32px` · `--space-7 48px` · `--space-8 64px` · `--space-9 96px`

Layout: `--container 1120px`, `--gutter` 24px (16px under 640px). One left edge for every section. Section padding `--space-9` vertical on wide, `--space-7` on narrow.

## Radii

`--radius-none 0` · `--radius-sm 2px` (buttons, sheet, inputs). Nothing rounder.

## Shadows

None. Elevation level 0 only. Separation is done with hairlines.

## Motion

| Token | Value |
|---|---|
| `--dur-hover` | 120ms |
| `--dur-status` | 160ms |
| `--dur-max` | 200ms |
| `--stagger` | 60ms |
| `--ease` | `cubic-bezier(0.2, 0, 0, 1)` |

The one motion: on "Run the match again" the sheet drops to its unchecked state at once, holds for `--dur-max`, then each row resolves after `--dur-max + index × --stagger`, over `--dur-status`.

Properties animated: `color`, `background-color`, `border-color`, `opacity`. Never layout properties, never transforms on hover.
Reduced motion: every duration goes to 0, stagger to 0.

## Base components

- **Primary button** (`.btn-primary`): accent ground, white text, 2px radius, 12px 20px padding, 500 weight. Hover/active: accent-strong. Focus: 2px accent outline at 2px offset. Disabled: `--color-disabled` ground, ink text (#15171A on #C9CDD3 = 11.3:1), `cursor: not-allowed`.
- **Secondary button** (`.btn-secondary`): white ground, ink text, 1px `--color-border-control` border. Hover: border ink. Active: surface ground. Focus/disabled as above.
- **Quiet link** (`.link`): ink, underline 1px offset 3px in `--color-border-control`; hover underline ink. Focus outline accent.
- **Checkbox toggle**: native checkbox with `accent-color: var(--color-accent)`.
- **Sheet**: table, 1px ink top rule, hairline rows, header labels in muted 13px, numbers right-aligned, a status column. Discrepant value: `<mark>` on accent-wash, accent, 600. Under 720px each line becomes a block: matched = item + result; exception = item, three labelled values side by side, result.
- **Price panel**: 1px ink border, 2px radius, no fill.
- No cards, no badges, no inputs on this page.
