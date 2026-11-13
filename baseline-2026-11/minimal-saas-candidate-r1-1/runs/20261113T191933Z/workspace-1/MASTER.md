# Ploverdesk - MASTER design system

Single source of truth for the landing page. Every value in `src/styles/tokens.css` comes from here.
Status: **UNVALIDATED**. This was a headless run and nobody approved it.

## Theses

**Visual thesis.** A cool near-white page in near-black ink with a single color on it, a deep amber
used only to mark a line that does not match: on this page color means a mismatch, never brand or
decoration. Type is the system sans (no third-party font request, and SF Pro, Segoe UI and Roboto
all ship tabular figures), weights 400 and 500 only, moderate size contrast; the voice comes from
tabular figures lining up in columns. Spacing is on a 4px base, airy between sections and tight
inside the match table. Components are flat: hairline rules instead of boxes, 2px corners, no
shadows. Primary action filled in ink, the demo link as plain underlined text.
First screen: headline, one sentence and Start the 14-day trial at reading measure (34rem), and
below them, across the full container width, an illustrative three-way match of one example
invoice (labelled as an example): matched lines recede to grey, one quantity difference stays in
ink and amber.

**Interaction thesis.** Fast and dry: hovers are 150ms `cubic-bezier(0.2, 0, 0, 1)`, color or
underline only. Nothing moves on scroll. Forbidden: scroll reveals, parallax, bounce, scale on
hover, looping animation, gradients, counting numbers, entrance fade-ups. The one motion: on first
load, after 400ms, the matched rows of the hero table recede (opacity 1 to 0.64, 240ms each, 80ms
stagger) and their status reads Matched, leaving the mismatched line standing. Reduced motion: the
table renders in its final state.

**Allowed patterns:** hairline 1px rules (including on every row of the match table); tabular
figures; an illustrative three-way-match table in the hero, built as a real `<table>` and labelled
as an example; the single recede on load (runs once, never loops).

Set aside: SaaS routine (gradient hero, dashboard screenshot, logo strip, three feature cards);
its opposite, a text-only page with one giant headline; a product dashboard; a spreadsheet grid.
Kept: the three source documents (invoice, purchase order, delivery note) read line by line
against each other.

Assumptions (headless run): audience is the finance lead of a mid-size wholesaler; no network so
no web face; no figure except the brief's own and example quantities labelled as illustrative.

## Dials

| Dial | Value | From |
|---|---|---|
| variance | 3 | "flat, hairline rules, reading measure at the left" |
| motion | 2 | "fast and dry, nothing moves on scroll, one motion" |
| density | 4 | "airy between sections, tight inside the match table" |

## Color

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--color-bg` | `#FCFCFD` | page | |
| `--color-surface` | `#F3F4F6` | table head band | ink 16.29:1, ink-2 6.19:1 |
| `--color-ink` | `#15171C` | text, primary button | 17.49:1 on bg |
| `--color-ink-2` | `#565B66` | secondary text, captions | 6.64:1 on bg |
| `--color-rule` | `#DCDFE4` | hairlines only, never text | 1.30:1 (non-text, decorative separation) |
| `--color-flag` | `#8A4A06` | a value that does not match, nothing else | 6.69:1 on bg, 6.18:1 on flag-bg |
| `--color-flag-bg` | `#FBF2E4` | behind a mismatched value | |
| `--color-ink-hover` | `#2C3039` | primary button hover | bg on it 12.89:1 |
| `--color-ink-active` | `#3A3F4A` | primary button active | bg on it 10.29:1 |
| `--opacity-receded` | `0.64` | matched rows, final state | ink at .64 = #68696D, 5.35:1 on bg |

No dark mode: one light page, by thesis.

## Typography

Stack: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
No web face is requested. `font-variant-numeric: tabular-nums` on every figure.

| Token | Size | Line height | Weight |
|---|---|---|---|
| `--text-display` | `clamp(2rem, 1.4rem + 2.6vw, 2.75rem)` | 1.12 | 500, letter-spacing -0.01em |
| `--text-h2` | `1.5rem` | 1.25 | 500 |
| `--text-h3` | `1.0625rem` | 1.4 | 500 |
| `--text-body` | `1.0625rem` | 1.55 | 400 |
| `--text-small` | `0.9375rem` | 1.5 | 400 |
| `--text-caption` | `0.8125rem` | 1.45 | 400 |
| `--text-price` | `clamp(2.25rem, 1.8rem + 2vw, 3rem)` | 1 | 500 |

Reading measure `--measure: 34rem` for hero copy, `--measure-wide: 40rem` for prose.

## Spacing (4px base)

`--space-1` 0.25rem, `--space-2` 0.5rem, `--space-3` 0.75rem, `--space-4` 1rem, `--space-5` 1.5rem,
`--space-6` 2rem, `--space-7` 3rem, `--space-8` 4rem, `--space-9` 6rem.
Section rhythm: `--space-9` between sections (`--space-8` under 48rem). Table cells
`--space-3` x `--space-4`. Container `--container: 68rem`, gutter `clamp(1.25rem, 4vw, 2.5rem)`.
Tap target `--tap-min: 44px`. Match table `--table-min: 36rem`: below that width it scrolls inside its
own focusable region instead of squeezing the columns. Price line height `--leading-price: 1`.

## Radii, borders, shadows

`--radius-sm: 2px` (buttons, focus ring). Nothing rounder. `--border-hairline: 1px solid var(--color-rule)`.
Shadows: none. Elevation is not part of this system.

## Motion

| Token | Value |
|---|---|
| `--ease` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--dur-hover` | `150ms` |
| `--dur-recede` | `240ms` |
| `--delay-recede` | `400ms` |
| `--stagger` | `80ms` |

Properties animated: `opacity` (recede, status), `background-color` / `color` / `text-decoration-color`
(hovers only). Reduced motion: all animation removed, final state shown.

## Components

- **Button (primary)** - `<a>` to /trial. Ink fill, bg text, 2px radius, padding `--space-3` x `--space-5`,
  min-height 44px. Hover `--color-ink-hover`; active `--color-ink-active`; focus 2px ink outline,
  3px offset; disabled (`aria-disabled="true"`) surface fill, ink-2 text, no pointer.
- **Link (quiet)** - ink-2 text, underline in `--color-rule`, 0.2em offset. Hover: ink text, ink
  underline. Focus as button. Active: ink. Used for Book a demo.
- **Match table** - real `<table>`, caption, hairline under every row, surface band on head,
  tabular figures right-aligned. Mismatched value: flag on flag-bg, weight 500.
- **Ruled list** - rows separated by hairlines, term column + text column on wide screens.
- No cards, badges or icons.

## Copy rules

One call to action label everywhere: **Start the 14-day trial**. Secondary: **Book a demo**.
No em dashes. No invented names, figures, logos or quotes.
