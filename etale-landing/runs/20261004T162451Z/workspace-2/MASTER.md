# Étale - MASTER design system

Single source of truth for the Étale landing page. Every colour, size, space, radius and
motion value in `src/` comes from the tokens below, emitted as CSS custom properties in
`src/styles/tokens.css`. Status: theses **UNVALIDATED** (headless run, nobody answered).

## Theses

**Visual thesis.** A pre-dawn page on a near-black slate-green ground with cool off-white ink
and one signal amber kept for slack only (the slack markers and the beta button, nothing else).
The type is the iPhone's own system face (SF Pro through `system-ui`), because the page should
read like the app it sells: regular and semibold only, slack times set very large in tabular
figures over 17px body copy. Airy single column on an 8px base, with one dense, fully labelled
day chart. Flat components, 4px radii, 1px hairline rules like a printed tide table, no
shadows. New identity: no existing brand to preserve.

**Interaction thesis.** Still by design. One entrance: the day chart draws its tide line left
to right in 900ms, then its three slack markers fade in (240ms each, 120ms stagger), all on
`cubic-bezier(0.22, 1, 0.36, 1)`, once, the first time the chart enters the viewport. Hovers
are fast (150ms), colour and underline only, no scale, no lift. Nothing else moves on scroll:
no parallax, no looping wave, no bounce or spring, no counters ticking up. With reduced
motion everything is drawn at once.

**Allowed patterns:** hairline rules (the tide table), tabular figures at display size, a dark
ground, one entrance draw on the data chart.

Because the theses are unvalidated, `tells` counts every one of these anyway. Hairlines are
therefore kept to section separators, never on every row.

### Assumptions (brainstorm answered from the brief)

- Product: what no neighbour can claim is that slack comes from current predictions
  (SFB1204), not from high or low tide.
- Audience: year-round Aquatic Park swimmers, tide-literate, checking on an iPhone before dawn.
- Mood: still, exact, pre-dawn, plain-spoken.
- References: none given; the printed tide table they already use.
- Stack: React 19, Vite, TypeScript, plain CSS. No animation library, none to be added.

### Dials (sent to the design-system query)

| Dial | Value | Clause |
|---|---|---|
| variance | 3 | "single column" |
| motion | 2 | "one entrance ... nothing else moves" |
| density | 3 | "airy single column on an 8px base" |

## Colour

All ratios computed (WCAG 2.x) against `--color-ground` unless stated.

| Token | Hex | Role | Ratio |
|---|---|---|---|
| `--color-ground` | `#0D1412` | page background | - |
| `--color-surface` | `#131C19` | chart well | ink 14.25, muted 6.6 |
| `--color-ink` | `#E4EAE6` | body text, headings | 15.29 |
| `--color-ink-muted` | `#93A39D` | captions, axis labels, secondary text | 7.08 |
| `--color-rule` | `#2A3632` | section separators, chart gridlines (decorative) | 1.49 |
| `--color-tide` | `#5C6D67` | tide height line (graphic) | 3.41 |
| `--color-flood` | `#6FA59A` | flood bars and labels | 6.68 |
| `--color-ebb` | `#8E9BB0` | ebb bars and labels | 6.63 |
| `--color-slack` | `#F0C04A` | slack markers, slack figures, primary button | 10.96 |
| `--color-slack-hover` | `#F6D27A` | primary button hover | ground on it 12.81 |
| `--color-slack-active` | `#D9AC3E` | primary button active | ground on it 8.81 |
| `--color-on-slack` | `#0D1412` | text on the amber button | 10.96 |
| `--color-focus` | `#E4EAE6` | focus ring | 15.29 |

Semantic colours (success, warning, error, info) are not defined: the page has no form, no
state and no message to report. Add them here before anything needs them.

## Typography

- Family: `--font-sans: system-ui, -apple-system, "SF Pro Text", "Helvetica Neue", Arial, sans-serif`.
  The display face is the same system face (SF Pro Display on Apple devices). Reason: the
  visitors are on an iPhone, and the page reads like the app it sells. No web font, no network.
- Weights: `--weight-regular: 400`, `--weight-semibold: 600`. Nothing else.
- Numbers: `font-variant-numeric: tabular-nums` on every time, height and speed.

