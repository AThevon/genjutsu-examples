# Ploverdesk - Design System (MASTER)

Single source of truth for the Ploverdesk landing page. Code tokens live in `src/tokens.css` and
mirror this file one to one. Any value not listed here does not belong in the code.

Status: the theses below were written in a session with nobody available to validate them.
They are **UNVALIDATED** until the founders read them.

## Theses

**Visual thesis.** A cool white page set in near-black ink, with grey for everything secondary.
There is exactly one colour, a burnt vermilion, and it marks only a mismatch, because the product
only shows a person the lines that don't match; the call to action is solid ink, not colour. One
face: the system sans (`system-ui` stack), at weights 400/500/600 with modest size contrast and
tabular figures for the price. No webfont request, because a page that promises EU-hosted data
shouldn't send its visitors' IPs to a third-party font host. Spacing is airy on an 8px base, in a
left-aligned single column with a reading measure of about 36rem. Components are flat, with a 2px
radius and no shadows: a filled ink button and a bordered secondary link.

**Interaction thesis.** Fast and dry: 140ms colour and background transitions on hover, with
`cubic-bezier(0.2, 0, 0, 1)`. The focus ring appears instantly. Nothing moves on scroll.
Forbidden: scroll reveals, parallax, entrance animations, scale or translate on hover, loops,
bounce. Under reduced motion every transition goes to 0ms.

**Allowed patterns:** hairline rules between the rows of the mismatch table (the visitor reads
across its columns); one hairline under the header; the founding year 2025 and "six people in
Rotterdam", both stated by the founders.

### Assumptions made in place of the brainstorm (nobody was available to answer)

- A1 Product: what is true of Ploverdesk and of no template is that it shows a person only the
  lines that do not match. The page states this, and colour is spent only on mismatches.
- A2 Audience: finance leads and AP managers at mid-size wholesalers. They read tables daily,
  distrust marketing language, and buy on behalf of a company. Price and data location in plain view.
- A3 Mood: quiet, precise, sober, legible, honest.
- A4 References: none given; none suggested.
- A5 Stack: React 19 + Vite 8, plain CSS custom properties, no animation library (scan).
- A6 No product screenshot exists, and no figure may be invented, so the page shows no drawn
  product UI and no example numbers. The three mismatch types are described in words.

### Dials (sent to the design-system lookup)

| Dial | Value | From the clause |
|---|---|---|
| variance | 2 | "left-aligned single column", "components are flat" |
| motion | 1 | "Nothing moves on scroll", colour transitions only |
| density | 3 | "Spacing is airy on an 8px base" |

Lookup output kept: single-column pattern, single CTA focus, high-contrast ink button, ring = ink.
Dropped: navy + blue CTA palette (category default), Plus Jakarta Sans (reflex SaaS face and a
third-party request), "exaggerated minimalism" 900-weight display (fights modest size contrast),
GSAP scroll reveal (forbidden by the interaction thesis), centred CTA (thesis is left-aligned).

## Color

Light only. The product has no dark mode in the brief, and the page is read at a desk.

| Token | Hex | Role | Contrast on #FFFFFF |
|---|---|---|---|
| `--color-ground` | `#FFFFFF` | page background | - |
| `--color-surface` | `#F4F5F6` | quiet band (price section), secondary hover fill | - |
| `--color-ink` | `#16191C` | text, primary button fill, focus ring | 17.65:1 |
| `--color-ink-hover` | `#2E3338` | primary button hover | white on it 12.75:1 |
| `--color-ink-active` | `#000000` | primary button active | white on it 21:1 |
| `--color-on-ink` | `#FFFFFF` | text on ink | 17.65:1 |
| `--color-muted` | `#596067` | secondary text, table headers | 6.38:1 (5.84:1 on surface) |
| `--color-rule` | `#D9DCDF` | hairlines (decorative, carries no information alone) | 1.38:1 |
| `--color-border` | `#80868C` | secondary button boundary (UI boundary) | 3.68:1 (3.37:1 on surface) |
| `--color-signal` | `#B03A0E` | **mismatch only.** Never on CTAs, links or decoration | 6.07:1 |
| `--color-disabled` | `#A3A8AD` | disabled control text/border | 2.4:1 (disabled controls are exempt from WCAG 1.4.3) |

