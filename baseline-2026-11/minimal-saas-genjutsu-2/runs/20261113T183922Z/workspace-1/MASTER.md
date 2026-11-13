# Ploverdesk landing page: design system

Single source of truth. Every value in `src/` comes from the tokens below, through
`src/tokens.css`. Nothing outside this file is a decision.

Status: **UNVALIDATED**. Written in a session where nobody could approve it; every brainstorm
answer below is an assumption drawn from the founders' brief.

## Theses

**Visual thesis.** A light, cool-white page in graphite ink, with one amber accent used only to
mark a mismatching value (never the CTA). No display face: the system sans throughout at weights
400 and 500, modest size contrast and tabular figures, chosen so the page makes no third-party
request, like a product that keeps data in Frankfurt. Airy 8px-based spacing in one
left-aligned reading column. Flat components: 1px borders, 2px radii, no shadows.

**Interaction thesis.** Fast, dry transitions of 120 to 160ms on `cubic-bezier(0.2, 0, 0, 1)`.
Hover changes colour and underline only, never scale or movement. Nothing moves on scroll.
Forbidden: scroll reveals, parallax, entrance animations, bounce, infinite loops, transforms
on hover.

**Allowed patterns:** hairline rules on the rows of the match table (the reader tracks across
document columns); one accent colour, on mismatch cells only; the founding year and city stated
as plain facts in the company section, as given in the brief.

### Assumptions (brainstorm answered from the brief)

- Product: what sets it apart is that a person sees only the lines that don't match. The page
  copies that: everything quiet, colour only where something disagrees.
- Audience: finance leads at mid-size wholesalers, precise readers who know the term three-way
  match and distrust marketing language.
- Mood: quiet, precise, sober, legible.
- References: none given; none suggested.
- Stack: React 19 + Vite, plain CSS, no animation library.

### Dials sent to the design-system lookup

| Dial | Value | From the thesis clause |
|---|---|---|
| variance | 2 | "one left-aligned reading column" |
| motion | 1 | "nothing moves on scroll", "colour and underline only" |
| density | 3 | "airy 8px-based spacing" |

Taken from the lookup: the cool slate neutral family and its pale border tone. Dropped: the
blue CTA (the navy-and-blue fintech default), Roboto via Google Fonts (a third-party request; the
thesis has no display face), 900-weight oversized type (the heavy-grotesque reflex), and the
GSAP scroll reveal (forbidden by the interaction thesis).

## Color

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--color-ground` | `#FBFCFD` | page background | |
| `--color-surface` | `#F1F3F6` | table header ground | |
| `--color-ink` | `#14181F` | text, primary button fill, focus ring | 17.32:1 on ground |
| `--color-ink-2` | `#4A5260` | secondary text, lead | 7.67:1 on ground |
| `--color-ink-3` | `#5F6775` | tertiary text, table headers | 5.55:1 on ground, 5.13:1 on surface |
| `--color-ink-hover` | `#2E3540` | primary button hover | white on it 12.36:1 |
| `--color-ink-active` | `#000000` | primary button active | |
| `--color-on-ink` | `#FFFFFF` | text on ink | 17.79:1 on ink |
| `--color-rule` | `#DCE0E6` | hairlines, link underline at rest | decorative, not a UI boundary |
| `--color-disabled` | `#8A939F` | disabled text | 3.03:1 (disabled state, exempt) |
| `--color-flag-ink` | `#8A4B00` | mismatch text and edge mark | 6.03:1 on flag ground |
| `--color-flag-ground` | `#FCF0DA` | mismatch cell ground | |

Semantic: the page has one semantic state, **flag** (a line that needs a person). No success,
warning, error or info colours exist, because the page has no form and no system state to
report. The flag is never colour alone: the cell text says what differs.

No dark theme. The brief gives no reason for one.

## Typography

