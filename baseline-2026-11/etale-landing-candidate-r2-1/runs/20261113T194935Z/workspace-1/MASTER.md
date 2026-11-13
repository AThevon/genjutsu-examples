# Étale - MASTER design system

Single source of truth for the landing page. Every value in `src/tokens.css` is listed here; no
component may use a colour, size, duration or easing that is not.

Status: theses **UNVALIDATED** (headless run, no one to approve). Built on them as written.

## Theses

**Visual thesis.** Étale is drawn as the day of current at SFB1204. The ground is a cold near-black
bay-green (the water before sunrise, read on a phone before 6 am), the ink is fog-pale, and one
buoy-orange accent is reserved for slack moments only. The type is the system face (SF on the
iPhones this audience carries): very large tabular-figure times against small plain labels, no
mono, no web face. All text sits on one left edge at a ~36rem measure; the day strip alone takes
the full content width, because it is a 24-hour axis. Components are flat and sharp: no shadows,
no borders, 2px radius at most.
**First screen:** the three slack times of Friday 2 October 2026 at SFB1204 at display size, over
a full-width 00:00 to 24:00 strip on which NOAA's max flood and ebb predictions are stems above
and below a zero line and the slacks are orange ticks on it. Each figure carries its date and
station; the call to /beta sits beside it. At 375px the strip keeps the full width with hour ticks
only, and its labels move into the stacked readout. Everything is drawn at rest, without script.

**Interaction thesis.** One motion: choosing a slack time (hover, focus or tap; the first slack is
selected at rest) slides a selection band along the strip to that slack's window between its two
max-current stems, transform only, 320ms, `cubic-bezier(0.2, 0, 0, 1)`, decelerating to stillness
with no overshoot; the detail line swaps text instantly. Reduced motion: the band moves without
transition. Control hover: 160ms colour change. Scroll does nothing. Forbidden: scroll reveals,
parallax, bounce or overshoot, looping wave animation, counting-up numbers, glows, gradients.

**Allowed patterns:** the hairline zero line of the strip (it is the data axis); the single
buoy-orange accent; the dark ground.

Set aside: phone-mockup hero with feature cards; bare centred text page; ocean and wave imagery;
the printed tide table. Kept: NOAA current-prediction trace.

## Dials (sent to search.py)

| Dial | Value | From the clause |
|---|---|---|
| variance | 4 | "one left edge ... the day strip alone takes the full content width" |
| motion | 2 | "One motion ... Scroll does nothing" |
| density | not sent | the theses set a measure and a size contrast, not a density |

Lookup result: kept the 150-300ms hover range and the 375/768/1024/1440 checks. Dropped the navy
and gold palette (category default), Plus Jakarta Sans (unrequested third-party font), scroll
reveal, parallax and CTA glow (forbidden), device mockups, ratings and store badges (none exist).

## Color

Dark only. There is no light theme: the page is for the hour before sunrise.

| Token | Hex | Role | Contrast on `--c-ground` |
|---|---|---|---|
| `--c-ground` | `#0b1513` | page background | - |
| `--c-ground-raised` | `#122220` | the evening-alert block, the station blocks | 1.1:1 (surface step only) |
| `--c-ink` | `#dde5e1` | body text, stems, primary button fill | 14.47:1 |
| `--c-ink-strong` | `#f4f7f5` | primary button hover | 17.22:1 |
| `--c-muted` | `#93a39d` | labels, captions, unselected times | 7.04:1 (6.25:1 on raised) |
| `--c-axis` | `#5a6f68` | zero line, hour ticks, tide curve | 3.46:1 |
| `--c-disabled` | `#5d6d68` | disabled text | 3.41:1 (exempt, disabled) |
| `--c-slack` | `#ff6b2c` | slack ticks, selected slack time, focus of slack | 6.54:1 (5.80:1 on raised) |
| `--c-slack-band` | `#1f1a14` | selection band fill | ink on it 13.46:1, slack 6.08:1 |

Button: `--c-ground` text on `--c-ink` = 14.47:1; on `--c-ink-strong` = 17.22:1.
Semantic colours (success, warning, error, info): none. The page has no form and no status; the
beta is a plain link. By decision, not omission.
Orange is never used for the call to action: it means slack, nothing else.

## Typography