Semantic: the only semantic colour is `signal` (a mismatch). "Matched" is not coloured: it is
the ordinary state, shown in ink. No success green, no info blue.

## Typography

- Family: `--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- No webfont, no third-party font request (see visual thesis).
- Weights: 400 body, 500 labels / buttons / price, 600 headings.
- Figures: `font-variant-numeric: tabular-nums` on the price.

| Token | Size | Line height | Use |
|---|---|---|---|
| `--text-xs` | 0.8125rem | 1.45 | table head, footer |
| `--text-sm` | 0.875rem | 1.5 | small print under CTAs |
| `--text-base` | 1rem | 1.55 | body |
| `--text-lg` | 1.125rem | 1.55 | lead paragraph |
| `--text-h3` | 1.125rem | 1.35 | item titles (weight 600) |
| `--text-h2` | 1.5rem | 1.25 | section headings (weight 600) |
| `--text-price` | 2rem | 1.1 | price (weight 500, tabular) |
| `--text-display` | clamp(2.25rem, 1.55rem + 2.4vw, 3.25rem) | 1.1 | the one h1 (weight 600, letter-spacing -0.01em) |

Measure: `--measure: 36rem` for prose, `--measure-wide: 44rem` for the table,
`--label-col: 8rem` for the label column of the export/hosting facts.

## Spacing (8px base, 4px half-step)

`--space-1` 0.25rem (4) / `--space-2` 0.5rem (8) / `--space-3` 0.75rem (12) / `--space-4` 1rem (16) /
`--space-5` 1.5rem (24) / `--space-6` 2rem (32) / `--space-7` 3rem (48) / `--space-8` 4rem (64) /
`--space-9` 6rem (96) / `--space-10` 8rem (128)

- Page gutter: `--space-5` under 640px, `--space-7` above.
- Section rhythm: `--space-9` between sections under 640px, `--space-10` above.
- Container: `--container: 68rem`, content left-aligned inside it.

## Radii

`--radius-none: 0` / `--radius-sm: 2px` (buttons). Nothing larger, no pills.

## Shadows

Level 0 only: `--shadow-0: none`. The page is flat; separation is done by space and by the
two allowed hairlines.

## Motion

| Token | Value |
|---|---|
| `--dur-fast` | 140ms |
| `--ease-out` | cubic-bezier(0.2, 0, 0, 1) |
| stagger | none |

Animated properties: `background-color`, `border-color`, `color`, `text-decoration-color` only.
Reduced motion: `--dur-fast: 0ms`.

## Base components

**Button, primary** (`.btn .btn-primary`) - ink fill, on-ink text, 1px ink border, radius-sm,
padding `--space-3` `--space-5`, weight 500, text-base.
- hover: fill + border `--color-ink-hover`
- focus-visible: 2px solid `--color-ink` outline, 2px offset, no transition
- active: fill + border `--color-ink-active`
- disabled (`aria-disabled="true"`): ground fill, `--color-disabled` text and border, no pointer

**Button, secondary** (`.btn .btn-secondary`) - transparent, ink text, 1px `--color-border`.
- hover: border `--color-ink`, fill `--color-surface`
- focus-visible: same ring as primary
- active: fill `--color-rule`
- disabled: `--color-disabled` text and border

**Text link** (`.link`) - ink, underline at 1px, offset 0.2em, decoration `--color-border`.
- hover: decoration `--color-ink`; focus-visible: ring; active: `--color-muted` text; disabled: n/a.

**Mismatch table** - full-width up to `--measure-wide`, header row in muted text-xs weight 500,
a `--color-rule` hairline under each row, first column in `--color-signal` weight 500.

**Card, input, badge** - not used on this page; none defined. Add here before adding to the code.

## Copy rules

- One call to action, one label everywhere: **Start the 14-day trial** -> `/trial`.
- One quieter link, one label: **Book a demo** -> `/demo`.
- No figures other than: 290 EUR, per month, per company; 14-day; 2025; six people; three-way.
- No customer logos, testimonials, usage numbers, or invented names.
- No em dash in visible copy.