Font stack, all text: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
(`--font-sans`). No web font is loaded and no font request leaves the page.

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `--text-sm` | 0.875rem | 1.5 | 400 | footnotes, table on narrow screens |
| `--text-base` | 1rem | 1.6 | 400 | body, table |
| `--text-lead` | 1.125rem | 1.6 | 400 | hero lead |
| `--text-h2` | 1.375rem | 1.3 | 500 | section headings |
| `--text-h1` | clamp(2rem, 1.4rem + 2.4vw, 2.75rem) | 1.15 | 500 | the one headline |
| `--text-price` | clamp(1.75rem, 1.4rem + 1.4vw, 2.25rem) | 1.2 | 500 | the price line, tabular figures |

Weights: `--weight-regular` 400, `--weight-medium` 500. Nothing heavier.
Headline tracking `--tracking-tight` -0.01em; everything else 0.
Figures: `font-variant-numeric: tabular-nums` wherever a figure appears.
Measure: body text capped at `--measure` 38rem.

## Spacing

Base unit 8px, with one 4px half step.

| Token | Value |
|---|---|
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-5` | 1.5rem (24px) |
| `--space-6` | 2rem (32px) |
| `--space-7` | 3rem (48px) |
| `--space-8` | 4rem (64px) |
| `--space-9` | 6rem (96px) |
| `--space-10` | 8rem (128px) |

Layout: `--column` 44rem (reading column), `--column-wide` 60rem (the match table), page gutter
`--space-5`. Facts term column `--facts-term` 8rem. Minimum touch target `--target-min`
2.75rem (44px) on the button and the demo link. One breakpoint, 40rem, written literally in media
queries because they cannot read custom properties. Section rhythm: `--space-9` between sections, `--space-10` above the first on wide
screens.

## Radii

| Token | Value |
|---|---|
| `--radius-none` | 0 |
| `--radius-sm` | 2px |

## Elevation

One level: 0. `--shadow-none: none`. Separation is done with `--color-rule` hairlines and
`--color-surface` grounds, never with shadows.

## Motion

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 120ms | link underline colour |
| `--dur-base` | 160ms | button background |
| `--ease-out` | cubic-bezier(0.2, 0, 0, 1) | every transition |

No delay, no stagger, no scroll-linked motion, no keyframes. Only `color`,
`background-color` and `text-decoration-color` transition. Under
`prefers-reduced-motion: reduce` the durations drop to 0ms: states swap instantly.

## Base components

**Primary button** (`.button`): the trial link, an `<a>` styled as a button.
- default: `--color-ink` fill, `--color-on-ink` text, `--weight-medium`, padding
  `--space-3` `--space-5`, `--radius-sm`, no border.
- hover: fill `--color-ink-hover`, `--dur-base` `--ease-out`.
- focus-visible: 2px solid `--color-ink` outline, offset 2px.
- active: fill `--color-ink-active`.
- disabled (`aria-disabled="true"`): fill `--color-surface`, text `--color-disabled`, no pointer.

**Text link** (`.link`): the demo link and inline links.
- default: `--color-ink` text, 1px underline in `--color-rule`, offset 0.25em.
- hover: underline `--color-ink`, `--dur-fast` `--ease-out`.
- focus-visible: 2px solid `--color-ink` outline, offset 2px, `--radius-sm`.
- active: text `--color-ink-2`.
- disabled (`aria-disabled="true"`): text `--color-disabled`, underline none.

**Match table** (`.match`): rows ruled with 1px `--color-rule`; header on `--color-surface`
in `--color-ink-3`, `--weight-medium`; a mismatch cell (`.match__flag`) on
`--color-flag-ground` in `--color-flag-ink`, with a 2px inset edge in `--color-flag-ink`.
Below 40rem each row is stacked, and each cell is labelled with its column name.

**Definition list** (`.facts`): term in `--color-ink-3`, definition in `--color-ink`, two
columns from 40rem, one column below.

No cards, inputs or badges: the page has none.