Family, by decision: `system-ui, -apple-system, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
No web font is requested. Figures: `font-variant-numeric: tabular-nums` on every time and value.

| Token | Value | Use |
|---|---|---|
| `--fs-label` | `0.8125rem` | station labels, axis labels |
| `--fs-body` | `1.0625rem` | body |
| `--fs-lead` | `1.375rem` | lead line, detail line |
| `--fs-h2` | `clamp(1.75rem, 1.2rem + 2.2vw, 2.75rem)` | section titles |
| `--fs-h1` | `clamp(2rem, 1.3rem + 3vw, 3.5rem)` | hero headline |
| `--fs-time` | `clamp(3.25rem, 1rem + 9vw, 8.5rem)` | slack times |
| `--fw-light` 300, `--fw-regular` 400, `--fw-semibold` 600 | | times are light, headings semibold |
| `--lh-tight` 1.05, `--lh-body` 1.55 | | |
| `--measure` | `36rem` | every text block |

## Spacing

Base unit 4px. `--s-1` 0.25rem, `--s-2` 0.5rem, `--s-3` 0.75rem, `--s-4` 1rem, `--s-5` 1.5rem,
`--s-6` 2rem, `--s-7` 3rem, `--s-8` 4rem, `--s-9` 6rem, `--s-10` 8rem.
Edges: `--gutter: clamp(1.25rem, 5vw, 4rem)` on both sides; `--content-max: 88rem`. Every section
starts on the same left edge. Text stops at `--measure`; the two charts (day strip, tide curve)
run the full content width because both are a 24-hour time axis.
Sections are separated by `--s-10` (desktop) / `--s-9` (narrow).
Fixed sizes: `--tap-min: 48px` (every control), `--hairline: 1px` (axis, underline),
`--focus-width: 2px`, `--focus-offset: 3px`.
`--measure-display: 18ch` for the hero headline (measure counted at display size).
`--fs-suffix: 0.3em` (the am/pm after a display time), `--underline-offset: 0.2em` (text links).
Breakpoints (CSS cannot read custom properties in media queries, so they are written as values):
narrow `max-width: 40rem` (times stack, chart labels move to lists), wide `min-width: 64rem`
(the two station blocks sit side by side).
Chart heights: day strip `12rem` (narrow `8rem`), tide curve `14rem` (narrow `10rem`), as
`--strip-h` / `--curve-h` in `src/App.css`, built from the spacing scale (`--s-10` + `--s-8`,
`--s-10`; `--s-10` + `--s-9`, `--s-9` + `--s-8`). Stem height is a share of the strip: up to 30%
of it (narrow 44%) for the strongest predicted current of the day; labels sit in the remainder.

## Radii and shadows

`--r-none: 0`, `--r-sm: 2px`, `--r-full: 50%` (the tide high/low dots only). No shadows: elevation level 0 only. A raised surface is a colour
step (`--c-ground-raised`), never a shadow.

## Motion

| Token | Value |
|---|---|
| `--dur-hover` | `160ms` |
| `--dur-settle` | `320ms` |
| `--ease-settle` | `cubic-bezier(0.2, 0, 0, 1)` |
| stagger | none |

Reduced motion (`prefers-reduced-motion: reduce`): `--dur-settle` and `--dur-hover` become `0ms`.

## Base components

- **Primary link-button** ("Join the TestFlight beta", to `/beta`): fill `--c-ink`, text
  `--c-ground`, `--r-sm`, padding `--s-4` `--s-5`, min height 48px. Hover `--c-ink-strong`;
  focus-visible 2px `--c-ink` outline at 3px offset; active `--c-muted` fill; disabled
  `--c-disabled` fill (not used on this page).
- **Slack time button**: unstyled text, `--fs-time`, `--fw-light`, `--c-muted`; selected and hover
  `--c-slack`; focus-visible 2px `--c-slack` outline; active `--c-ink`; disabled `--c-disabled`.
  Min tap target 48px.
- **Text link**: `--c-ink`, underline 1px offset 0.2em; hover: underline thickens to 2px (never
  orange, which is reserved for slack); focus-visible 2px `--c-ink` outline; active `--c-muted`.
- **Raised block**: `--c-ground-raised`, `--r-sm`, padding `--s-6`. No border, no shadow.
- **Label**: `--fs-label`, `--c-muted`, sentence case, no letter-spacing, no mono.