| Token | Value | Use |
|---|---|---|
| `--text-caption` | `0.875rem` (14px) | captions, sources |
| `--text-chart` | `0.75rem` (12px) | chart labels, at 1:1 scale inside the scrolling well |
| `--text-body` | `1.0625rem` (17px) | body |
| `--text-lead` | `1.25rem` (20px) | hero lead, list titles |
| `--text-h2` | `1.75rem` (28px) | section headings |
| `--text-h1` | `clamp(2.25rem, 6vw, 3.5rem)` | page heading |
| `--text-figure` | `clamp(4.5rem, 16vw, 8rem)` | the slack time |
| `--leading-tight` | `1.1` | h1, figure |
| `--leading-heading` | `1.25` | h2, lead |
| `--leading-body` | `1.55` | body |
| `--tracking-tight` | `-0.02em` | h1, figure |

## Spacing (8px base)

`--space-1: 0.25rem` (4) · `--space-2: 0.5rem` (8) · `--space-3: 1rem` (16) ·
`--space-4: 1.5rem` (24) · `--space-5: 2rem` (32) · `--space-6: 3rem` (48) ·
`--space-7: 4rem` (64) · `--space-8: 6rem` (96) · `--space-9: 8rem` (128)

Layout: `--measure: 38rem` (text column), `--page-max: 64rem`, `--label-col: 10rem` (time
ranges beside their values), `--chart-min-width: 46rem`, `--target-min: 2.75rem` (44px touch
target), gutter `--space-4` below
48rem and `--space-6` above. Sections are separated by `--space-8` (mobile `--space-7`).

Breakpoints (media queries cannot read custom properties, so they are written as literals and
listed here): `40rem` (stretch list goes two-column), `48rem` (section and hero padding, two
source columns). The hero stays a single column at every width.

Chart geometry (axis positions, bar width, marker radius) is in SVG user units, as named
constants at the top of `src/DayChart.tsx`; its colours and lines come from the tokens.

## Radii and elevation

`--radius-sm: 2px` (chart bars), `--radius: 4px` (button, chart well, focus ring).
Elevation: level 0 only. No shadows anywhere.

Lines: `--line-hair: 1px` (rules, axes, underline), `--line-bold: 2px` (tide line, focus
ring), `--line-halo: 4px` (knock-out stroke behind chart labels), `--focus-offset: 3px`
(focus ring offset, underline offset).

## Motion

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | every transition and animation |
| `--dur-fast` | `150ms` | hover, active, focus colour changes |
| `--dur-mark` | `240ms` | each slack marker fade |
| `--dur-draw` | `900ms` | tide line draw |
| `--stagger` | `120ms` | between slack markers |

Animated properties: `color`, `background-color`, `text-decoration-color`, `opacity`,
`stroke-dashoffset`. Never layout properties. `prefers-reduced-motion: reduce` draws the chart
at once and removes every transition.

## Base components

- **Primary button** (`.button`): amber fill, `--color-on-slack` text, semibold, `--radius`,
  padding `--space-3` / `--space-4`. Hover `--color-slack-hover`, active
  `--color-slack-active`, focus 2px `--color-focus` outline offset 3px, disabled
  `opacity: 0.4` with `cursor: not-allowed` (the page itself never disables it). One label
  everywhere: "Join the TestFlight beta", always to `/beta`.
- **Link** (`.link`): ink, 1px underline in `--color-ink-muted`, offset 3px; hover underline
  turns `--color-ink`; active `--color-ink-muted` text; same focus ring.
- **Card**: none. Content sits on the ground; no boxes.
- **Badge**: none. "Beta" is said in a sentence, never stamped.
- **Input**: none. The beta sign-up lives at `/beta`.
- **Chart well** (`.daychart`): `--color-surface`, `--radius`, scrolls horizontally inside
  itself under 48rem so the page never does.

## Data rules

- Every figure on the page comes from `data/tide.json` (NOAA CO-OPS, 2 October 2026) and is
  labelled with its date and station. Times are PDT (UTC-7). Heights in feet above MLLW,
  currents in knots, positive flood, negative ebb.
- Slack times come from the current predictions of SFB1204, never from high or low tide.
- No water temperature, no user counts, no prices, no ratings, no testimonials.
